const express = require('express');
const Royalty = require('../models/Royalty');
const { protect, authorize, checkArtistAccess } = require('../middleware/auth');
const { 
  validateRoyaltyCreate,
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

// @desc    Get all royalties
// @route   GET /api/royalties
// @access  Private
router.get('/', 
  protect, 
  validatePagination,
  validateDateRange,
  asyncHandler(async (req, res) => {
    const { page, limit, skip } = parsePagination(req.query);

    const query = {};
    const dateRange = buildDateRangeFilter(req.query.startDate, req.query.endDate);
    if (dateRange) query.periodStart = dateRange;

    applyArtistFilter(query, req.user, req.artistProfile, 'artist', req.query.artist);

    if (req.query.status) query.status = req.query.status;
    if (req.query.source) query.source = req.query.source;
    if (req.query.workType) query.workType = req.query.workType;

    const royalties = await Royalty.find(query)
      .populate('artist', 'name email')
      .populate('createdBy', 'username')
      .populate('approvedBy', 'username')
      .sort({ periodStart: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Royalty.countDocuments(query);

    res.json({
      success: true,
      data: {
        royalties,
        pagination: paginationMeta(total, { page, limit }),
      }
    });
  })
);

// @desc    Get single royalty
// @route   GET /api/royalties/:id
// @access  Private
router.get('/:id', 
  protect, 
  validateMongoId('id'),
  asyncHandler(async (req, res) => {
    const royalty = await findByIdOr404(Royalty, req.params.id, 'Royalty', [
      { path: 'artist', select: 'name email user' },
      { path: 'contract', select: 'title contractNumber' },
      { path: 'createdBy', select: 'username profile' },
      { path: 'approvedBy', select: 'username' },
      'payments',
    ]);

    enforceArtistOwnership(royalty, req.user, req.artistProfile, 'royalty');

    res.json({
      success: true,
      data: { royalty },
    });
  })
);

// @desc    Create royalty
// @route   POST /api/royalties
// @access  Private/Admin/Manager
router.post('/', 
  protect, 
  authorize('admin', 'manager'),
  validateRoyaltyCreate,
  asyncHandler(async (req, res) => {
    const royaltyData = {
      ...req.body,
      createdBy: req.user.id
    };

    const royalty = await Royalty.create(royaltyData);

    // Update artist earnings
    const Artist = require('../models/Artist');
    const artist = await Artist.findById(royalty.artist);
    if (artist) {
      await artist.calculateTotalEarnings();
    }

    res.status(201).json({
      success: true,
      message: 'Royalty created successfully',
      data: {
        royalty: await Royalty.findById(royalty._id)
          .populate('artist', 'name email')
          .populate('createdBy', 'username')
      }
    });
  })
);

// @desc    Update royalty
// @route   PUT /api/royalties/:id
// @access  Private/Admin/Manager
router.put('/:id', 
  protect, 
  authorize('admin', 'manager'),
  validateMongoId('id'),
  asyncHandler(async (req, res) => {
    const royalty = await findByIdOr404(Royalty, req.params.id, 'Royalty');

    if (royalty.status === 'approved' || royalty.status === 'paid') {
      throw new AppError('Cannot update approved or paid royalties', 400);
    }

    // Update royalty
    Object.assign(royalty, req.body);
    await royalty.save();

    res.json({
      success: true,
      message: 'Royalty updated successfully',
      data: {
        royalty: await Royalty.findById(royalty._id)
          .populate('artist', 'name email')
          .populate('createdBy', 'username')
      }
    });
  })
);

// @desc    Approve royalty
// @route   PUT /api/royalties/:id/approve
// @access  Private/Admin/Manager
router.put('/:id/approve', 
  protect, 
  authorize('admin', 'manager'),
  validateMongoId('id'),
  asyncHandler(async (req, res) => {
    const royalty = await findByIdOr404(Royalty, req.params.id, 'Royalty');

    if (royalty.status !== 'pending') {
      throw new AppError('Royalty is not pending approval', 400);
    }

    await royalty.approve(req.user.id);

    res.json({
      success: true,
      message: 'Royalty approved successfully',
      data: {
        royalty
      }
    });
  })
);

// @desc    Delete royalty
// @route   DELETE /api/royalties/:id
// @access  Private/Admin/Manager
router.delete('/:id', 
  protect, 
  authorize('admin', 'manager'),
  validateMongoId('id'),
  asyncHandler(async (req, res) => {
    const royalty = await findByIdOr404(Royalty, req.params.id, 'Royalty');

    // Don't allow deletion of approved or paid royalties
    if (royalty.status === 'approved' || royalty.status === 'paid') {
      throw new AppError('Cannot delete approved or paid royalties', 400);
    }

    await Royalty.findByIdAndDelete(req.params.id);

    // Update artist earnings
    const Artist = require('../models/Artist');
    const artist = await Artist.findById(royalty.artist);
    if (artist) {
      await artist.calculateTotalEarnings();
    }

    res.json({
      success: true,
      message: 'Royalty deleted successfully'
    });
  })
);

// @desc    Get royalty analytics
// @route   GET /api/royalties/analytics
// @access  Private
router.get('/analytics', 
  protect, 
  validateDateRange,
  asyncHandler(async (req, res) => {
    const { startDate, endDate } = req.query;
    const matchStage = {};
    const dateRange = buildDateRangeFilter(startDate, endDate);
    if (dateRange) matchStage.periodStart = dateRange;

    applyArtistFilter(matchStage, req.user, req.artistProfile);

    const analytics = await Royalty.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          totalRoyalties: { $sum: '$amount' },
          totalPending: { $sum: '$pendingAmount' },
          totalPaid: { $sum: '$paidAmount' },
          averageRoyalty: { $avg: '$amount' },
          count: { $sum: 1 },
          bySource: {
            $push: {
              source: '$source',
              amount: '$amount'
            }
          },
          byStatus: {
            $push: {
              status: '$status',
              amount: '$amount'
            }
          }
        }
      }
    ]);

    const summary = analytics[0] || {
      totalRoyalties: 0,
      totalPending: 0,
      totalPaid: 0,
      averageRoyalty: 0,
      count: 0,
      bySource: [],
      byStatus: []
    };

    const sourceSummary = groupBySum(summary.bySource, 'source', 'amount');
    const statusSummary = groupBySumWithCount(summary.byStatus, 'status', 'amount');

    res.json({
      success: true,
      data: {
        summary: {
          totalRoyalties: summary.totalRoyalties,
          totalPending: summary.totalPending,
          totalPaid: summary.totalPaid,
          averageRoyalty: summary.averageRoyalty,
          count: summary.count
        },
        bySource: sourceSummary,
        byStatus: statusSummary
      }
    });
  })
);

module.exports = router;