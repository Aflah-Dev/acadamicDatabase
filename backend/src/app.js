import express from "express";
import cors from "cors";

import { env } from "./config/env.js";
import { pool } from "./config/pool.js";
import { testConnection } from "./config/testConnection.js";
import { notFound, errorHandler } from "./middlewares/errorHandler.js";

// Import routes
import departmentRoutes from "./routes/departmentRoutes.js";
import teacherRoutes from "./routes/teacherRoutes.js";
import classRoutes from "./routes/classRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import subjectRoutes from "./routes/subjectRoutes.js";
import markRoutes from "./routes/markRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";

const app = express();
const PORT = env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: env.JSON_LIMIT || "100kb" }));
app.use(
  express.urlencoded({
    extended: true,
    limit: env.URLENCODED_LIMIT || "100kb",
  }),
);

// Routes
app.use("/api/departments", departmentRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/marks", markRoutes);
app.use("/api/reports", reportRoutes);

// Health check
app.get("/api/health", async (req, res) => {
  try {
    res.json({
      status: "OK",
      message: "Server and database are healthy",
      environment: process.env.NODE_ENV || "development",
    });
  } catch (error) {
    res.status(503).json({
      status: "DEGRADED",
      message: "Server is running but database is unavailable",
    });
  }
});

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start server
const startServer = async () => {
  let server;

  const gracefulShutdown = (signal) => {
    console.log(`\n${signal} received. Shutting down gracefully...`);

    if (server) {
      server.close(async () => {
        try {
          await pool.end();
          console.log("Database pool closed.");
        } finally {
          process.exit(0);
        }
      });
    }
  };

  try {
    await testConnection();
    server = app.listen(PORT, () => {
      console.log(`✓ Server is running on port ${PORT}`);
      console.log(`✓ Environment: ${process.env.NODE_ENV || "development"}`);
    });

    process.on("SIGINT", () => gracefulShutdown("SIGINT"));
    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
