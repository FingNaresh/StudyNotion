const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");
require("dotenv").config();

// resetPasswordToken
exports.resetPasswordToken = async (req, res) => {
  try {
    // get email from req body
    const email = req.body.email;
    // check user for this email,email validation
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({
        success: false,
        message: "Your email is not registered with us, please try again",
      });
    }
    // generate token
    const token = crypto.randomUUID();
    // Update user by adding token and expiration time
    const updatedUserDetails = await User.findByIdAndUpdate(
      { email: email },
      {
        token: token,
        resetPasswordExpires: Date.now() + 5 * 60 * 1000,
      },
      { new: true },
    );
    // create url
    const url = `http://localhost:3000/update-password/${token}`;

    // send mail containing the url
    await mailSender(email, "Password Reset Link", `Passwor Reset Link:${url}`);

    // return response
    return res.json({
      success: true,
      message:
        "Email sent succesfully , please check email and change password",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong, please try again",
    });
  }
};

// resetPassword
exports.resetPassword = async (req, res) => {
  try {
    // data fetch
    const { password, confirmPassword, token } = req.body;
    // validation
    if (password !== confirmPassword) {
      return res.json({
        success: false,
        message: "Password and confirm password does not match",
      });
    }
    // get Userdetials from db using token
    const userDetails = await User.findOne({
      token: token,
    });
    if (!userDetails) {
      return res.json({
        success: false,
        message: "token invalid or expired",
      });
    }
    // token time check
    if (userDetails.resetPasswordExpires < Date.now()) {
      return res.json({
        success: false,
        message: "token is  expired, please regenerate your token",
      });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    // update password
    await User.findByIdAndUpdate(
      { token: token },
      { password: hashedPassword },
      { new: true },
    );
    // return response
    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong, please try again",
    });
  }
};
