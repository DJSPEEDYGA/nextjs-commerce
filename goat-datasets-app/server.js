/**
 * GOAT DATASETS APP - SERVER
 * NO API KEYS | NO LOGINS | DOWNLOAD & GO
 * 
 * Harvey Lee Miller Jr. (DJ Speedy) - GOAT Royalty App
 * Version 1.0.0
 */

const express = require('express');
const path = require('path');
const HFDatasetsEngine = require('./lib/hf-datasets');

const app = express();
const PORT = process.env.PORT || 4002;

// Initialize HF Datasets Engine
const hf = new HFDatasetsEngine({
  downloadDir: path.join(__dirname, 'datasets')
});

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// SSE clients for real-time download progress
const sseClients = new Set();

app.get('/api/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.flushHeaders();
  sseClients.add(res);
  req.on('close', () => sseClients.delete(res));
});

function broadcast(event, data) {
  const msg = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  sseClients.forEach(client => client.write(msg));
}

// Wire up HF engine events to SSE
hf.on('download-start', (d) => broadcast('download-start', d));
hf.on('download-progress', (d) => broadcast('download-progress', d));
hf.on('download-complete', (d) => broadcast('download-complete', d));
hf.on('download-error', (d) => broadcast('download-error', d));

// ═══════════════════════════════════════════════════
// API ROUTES
// ═══════════════════════════════════════════════════

// --- Stats ---
app.get('/api/stats', (req, res) => {
  res.json(hf.getStats());
});

// --- Catalog (built-in, instant, offline) ---
app.get('/api/catalog', (req, res) => {
  const { search, category, license, format, sort, page, limit } = req.query;
  res.json(hf.getCatalog({ 
    search, category, license, format, sort, 
    page: parseInt(page) || 1, 
    limit: parseInt(limit) || 50 
  }));
});

// --- Categories ---
app.get('/api/categories', (req, res) => {
  res.json(hf.getCategories());
});

// --- Single dataset detail ---
app.get('/api/dataset/:org/:name', (req, res) => {
  const id = `${req.params.org}/${req.params.name}`;
  const dataset = hf.getDataset(id);
  if (!dataset) return res.status(404).json({ error: 'Dataset not found' });
  res.json(dataset);
});

// --- Live search from HuggingFace API (no auth) ---
app.get('/api/search', async (req, res) => {
  const { q, limit } = req.query;
  if (!q) return res.json({ datasets: [], total: 0 });
  const results = await hf.searchHF(q, parseInt(limit) || 20);
  res.json(results);
});

// --- Dataset info from HF API ---
app.get('/api/info/:org/:name', async (req, res) => {
  const id = `${req.params.org}/${req.params.name}`;
  const info = await hf.getDatasetInfo(id);
  res.json(info);
});

// --- List files in dataset ---
app.get('/api/files/:org/:name', async (req, res) => {
  const id = `${req.params.org}/${req.params.name}`;
  const files = await hf.listFiles(id);
  res.json(files);
});

// --- Preview dataset content ---
app.get('/api/preview/:org/:name', async (req, res) => {
  const id = `${req.params.org}/${req.params.name}`;
  const { filename } = req.query;
  const preview = await hf.previewData(id, filename || 'README.md');
  res.json(preview);
});

// --- Download a specific file ---
app.post('/api/download/file', async (req, res) => {
  const { datasetId, filename } = req.body;
  if (!datasetId || !filename) return res.status(400).json({ error: 'datasetId and filename required' });
  
  // Start download in background, return immediately
  res.json({ started: true, datasetId, filename, message: 'Download started - watch SSE for progress' });
  
  hf.downloadFile(datasetId, filename).catch(err => {
    broadcast('download-error', { id: `${datasetId}/${filename}`, error: err.message });
  });
});

// --- Download README ---
app.post('/api/download/readme', async (req, res) => {
  const { datasetId } = req.body;
  if (!datasetId) return res.status(400).json({ error: 'datasetId required' });
  const result = await hf.downloadReadme(datasetId);
  res.json(result);
});

// --- Batch download dataset ---
app.post('/api/download/dataset', async (req, res) => {
  const { datasetId, maxFileSize, maxFiles, extensions } = req.body;
  if (!datasetId) return res.status(400).json({ error: 'datasetId required' });
  
  res.json({ started: true, datasetId, message: 'Batch download started' });
  
  hf.downloadDataset(datasetId, { maxFileSize, maxFiles, extensions }).catch(err => {
    broadcast('download-error', { id: datasetId, error: err.message });
  });
});

// --- Active downloads ---
app.get('/api/downloads/active', (req, res) => {
  res.json(hf.getActiveDownloads());
});

// --- Local datasets ---
app.get('/api/local', (req, res) => {
  res.json(hf.getLocalDatasets());
});

// --- Delete local dataset ---
app.delete('/api/local/:org/:name', (req, res) => {
  const id = `${req.params.org}/${req.params.name}`;
  res.json(hf.deleteLocalDataset(id));
});

// --- Analyze local dataset ---
app.get('/api/analyze/:org/:name', async (req, res) => {
  const id = `${req.params.org}/${req.params.name}`;
  const analysis = await hf.analyzeLocalDataset(id);
  res.json(analysis);
});

// --- Health check ---
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    app: 'GOAT Datasets App',
    version: '1.0.0',
    author: 'DJ Speedy / Harvey Lee Miller Jr.',
    noApiKeys: true,
    noLogins: true,
    downloadAndGo: true,
    uptime: process.uptime()
  });
});

// Catch-all: serve index.html for SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`
╔══════════════════════════════════════════════════════╗
║           🐐 GOAT DATASETS APP v1.0.0 🐐            ║
║                                                      ║
║   NO API KEYS | NO LOGINS | DOWNLOAD & GO            ║
║                                                      ║
║   🎵 DJ Speedy / Harvey Lee Miller Jr.               ║
║   🌐 http://localhost:${PORT}                          ║
║                                                      ║
║   📊 ${hf.catalog.length} Datasets Ready | ${hf.localDatasets.size} Local          ║
║   🔥 HuggingFace Hub Direct Access                   ║
╚══════════════════════════════════════════════════════╝
  `);
});

module.exports = app;