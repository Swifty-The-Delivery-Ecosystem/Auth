const User = require("../models/user.model");
const nodemailer = require("nodemailer");

const {
  // PHONE_NOT_FOUND_ERR,
  // PHONE_ALREADY_EXISTS_ERR,
  USER_NOT_FOUND_ERR,
  MAIL_ALREADY_EXISTS_ERR,
  INCORRECT_OTP_ERR,
  INCORRECT_CRED_ERR,
  ACCESS_DENIED_ERR,
} = require("../errors");

const { checkPassword, hashPassword } = require("../utils/password.util");
const { createJwtToken } = require("../utils/token.util");
// const { TWILIO_SERVICE_SID, TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } =
//   process.env;
// const client = require("twilio")(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, {
//   lazyloading: true,
// });

let mailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "adityavinay@iitbhilai.ac.in",
    pass: "afbu jlzp wolw qhya",
  },
});

const otp = Math.floor(1000 + Math.random() * 8000);

// ---------------------- verify mail otp -------------------------

exports.verifyOtp = async (req, res, next) => {
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
      message: "OTP verified successfully.",
      data: {
        token,
        userId: user._id,
      },
    });
  } catch (error) {
    next(error);
  }
};

// --------------------- create new user ---------------------------------

exports.createNewUser = async (req, res, next) => {
  try {
    let { email, name, passwd } = req.body; // send the hashed passwd from the client
    // let countrycode = 91
    // check duplicate phone Number
    const emailExist = await User.findOne({ email });

    if (emailExist) {
      next({ status: 400, message: MAIL_ALREADY_EXISTS_ERR });
      return;
    }
    // create new user
    const createUser = new User({
      email,
      name,
      role: "USER",
      otp: {
        code: otp,
        expiresAt: new Date(Date.now() + 2 * 60 * 1000), // Set expiration to 2 minutes from now
      },
    });

    // save user
    const user = await createUser.save();

    let mailDetails = {
      from: "adityavinay@iitbhilai.ac.in",
      to: email,
      subject: "OTP for creating account at Swifty.",
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
    // const otpResponse = await client.verify
    // .services(TWILIO_SERVICE_SID)
    // .verifications.create({
    //     to:`+${countrycode}${phone}`,
    //     channel: "sms",
    // })

    res.status(200).send("OTP sent successfully to your email address.");
  } catch (error) {
    next(error);
  }
};

// ------------ login ----------------------------------

exports.login = async (req, res, next) => {
  try {
    const { email, passwd } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      next({ status: 400, message: EMAIL_NOT_FOUND_ERR });
      return;
    }

    // if (passwd === user.password) {
    //   res.status(200).send("You have logged in successfully!");
    // } else {
    //   next({ status: 400, message: INCORRECT_PASS_ERR });
    //   return;
    // }

    const passwordMatch = password === user.password ? 1 : 0;

    if (passwordMatch) {
      const token = createJwtToken({ userId: user._id });

      res.status(201).json({
        type: "success",
        data: {
          token,
          userId: user._id,
        },
      });
    } else {
      res.status(401).json({ error: INCORRECT_CRED_ERR });
    }
  } catch (error) {
    next(error);
  }

  // user.otp = { code: otp, expiresAt: new Date(Date.now() + 2 * 60 * 1000) };

  // const otp = Math.floor(1000 + Math.random() * 9000);

  // const otpResponse = await client.verify
  // .services(TWILIO_SERVICE_SID)
  // .verifications.create({
  //     to:`+${countrycode}${phone}`,
  //     channel: "sms",
  // })
  // let mailDetails = {
  //   from: "adityavinay@iitbhilai.ac.in",
  //   to: email,
  //   subject: "Test mail",
  //   text: `Your OTP is: ${user.otp.code}`,
  // };
  // mailTransporter.sendMail(mailDetails, function (err, data) {
  //   if (err) {
  //     console.log("Error Occurs");
  //     console.log(err);
  //   } else {
  //     console.log("Email sent successfully");
  //   }
  // });
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
      message: "Mr. Admin, you are in!",
      data: {
        user: currentUser,
      },
    });
  } catch (error) {
    next(error);
  }
};
