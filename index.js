const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();


const { PORT, MONGODB_URI,ORIGIN } = require("./config");
const { API_ENDPOINT_NOT_FOUND_ERR, SERVER_ERR } = require("./errors");
console.log(API_ENDPOINT_NOT_FOUND_ERR)
// routes
const userAuthRoutes = require("./routes/userAuth.route");
const vendorAuthRoutes = require("./routes/vendorAuth.route");
const adminAuthRoutes = require("./routes/adminAuth.route")
// init express app
const app = express();

// middlewares



app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: ORIGIN,
    optionsSuccessStatus: 200,
  })
);


// index route

app.get("/", (req, res) => {
  res.status(200).json({
    type: "success",
    message: "server is up and running",
    data: null,
  });
});

// routes middlewares

app.use("/api/v1/auth/users", userAuthRoutes);
app.use("/api/v1/auth/vendors", vendorAuthRoutes);
app.use("/api/v1/auth/admins", adminAuthRoutes);

// page not found error handling  middleware

app.use("*", (req, res, next) => {
  const error = {
    status: 404,
    message: API_ENDPOINT_NOT_FOUND_ERR,
  };
  next(error);
});

// global error handling middleware
app.use((err, req, res, next) => {
  console.log(err);
  const status = err.status || 500;
  const message = err.message || SERVER_ERR;
  const data = err.data || null;
  res.status(status).json({
    type: "error",
    message,
    data,
  });
});

async function main() {
  try {
    await mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

    console.log("database connected");

    app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

main();