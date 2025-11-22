const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false
}));
app.use(cors());
app.use(compression());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.get('/api/status', (req, res) => {
    res.json({
        status: 'online',
        message: 'GOAT Royalties API is running',
        version: '2.0.0',
        timestamp: new Date().toISOString()
    });
});

app.get('/api/dashboard', (req, res) => {
    res.json({
        totalRevenue: 285600,
        growthRate: 23.5,
        platforms: {
            spotify: { revenue: 89200, growth: 15.2 },
            appleMusic: { revenue: 67800, growth: 18.7 },
            youtube: { revenue: 45300, growth: 22.3 },
            tidal: { revenue: 12400, growth: 8.9 },
            amazonMusic: { revenue: 18900, growth: 12.4 }
        },
        contentStats: {
            protectedTracks: 156,
            totalStreams: 3400000,
            downloads: 78000
        },
        nftPortfolio: {
            totalValue: 156000,
            items: 23,
            chains: ['Ethereum', 'Polygon', 'Solana']
        },
        collaboration: {
            teamMembers: 15,
            sharedFiles: 234,
            activeProjects: 8
        }
    });
});

app.get('/api/revenue/predictions', (req, res) => {
    res.json({
        nextMonth: {
            predicted: 352600,
            increase: 67000,
            confidence: 95
        },
        opportunities: [
            { platform: 'TikTok', potential: 25000, priority: 'high' },
            { platform: 'Spotify Playlists', potential: 18000, priority: 'high' },
            { platform: 'YouTube Sync', potential: 15000, priority: 'medium' }
        ]
    });
});

app.get('/api/nft/portfolio', (req, res) => {
    res.json({
        totalValue: 156000,
        items: [
            { id: 1, name: 'Genesis Track NFT', value: 45000, chain: 'Ethereum' },
            { id: 2, name: 'Album Art Collection', value: 32000, chain: 'Polygon' },
            { id: 3, name: 'Exclusive Beat Pack', value: 28000, chain: 'Solana' },
            { id: 4, name: 'Limited Edition Single', value: 51000, chain: 'Ethereum' }
        ],
        recentSales: 12,
        royaltiesEarned: 23400
    });
});

app.get('/api/collaboration/status', (req, res) => {
    res.json({
        activeMembers: 15,
        onlineNow: 6,
        sharedFiles: 234,
        recentActivity: [
            { user: 'Producer Mike', action: 'uploaded new beat', time: '5 min ago' },
            { user: 'Sarah Vocals', action: 'commented on track', time: '12 min ago' },
            { user: 'DJ Alex', action: 'shared mix', time: '1 hour ago' }
        ],
        storageUsed: '450GB',
        storageTotal: '1TB'
    });
});

// Catch-all route - serve index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Something went wrong!',
        message: err.message
    });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 GOAT Royalties Server running on port ${PORT}`);
    console.log(`📊 Dashboard: http://localhost:${PORT}`);
    console.log(`🔌 API Status: http://localhost:${PORT}/api/status`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
    });
});