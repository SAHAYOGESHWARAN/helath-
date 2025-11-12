const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());

const EMR_API_URL = process.env.EMR_API_URL || 'http://localhost:4001';
const SCHEDULING_API_URL = process.env.SCHEDULING_API_URL || 'http://localhost:4002';
const NOTES_API_URL = process.env.NOTES_API_URL || 'http://localhost:4003';
const GENAI_API_URL = process.env.GENAI_API_URL || 'http://localhost:4000';
const VIDEO_API_URL = process.env.VIDEO_API_URL || 'http://localhost:4004';

const services = [
  {
    route: '/api/video',
    target: VIDEO_API_URL,
  },
  {
    route: '/api/emr',
    target: EMR_API_URL,
  },
  {
    route: '/api/scheduling',
    target: SCHEDULING_API_URL,
  },
  {
    route: '/api/notes',
    target: NOTES_API_URL,
  },
  {
    route: '/api/genai',
    target: GENAI_API_URL,
  },
];

services.forEach(({ route, target }) => {
  app.use(route, createProxyMiddleware({
    target,
    changeOrigin: true,
    pathRewrite: (path, req) => {
      return path.replace(route, '/api');
    },
  }));
});

const PORT = process.env.API_GATEWAY_PORT || 5000;
app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});
