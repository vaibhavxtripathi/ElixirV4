import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Basic middleware
app.use(express.json());

// Simple test route
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is working!' });
});

// Test API route
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

export default app;