// Wallet addresses are public by design (receiving addresses).
// NiceHash API credentials MUST be configured via environment variables
// on the server side — never embed real API keys in client-served files.
// See .env.example for NICEHASH_API_KEY, NICEHASH_API_SECRET, NICEHASH_ORG_ID.
const walletConfig = {
    wallets: {
        bitcoin: {
            address: '$lifeimitatesartinc',
            cashApp: 'https://cash.app/launch/bitcoin/$lifeimitatesartinc/S035CDqqhR',
            note: 'Cash App Bitcoin payment link'
        },
        ethereum: {
            address: process.env.ETH_WALLET_ADDRESS || '',
            note: 'MetaMask or other ETH wallet — set ETH_WALLET_ADDRESS env var'
        },
        paypal: {
            address: 'https://www.paypal.biz/harveymiller',
            note: 'PayPal payment link'
        },
        litecoin: {
            address: process.env.LTC_WALLET_ADDRESS || '',
            note: 'LTC wallet — set LTC_WALLET_ADDRESS env var'
        },
    },
    nicehash: {
        enabled: true,
        apiUrl: 'https://api.nicehash.com/api/v2',
        // API credentials are loaded server-side from environment variables.
        // Do NOT hardcode real keys here — this file may be served to clients.
        apiKey: process.env.NICEHASH_API_KEY || '',
        apiSecret: process.env.NICEHASH_API_SECRET || '',
        organizationId: process.env.NICEHASH_ORG_ID || '',
        walletAddress: process.env.LTC_WALLET_ADDRESS || '',
    },
    payoutSettings: {
        minimumPayout: { btc: 0.001, eth: 0.01, ltc: 0.1 },
        payoutFrequency: 'daily',
        autoWithdraw: false
    },
};
module.exports = walletConfig;
