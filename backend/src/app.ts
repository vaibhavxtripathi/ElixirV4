import express from "express";
import helmet from "helmet";
import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import authRoutes from "./routes/auth";
import eventsRoutes from "./routes/events";
import clubsRoutes from "./routes/clubs";
import blogsRoutes from "./routes/blogs";
import mentorsRoutes from "./routes/mentors";
import usersRoutes from "./routes/users";
import testimonialsRoutes from "./routes/testimonials";

const cors = require("cors");
const morgan = require("morgan");

const app = express();
app.set("trust proxy", 1);

app.use(helmet());
// CORS middleware - supports dynamic origins via env var
app.use((req, res, next) => {
  // Default allowed origins
  const defaultOrigins = [
    "https://elixir-v4.vercel.app",
    "https://dev.elixircommunity.in",
    "https://elixircommunity.in",
    "https://www.elixircommunity.in",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
  ];

  // Allow additional origins from environment variable (comma-separated)
  const envOrigins =
    process.env.ALLOWED_ORIGINS?.split(",")
      .map((origin) => origin.trim())
      .filter(Boolean) || [];

  const allowedOrigins = [...defaultOrigins, ...envOrigins];

  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }

  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  next();
});
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
// Rate limiter: be careful behind proxies and avoid over-eager 429s
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1000, // raise ceiling to reduce false positives for normal browsing
    standardHeaders: true,
    legacyHeaders: false,
    // Distinguish users where possible; otherwise fall back to IP (respecting trust proxy)
    keyGenerator: (req: any) => {
      // Prefer authenticated user id
      const authHeader = req.headers?.authorization as string | undefined;
      const bearer = authHeader?.startsWith("Bearer ")
        ? authHeader.slice(7)
        : undefined;
      // lightweight decode without verification to avoid cost; if it fails, ignore
      try {
        if (bearer) {
          const payload = JSON.parse(
            Buffer.from(bearer.split(".")[1] || "", "base64").toString("utf8")
          );
          if (payload?.userId) return `uid:${payload.userId}`;
        }
      } catch {}
      // IPv6-safe fallback using helper
      return ipKeyGenerator(req);
    },
    message: { message: "Too many requests, please slow down." },
  })
);
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Server is working!" });
});

app.get("/test", (req, res) => {
  res.json({ message: "API is working!" });
});

app.use("/auth", authRoutes);
app.use("/events", eventsRoutes);
app.use("/clubs", clubsRoutes);
app.use("/blogs", blogsRoutes);
app.use("/mentors", mentorsRoutes);
app.use("/users", usersRoutes);
app.use("/testimonials", testimonialsRoutes);

export default app;
