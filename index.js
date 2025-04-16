
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
// const passport = require("passport");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const router = require("./src/Routes");
const globalErrorHandler = require("./src/error/globalErrorHandler");

const app = express();
app.use(cors());
app.use(express.json());
app.use(globalErrorHandler);

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, //ach unique IP address can make up to 100 requests within a 15-minute window.
    max: 100,
    message: "Too many requests, please try again later."
  })
);


// app.use("/auth", authRoutes);
// app.use("/payments", paymentRoutes);
app.use("/api/v1",router)
// console.log(process.env.MONGO_URI)

mongoose.connect(process.env.MONGO_URI)
  .then(() => app.listen(process.env.PORT || 3000, () => console.log("Server running")))
  .catch(err => console.error("MongoDB connection error:", err));
