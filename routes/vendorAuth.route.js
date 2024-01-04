const express = require("express");
const router = express.Router();


const checkAuth = require("../middlewares/checkVendor");

const {
  vendorLogin,createNewVendor, fetchCurrentVendor
} = require("../controllers/vendorAuth.controller");


router.post("/register", createNewVendor);

router.post("/login", vendorLogin);

router.get("/currentVendor", checkAuth, fetchCurrentVendor);

module.exports = router;