/**
 * GOAT Connect — Banking Integration
 * Copyright © 2024 HARVEY L MILLER JR / JUAQUIN J MALPHURS / KEVIN W HALLINGQUEST
 *
 * Plaid-style bank account linking and verification
 * Stripe Connect for payments and income verification
 * Purpose: Verify financial stability, enable premium features, prevent fraud
 */

class BankingIntegration {
    constructor(config = {}) {
        this.plaidClientId = config.plaidClientId || process.env.PLAID_CLIENT_ID || '';
        this.plaidSecret   = config.plaidSecret   || process.env.PLAID_SECRET    || '';
        this.stripeKey     = config.stripeKey     || process.env.STRIPE_SECRET   || '';
        this.isDemo        = !this.plaidClientId  && !this.stripeKey;

        // Supported institutions
        this.institutions = [
            { id: 'ins_001', name: 'Chase Bank',         icon: '🏦', type: 'major',    logo: '💙' },
            { id: 'ins_002', name: 'Bank of America',    icon: '🏦', type: 'major',    logo: '🔴' },
            { id: 'ins_003', name: 'Wells Fargo',        icon: '🏦', type: 'major',    logo: '🟡' },
            { id: 'ins_004', name: 'Citibank',           icon: '🏦', type: 'major',    logo: '🔵' },
            { id: 'ins_005', name: 'Capital One',        icon: '💳', type: 'major',    logo: '🔴' },
            { id: 'ins_006', name: 'Goldman Sachs',      icon: '💰', type: 'premium',  logo: '⬛' },
            { id: 'ins_007', name: 'US Bank',            icon: '🏦', type: 'major',    logo: '🔵' },
            { id: 'ins_008', name: 'TD Bank',            icon: '🏦', type: 'major',    logo: '🟢' },
            { id: 'ins_009', name: 'Ally Bank',          icon: '💻', type: 'online',   logo: '🟣' },
            { id: 'ins_010', name: 'Chime',              icon: '📱', type: 'neobank',  logo: '🟡' },
            { id: 'ins_011', name: 'Cash App',           icon: '📱', type: 'fintech',  logo: '🟢' },
            { id: 'ins_012', name: 'Venmo',              icon: '📱', type: 'fintech',  logo: '🔵' },
        ];

        // Linked accounts cache
        this.linkedAccounts = new Map();

        // Verification purposes
        this.purposes = [
            { id: 'identity',   label: 'Identity Verification',     description: 'Confirm your real identity via bank records' },
            { id: 'income',     label: 'Income Verification',        description: 'Verify income for premium match filters (optional)' },
            { id: 'fraud',      label: 'Fraud Prevention',           description: 'Prevent scammers and catfishing' },
            { id: 'payment',    label: 'Premium Subscription',       description: 'Enable premium dating features' },
        ];
    }

    getInstitutions() {
        return this.institutions;
    }

    async linkAccount(data) {
        const { userId, institutionId } = data;

        if (this.isDemo) {
            const institution = this.institutions.find(i => i.id === institutionId) || this.institutions[0];
            const linkToken = 'link-sandbox-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);

            return {
                success: true,
                linkToken,
                userId,
                institution: institution.name,
                expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
                instructions: `Complete bank linking via ${institution.name} secure portal`,
                demo: true,
                message: `✅ Bank link initiated with ${institution.name}. In production, user would be redirected to secure Plaid Link UI.`
            };
        }

        throw new Error('Production Plaid integration not configured. Add PLAID_CLIENT_ID and PLAID_SECRET to .env');
    }

    async verifyAccount(data) {
        const { userId, linkToken } = data;

        if (this.isDemo) {
            const verified = Math.random() > 0.05; // 95% success rate

            const result = {
                success: verified,
                userId,
                verified,
                demo: true,
                accountInfo: verified ? {
                    accountType: ['checking', 'savings'][Math.floor(Math.random() * 2)],
                    institutionName: this.institutions[Math.floor(Math.random() * 4)].name,
                    last4: Math.floor(1000 + Math.random() * 9000).toString(),
                    accountAge: Math.floor(1 + Math.random() * 10) + ' years',
                    incomeVerified: Math.random() > 0.4,
                    incomeRange: ['$25K-50K', '$50K-75K', '$75K-100K', '$100K-150K', '$150K+'][Math.floor(Math.random() * 5)],
                    creditScoreRange: ['650-700', '700-750', '750-800', '800+'][Math.floor(Math.random() * 4)],
                    fraudScore: Math.floor(Math.random() * 10) // 0-100, lower is better
                } : null,
                verificationBadge: verified,
                message: verified ? '✅ Bank account successfully verified' : '❌ Verification failed — please try again'
            };

            this.linkedAccounts.set(userId, result);
            return result;
        }

        throw new Error('Production bank verification not configured');
    }

    async getStatus(userId) {
        const cached = this.linkedAccounts.get(userId);
        if (cached) return { ...cached, fromCache: true };

        return {
            userId,
            verified: false,
            status: 'unverified',
            message: 'No bank account linked. Link your account to unlock trust badge.',
            benefits: [
                '✅ Financial Trust Badge on profile',
                '🔒 Enhanced fraud protection',
                '💎 Access to premium verified matches',
                '💰 Income filter unlock (optional)'
            ]
        };
    }
}

module.exports = BankingIntegration;