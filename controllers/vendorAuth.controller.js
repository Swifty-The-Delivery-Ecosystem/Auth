const Vendor = require("../models/vendor.model");
const nodemailer = require("nodemailer");
const bcrypt = require('bcrypt');
// KXPFKU96F1QHUHQ4PPDH2Z8H
const {
  PHONE_NOT_FOUND_ERR,
  PHONE_ALREADY_EXISTS_ERR,
  USER_NOT_FOUND_ERR,
  INCORRECT_OTP_ERR,
  ACCESS_DENIED_ERR,
} = require("../errors");

// const { checkPassword, hashPassword } = require("../utils/password.util");
const { createJwtToken } = require("../utils/token.util");
const otp = Math.floor(1000 + Math.random() * 9000);

let mailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "adityavinay@iitbhilai.ac.in",
    pass: "afbu jlzp wolw qhya",
  },
});


// --------------------- create new user ---------------------------------

exports.createNewVendor = async (req, res, next) => {
  try {
    let { email, ownerName, restaurantName, password, restaurantId,location, phone } = req.body;

    // let countrycode = 91
    const emailExist = await Vendor.findOne({ email });
    if (emailExist) {
      next({ status: 400, message: EMAIL_ALREADY_EXISTS_ERR });
      return;
    }
    // create new vendor
  
    const createVendor = new Vendor({
      ownerName,
      email,
      restaurantName,
      restaurantId,
      password,
      otp: {
        code: otp,
        expiresAt: new Date(Date.now() + 2 * 60 * 1000), // Set expiration to 2 minutes from now
      },
      location,
      phone
    });

    const vendor = await createVendor.save();

    let mailDetails = {
      from: "adityavinay@iitbhilai.ac.in",
      to: email,
      subject: "Test mail",
      text: `Your OTP is: ${otp}`,
    };

    mailTransporter.sendMail(mailDetails, function (err, data) {
      if (err) {
        console.log("Error Occurs");
        console.log(err);
      } else {
        console.log("Email sent successfully");
      }
    });

    res.status(200).send("OTP send successfully");
  } catch (error) {
    next(error);
  }
};

// ------------ login with password ----------------------------------

exports.vendorLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const vendor = await Vendor.findOne({ email });

    if (!vendor) {
      next({ status: 400, message: USER_NOT_FOUND_ERR });
      return;
    }
    
    const passwordMatch = vendor.password=== password;
    if (passwordMatch) {
        // Generate JWT token
        const token = createJwtToken({ userId: vendor._id });

        res.status(201).json({
            type: "success",
            data: {
              token,
              userId: vendor._id,
            },
          });

    } else {
        res.status(401).json({ error: 'Invalid credentials' });
    }
    
  } catch (error) {
    next(error);
  }
};

// ---------------------- verify mail otp -------------------------

exports.verifyOtp = async (req, res, next) => {
  try {
    const { in_otp, email } = req.body;
    const vendor = await Vendor.findOne({ email });
    if (!vendor) {
      next({ status: 400, message: USER_NOT_FOUND_ERR });
      return;
    }

    if (in_otp !== vendor.otp.code || vendor.otp.expiresAt < Date(Date.now() + 2 * 60 * 1000) ) {
      next({ status: 400, message: INCORRECT_OTP_ERR });
      return;
    }

    const token = createJwtToken({ userId: vendor._id });
    vendor.otp=null;
    vendor.save();
    res.status(201).json({
      type: "success",
      message: "OTP verified successfully.",
      data: {
        token,
        userId: vendor._id,
      },
    });

  } catch (error) {
    next(error);
  }
};

// --------------- fetch current user -------------------------

exports.fetchCurrentVendor = async (req, res, next) => {
  try {
    const currentUser = res.locals.user;
    
    return res.status(200).json({
      type: "success",
      message: "fetch current user",
      data: {
        user: currentUser,
      },
    });
  } catch (error) {
    next(error);
  }
};
