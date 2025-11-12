const fs = require('fs');
const path = require('path');

const requiredEnvVars = [
  'EMR_PORT',
  'SCHEDULING_PORT',
  'NOTES_PORT',
  'VIDEO_PORT',
  'API_GATEWAY_PORT',
  'API_KEY',
  'MONGODB_URI',
  'DB_USER',
  'DB_HOST',
  'DB_DATABASE',
  'DB_PASSWORD',
  'DB_PORT',
  'VITE_API_KEY',
  'VITE_API_GATEWAY_URL',
];

const envFilePath = path.resolve(__dirname, '../.env');

if (!fs.existsSync(envFilePath)) {
  console.error('.env file not found. Please create one from .env.example');
  process.exit(1);
}

require('dotenv').config({ path: envFilePath });

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error(`Missing required environment variables: ${missingVars.join(', ')}`);
  process.exit(1);
}

console.log('Environment variables are configured correctly.');
