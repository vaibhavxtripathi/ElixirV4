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
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") || [
      "https://elixir-v4.vercel.app",
      "https://elixir-v4-git-main.vercel.app",
      "https://elixir-v4-git-develop.vercel.app",
      "http://localhost:3000",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
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
