import config from "config";
import jwt from "jsonwebtoken";

import nodemailer from "nodemailer";
import cloudinary from "cloudinary";

cloudinary.config({
  cloud_name: config.get("cloudinary.cloud_name"),
  api_key: config.get("cloudinary.api_key"),
  api_secret: config.get("cloudinary.api_secret"),
});

//
const transporter = nodemailer.createTransport({
  service: config.get("nodemailer.service"),
  auth: {
    user: config.get("nodemailer.email"),
    pass: config.get("nodemailer.password"),
  },
});

transporter.verify((err) => {
  if (err) return console.error(err);
  console.log("Email: " + config.get("nodemailer.email") + " Conected");
});

const from = config.get("nodemailer.email");

//
import qrcode from "qrcode";
import axios from "axios";
import { feeServices } from "../api/v1/services/fee";
const { findFee, sortFee } = feeServices;

module.exports = {
  async getFeeCategory(blockchainUrl, address) {
    let getCategory;
    let massBalance = await axios.get(
      `${blockchainUrl}/getBalance/${address}/MASS`
    );
    getCategory = await sortFee({
      massHeld: { $lte: massBalance.data.balance },
    });
    if (!getCategory) {
      getCategory = await findFee({ planType: "Basic" });
    }
    return getCategory;
  },

  getOTP() {
    var otp = Math.floor(1000 + Math.random() * 9000);
    return otp;
  },

  sendEmailOtp: (email, otp, userName, callback) => {
    // var sub = `Use the One Time Password(OTP)  ${otp}  to verify your account. `
    let html = `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
  <div style="margin:50px auto;width:70%;padding:20px 0">
    <div style="border-bottom:1px solid #eee">
      <table style="width:100%">
          <tr>
              <th><img src="https://res.cloudinary.com/mobiloittetech/image/upload/v1654353773/hxget5wuaod6vfqunwbt.png" alt="Logo"
                      style="width:30%;height:30%;"></th>
          </tr>
      </table>
    </div>
    <p style="font-size:1.1em">Hi ${userName},</p>
    <p>Thank you for choosing MAS. Use the following OTP to complete your Sign Up procedures. OTP is valid for 5 minutes</p>
    <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${otp}</h2>
    <p style="font-size:0.9em;">Regards,<br />MAS</p>
    <hr style="border:none;border-top:1px solid #eee" />
    <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
    </div>
  </div>
</div>`;

    var mailOptions = {
      from,
      to: email,
      subject: "Your Email OTP to Sign Up to your MAS account",
      // text: sub,
      html: html,
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        callback(error, null);
      } else {
        callback(null, info.response);
      }
    });
  },
  getReferralCode() {
    var x = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 8; i++) {
      x += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return x;
  },

  getToken: async (payload) => {
    var token = await jwt.sign(payload, config.get("jwtsecret"), {
      expiresIn: "24h",
    });
    return token;
  },

  // sendMail: async (to, name, link) => {
  //   let html = ` <div
  //   style="background-color:rgb(255, 255, 255); border-width:1px; border-style: solid; border-color: #000000; height: 500px; width:700px">
  //   <img src=${logo} alt="company logo" width="180" height="75">
  //   <div style="font-size:20px; text-align:left; margin-left: 3rem; margin-right: 3rem; margin-top: auto;">
  //       <p>Hello,</p>
  //       <p text-decoration="none">We recevied a request to reset the password for the <b> MAS </b> account associated with
  //           ${to}.</p>
  //       <a href="${config.get('hostAddress')}?${link}" style="text-decoration: none; ">
  //           <button type="button"
  //               style="display: block;width: 100%; border: none; background-color:blue;color:white;padding: 14px 28px; font-size: 16px;cursor: pointer; text-align: center;">
  //               Request your password
  //           </button>
  //       </a>
  //       <p>if you didn't request to reset your password, let us know by replying directly to this email. No changes
  //           were made to your account yet.</p>
  //       <p>
  //           Thanks,<br>
  //           <b>MAS Team</b>
  //       </p>
  //   </div>`

  //   var transporter = nodemailer.createTransport({
  //     service: config.get('nodemailer.service'),
  //     auth: {
  //       "user": config.get('nodemailer.email'),
  //       "pass": config.get('nodemailer.password')
  //     },

  //   });
  //   var mailOptions = {
  //     from: "<" + config.get("nodemailer.email") + ">",
  //     to: to,
  //     subject: 'Reset Link',
  //     html: html
  //   };
  //   return await transporter.sendMail(mailOptions)
  // },
  sendMail: async (to, name, link, type) => {
    let html = `
    <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
    <div style="margin:50px auto;width:70%;padding:20px 0">
      <div style="border-bottom:1px solid #eee">
        <table style="width:100%">
            <tr>
                <th><img src="https://res.cloudinary.com/mobiloittetech/image/upload/v1654353773/hxget5wuaod6vfqunwbt.png" alt="Logo"
                        style="width:30%;height:30%;"></th>
            </tr>
        </table>
      </div>
      <p style="font-size:1.1em">Hi ${name},</p>
      <p>If you forgot your password, no worries: Click on reset button and we will send you a link you can use to pick a new password.</p>
      <div align="center">
        <a href="${
          type == "admin"
            ? config.get("hostAddress")
            : config.get("userResetLink")
        }?token=${link}" target="_blank" style="box-sizing: border-box;display: inline-block;font-family:'Montserrat',sans-serif;text-decoration: none;-webkit-text-size-adjust: none;text-align: center;color: #FFFFFF; background-color: #0088ee; border-radius: 60px;-webkit-border-radius: 60px; -moz-border-radius: 60px; width:auto; max-width:100%; overflow-wrap: break-word; word-break: break-word; word-wrap:break-word; mso-border-alt: none;border-top-color: #CCC; border-top-style: solid; border-top-width: 0px; border-left-color: #CCC; border-left-style: solid; border-left-width: 0px; border-right-color: #CCC; border-right-style: solid; border-right-width: 0px; border-bottom-color: #0275a4; border-bottom-style: solid; border-bottom-width: 5px;">
          <span style="display:block;padding:15px 40px 14px;line-height:120%;"><strong><span style="font-size: 16px; line-height: 19.2px;">RESET PASSWORD</span></strong></span>
        </a>
    </div>
      <p style="font-size:0.9em;">Regards,<br />MAS</p>
      <hr style="border:none;border-top:1px solid #eee" />
      <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
      </div>
    </div>
  </div>`;
    var mailOptions = {
      from,
      to: to,
      subject: "Reset Link",
      html: html,
    };
    return await transporter.sendMail(mailOptions);
  },
  getImageUrl: async (files) => {
    var result = await cloudinary.v2.uploader.upload(files[0].path, {
      resource_type: "auto",
    });
    return result.secure_url;
  },

  genBase64: async (data) => {
    return await qrcode.toDataURL(data);
  },

  getSecureUrl: async (base64) => {
    var result = await cloudinary.v2.uploader.upload(base64);
    return result.secure_url;
  },

  subAdminMail: async (email, name, password) => {
    let html = `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
    <div style="margin:50px auto;width:70%;padding:20px 0">
      <div style="border-bottom:1px solid #eee">
        <table style="width:100%">
            <tr>
                <th><img src="https://res.cloudinary.com/mobiloittetech/image/upload/v1654353773/hxget5wuaod6vfqunwbt.png" alt="Logo"
                        style="width:30%;height:30%;"></th>
            </tr>
        </table>
      </div>
      <p style="font-size:1.1em">Hi ${name},</p>
      <p>Thank you for choosing MAS. Your account has been created as Sub-Admin. The following is the login details : <br>Email : ${email} <br>Password : ${password} <br>Link : https://donations-creator-admin.mobiloitte.org/</p>
      <p style="font-size:0.9em;">Regards,<br />MAS</p>
      <hr style="border:none;border-top:1px solid #eee" />
      <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
      </div>
    </div>
  </div>`;
    var mailOptions = {
      from,
      to: email,
      subject: "Sub-Admin Account Creation",
      html: html,
    };

    //
    return await transporter.sendMail(mailOptions);
  },
};
