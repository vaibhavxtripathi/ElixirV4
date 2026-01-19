import app from "./app";
import { prisma } from "./lib/prisma";

const PORT = process.env.PORT || 3001;

async function startServer() {
  try {
    await prisma.$connect();

    app.listen(PORT, () => {
      // Server started successfully
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

// Graceful shutdown - clean up database connection when app closes
process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

startServer();
