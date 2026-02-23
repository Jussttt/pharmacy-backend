require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const routes = require("./routes");
const AppError = require("./utils/AppError");
const errorMiddleware = require("./middlewares/error.middleware");

const app = express();

// ==============================
// GLOBAL MIDDLEWARES
// ==============================

// Security headers
app.use(helmet());

// Enable CORS
app.use(cors());

// Parse JSON body
app.use(express.json());

// Logging
app.use(morgan("dev"));

// ==============================
// ROUTES
// ==============================

app.use("/api", routes);

// ==============================
// 404 HANDLER
// ==============================

app.use((req, res, next) => {
  next(new AppError(`Route not found: ${req.originalUrl}`, 404));
});

// ==============================
// GLOBAL ERROR HANDLER (LAST)
// ==============================

app.use(errorMiddleware);

module.exports = app;