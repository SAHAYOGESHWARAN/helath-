
const express = require('express');
const path = require('path');
const compression = require('compression');
const helmet = require('helmet');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8080;

// Security & performance middlewares
app.use(helmet());
app.use(cors());
app.use(compression());

// Serve static files from dist
app.use(express.static(path.join(__dirname, 'dist')));

// Catch-all route (compatible with latest path-to-regexp)
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start server
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
