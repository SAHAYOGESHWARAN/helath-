const express = require('express');
const cors = require('cors');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, ScanCommand } = require('@aws-sdk/lib-dynamodb');

const app = express();
const PORT = process.env.VIDEO_PORT || 3005;

const client = new DynamoDBClient({ region: process.env.AWS_REGION || 'us-east-1' });
const docClient = DynamoDBDocumentClient.from(client);

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', async (req, res) => {
  try {
    // Check DynamoDB connection
    await docClient.send(new ScanCommand({ TableName: 'video_sessions', Limit: 1 }));
    res.json({ status: 'Video service is running with DynamoDB' });
  } catch (error) {
    console.error('DynamoDB health check failed:', error);
    res.status(500).json({ status: 'Video service is running but DynamoDB connection failed' });
  }
});

// Routes
const videoRoutes = require('./routes/videoRoutes');
app.use('/api/video', videoRoutes);

app.listen(PORT, () => {
  console.log(`Video service listening on port ${PORT}`);
});
