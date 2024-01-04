const Vendor = require("../models/vendor.model");
const nodemailer = require("nodemailer");
// const bcrypt = require('bcrypt');
// KXPFKU96F1QHUHQ4PPDH2Z8H
const {
  // PHONE_NOT_FOUND_ERR,
  // PHONE_ALREADY_EXISTS_ERR,
  USER_NOT_FOUND_ERR,
  INCORRECT_OTP_ERR,
  INCORRECT_PASS_ERR,
  ACCESS_DENIED_ERR,
} = require("../errors");

// const { checkPassword, hashPassword } = require("../utils/password.util");
const { createJwtToken } = require("../utils/token.util");

let mailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "adityavinay@iitbhilai.ac.in",
    pass: "afbu jlzp wolw qhya",
  },
});

const otp = Math.floor(1000 + Math.random() * 9000);

// ---------------------- verify mail otp -------------------------

exports.verifyOtp = async (req, res, next) => {
  try {
    const { in_otp, email } = req.body;
    const vendor = await Vendor.findOne({ email });
    if (!vendor) {
      next({ status: 400, message: USER_NOT_FOUND_ERR });
      return;
    }
    console.log(vendor.otp.code);
    if (in_otp !== vendor.otp.code) {
      next({ status: 400, message: INCORRECT_OTP_ERR });
      return;
    }
    // const verifiedResponse = await client.verify.
    // services(TWILIO_SERVICE_SID)
    // .verificationChecks.create({
    //     to:`+${countrycode}${phone}`,
    //     code: otp,
    // });

    const token = createJwtToken({ vendorId: vendor._id });

    res.status(201).json({
      type: "success",
      message: "OTP verified successfully.",
      data: {
        token,
        vendorId: vendor._id,
      },
    });
  } catch (error) {
    next(error);
  }
};

// --------------------- create new user ---------------------------------

exports.createNewVendor = async (req, res, next) => {
  try {
    let { email, ownerName, restaurantName, password, restaurantId } = req.body; //provide the hashed passwd from the client
    console.log(req.body);
    // let countrycode = 91
    // check duplicate phone Number
    const emailExist = await Vendor.findOne({ email });

    if (emailExist) {
      next({ status: 400, message: EMAIL_ALREADY_EXISTS_ERR });
      return;
    }
    // create new user
    // const hashedPassword = await bcrypt.hash(password, 10);

    const createVendor = new Vendor({
      email,
      ownerName,
      restaurantName,
      password,
      restaurantId,
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

// ------------ login ----------------------------------

exports.vendorLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const vendor = await Vendor.findOne({ email });

    if (!vendor) {
      next({ status: 400, message: USER_NOT_FOUND_ERR });
      return;
    }

    const passwordMatch = password === vendor.password ? 1 : 0;

    if (passwordMatch) {
      const token = createJwtToken({ vendorId: vendor._id });

      res.status(201).json({
        type: "success",
        data: {
          token,
          vendorId: vendor._id,
        },
      });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (error) {
    next(error);
  }
};

// --------------- fetch current user -------------------------

exports.fetchCurrentVendor = async (req, res, next) => {
  try {
    const currentVendor = res.locals.vendor;

    return res.status(200).json({
      type: "success",
      message: "fetch current Vendor",
      data: {
        vendor: currentVendor,
      },
    });
  } catch (error) {
    next(error);
  }
};