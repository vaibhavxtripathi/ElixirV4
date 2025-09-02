import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/auth";
import eventsRoutes from "./routes/events";
import clubsRoutes from "./routes/clubs";
import blogsRoutes from "./routes/blogs";
import mentorsRoutes from "./routes/mentors";
import usersRoutes from "./routes/users";

const cors = require("cors");
const morgan = require("morgan");

dotenv.config();

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN?.split(",") || "*" }));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 300 }));
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Server is working!" });
});

app.get("/api/test", (req, res) => {
  res.json({ message: "API is working!" });
});

app.use("/api/auth", authRoutes);
app.use("/api/events", eventsRoutes);
app.use("/api/clubs", clubsRoutes);
app.use("/api/blogs", blogsRoutes);
app.use("/api/mentors", mentorsRoutes);
app.use("/api/users", usersRoutes);

export default app;
