import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
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
// CORS middleware
app.use((req, res, next) => {
  const allowedOrigins = [
    "https://elixir-v4.vercel.app",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
  ];

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
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 300 }));
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
