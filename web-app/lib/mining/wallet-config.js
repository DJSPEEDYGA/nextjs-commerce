const walletConfig = {
    wallets: {
        bitcoin: {
            address: '$lifeimitatesartinc',
            cashApp: 'https://cash.app/launch/bitcoin/$lifeimitatesartinc/S035CDqqhR',
            note: 'Cash App Bitcoin payment link'
        },
        ethereum: {
            address: '0x324A37mfy4RBLJY9shXYUeoJw1eERHx12n',  // UPDATE THIS
            note: 'MetaMask or other ETH wallet'
        },
        paypal: {
            address: 'https://www.paypal.biz/harveymiller',
            note: 'PayPal payment link'
        },
        litecoin: {
            address: '324A37mfy4RBLJY9shXYUeoJw1eERHx12n',
            note: 'LTC wallet - FOR NICEHASH PAYOUTS'
        },
    },
    nicehash: {
        enabled: true,
        apiUrl: 'https://api.nicehash.com/api/v2',
        apiKey: process.env.NICEHASH_API_KEY || null,
        apiSecret: process.env.NICEHASH_API_SECRET || null,
        organizationId: process.env.NICEHASH_ORG_ID || null,
        walletAddress: '324A37mfy4RBLJY9shXYUeoJw1eERHx12n',
    },
    payoutSettings: {
        minimumPayout: { btc: 0.001, eth: 0.01, ltc: 0.1 },
        payoutFrequency: 'daily',
        autoWithdraw: false
    },
};
module.exports = walletConfig;

// Helper function to check if NiceHash is configured
walletConfig.isConfigured = function() {
    return this.nicehash.apiKey && 
           this.nicehash.apiSecret && 
           this.nicehash.organizationId;
};
