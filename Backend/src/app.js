import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan"
import fs from "fs"
import path from "path"
import { fileURLToPath } from 'url';
import winston from 'winston'; // Importing winston for detailed logging
import dotenv from "dotenv"

const app = express();

dotenv.config({ path: "./.env" })

// Log setup for access logs
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// const buildDir = path.join(__dirname, "../../Frontend"); // Path to the build directory


// Middleware setup
app.use(cors({ credentials: true, origin: process.env.CORS_ORIGIN }));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// app.use(express.static(buildDir));


const accessLogStream = fs.createWriteStream(path.join(__dirname, "../public/logs", 'log entry for an HTTP request.log'), { flags: 'a' });
app.use(morgan('combined', { stream: accessLogStream }));

// Setup Winston for custom logs
const logger = winston.createLogger({
  level: 'info', // Adjust log level as needed
  transports: [
    // File transport for saving logs to a file
    new winston.transports.File({
      filename: path.join(__dirname, '../public/logs', 'HTTP request in detailed.log')
    }),

    // Console transport to log directly to the console
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(), // This will add color to the console logs
        winston.format.simple()    // A simple log format
      )
    })
  ]
});



// Log incoming request details
app.use((req, res, next) => {
  // Log full details of the incoming request
  logger.info(`Request Method: ${req.method}`);
  logger.info(`Request URL: ${req.originalUrl}`);
  logger.info(`Request Headers: ${JSON.stringify(req.headers)}`);
  logger.info(`Request Body: ${JSON.stringify(req.body)}`);
  logger.info(`Query Parameters: ${JSON.stringify(req.query)}`);

  // Capture original send function to log the response after processing
  const originalSend = res.send;
  res.send = function (body) {
    // Log the response details
    logger.info(`Response Status: ${res.statusCode}`);
    // logger.info(`Response Body: ${body}`);

    // Call the original send function to send the response
    originalSend.call(this, body);
  };

  // Proceed to the next middleware or route handler
  next();
});

// Routes
import userRouter from "./Routes/user.routes.js";
import vehicleRouter from "./Routes/vehicle.routes.js";
import softwareRouter from "./Routes/software.routes.js";
import campaignRouter from "./Routes/campaign.routes.js";

// Routes declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/vehicle", vehicleRouter);
app.use("/api/v1/software", softwareRouter);
app.use("/api/v1/campaign", campaignRouter);



// This serves index.html for all unmatched routes in production (when the React app is built)
// app.get("*", (req, res) => {
//   res.sendFile(path.join(buildDir, "index.html"));
// });


// Error handling middleware
app.use((err, req, res, next) => {
  // Log the error details
  logger.error({
    message: "An error occurred",
    error: err.message || "Unknown error",
    statusCode: err.statusCode || 500,
    method: req.method,
    url: req.originalUrl,
    body: req.body, // Request body that caused the error (optional)
  });

  // Send the error response to the client
  const responseMessage = {
    message: "An error occurred",
    error: err.message || "Unknown error",
  };

  res.status(err.statusCode || 500).json(responseMessage);
});

export { app };





// LOCAL_NETWORK_IP = localhost #For Development Server
// LOCAL_NETWORK_IP = 10.191.14.154 #For Production Server




// // OLD

// import express from "express";
// import cors from "cors";
// import cookieParser from "cookie-parser";
// import { fileURLToPath } from 'url';
// import path from "path"

// const app = express();



// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// const buildDir = path.join(__dirname, "../../build");


// // Set up CORS, cookie parser, and body parsers
// app.use(cors({ credentials: true, origin: process.env.CORS_ORIGIN }));
// app.use(express.json({ limit: "16kb" }));
// app.use(express.urlencoded({ extended: true, limit: "16kb" }));
// app.use(express.static("public"));
// app.use(cookieParser());
// app.use(express.static(buildDir));

// //Routes
// import userRouter from "./Routes/user.routes.js";
// import vehicleRouter from "./Routes/vehicle.routes.js";
// import softwareRouter from "./Routes/software.routes.js";
// import campaignRouter from "./Routes/campaign.routes.js";
// import { TIME } from "sequelize";
// //routes declaration

// app.use("/api/v1/users", userRouter);
// app.use("/api/v1/vehicle", vehicleRouter);
// app.use("/api/v1/software", softwareRouter);
// app.use("/api/v1/campaign", campaignRouter);



// // This serves index.html for all unmatched routes in production (when the React app is built)
// app.get("*", (req, res) => {
//   res.sendFile(path.join(buildDir, "index.html"));
// });


// app.use((err, req, res, next) => {
//   console.log("Error", err);
//   res.status(err.statusCode).json(err);
// });


// export { app };



