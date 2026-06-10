const express = require('express');
const Payment = require('../models/Payment');
const Royalty = require('../models/Royalty');
const { protect, authorize, checkArtistAccess } = require('../middleware/auth');
const { 
  validatePaymentCreate,
  validateMongoId,
  validatePagination,
  validateDateRange
} = require('../middleware/validation');
const { asyncHandler, AppError } = require('../middleware/errorHandler');
const { parsePagination, paginationMeta } = require('../utils/pagination');
const { buildDateRangeFilter, applyArtistFilter, enforceArtistOwnership } = require('../utils/queryFilters');
const { findByIdOr404 } = require('../utils/routeHelpers');
const { groupBySum, groupBySumWithCount } = require('../utils/aggregationHelpers');

const router = express.Router();

// @desc    Get all payments
// @route   GET /api/payments
// @access  Private
router.get('/', 
  protect, 
  validatePagination,
  validateDateRange,
  asyncHandler(async (req, res) => {
    const { page, limit, skip } = parsePagination(req.query);

    const query = {};
    const dateRange = buildDateRangeFilter(req.query.startDate, req.query.endDate);
    if (dateRange) query.paymentDate = dateRange;

    applyArtistFilter(query, req.user, req.artistProfile, 'artist', req.query.artist);

    if (req.query.status) query.status = req.query.status;
    if (req.query.method) query.method = req.query.method;

    const payments = await Payment.find(query)
      .populate('artist', 'name email')
      .populate('royalties.royalty', 'workTitle workType periodStart periodEnd')
      .populate('createdBy', 'username')
      .populate('processedBy', 'username')
      .sort({ paymentDate: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Payment.countDocuments(query);

    res.json({
      success: true,
      data: {
        payments,
        pagination: paginationMeta(total, { page, limit }),
      }
    });
  })
);

// @desc    Get single payment
// @route   GET /api/payments/:id
// @access  Private
router.get('/:id', 
  protect, 
  validateMongoId('id'),
  asyncHandler(async (req, res) => {
    const payment = await findByIdOr404(Payment, req.params.id, 'Payment', [
      { path: 'artist', select: 'name email user' },
      { path: 'royalties.royalty', select: 'workTitle workType amount' },
      { path: 'createdBy', select: 'username profile' },
      { path: 'processedBy', select: 'username' },
    ]);

    enforceArtistOwnership(payment, req.user, req.artistProfile, 'payment');

    res.json({
      success: true,
      data: { payment },
    });
  })
);

// @desc    Create payment
// @route   POST /api/payments
// @access  Private/Admin/Manager
router.post('/', 
  protect, 
  authorize('admin', 'manager'),
  validatePaymentCreate,
  asyncHandler(async (req, res) => {
    const { royalties, totalAmount, ...paymentData } = req.body;

    // Verify royalties exist and belong to the artist
    const royaltyIds = royalties.map(r => r.royalty);
    const royaltyDocs = await Royalty.find({ 
      _id: { $in: royaltyIds },
      artist: paymentData.artist 
    });

    if (royaltyDocs.length !== royaltyIds.length) {
      throw new AppError('One or more royalties not found or do not belong to the specified artist', 400);
    }

    // Check if royalties are already fully paid
    for (const royalty of royaltyDocs) {
      if (royalty.getPaymentStatus() === 'fully_paid') {
        throw new AppError(`Royalty for "${royalty.workTitle}" is already fully paid`, 400);
      }
    }

    // Validate total amount matches sum of royalty amounts
    const royaltyTotal = royalties.reduce((sum, r) => sum + r.amount, 0);
    if (Math.abs(royaltyTotal - totalAmount) > 0.01) {
      throw new AppError('Total amount does not match the sum of royalty amounts', 400);
    }

    const payment = await Payment.create({
      ...paymentData,
      royalties,
      createdBy: req.user.id
    });

    // Generate transaction ID
    payment.generateTransactionId();
    await payment.save();

    res.status(201).json({
      success: true,
      message: 'Payment created successfully',
      data: {
        payment: await Payment.findById(payment._id)
          .populate('artist', 'name email')
          .populate('royalties.royalty', 'workTitle workType')
          .populate('createdBy', 'username')
      }
    });
  })
);

// @desc    Process payment
// @route   PUT /api/payments/:id/process
// @access  Private/Admin/Manager
router.put('/:id/process', 
  protect, 
  authorize('admin', 'manager'),
  validateMongoId('id'),
  asyncHandler(async (req, res) => {
    const payment = await findByIdOr404(Payment, req.params.id, 'Payment');

    if (payment.status !== 'pending') {
      throw new AppError('Payment is not pending', 400);
    }

    await payment.process(req.user.id);

    res.json({
      success: true,
      message: 'Payment processing started',
      data: { payment },
    });
  })
);

// @desc    Complete payment
// @route   PUT /api/payments/:id/complete
// @access  Private/Admin/Manager
router.put('/:id/complete', 
  protect, 
  authorize('admin', 'manager'),
  validateMongoId('id'),
  asyncHandler(async (req, res) => {
    const payment = await findByIdOr404(Payment, req.params.id, 'Payment');

    if (payment.status !== 'processing') {
      throw new AppError('Payment is not being processed', 400);
    }

    await payment.complete();

    // Update artist earnings
    const Artist = require('../models/Artist');
    const artist = await Artist.findById(payment.artist);
    if (artist) {
      await artist.calculateTotalEarnings();
    }

    res.json({
      success: true,
      message: 'Payment completed successfully',
      data: {
        payment
      }
    });
  })
);

// @desc    Fail payment
// @route   PUT /api/payments/:id/fail
// @access  Private/Admin/Manager
router.put('/:id/fail', 
  protect, 
  authorize('admin', 'manager'),
  validateMongoId('id'),
  asyncHandler(async (req, res) => {
    const { reason } = req.body;

    if (!reason) {
      throw new AppError('Failure reason is required', 400);
    }

    const payment = await findByIdOr404(Payment, req.params.id, 'Payment');

    if (payment.status !== 'processing') {
      throw new AppError('Payment is not being processed', 400);
    }

    await payment.fail(reason);

    res.json({
      success: true,
      message: 'Payment marked as failed',
      data: {
        payment
      }
    });
  })
);

// @desc    Refund payment
// @route   PUT /api/payments/:id/refund
// @access  Private/Admin/Manager
router.put('/:id/refund', 
  protect, 
  authorize('admin', 'manager'),
  validateMongoId('id'),
  asyncHandler(async (req, res) => {
    const { refundAmount, refundReason } = req.body;

    if (!refundAmount || !refundReason) {
      throw new AppError('Refund amount and reason are required', 400);
    }

    const payment = await findByIdOr404(Payment, req.params.id, 'Payment');

    if (payment.status !== 'completed') {
      throw new AppError('Only completed payments can be refunded', 400);
    }

    if (refundAmount > payment.totalAmount) {
      throw new AppError('Refund amount cannot exceed payment total', 400);
    }

    await payment.refund(refundAmount, refundReason);

    // Update artist earnings
    const Artist = require('../models/Artist');
    const artist = await Artist.findById(payment.artist);
    if (artist) {
      await artist.calculateTotalEarnings();
    }

    res.json({
      success: true,
      message: 'Payment refunded successfully',
      data: {
        payment
      }
    });
  })
);

// @desc    Get payment analytics
// @route   GET /api/payments/analytics
// @access  Private
router.get('/analytics', 
  protect, 
  validateDateRange,
  asyncHandler(async (req, res) => {
    const { startDate, endDate } = req.query;
    const matchStage = {};
    const dateRange = buildDateRangeFilter(startDate, endDate);
    if (dateRange) matchStage.paymentDate = dateRange;

    applyArtistFilter(matchStage, req.user, req.artistProfile);

    const analytics = await Payment.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          totalPayments: { $sum: '$totalAmount' },
          completedPayments: {
            $sum: {
              $cond: [{ $eq: ['$status', 'completed'] }, '$totalAmount', 0]
            }
          },
          pendingPayments: {
            $sum: {
              $cond: [{ $eq: ['$status', 'pending'] }, '$totalAmount', 0]
            }
          },
          processingPayments: {
            $sum: {
              $cond: [{ $eq: ['$status', 'processing'] }, '$totalAmount', 0]
            }
          },
          totalFees: { $sum: '$processingFees' },
          totalTaxes: { $sum: '$taxes' },
          netAmount: { $sum: '$netAmount' },
          count: { $sum: 1 },
          byMethod: {
            $push: {
              method: '$method',
              amount: '$totalAmount'
            }
          },
          byStatus: {
            $push: {
              status: '$status',
              amount: '$totalAmount'
            }
          }
        }
      }
    ]);

    const summary = analytics[0] || {
      totalPayments: 0,
      completedPayments: 0,
      pendingPayments: 0,
      processingPayments: 0,
      totalFees: 0,
      totalTaxes: 0,
      netAmount: 0,
      count: 0,
      byMethod: [],
      byStatus: []
    };

    const methodSummary = groupBySum(summary.byMethod, 'method', 'amount');
    const statusSummary = groupBySumWithCount(summary.byStatus, 'status', 'amount');

    res.json({
      success: true,
      data: {
        summary: {
          totalPayments: summary.totalPayments,
          completedPayments: summary.completedPayments,
          pendingPayments: summary.pendingPayments,
          processingPayments: summary.processingPayments,
          totalFees: summary.totalFees,
          totalTaxes: summary.totalTaxes,
          netAmount: summary.netAmount,
          count: summary.count
        },
        byMethod: methodSummary,
        byStatus: statusSummary
      }
    });
  })
);

module.exports = router;