import app from "../src/app";
import serverless from "serverless-http";

const serverlessHandler = serverless(app);

export default async function handler(req: any, res: any) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', 'https://elixir-v4.vercel.app');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  // Vercel strips the /api prefix, so we need to re-add it for Express
  const originalUrl = req.url || "/";
  if (!originalUrl.startsWith("/api")) {
    req.url = `/api${originalUrl}`;
  }
  return serverlessHandler(req, res);
}
