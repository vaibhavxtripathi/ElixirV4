import app from "../src/app";

export default function handler(req: any, res: any) {
  const originalUrl = req.url || "/";
  if (!originalUrl.startsWith("/api")) {
    req.url = "/api" + (originalUrl === "/" ? "" : originalUrl);
  }
  return app(req, res);
}
