import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import eventsRoutes from "./routes/events";
import clubsRoutes from "./routes/clubs";
import blogsRoutes from "./routes/blogs";
import mentorsRoutes from "./routes/mentors";
import usersRoutes from "./routes/users";

dotenv.config();

const app = express();

// Basic middleware
app.use(express.json());

// Simple test route
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Server is working!" });
});

// Test API route
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
