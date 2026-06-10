/**
 * Hostinger API Routes
 * Provides endpoints for managing Hostinger hosting services
 */

const express = require('express');
const router = express.Router();
const { requireEmailVerification, authorize } = require('../middleware/auth');
const HostingerService = require('../services/hostingerService');
const { hostingerHandler } = require('../utils/routeHelpers');

// Initialize Hostinger service
const hostingerService = new HostingerService();

// Shared middleware applied to every route in this file
const adminOnly = [requireEmailVerification, authorize(['admin'])];

/**
 * @route   GET /api/hostinger/test
 * @desc    Test Hostinger API connection
 * @access  Private (Admin only)
 */
router.get('/test', ...adminOnly, hostingerHandler(
  () => hostingerService.testConnection(),
  'Failed to test Hostinger connection'
));

/**
 * @route   GET /api/hostinger/domains
 * @desc    Get all domains
 * @access  Private (Admin only)
 */
router.get('/domains', ...adminOnly, hostingerHandler(
  () => hostingerService.getDomains(),
  'Failed to fetch domains'
));

/**
 * @route   GET /api/hostinger/domains/:domainName
 * @desc    Get domain details
 * @access  Private (Admin only)
 */
router.get('/domains/:domainName', ...adminOnly, hostingerHandler(
  (req) => hostingerService.getDomainDetails(req.params.domainName),
  'Failed to fetch domain details'
));

/**
 * @route   GET /api/hostinger/domains/:domainName/dns
 * @desc    Get DNS records for a domain
 * @access  Private (Admin only)
 */
router.get('/domains/:domainName/dns', ...adminOnly, hostingerHandler(
  (req) => hostingerService.getDNSRecords(req.params.domainName),
  'Failed to fetch DNS records'
));

/**
 * @route   POST /api/hostinger/domains/:domainName/dns
 * @desc    Create a new DNS record
 * @access  Private (Admin only)
 */
router.post('/domains/:domainName/dns', ...adminOnly, hostingerHandler(
  (req) => hostingerService.createDNSRecord(req.params.domainName, req.body),
  'Failed to create DNS record'
));

/**
 * @route   PUT /api/hostinger/domains/:domainName/dns/:recordId
 * @desc    Update a DNS record
 * @access  Private (Admin only)
 */
router.put('/domains/:domainName/dns/:recordId', ...adminOnly, hostingerHandler(
  (req) => hostingerService.updateDNSRecord(req.params.domainName, req.params.recordId, req.body),
  'Failed to update DNS record'
));

/**
 * @route   DELETE /api/hostinger/domains/:domainName/dns/:recordId
 * @desc    Delete a DNS record
 * @access  Private (Admin only)
 */
router.delete('/domains/:domainName/dns/:recordId', ...adminOnly, hostingerHandler(
  (req) => hostingerService.deleteDNSRecord(req.params.domainName, req.params.recordId),
  'Failed to delete DNS record'
));

/**
 * @route   GET /api/hostinger/domains/:domainName/ssl
 * @desc    Get SSL certificate information
 * @access  Private (Admin only)
 */
router.get('/domains/:domainName/ssl', ...adminOnly, hostingerHandler(
  (req) => hostingerService.getSSLInfo(req.params.domainName),
  'Failed to fetch SSL information'
));

/**
 * @route   POST /api/hostinger/domains/:domainName/ssl
 * @desc    Install SSL certificate
 * @access  Private (Admin only)
 */
router.post('/domains/:domainName/ssl', ...adminOnly, hostingerHandler(
  (req) => hostingerService.installSSL(req.params.domainName, req.body),
  'Failed to install SSL certificate'
));

/**
 * @route   GET /api/hostinger/hosting
 * @desc    Get hosting account information
 * @access  Private (Admin only)
 */
router.get('/hosting', ...adminOnly, hostingerHandler(
  () => hostingerService.getHostingInfo(),
  'Failed to fetch hosting information'
));

