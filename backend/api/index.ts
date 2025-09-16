import app from "../src/app";
import serverless from "serverless-http";

const serverlessHandler = serverless(app);

export default async function handler(req: any, res: any) {
  // Vercel strips the /api prefix, so we need to re-add it for Express
  const originalUrl = req.url || "/";
  if (!originalUrl.startsWith("/api")) {
    req.url = `/api${originalUrl}`;
  }
  return serverlessHandler(req, res);
}
