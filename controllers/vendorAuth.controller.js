const Vendor = require("../models/user.model");
const nodemailer = require("nodemailer");
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

let mailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "adityavinay@iitbhilai.ac.in",
    pass: "afbu jlzp wolw qhya",
  },
});

const otp = Math.floor(1000 + Math.random() * 9000);

// --------------------- create new user ---------------------------------

exports.createNewVendor = async (req, res, next) => {
  try {
    let { email, name, password } = req.body;
    console.log(req.body);
    // let countrycode = 91
    // check duplicate phone Number
    const emailExist = await Vendor.findOne({ email });

    if (emailExist) {
      next({ status: 400, message: EMAIL_ALREADY_EXISTS_ERR });
      return;
    }
    // create new user
    const createVendor = new Vendor({
      email,
      name,
      password
    //   otp: {
    //     code: otp,
    //     expiresAt: new Date(Date.now() + 2 * 60 * 1000), // Set expiration to 2 minutes from now
    //   },
    });

    const user = await createVendor.save();

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

// ------------ login with phone otp ----------------------------------

exports.vendorLogin = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      next({ status: 400, message: EMAIL_NOT_FOUND_ERR });
      return;
    }

    user.otp = { code: otp, expiresAt: new Date(Date.now() + 2 * 60 * 1000) };

    let mailDetails = {
      from: "adityavinay@iitbhilai.ac.in",
      to: email,
      subject: "Test mail",
      text: `Your OTP is: ${user.otp.code}`,
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

// ---------------------- verify phone otp -------------------------

exports.verifyPhoneOtp = async (req, res, next) => {
  try {
    const { in_otp, email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      next({ status: 400, message: USER_NOT_FOUND_ERR });
      return;
    } 
    console.log(user.otp.code);
    if (in_otp !== user.otp.code) {
      next({ status: 400, message: INCORRECT_OTP_ERR });
      return;
    }
    // const verifiedResponse = await client.verify.
    // services(TWILIO_SERVICE_SID)
    // .verificationChecks.create({
    //     to:`+${countrycode}${phone}`,
    //     code: otp,
    // });

    const token = createJwtToken({ userId: user._id });

    res.status(201).json({
      type: "success",
      message: "OTP verified successfully",
      data: {
        token,
        userId: user._id,
      },
    });
  } catch (error) {
    next(error);
  }
};

// --------------- fetch current user -------------------------

exports.fetchCurrentUser = async (req, res, next) => {
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

// --------------- admin access only -------------------------

exports.handleAdmin = async (req, res, next) => {
  try {
    const currentUser = res.locals.user;

    return res.status(200).json({
      type: "success",
      message: "Okay you are admin!!",
      data: {
        user: currentUser,
      },
    });
  } catch (error) {
    next(error);
  }
};