/**
 * @route   GET /api/hostinger/hosting/stats
 * @desc    Get hosting statistics
 * @access  Private (Admin only)
 */
router.get('/hosting/stats', ...adminOnly, hostingerHandler(
  () => hostingerService.getHostingStats(),
  'Failed to fetch hosting statistics'
));

/**
 * @route   GET /api/hostinger/hosting/bandwidth
 * @desc    Get bandwidth usage
 * @access  Private (Admin only)
 */
router.get('/hosting/bandwidth', ...adminOnly, hostingerHandler(
  (req) => hostingerService.getBandwidthUsage(req.query.start_date, req.query.end_date),
  'Failed to fetch bandwidth usage'
));

/**
 * @route   GET /api/hostinger/hosting/disk-usage
 * @desc    Get disk usage
 * @access  Private (Admin only)
 */
router.get('/hosting/disk-usage', ...adminOnly, hostingerHandler(
  () => hostingerService.getDiskUsage(),
  'Failed to fetch disk usage'
));

/**
 * @route   GET /api/hostinger/domains/:domainName/emails
 * @desc    Get email accounts for a domain
 * @access  Private (Admin only)
 */
router.get('/domains/:domainName/emails', ...adminOnly, hostingerHandler(
  (req) => hostingerService.getEmailAccounts(req.params.domainName),
  'Failed to fetch email accounts'
));

/**
 * @route   POST /api/hostinger/domains/:domainName/emails
 * @desc    Create a new email account
 * @access  Private (Admin only)
 */
router.post('/domains/:domainName/emails', ...adminOnly, hostingerHandler(
  (req) => hostingerService.createEmailAccount(req.params.domainName, req.body),
  'Failed to create email account'
));

/**
 * @route   DELETE /api/hostinger/domains/:domainName/emails/:emailId
 * @desc    Delete an email account
 * @access  Private (Admin only)
 */
router.delete('/domains/:domainName/emails/:emailId', ...adminOnly, hostingerHandler(
  (req) => hostingerService.deleteEmailAccount(req.params.domainName, req.params.emailId),
  'Failed to delete email account'
));

/**
 * @route   GET /api/hostinger/databases
 * @desc    Get all databases
 * @access  Private (Admin only)
 */
router.get('/databases', ...adminOnly, hostingerHandler(
  () => hostingerService.getDatabases(),
  'Failed to fetch databases'
));

/**
 * @route   POST /api/hostinger/databases
 * @desc    Create a new database
 * @access  Private (Admin only)
 */
router.post('/databases', ...adminOnly, hostingerHandler(
  (req) => hostingerService.createDatabase(req.body),
  'Failed to create database'
));

/**
 * @route   GET /api/hostinger/ftp
 * @desc    Get FTP accounts
 * @access  Private (Admin only)
 */
router.get('/ftp', ...adminOnly, hostingerHandler(
  () => hostingerService.getFTPAccounts(),
  'Failed to fetch FTP accounts'
));

/**
 * @route   POST /api/hostinger/ftp
 * @desc    Create FTP account
 * @access  Private (Admin only)
 */
router.post('/ftp', ...adminOnly, hostingerHandler(
  (req) => hostingerService.createFTPAccount(req.body),
  'Failed to create FTP account'
));

/**
 * @route   GET /api/hostinger/domains/check/:domainName
 * @desc    Check domain availability
 * @access  Private (Admin only)
 */
router.get('/domains/check/:domainName', ...adminOnly, hostingerHandler(
  (req) => hostingerService.checkDomainAvailability(req.params.domainName),
  'Failed to check domain availability'
));

/**
 * @route   GET /api/hostinger/account
 * @desc    Get account information
 * @access  Private (Admin only)
 */
router.get('/account', ...adminOnly, hostingerHandler(
  () => hostingerService.getAccountInfo(),
  'Failed to fetch account information'
));

module.exports = router;
