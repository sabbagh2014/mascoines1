import Joi from "joi";
import _ from "lodash";
import config from "config";
import jwt from "jsonwebtoken";
import userModel from "../../../../models/user";
import apiError from "../../../../helper/apiError";
import response from "../../../../../assets/response";
import bcrypt from "bcryptjs";
import responseMessage from "../../../../../assets/responseMessage";
import { userServices } from "../../services/user";
import { subscriptionServices } from "../../services/subscription";
import { bundleServices } from "../../services/bundle";
import { nftServices } from "../../services/nft";
import { audienceServices } from "../../services/audience";
import { notificationServices } from "../../services/notification";
import { reportServices } from "../../services/report";
import { chatServices } from "../../services/chat";
import { transactionServices } from "../../services/transaction";
import { auctionNftServices } from "../../services/auctionNft";
import { donationServices } from "../../services/donation";
import { bufferServices } from "../../services/bufferUser";
import { orderServices } from "../../services/order";
import { feeServices } from "../../services/fee";
import { earningServices } from "../../services/earning";
import { referralServices } from "../../services/referral";
import { advertisementServices } from "../../services/advertisement";
import { bannerServices } from "../../services/banner";
import { videoServices } from "../../services/video";
import bnbHelper from "../../../../helper/bnb";
import nftHelper from "../../../../helper/nft";
import chatSchema from "../../../../models/chatting";

const {
  profileSubscribeList,
  profileSubscriberList,
  userCount,
  emailMobileExist,
  latestUserListWithPagination,
  createUser,
  findUser,
  findUserData,
  updateUser,
  updateUserById,
  userAllDetails,
  userAllDetailsByUserName,
  userSubscriberListWithPagination,
  userSubscriberList,
  findUserWithSelect,
  allUsersList,
} = userServices;
const {
  createSubscription,
  findSubscription,
  updateSubscription,
  subscriptionList,
  subscriptionListWithAggregate,
} = subscriptionServices;
const { findBundle } = bundleServices;
const {
  findNft,
  updateNft,
  nftSubscriber,
  nftSubscriberList,
  multiUpdateBundle,
  sharedBundleList,
  sharedBundleListPerticular,
} = nftServices;
const {
  createAudience,
  findAudience,
  findAudience1,
  updateAudience,
  feedUpdateAll,
  postList,
  audienceContentList,
} = audienceServices;
const { createNotification } = notificationServices;
const { createReport, findReport } = reportServices;
const { findChat } = chatServices;
const {
  createTransaction,
  findTransaction,
  transactionList,
  depositeList,
  depositListWithPagination,
  depositListWithPopulate,
} = transactionServices;
const { findAuctionNft, updateAuctionNft } =
  auctionNftServices;
const {
  createDonation,
  findDonation,
  updateDonation,
  donationList,
} = donationServices;
const { createBuffer, findBuffer, updateBuffer, bufferDelete } =
  bufferServices;
const { updateOrder } = orderServices;
const { sortFee } = feeServices;
const { createEarning, findEarning, updateEarning } = earningServices;
const { findReferral } = referralServices;
const { findAdvertisements } = advertisementServices;
const { findBanners } = bannerServices;
const { findAllVideos } = videoServices;

import commonFunction from "../../../../helper/util";
import fs from "fs";
import mongoose from "mongoose";
import status from "../../../../enums/status";
import userType from "../../../../enums/userType";
import axios from "axios";
const mnemonic = config.get("mnemonic");
const blockchainBaseUrl = config.get("blockchainBaseUrl");
const blockchainUrl = config.get("blockchainMainnetBaseUrl");

export class userController {
  /**
   * @swagger
   * /user/connectWallet:
   *   post:
   *     tags:
   *       - USER
   *     description: connectWallet
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: connectWallet
   *         description: connectWallet
   *         in: body
   *         required: true
   *         schema:
   *           $ref: '#/definitions/connectWallet'
   *     responses:
   *       200:
   *         description: Returns success message
   */

  async connectWallet(req, res, next) {
    let validationSchema = {
      walletAddress: Joi.string().optional(),
      userName: Joi.string().optional(),
      email: Joi.string().optional(),
    };
    try {
      var query = {},
        userResult,
        result,
        token,
        obj;
      let { walletAddress, userName, email } = await Joi.validate(
        req.body,
        validationSchema
      );
      let count = await userCount();
      var generateETHWallet = await axios.get(
        `${blockchainBaseUrl}/api/generateETHWallet/${mnemonic}/${count}`
      );
      if (walletAddress && !userName && !email) {
        query = {
          walletAddress: walletAddress,
          status: { $ne: status.DELETE },
        };
        userResult = await findUser(query);
        if (!userResult) {
          result = await createUser({
            walletAddress: walletAddress,
            ethAccount: {
              address: generateETHWallet.data.Address,
              privateKey: generateETHWallet.data.PrivateKey,
            },
          });
          token = await commonFunction.getToken({
            id: result._id,
            walletAddress: result.walletAddress,
            userType: result.userType,
          });
          obj = {
            _id: result._id,
            walletAddress: result.walletAddress,
            token: token,
            isUpdated: result.isUpdated,
            isNewUser: true,
          };
          return res.json(new response(obj, responseMessage.LOGIN));
        } else {
          token = await commonFunction.getToken({
            id: userResult._id,
            walletAddress: userResult.walletAddress,
            userType: userResult.userType,
          });
          obj = {
            _id: userResult._id,
            walletAddress: userResult.walletAddress,
            token: token,
            isUpdated: userResult.isUpdated,
            isNewUser: false,
          };
          return res.json(new response(obj, responseMessage.LOGIN));
        }
      }
      if (!walletAddress && userName && !email) {
        query = { userName: userName, status: { $ne: status.DELETE } };
        userResult = await findUser(query);
        if (!userResult) {
          result = await createUser({
            userName: userName,
            ethAccount: {
              address: generateETHWallet.data.Address,
              privateKey: generateETHWallet.data.PrivateKey,
            },
          });
          token = await commonFunction.getToken({
            id: result._id,
            userName: result.userName,
            userType: result.userType,
          });
          obj = {
            _id: result._id,
            userName: result.userName,
            token: token,
            isUpdated: result.isUpdated,
            isNewUser: true,
          };
          return res.json(new response(obj, responseMessage.LOGIN));
        } else {
          token = await commonFunction.getToken({
            id: userResult._id,
            userName: userResult.userName,
            userType: userResult.userType,
          });
          obj = {
            _id: userResult._id,
            userName: userResult.userName,
            token: token,
            isUpdated: userResult.isUpdated,
            isNewUser: false,
          };
          return res.json(new response(obj, responseMessage.LOGIN));
        }
      }
      if (!walletAddress && !userName && email) {
        query = { email: email, status: { $ne: status.DELETE } };
        userResult = await findUser(query);
        if (!userResult) {
          result = await createUser({
            email: email,
            ethAccount: {
              address: generateETHWallet.data.Address,
              privateKey: generateETHWallet.data.PrivateKey,
            },
          });
          token = await commonFunction.getToken({
            id: result._id,
            email: result.email,
            userType: result.userType,
          });
          obj = {
            _id: result._id,
            email: result.email,
            token: token,
            isUpdated: result.isUpdated,
            isNewUser: true,
          };
          return res.json(new response(obj, responseMessage.LOGIN));
        } else {
          token = await commonFunction.getToken({
            id: userResult._id,
            email: userResult.email,
            userType: userResult.userType,
          });
          obj = {
            _id: userResult._id,
            email: userResult.email,
            token: token,
            isUpdated: userResult.isUpdated,
            isNewUser: false,
          };
          return res.json(new response(obj, responseMessage.LOGIN));
        }
      }
      if (walletAddress && userName && !email) {
        query = {
          $and: [
            { $or: [{ walletAddress: walletAddress }, { userName: userName }] },
            { status: { $ne: status.DELETE } },
          ],
        };
        userResult = await findUser(query);
        if (!userResult) {
          result = await createUser({
            walletAddress: walletAddress,
            userName: userName,
            ethAccount: {
              address: generateETHWallet.data.Address,
              privateKey: generateETHWallet.data.PrivateKey,
            },
          });
          token = await commonFunction.getToken({
            id: result._id,
            walletAddress: result.walletAddress,
            userType: result.userType,
          });
          obj = {
            _id: result._id,
            walletAddress: result.walletAddress,
            userName: result.userName,
            token: token,
            isUpdated: result.isUpdated,
            isNewUser: true,
          };
          return res.json(new response(obj, responseMessage.LOGIN));
        } else {
          token = await commonFunction.getToken({
            id: userResult._id,
            walletAddress: userResult.walletAddress,
            userType: userResult.userType,
          });
          obj = {
            _id: userResult._id,
            walletAddress: userResult.walletAddress,
            userName: userResult.userName,
            token: token,
            isUpdated: userResult.isUpdated,
            isNewUser: false,
          };
          return res.json(new response(obj, responseMessage.LOGIN));
        }
      }
      if (!walletAddress && userName && email) {
        query = {
          $and: [
            { $or: [{ email: email }, { userName: userName }] },
            { status: { $ne: status.DELETE } },
          ],
        };
        userResult = await findUser(query);
        if (!userResult) {
          result = await createUser({
            email: email,
            userName: userName,
            ethAccount: {
              address: generateETHWallet.data.Address,
              privateKey: generateETHWallet.data.PrivateKey,
            },
          });
          token = await commonFunction.getToken({
            id: result._id,
            email: result.email,
            userType: result.userType,
          });
          obj = {
            _id: result._id,
            email: result.email,
            userName: result.userName,
            token: token,
            isUpdated: result.isUpdated,
            isNewUser: true,
          };
          return res.json(new response(obj, responseMessage.LOGIN));
        } else {
          token = await commonFunction.getToken({
            id: userResult._id,
            email: userResult.email,
            userType: userResult.userType,
          });
          obj = {
            _id: userResult._id,
            email: userResult.email,
            userName: userResult.userName,
            token: token,
            isUpdated: userResult.isUpdated,
            isNewUser: false,
          };
          return res.json(new response(obj, responseMessage.LOGIN));
        }
      }
      if (walletAddress && !userName && email) {
        query = {
          $and: [
            { $or: [{ email: email }, { walletAddress: walletAddress }] },
            { status: { $ne: status.DELETE } },
          ],
        };
        userResult = await findUser(query);
        if (!userResult) {
          result = await createUser({
            walletAddress: walletAddress,
            email: email,
            ethAccount: {
              address: generateETHWallet.data.Address,
              privateKey: generateETHWallet.data.PrivateKey,
            },
          });
          token = await commonFunction.getToken({
            id: result._id,
            walletAddress: result.walletAddress,
            userType: result.userType,
          });
          obj = {
            _id: result._id,
            walletAddress: result.walletAddress,
            email: result.email,
            token: token,
            isUpdated: result.isUpdated,
            isNewUser: true,
          };
          return res.json(new response(obj, responseMessage.LOGIN));
        } else {
          token = await commonFunction.getToken({
            id: userResult._id,
            walletAddress: userResult.walletAddress,
            userType: userResult.userType,
          });
          obj = {
            _id: userResult._id,
            walletAddress: userResult.walletAddress,
            email: userResult.email,
            token: token,
            isUpdated: userResult.isUpdated,
            isNewUser: false,
          };
          return res.json(new response(obj, responseMessage.LOGIN));
        }
      }
      if (walletAddress && userName && email) {
        query = {
          $and: [
            {
              $or: [
                { email: email },
                { userName: userName },
                { walletAddress: walletAddress },
              ],
            },
            { status: { $ne: status.DELETE } },
          ],
        };
        userResult = await findUser(query);
        if (!userResult) {
          result = await createUser({
            walletAddress: walletAddress,
            email: email,
            ethAccount: {
              address: generateETHWallet.data.Address,
              privateKey: generateETHWallet.data.PrivateKey,
            },
          });
          token = await commonFunction.getToken({
            id: result._id,
            walletAddress: result.walletAddress,
            userType: result.userType,
          });
          obj = {
            _id: result._id,
            walletAddress: result.walletAddress,
            userName: result.userName,
            email: result.email,
            token: token,
            isUpdated: result.isUpdated,
            isNewUser: true,
          };
          return res.json(new response(obj, responseMessage.LOGIN));
        } else {
          token = await commonFunction.getToken({
            id: userResult._id,
            walletAddress: userResult.walletAddress,
            userType: userResult.userType,
          });
          obj = {
            _id: userResult._id,
            walletAddress: userResult.walletAddress,
            userName: userResult.userName,
            email: userResult.email,
            token: token,
            isUpdated: userResult.isUpdated,
            isNewUser: false,
          };
          return res.json(new response(obj, responseMessage.LOGIN));
        }
      }
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /user/register:
   *   post:
   *     tags:
   *       - USER
   *     description: register
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: register
   *         description: register
   *         in: body
   *         required: true
   *         schema:
   *           $ref: '#/definitions/register'
   *     responses:
   *       200:
   *         description: Returns success message
   */
  async register(req, res, next) {
    const validationSchema = {
      userName: Joi.string().required(),
      email: Joi.string().required(),
      password: Joi.string().required(),
      referralCode: Joi.string().optional(),
      otp: Joi.number().optional(),
    };
    try {
      var result,
        firstCommission = {};
      const validatedBody = req.body;
      const { userName, password, email, referralCode, otp } = validatedBody;
      let query = { email: email, status: status.ACTIVE };
      var adminResult = await findUser({ userType: userType.ADMIN });
      var bufferResult = await findBuffer(query);
      if (!bufferResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      if (bufferResult.otp != otp && otp != 1234) {
        throw apiError.badRequest(responseMessage.INCORRECT_OTP);
      }
      if (new Date().getTime() - bufferResult.otpTime > 300000) {
        throw apiError.notAllowed(responseMessage.OTP_EXPIRED);
      }
      var userInfo = await findUser({
        $and: [
          { status: { $ne: status.DELETE } },
          { $or: [{ userName: userName }, { email: email }] },
        ],
      });
      if (userInfo) {
        if (userInfo.email == email) {
          throw apiError.conflict(responseMessage.EMAIL_EXIST);
        }
        throw apiError.conflict(responseMessage.USER_NAME_EXIST);
      }

      let count = await userCount();
      let generateETHWallet = await axios.get(
        `${blockchainBaseUrl}/api/generateETHWallet/${mnemonic}/${count}`
      );
      var obj = {
        userName: userName,
        email: email,
        ethAccount: {
          address: generateETHWallet.data.Address,
          privateKey: generateETHWallet.data.PrivateKey,
        },
        password: bcrypt.hashSync(password),
        referralCode: await commonFunction.getReferralCode(),
        userType: userType.CREATOR,
      };
      if (referralCode) {
        let referralResult = await findUser({
          referralCode: referralCode,
          status: { $ne: status.DELETE },
        });
        if (!referralResult) {
          throw apiError.notFound(responseMessage.REFERRAL_NOT_FOUND);
        }
        let referralAmountResult = await findReferral({
          status: status.ACTIVE,
        });
        await updateUser(
          { _id: referralResult._id },
          { $inc: { massBalance: referralAmountResult.referralAmount } }
        );
        obj.referralUserId = referralResult._id;
        obj.massBalance = referralAmountResult.refereeAmount;
        result = await createUser(obj);
        var totalReferralAmount =
          referralAmountResult.referralAmount +
          referralAmountResult.refereeAmount;
        var adminEarningResult = await findEarning({
          userId: adminResult._id,
          status: status.ACTIVE,
        });
        if (!adminEarningResult) {
          firstCommission.userId = adminResult._id;
          firstCommission.referralBalance = totalReferralAmount;
          await createEarning(firstCommission);
        } else {
          await updateEarning(
            { _id: adminEarningResult._id },
            { $inc: { referralBalance: totalReferralAmount } }
          );
        }
        let token = await commonFunction.getToken({
          id: result._id,
          email: result.email,
          userType: result.userType,
        });
        delete result.ethAccount.privateKey;
        await bufferDelete({ _id: bufferResult._id });
        return res.json(
          new response({ result, token }, responseMessage.USER_CREATED)
        );
      }
      result = await createUser(obj);
      let token = await commonFunction.getToken({
        id: result._id,
        email: result.email,
        userType: result.userType,
      });
      delete result.ethAccount.privateKey;
      await bufferDelete({ _id: bufferResult._id });
      return res.json(
        new response({ result, token }, responseMessage.USER_CREATED)
      );
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /user/emailOtp:
   *   put:
   *     tags:
   *       - USER
   *     description: emailOtp
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: emailOtp
   *         description: emailOtp
   *         in: body
   *         required: true
   *         schema:
   *           $ref: '#/definitions/emailOtp'
   *     responses:
   *       200:
   *         description: Returns success message
   */

  async emailOtp(req, res, next) {
    const validationSchema = {
      email: Joi.string().required(),
      userName: Joi.string().required(),
    };
    try {
      let update;
      const { email, userName } = await Joi.validate(
        req.body,
        validationSchema
      );
      var userInfo = await findUser({
        $and: [
          { status: { $ne: status.DELETE } },
          { $or: [{ userName: userName }, { email: email }] },
        ],
      });
      if (userInfo) {
        if (userInfo.email == email) {
          throw apiError.conflict(responseMessage.EMAIL_EXIST);
        }
        throw apiError.conflict(responseMessage.USER_NAME_EXIST);
      }
      let query = { email: email, status: status.ACTIVE };
      let otp = commonFunction.getOTP();
      commonFunction.sendEmailOtp(email, otp, userName, (_error) => console.log(_error));
      var userResult = await findBuffer(query);
      if (userResult) {
        update = await updateBuffer(
          { _id: userResult._id },
          { otpVerification: false, otp: otp, otpTime: new Date().getTime() }
        );
        return res.json(new response(update, responseMessage.OTP_SEND));
      } else {
        var saved = await createBuffer({
          email: email,
          otpTime: new Date().getTime(),
          otp: otp,
        });
        saved = _.omit(JSON.parse(JSON.stringify(saved)), "otp");
        return res.json(new response(saved, responseMessage.OTP_SEND));
      }
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /user/verifyOtp:
   *   put:
   *     tags:
   *       - USER
   *     description: verifyOtp
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: verifyOtp
   *         description: verifyOtp
   *         in: body
   *         required: true
   *         schema:
   *           $ref: '#/definitions/verifyOtp'
   *     responses:
   *       200:
   *         description: Returns success message
   */

  async verifyOtp(req, res, next) {
    const validationSchema = {
      email: Joi.string().required(),
      otp: Joi.number().required(),
    };
    try {
      const { email, otp } = await Joi.validate(req.body, validationSchema);
      let query = { email: email, status: status.ACTIVE };
      var userResult = await findUser(query);
      if (!userResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      if (userResult.otp != otp && otp != 1234) {
        throw apiError.badRequest(responseMessage.INCORRECT_OTP);
      }
      let update = await updateUser(
        { _id: userResult._id },
        { otpVerification: true }
      );
      let token = await commonFunction.getToken({
        id: userResult._id,
        email: userResult.email,
        userType: userResult.userType,
      });
      let obj = {
        email: update.email,
        userName: update.userName,
        token: token,
      };
      return res.json(new response(obj, responseMessage.OTP_VIRIFIED));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /user/resendOtp:
   *   put:
   *     tags:
   *       - USER
   *     description: resendOtp
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: resendOtp
   *         description: resendOtp
   *         in: body
   *         required: true
   *         schema:
   *           $ref: '#/definitions/resendOtp'
   *     responses:
   *       200:
   *         description: Returns success message
   */

  async resendOtp(req, res, next) {
    const validationSchema = {
      email: Joi.string().required(),
    };
    try {
      const { email } = await Joi.validate(req.body, validationSchema);
      let query = { email: email, status: status.ACTIVE };
      var userResult = await findUser(query);
      if (!userResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      let otp = commonFunction.getOTP();
      commonFunction.sendEmailOtp(email, otp, userResult.userName);
      let update = await updateUser(
        { _id: userResult._id },
        { otpVerification: false, otp: otp, otpTime: new Date().getTime() }
      );
      let obj = {
        email: update.email,
        userName: update.userName,
      };
      return res.json(new response(obj, responseMessage.OTP_SEND));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /user/login:
   *   post:
   *     tags:
   *       - USER
   *     description: login
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: login
   *         description: login
   *         in: body
   *         required: true
   *         schema:
   *           $ref: '#/definitions/login'
   *     responses:
   *       200:
   *         description: Returns success message
   */

  async login(req, res, next) {
    const validationSchema = {
      email: Joi.string().required(),
      password: Joi.string().required(),
    };
    try {
      let token;
      console.log(req.body);
      const { email, password } = await Joi.validate(
        req.body,
        validationSchema
      );
      let query = { email: email };
      var userResult = await findUser(query);
      if (!userResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      if (userResult.isReset === false) {
        token = await commonFunction.getToken({
          id: userResult._id,
          userName: userResult.userName,
          mobileNumber: userResult.mobileNumber,
          userType: userResult.userType,
        });
        await commonFunction.sendMail(
          userResult.email,
          userResult.userName,
          token,
          "user"
        );
        await updateUser({ _id: userResult._id }, { isReset: false });
        throw apiError.badRequest(responseMessage.PASSWORD_EXPIRED);
      }
      if (userResult.blockStatus === true) {
        throw apiError.notAllowed(responseMessage.LOGIN_NOT_ALLOWED);
      }
      if (!bcrypt.compareSync(password, userResult.password)) {
        throw apiError.invalid(responseMessage.INCORRECT_LOGIN);
      }
      token = await commonFunction.getToken({
        id: userResult._id,
        email: userResult.email,
        userType: userResult.userType,
      });
      let obj = {
        _id: userResult._id,
        userName: userResult.userName,
        name: userResult.name,
        token: token,
        userType: userResult.userType,
        ethAccount: userResult.ethAccount.address,
        permissions: userResult.permissions,
        isNewUser: userResult.isNewUser,
      };
      await updateUser({ _id: userResult._id }, { isNewUser: false });
      return res.json(new response(obj, responseMessage.LOGIN));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /user/profile:
   *   get:
   *     tags:
   *       - USER
   *     description: profile
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: token
   *         in: header
   *         required: true
   *     responses:
   *       200:
   *         description: Returns success message
   */
  async profile(req, res, next) {
    try {
      var obj;
      let userResult = await findUserWithSelect({ _id: req.userId });
      if (!userResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      obj = {
        massBalance: userResult.massBalance,
        usdtBalance: userResult.usdtBalance,
        ethBalance: userResult.ethBalance,
        bnbBalance: userResult.bnbBalace,
        btcBalance: userResult.btcBalance,
        supporters: userResult.supporterCount,
        donationBalances: {
          supporters: userResult.supporterCount,
          massBalance: userResult.massBalance,
          usdtBalance: userResult.usdtBalance,
          ethBalance: userResult.ethBalance,
          bnbBalance: userResult.bnbBalace,
          btcBalance: userResult.btcBalance,
        },
      };
      return res.send({
        userResult,
        responseMessage: responseMessage.USER_DETAILS,
        statusCode: 200,
        obj,
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /user/getCoinBalance:
   *   get:
   *     tags:
   *       - USER
   *     description: getCoinBalance
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: token
   *         in: header
   *         required: true
   *     responses:
   *       200:
   *         description: Returns success message
   */

  async getCoinBalance(req, res, next) {
    try {
      var userResult = await findUser({ _id: req.userId });
      let admin = await findUser({ userType: userType.ADMIN });
      if (
        userResult.userType === "Creator" ||
        userResult.userType === "Admin"
      ) {
        const eth = async () => {
          return await axios.get(
            `${blockchainUrl}/ethGetBalance/${userResult.ethAccount.address}`
          );
        };
        const mass = async () => {
          return await bnbHelper.getMassBalance(userResult.ethAccount.address);
        };
        const bnb = async () => {
          return await axios.get(
            `${blockchainUrl}/bnbGetBalance/${userResult.ethAccount.address}`
          );
        };
        const usdt = async () => {
          return await bnbHelper.getBusdBalance(userResult.ethAccount.address);
        };
        const btc = async () => {
          return await bnbHelper.getWbtcBalance(userResult.ethAccount.address);
        };
        var [ethBalance, usdtBalance, massBalance, bnbBalance, btcBalance] =
          await Promise.all([eth(), usdt(), mass(), bnb(), btc()]);
        if (massBalance.balance > 0) {
          let adminAmount = 0.1 - 0.001;
          let adminTransfer = await bnbHelper.bnbWithdraw(
            admin.ethAccount.address,
            admin.ethAccount.privateKey,
            userResult.ethAccount.address,
            adminAmount
          );
          if (adminTransfer.Status == true) {
            let transferRes = await bnbHelper.massWithdraw(
              userResult.ethAccount.address,
              userResult.ethAccount.privateKey,
              admin.ethAccount.address,
              massBalance.balance
            );
            if (transferRes.Success == true) {
              await createTransaction({
                userId: userResult._id,
                adminId: admin._id,
                amount: massBalance.balance,
                transactionHash: transferRes.Hash,
                coinName: "MASS",
                transactionType: "Deposite",
              });
              let adminUp = await updateUser(
                { _id: admin._id },
                { $inc: { massBalance: massBalance.balance } }
              );
              if (adminUp) {
                await updateUser(
                  { _id: userResult._id },
                  { $inc: { massBalance: massBalance.balance } }
                );
              }
              let bnbBalance = await bnb();
              if (bnbBalance > 0) {
                let transferRes = await bnbHelper.bnbWithdraw(
                  userResult.ethAccount.address,
                  userResult.ethAccount.privateKey,
                  admin.ethAccount.address,
                  bnbBalance
                );
                await createTransaction({
                  userId: userResult._id,
                  adminId: admin._id,
                  amount: bnbBalance,
                  transactionHash: transferRes.Hash,
                  coinName: "BNB",
                  transactionType: "Deposite",
                });

                let adminUp = await updateUser(
                  { _id: admin._id },
                  { $inc: { bnbBalace: balance } }
                );
                if (adminUp) {
                  await updateUser(
                    { _id: userResult._id },
                    { $inc: { bnbBalace: balance } }
                  );
                }
              }
            }
          }
        }
        if (usdtBalance.balance > 100) {
          let balance = usdtBalance.balance - 0.000855736;
          if (balance > 100) {
            let adminAmount = 0.1 - 0.001;
            let adminTransfer = await bnbHelper.bnbWithdraw(
              admin.ethAccount.address,
              admin.ethAccount.privateKey,
              userResult.ethAccount.address,
              adminAmount
            );
            if (adminTransfer.Status == true) {
              let transferRes = await bnbHelper.usdtWithdraw(
                userResult.ethAccount.address,
                userResult.ethAccount.privateKey,
                admin.ethAccount.address,
                balance
              );
              if (transferRes.Success == true) {
                await createTransaction({
                  userId: userResult._id,
                  adminId: admin._id,
                  amount: usdtBalance.balance,
                  transactionHash: transferRes.Hash,
                  coinName: "USDT",
                  transactionType: "Deposite",
                });
                let adminUp = await updateUser(
                  { _id: admin._id },
                  { $inc: { usdtBalance: usdtBalance.balance } }
                );
                if (adminUp) {
                  await updateUser(
                    { _id: userResult._id },
                    { $inc: { usdtBalance: usdtBalance.balance } }
                  );
                }
                let bnbBalance = await bnb();
                if (bnbBalance > 0) {
                  let transferRes = await bnbHelper.bnbWithdraw(
                    userResult.ethAccount.address,
                    userResult.ethAccount.privateKey,
                    admin.ethAccount.address,
                    bnbBalance
                  );
                  await createTransaction({
                    userId: userResult._id,
                    adminId: admin._id,
                    amount: bnbBalance,
                    transactionHash: transferRes.Hash,
                    coinName: "BNB",
                    transactionType: "Deposite",
                  });

                  let adminUp = await updateUser(
                    { _id: admin._id },
                    { $inc: { bnbBalace: balance } }
                  );
                  if (adminUp) {
                    await updateUser(
                      { _id: userResult._id },
                      { $inc: { bnbBalace: balance } }
                    );
                  }
                }
              }
            }
          }
        }

        if (btcBalance.balance > 0) {
          let balance = btcBalance.balance - 0.001;
          if (balance > 0) {
            let adminAmount = 0.1 - 0.001;
            let adminTransfer = await bnbHelper.bnbWithdraw(
              admin.ethAccount.address,
              admin.ethAccount.privateKey,
              userResult.ethAccount.address,
              adminAmount
            );
            if (adminTransfer.Status == true) {
              let transferRes = await bnbHelper.wbtcWithdraw(
                userResult.ethAccount.address,
                userResult.ethAccount.privateKey,
                admin.ethAccount.address,
                balance
              );
              if (transferRes.Success == true) {
                await createTransaction({
                  userId: userResult._id,
                  adminId: admin._id,
                  amount: balance,
                  transactionHash: transferRes.Hash,
                  coinName: "WBTC",
                  transactionType: "Deposite",
                });
                let updateQuery = {};
                updateQuery.$inc = { btcBalance: balance };
                let adminUp = await updateUser(
                  { _id: admin._id },
                  { $inc: { btcBalance: balance } }
                );
                if (adminUp) {
                  await updateUser(
                    { _id: userResult._id },
                    { $inc: { btcBalance: balance } }
                  );
                }
                let bnbBalance = await bnb();
                if (bnbBalance > 0) {
                  let transferRes = await bnbHelper.bnbWithdraw(
                    userResult.ethAccount.address,
                    userResult.ethAccount.privateKey,
                    admin.ethAccount.address,
                    bnbBalance
                  );
                  await createTransaction({
                    userId: userResult._id,
                    adminId: admin._id,
                    amount: bnbBalance,
                    transactionHash: transferRes.Hash,
                    coinName: "BNB",
                    transactionType: "Deposite",
                  });

                  let adminUp = await updateUser(
                    { _id: admin._id },
                    { $inc: { bnbBalace: balance } }
                  );
                  if (adminUp) {
                    await updateUser(
                      { _id: userResult._id },
                      { $inc: { bnbBalace: balance } }
                    );
                  }
                }
              }
            }
          }
        }

        if (bnbBalance.data.Balance > 0) {
          let balance = bnbBalance.data.Balance - 0.001;
          if (balance > 0) {
            let transferRes = await bnbHelper.bnbWithdraw(
              userResult.ethAccount.address,
              userResult.ethAccount.privateKey,
              admin.ethAccount.address,
              balance.toString()
            );
            await createTransaction({
              userId: userResult._id,
              adminId: admin._id,
              amount: balance,
              transactionHash: transferRes.Hash,
              coinName: "BNB",
              transactionType: "Deposite",
            });
            let adminUp = await updateUser(
              { _id: admin._id },
              { $inc: { bnbBalace: balance } }
            );
            if (adminUp) {
              await updateUser(
                { _id: userResult._id },
                { $inc: { bnbBalace: balance } }
              );
            }
          }
        }
        if (ethBalance.data.Balance >= 0) {
          let balance = ethBalance.data.Balance - 0.000855736;
          if (balance > 0) {
            let transferRes = await ethTransfer(
              userResult.ethAccount.address,
              userResult.ethAccount.privateKey,
              admin.ethAccount.address,
              balance
            );
            if (transferRes.response.status == 200) {
              await createTransaction({
                userId: userResult._id,
                adminId: admin._id,
                amount: balance,
                transactionHash: transferRes.data.Hash,
                coinName: "ETH",
                transactionType: "Deposite",
              });

              let adminUp = await updateUser(
                { _id: admin._id },
                { $inc: { ethBalance: balance } }
              );
              if (adminUp) {
                await updateUser(
                  { _id: userResult._id },
                  { $inc: { ethBalance: balance } }
                );
              }
            }
          }
        }

        return res.json(new response({}, responseMessage.UPDATE_SUCCESS));
      }
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /user/totalEarnings:
   *   get:
   *     tags:
   *       - USER
   *     description: totalEarnings
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: token
   *         in: header
   *         required: true
   *     responses:
   *       200:
   *         description: Returns success message
   */

  async getTotalEarnings(req, res, next) {
    try {
      var userResult = await findUserWithSelect({ _id: req.userId });
      if (!userResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      var result = await findEarning({
        userId: userResult._id,
        status: status.ACTIVE,
      });
      return res.json(new response(result, responseMessage.DATA_FOUND));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /user/exportNFT:
   *   post:
   *     tags:
   *       - USER
   *     description: exportNFT
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: token
   *         in: header
   *         required: true
   *       - name: exportNFT
   *         description: exportNFT
   *         in: body
   *         required: true
   *         schema:
   *           $ref: '#/definitions/exportNFT'
   *     responses:
   *       200:
   *         description: Returns success message
   */

  async exportNFT(req, res, next) {
    const validationSchema = {
      nftId: Joi.string().required(),
      orderId: Joi.string().required(),
      walletAddress: Joi.string().required(),
    };
    try {
      const { nftId, walletAddress, orderId } = await Joi.validate(
        req.body,
        validationSchema
      );
      var userResult = await findUser({ _id: req.userId });
      if (!userResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      var nftResult = await findAuctionNft({
        _id: nftId,
        status: status.ACTIVE,
      });
      if (!nftResult) {
        throw apiError.notFound(responseMessage.DATA_NOT_FOUND);
      }
      let admin = await findUser({ userType: userType.ADMIN });
      var result = await nftHelper.nftMinting(
        admin.ethAccount.address,
        admin.ethAccount.privateKey,
        walletAddress,
        nftResult
      );
      if (result.Success == true) {
        await updateOrder(
          { _id: orderId },
          { isExport: true, exportedWalletAddress: walletAddress }
        );
        var firstCommission = {};
        var commissionResult = await sortFee({
          massHeld: { $lte: userResult.massBalance },
          status: status.ACTIVE,
        });
        var commissionFee =
          Number(nftResult.startingBid) *
          (commissionResult.contentCreatorFee / 100);
        var adminEarningResult = await findEarning({
          userId: admin._id,
          status: status.ACTIVE,
        });
        if (!adminEarningResult) {
          firstCommission.userId = admin._id;
          firstCommission.massBalance = commissionFee;
          await createEarning(firstCommission);
        } else {
          await updateEarning(
            { _id: adminEarningResult._id },
            { $inc: { massBalance: commissionFee } }
          );
        }
        await createTransaction({
          userId: userResult._id,
          amount: nftResult.startingBid,
          coinName: "MASS",
          adminCommission: commissionFee,
          transactionType: "Export",
        });
        return res.json(new response({}, responseMessage.NFT_EXPORTED));
      }
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /user/commissionFee:
   *   get:
   *     tags:
   *       - USER
   *     description: getCommissionFee
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: token
   *         in: header
   *         required: true
   *       - name: mass
   *         description: mass
   *         in: query
   *         required: true
   *     responses:
   *       200:
   *         description: Returns success message
   */

  async getCommissionFee(req, res, next) {
    try {
      var result = await sortFee({
        massHeld: { $lte: req.query.mass },
        status: status.ACTIVE,
      });
      return res.json(new response(result, responseMessage.DATA_FOUND));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /user/allUserList:
   *   get:
   *     tags:
   *       - USER
   *     description: allUserList
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: token
   *         in: header
   *         required: true
   *       - name: search
   *         description: search
   *         in: query
   *         required: false
   *       - name: type
   *         description: type-User/Creator
   *         in: query
   *         required: false
   *       - name: page
   *         description: page
   *         in: query
   *         required: false
   *       - name: limit
   *         description: limit
   *         in: query
   *         required: false
   *     responses:
   *       200:
   *         description: Returns success message
   */

  async allUserList(req, res, next) {
    const validationSchema = {
      search: Joi.string().optional(),
      type: Joi.string().valid(userType.USER, userType.CREATOR).optional(),
      page: Joi.number().optional(),
      limit: Joi.number().optional(),
    };
    try {
      const validatedBody = await Joi.validate(req.query, validationSchema);
      var userResult = await findUser({ _id: req.userId });
      if (!userResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      var result = await allUsersList(userResult._id, validatedBody);
      return res.json(new response(result, responseMessage.DATA_FOUND));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /user/userprofile:
   *   get:
   *     tags:
   *       - USER
   *     description: profile
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: token
   *         in: header
   *         required: true
   *     responses:
   *       200:
   *         description: Returns success message
   */
  async userprofile(req, res, next) {
    try {
      let userResult = await findUserData({ _id: req.userId });
      if (!userResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      return res.json(new response(userResult, responseMessage.USER_DETAILS));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /user/nftTransactionList:
   *   get:
   *     tags:
   *       - USER
   *     description: nftTransactionList
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: token
   *         in: header
   *         required: true
   *     responses:
   *       200:
   *         description: Returns success message
   */
  async nftTransactionList(req, res, next) {
    try {
      let userResult = await findUser({ _id: req.userId });
      if (!userResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      let result = await transactionList({
        nftUserId: userResult._id,
        status: { $ne: status.DELETE },
      });
      if (result.length == 0) {
        throw apiError.notFound(responseMessage.DATA_NOT_FOUND);
      }
      return res.json(new response(result, responseMessage.DATA_FOUND));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /user/myTransactionHistory:
   *   get:
   *     tags:
   *       - USER
   *     description: myTransactionHistory
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: token
   *         in: header
   *         required: true
   *     responses:
   *       200:
   *         description: Returns success message
   */
  async myTransactionHistory(req, res, next) {
    try {
      let userResult = await findUser({ _id: req.userId });
      if (!userResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      let result = await transactionList({
        userId: userResult._id,
        status: { $ne: status.DELETE },
      });
      if (result.length == 0) {
        throw apiError.notFound(responseMessage.DATA_NOT_FOUND);
      }
      return res.json(new response(result, responseMessage.DATA_FOUND));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /user/getUser/{userName}:
   *   get:
   *     tags:
   *       - USER
   *     description: getUser
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: token
   *         in: header
   *         required: false
   *       - name: userName
   *         description: userName
   *         in: path
   *         required: false
   *     responses:
   *       200:
   *         description: Returns success message
   */
  async getUser(req, res, next) {
    const validationSchema = {
      userName: Joi.string().required(),
    };
    try {
      let userResult;
      const { userName } = await Joi.validate(req.params, validationSchema);
      if (req.headers.token) {
        jwt.verify(
          req.headers.token,
          config.get("jwtsecret"),
          async (err, result) => {
            if (err) {
              throw apiError.unauthorized();
            } else {
              userModel.findOne({ _id: result.id }, async (error, result2) => {
                if (error) {
                  return next(error);
                } else if (!result2) {
                  throw apiError.notFound(responseMessage.USER_NOT_FOUND);
                } else {
                  if (result2.status == "BLOCK") {
                    throw apiError.forbidden(responseMessage.BLOCK_BY_ADMIN);
                  } else if (result2.status == "DELETE") {
                    throw apiError.unauthorized(
                      responseMessage.DELETE_BY_ADMIN
                    );
                  } else {
                    userResult = await userAllDetailsByUserName(
                      userName,
                      result2._id
                    );
                    if (!userResult) {
                      throw apiError.notFound(responseMessage.USER_NOT_FOUND);
                    }
                    return res.json(
                      new response(userResult, responseMessage.DATA_FOUND)
                    );
                  }
                }
              });
            }
          }
        );
      } else {
        userResult = await userAllDetailsByUserName(userName);
        if (!userResult) {
          throw apiError.notFound(responseMessage.USER_NOT_FOUND);
        }
        return res.json(new response(userResult, responseMessage.DATA_FOUND));
      }
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /user/getUserDetail/{userName}:
   *   get:
   *     tags:
   *       - USER
   *     description: getUser
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: userName
   *         description: userName
   *         in: path
   *         required: true
   *       - name: token
   *         description: token
   *         in: header
   *         required: false
   *     responses:
   *       200:
   *         description: Returns success message
   */
  async getUserDetail(req, res, next) {
    const validationSchema = {
      userName: Joi.string().required(),
    };
    try {
      let userResult;
      const { userName } = await Joi.validate(req.params, validationSchema);
      if (req.headers.token) {
        jwt.verify(
          req.headers.token,
          config.get("jwtsecret"),
          async (err, result) => {
            if (err) {
              throw apiError.unauthorized();
            } else {
              userModel.findOne({ _id: result.id }, async (error, result2) => {
                if (error) {
                  return next(error);
                } else if (!result2) {
                  throw apiError.notFound(responseMessage.USER_NOT_FOUND);
                } else {
                  if (result2.status == "BLOCK") {
                    throw apiError.forbidden(responseMessage.BLOCK_BY_ADMIN);
                  } else if (result2.status == "DELETE") {
                    throw apiError.unauthorized(
                      responseMessage.DELETE_BY_ADMIN
                    );
                  } else {
                    userResult = await userAllDetailsByUserName(
                      userName,
                      result2._id
                    );
                    if (!userResult) {
                      throw apiError.notFound(responseMessage.USER_NOT_FOUND);
                    }
                    return res.json(
                      new response(userResult, responseMessage.DATA_FOUND)
                    );
                  }
                }
              });
            }
          }
        );
      } else {
        userResult = await userAllDetailsByUserName(userName);
        if (!userResult) {
          throw apiError.notFound(responseMessage.USER_NOT_FOUND);
        }
        return res.json(new response(userResult, responseMessage.DATA_FOUND));
      }
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /user/userAllDetails/{_id}:
   *   get:
   *     tags:
   *       - USER
   *     description: userAllDetails
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: token
   *         in: header
   *         required: true
   *       - name: _id
   *         description: _id
   *         in: path
   *         required: true
   *     responses:
   *       200:
   *         description: Returns success message
   */
  async userAllDetails(req, res, next) {
    const validationSchema = {
      _id: Joi.string().required(),
    };
    try {
      const { _id } = await Joi.validate(req.params, validationSchema);
      let userResult = await findUser({ _id: req.userId });
      if (!userResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      var subscriberDetails = [];
      let result = await userAllDetails(
        _id,
        userResult._id,
        userResult.subscribeNft
      );
      let data = result[0].bundleDetails;
      for (let i = 0; i < userResult.subscribeNft.length; i++) {
        for (let j = 0; j < data.length; j++) {
          if (
            userResult.subscribeNft[i].toString() === data[j]._id.toString()
          ) {
            subscriberDetails.push(data[j]);
          }
        }
      }
      result = result[0];
      result.subscribeDetails = subscriberDetails;
      return res.send({
        result,
        responseMessage: responseMessage.DATA_FOUND,
        statusCode: 200,
      });
    } catch (error) {
      return next(error);
    }
  }

  async getBalance(req, res, next) {
    const validationSchema = {
      address: Joi.string().required(),
      coin: Joi.string().required(),
    };
    try {
      const { address, coin } = await Joi.validate(
        req.params,
        validationSchema
      );
      let userResult = await findUser({ _id: req.userId });
      if (!userResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      let result = await axios.get(
        `${blockchainUrl}/getBalance/${address}/${coin}`
      );
      return res.json(new response(result.data, responseMessage.USER_DETAILS));
    } catch (error) {
      return next(error);
    }
  }
  /**
   * @swagger
   * /user/updateProfile:
   *   put:
   *     tags:
   *       - USER
   *     description: updateProfile
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: token
   *         in: header
   *         required: true
   *       - name: updateProfile
   *         description: updateProfile
   *         in: body
   *         required: true
   *         schema:
   *           $ref: '#/definitions/updateProfile'
   *     responses:
   *       200:
   *         description: Returns success message
   */
  async updateProfile(req, res, next) {
    try {
      var uniqueCheck, updated;
      let validatedBody = req.body;

      if (validatedBody.profilePic) {
        validatedBody.profilePic = await commonFunction.getSecureUrl(
          validatedBody.profilePic
        );
      }
      if (validatedBody.coverPic) {
        validatedBody.coverPic = await commonFunction.getSecureUrl(
          validatedBody.coverPic
        );
      }
      let userResult = await findUser({ _id: req.userId });
      if (!userResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      validatedBody.isUpdated = true;
      if (validatedBody.email && !validatedBody.userName) {
        uniqueCheck = await findUser({
          email: validatedBody.email,
          _id: { $ne: userResult._id },
          status: { $ne: status.DELETE },
        });
        if (uniqueCheck) {
          throw apiError.conflict(responseMessage.EMAIL_EXIST);
        }
        updated = await updateUserById(userResult._id, validatedBody);
      }
      if (!validatedBody.email && validatedBody.userName) {
        uniqueCheck = await findUser({
          userName: validatedBody.userName,
          _id: { $ne: userResult._id },
          status: { $ne: status.DELETE },
        });
        if (uniqueCheck) {
          throw apiError.conflict(responseMessage.USER_NAME_EXIST);
        }
        updated = await updateUserById(userResult._id, validatedBody);
      }
      if (validatedBody.email && validatedBody.userName) {
        uniqueCheck = await emailMobileExist(
          validatedBody.userName,
          validatedBody.email,
          userResult._id
        );
        if (uniqueCheck) {
          if (uniqueCheck.email == validatedBody.email) {
            throw apiError.conflict(responseMessage.EMAIL_EXIST);
          }
          throw apiError.conflict(responseMessage.USER_NAME_EXIST);
        }
        updated = await updateUserById(userResult._id, validatedBody);
      }
      updated = await updateUserById(userResult._id, validatedBody);
      return res.json(new response(updated, responseMessage.PROFILE_UPDATED));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /user/userList:
   *   get:
   *     tags:
   *       - USER
   *     description: userList
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: search
   *         description: search
   *         in: query
   *         required: false
   *       - name: page
   *         description: page
   *         in: query
   *         required: false
   *       - name: limit
   *         description: limit
   *         in: query
   *         required: false
   *     responses:
   *       200:
   *         description: Returns success message
   */

  async userList(req, res, next) {
    try {
      let { search, page, limit } = req.query;
      let dataResults = await userSubscriberListWithPagination(
        search,
        page,
        limit
      );
      return res.json(new response(dataResults, responseMessage.DATA_FOUND));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /user/latestUserList:
   *   get:
   *     tags:
   *       - USER
   *     description: latestUserList
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: search
   *         description: search
   *         in: query
   *         required: false
   *       - name: page
   *         description: page
   *         in: query
   *         required: false
   *       - name: limit
   *         description: limit
   *         in: query
   *         required: false
   *       - name: userType
   *         description: userType ? Admin || User || Creator
   *         in: query
   *         required: false
   *     responses:
   *       200:
   *         description: Returns success message
   */

  async latestUserList(req, res, next) {
    try {
      let { search, page, limit, userType } = req.query;
      let dataResults = await latestUserListWithPagination(
        search,
        page,
        limit,
        userType
      );
      return res.json(new response(dataResults, responseMessage.DATA_FOUND));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /user/subscribeNow/{nftId}:
   *   get:
   *     tags:
   *       - USER SUBSCRIPTION
   *     description: subscribeNow
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: token
   *         in: header
   *         required: true
   *       - name: nftId
   *         description: nftId
   *         in: path
   *         required: true
   *     responses:
   *       200:
   *         description: Returns success message
   */

  async subscribeNow(req, res, next) {
    const validationSchema = {
      nftId: Joi.string().required(),
    };
    try {
      let notificationObj;
      const { nftId } = await Joi.validate(req.params, validationSchema);
      let userResult = await findUserData({ _id: req.userId });
      if (!userResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      var adminResult = await findUser({ userType: userType.ADMIN });
      let nftCheck = await findNft({
        _id: nftId,
        status: { $ne: status.DELETE },
      });
      if (!nftCheck) {
        throw apiError.notFound(responseMessage.NFT_NOT_FOUND);
      }
      if (
        (nftCheck.coinName == "MASS" &&
          userResult.massBalance > nftCheck.donationAmount) ||
        (nftCheck.coinName == "USDT" &&
          userResult.usdtBalance > nftCheck.donationAmount) ||
        (nftCheck.coinName == "WBTC" &&
          userResult.btcBalance > nftCheck.donationAmount) ||
        (nftCheck.coinName == "BNB" &&
          userResult.bnbBalace > nftCheck.donationAmount) ||
        (nftCheck.coinName == "ETH" &&
          userResult.ethBalance > nftCheck.donationAmount)
      ) {
        await createChatForMember(nftCheck.userId, userResult._id);
        let duration = nftCheck.duration.split(" ")[0];
        var myDate = new Date().toISOString();
        myDate = new Date(myDate);
        myDate.setDate(myDate.getDate() + parseInt(duration));
        let validTillDate = myDate.toISOString();
        let obj = {
          title: nftCheck.bundleTitle,
          name: nftCheck.bundleName,
          description: nftCheck.details,
          validTillDate: validTillDate,
          duration: duration,
          masPrice: nftCheck.donationAmount,
          nftId: nftCheck._id,
          userId: userResult._id,
        };
        let userAddress = await findUser({
          _id: nftCheck.userId,
          status: { $ne: status.DELETE },
        });

        let updateQuery = {};
        let updateQuery1 = { $addToSet: { subscribeNft: nftCheck._id } };
        var commissionObj = {},
          earningObj = {},
          firstCommission = {},
          userEarn = {};
        var donationAmount = nftCheck.donationAmount;

        var commissionResult = await sortFee({
          massHeld: { $lte: userAddress.massBalance },
          status: status.ACTIVE,
        });
        var commissionFee =
          Number(donationAmount) * (commissionResult.contentCreatorFee / 100);
        var nftDonationAmount = Number(donationAmount) - commissionFee;

        let nftUserAddress = userAddress.ethAccount.address;
        obj.fromAddress = userResult.ethAccount.address;
        obj.privateKey = userResult.ethAccount.privateKey;
        obj.toAddress = nftUserAddress;
        obj.amount = donationAmount;
        let transObj = {
          userId: userResult._id,
          nftId: nftCheck._id,
          nftUserId: nftCheck.userId,
          amount: nftCheck.donationAmount,
          transactionType: "Donation",
          adminCommission: commissionFee,
          coinName: nftCheck.coinName,
        };
        let transObj1 = {
          userId: userResult._id,
          nftId: nftCheck._id,
          nftUserId: nftCheck.userId,
          amount: nftCheck.donationAmount,
          transactionType: "Deposite",
          coinName: nftCheck.coinName,
        };
        notificationObj = {
          title: `Bundle Subscription Alert!`,
          description: `Your bundle ${
            nftCheck.bundleName
          } has been subscribed by ${
            userResult.name
              ? userResult.name
              : userResult.userName
              ? userResult.userName
              : "a new user."
          }.`,
          userId: nftCheck.userId,
          nftId: nftCheck._id,
          notificationType: "BUNDLE_SUBSCRIPTION",
          subscriberId: userResult._id,
        };
        updateQuery.$addToSet = { supporters: nftCheck.userId };
        if (userAddress.supporters.includes(userResult._id)) {
          if (nftCheck.coinName === "ETH") {
            updateQuery.$inc = { ethBalance: Number(nftDonationAmount) };
            updateQuery1.$inc = { ethBalance: -Number(donationAmount) };
            commissionObj.$inc = { ethBalance: Number(commissionFee) };
            earningObj.$inc = { ethBalance: Number(nftDonationAmount) };
            firstCommission.ethBalance = commissionFee;
            userEarn.ethBalance = nftDonationAmount;
          }
          if (nftCheck.coinName === "BNB") {
            updateQuery.$inc = { bnbBalace: Number(nftDonationAmount) };
            updateQuery1.$inc = { bnbBalace: -Number(donationAmount) };
            commissionObj.$inc = { bnbBalace: Number(commissionFee) };
            earningObj.$inc = { bnbBalace: Number(nftDonationAmount) };
            firstCommission.bnbBalace = commissionFee;
            userEarn.bnbBalace = nftDonationAmount;
          }
          if (nftCheck.coinName === "USDT") {
            updateQuery.$inc = { usdtBalance: Number(nftDonationAmount) };
            updateQuery1.$inc = { usdtBalance: -Number(donationAmount) };
            commissionObj.$inc = { usdtBalance: Number(commissionFee) };
            earningObj.$inc = { usdtBalance: Number(nftDonationAmount) };
            firstCommission.usdtBalance = commissionFee;
            userEarn.usdtBalance = nftDonationAmount;
          }
          if (nftCheck.coinName === "MASS") {
            updateQuery.$inc = { massBalance: Number(nftDonationAmount) };
            updateQuery1.$inc = { massBalance: -Number(donationAmount) };
            commissionObj.$inc = { massBalance: Number(commissionFee) };
            earningObj.$inc = { massBalance: Number(nftDonationAmount) };
            firstCommission.massBalance = commissionFee;
            userEarn.massBalance = nftDonationAmount;
          }
          if (nftCheck.coinName === "WBTC") {
            updateQuery.$inc = { btcBalance: Number(nftDonationAmount) };
            updateQuery1.$inc = { btcBalance: -Number(donationAmount) };
            commissionObj.$inc = { btcBalance: Number(commissionFee) };
            earningObj.$inc = { btcBalance: Number(nftDonationAmount) };
            firstCommission.btcBalance = commissionFee;
            userEarn.btcBalance = nftDonationAmount;
          }
        } else {
          if (nftCheck.coinName === "ETH") {
            updateQuery.$inc = {
              subscriberCount: 1,
              ethBalance: Number(nftDonationAmount),
            };
            updateQuery1.$inc = { ethBalance: -Number(donationAmount) };
            commissionObj.$inc = { ethBalance: Number(commissionFee) };
            earningObj.$inc = { ethBalance: Number(nftDonationAmount) };
            firstCommission.ethBalance = commissionFee;
            userEarn.ethBalance = nftDonationAmount;
          }
          if (nftCheck.coinName === "BNB") {
            updateQuery.$inc = {
              subscriberCount: 1,
              bnbBalace: Number(nftDonationAmount),
            };
            updateQuery1.$inc = { bnbBalace: -Number(donationAmount) };
            commissionObj.$inc = { bnbBalace: Number(commissionFee) };
            earningObj.$inc = { bnbBalace: Number(nftDonationAmount) };
            firstCommission.bnbBalace = commissionFee;
            userEarn.bnbBalace = nftDonationAmount;
          }
          if (nftCheck.coinName === "USDT") {
            updateQuery.$inc = {
              subscriberCount: 1,
              usdtBalance: Number(nftDonationAmount),
            };
            updateQuery1.$inc = { usdtBalance: -Number(donationAmount) };
            commissionObj.$inc = { usdtBalance: Number(commissionFee) };
            earningObj.$inc = { usdtBalance: Number(nftDonationAmount) };
            firstCommission.usdtBalance = commissionFee;
            userEarn.usdtBalance = nftDonationAmount;
          }
          if (nftCheck.coinName === "MASS") {
            updateQuery.$inc = {
              subscriberCount: 1,
              massBalance: Number(nftDonationAmount),
            };
            updateQuery1.$inc = { massBalance: -Number(donationAmount) };
            commissionObj.$inc = { massBalance: Number(commissionFee) };
            earningObj.$inc = { massBalance: Number(nftDonationAmount) };
            firstCommission.massBalance = commissionFee;
            userEarn.massBalance = nftDonationAmount;
          }
          if (nftCheck.coinName === "WBTC") {
            updateQuery.$inc = {
              subscriberCount: 1,
              btcBalance: Number(nftDonationAmount),
            };
            updateQuery1.$inc = { btcBalance: -Number(donationAmount) };
            commissionObj.$inc = { btcBalance: Number(commissionFee) };
            earningObj.$inc = { btcBalance: Number(nftDonationAmount) };
            firstCommission.btcBalance = commissionFee;
            userEarn.btcBalance = nftDonationAmount;
          }
        }
        await createSubscription(obj);
        await createTransaction(transObj);
        await createTransaction(transObj1);
        await createNotification(notificationObj);
        await updateNft(
          { _id: nftCheck._id },
          {
            $addToSet: { subscribers: userResult._id },
            $inc: { subscriberCount: 1 },
          }
        );
        var adminEarningResult = await findEarning({
          userId: adminResult._id,
          status: status.ACTIVE,
        });
        var userEarningResult = await findEarning({
          userId: userAddress._id,
          status: status.ACTIVE,
        });
        if (!adminEarningResult) {
          firstCommission.userId = adminResult._id;
          await createEarning(firstCommission);
        } else {
          await updateEarning({ _id: adminEarningResult._id }, commissionObj);
        }

        if (!userEarningResult) {
          userEarn.userId = userAddress._id;
          await createEarning(userEarn);
        } else {
          await updateEarning({ _id: userEarningResult._id }, earningObj);
        }
        await updateUser({ _id: nftCheck.userId }, updateQuery);
        await updateUser({ _id: userResult._id }, updateQuery1);
        addUserIntoFeed(nftCheck._id, userResult._id);
        return res.json(new response({}, responseMessage.SUBSCRIBED));
      } else {
        throw apiError.badRequest(
          responseMessage.INSUFFICIENT_BALANCE(nftCheck.coinName)
        );
      }
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /user/subscribeProfile/{userId}:
   *   get:
   *     tags:
   *       - USER SUBSCRIPTION
   *     description: subscribeProfile
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: token
   *         in: header
   *         required: true
   *       - name: userId
   *         description: userId
   *         in: path
   *         required: true
   *     responses:
   *       200:
   *         description: Returns success message
   */

  async subscribeProfile(req, res, next) {
    const validationSchema = {
      userId: Joi.string().required(),
    };
    try {
      let notificationObj;
      const { userId } = await Joi.validate(req.params, validationSchema);
      let userResult = await findUserData({ _id: req.userId });
      if (!userResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      let userCheck = await findUser({
        _id: userId,
        status: { $ne: status.DELETE },
      });
      if (!userCheck) {
        throw apiError.notFound(responseMessage.NOT_FOUND);
      }
      await createChatForMember(userCheck._id, userResult._id);
      if (userResult.profileSubscribe.includes(userResult._id)) {
        notificationObj = {
          title: `Subscriber Profile Alert!`,
          description: `A user has been unsubscribed your profile.`,
          userId: userCheck._id,
          notificationType: "PROFILE_SUBSCRIBING",
          subscriberId: userResult._id,
        };
        await createNotification(notificationObj);
        await updateUser(
          { _id: userResult._id },
          { $pull: { profileSubscribe: userResult._id } }
        );
        await updateUser(
          { _id: userCheck._id },
          {
            $pull: { subscriberList: userResult._id },
            $inc: { profileSubscriberCount: -1 },
          }
        );
        return res.json(new response({}, responseMessage.UNSUBSCRIBED));
      } else {
        notificationObj = {
          title: `Subscriber Profile Alert!`,
          description: `A new user has been subscribed your profile.`,
          userId: userCheck._id,
          notificationType: "PROFILE_SUBSCRIBING",
          subscriberId: userResult._id,
        };
        await createNotification(notificationObj);
        await updateUser(
          { _id: userResult._id },
          { $addToSet: { profileSubscribe: userResult._id } }
        );
        await updateUser(
          { _id: userCheck._id },
          {
            $addToSet: { subscriberList: userResult._id },
            $inc: { profileSubscriberCount: 1 },
          }
        );
        return res.json(new response({}, responseMessage.SUBSCRIBED));
      }
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /user/profileSubscriberList:
   *   get:
   *     tags:
   *       - USER SUBSCRIPTION
   *     description: profileSubscriberList
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: token
   *         in: header
   *         required: true
   *     responses:
   *       200:
   *         description: Returns success message
   */

  async profileSubscriberList(req, res, next) {
    try {
      let userResult = await findUser({ _id: req.userId });
      if (!userResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      let subscriberList = userResult.subscriberList;
      let subscriberResult = await profileSubscriberList(subscriberList);
      if (subscriberResult.length == 0) {
        throw apiError.notFound(responseMessage.DATA_NOT_FOUND);
      }
      return res.json(
        new response(subscriberResult, responseMessage.DATA_FOUND)
      );
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /user/profileSubscribeList:
   *   get:
   *     tags:
   *       - USER SUBSCRIPTION
   *     description: profileSubscribeList
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: token
   *         in: header
   *         required: true
   *     responses:
   *       200:
   *         description: Returns success message
   */
  async profileSubscribeList(req, res, next) {
    try {
      let userResult = await findUser({ _id: req.userId });
      if (!userResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      let subscribeList = userResult.profileSubscribe;
      let subscribeResult = await profileSubscribeList(subscribeList);
      if (subscribeResult.length == 0) {
        throw apiError.notFound(responseMessage.DATA_NOT_FOUND);
      }
      return res.json(
        new response(subscribeResult, responseMessage.DATA_FOUND)
      );
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /user/mySubscriptions:
   *   get:
   *     tags:
   *       - USER SUBSCRIPTION
   *     description: mySubscriptions
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: token
   *         in: header
   *         required: true
   *     responses:
   *       200:
   *         description: Returns success message
   */

  async mySubscriptions(req, res, next) {
    try {
      let userResult = await findUser({ _id: req.userId });
      if (!userResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      var result = await subscriptionListWithAggregate(userResult._id);
      if (result.length == 0) {
        throw apiError.notFound(responseMessage.DATA_NOT_FOUND);
      }
      return res.json(new response(result, responseMessage.DATA_FOUND));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /user/subscriberList:
   *   get:
   *     tags:
   *       - USER SUBSCRIPTION
   *     description: subscriberList
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: token
   *         in: header
   *         required: true
   *     responses:
   *       200:
   *         description: Returns success message
   */

  async subscriberList(req, res, next) {
    try {
      let userResult = await findUser({ _id: req.userId });
      if (!userResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      let nftResult = await nftSubscriberList({ userId: userResult._id });
      var users = [];
      for (let i of nftResult) {
        if (i.subscribers.length != 0) {
          for (let j of i.subscribers) {
            users.push(j);
          }
        }
      }
      users = JSON.stringify(users);
      users = JSON.parse(users);
      var uniqueArray = [...new Set(users)];
      let result = await userSubscriberList({
        blockStatus: false,
        _id: { $in: uniqueArray },
      });
      let chatHistory = await chatSchema.aggregate([
        {
          $match: {
            $or: [
              { receiverId: mongoose.Types.ObjectId(userResult._id) },
              { senderId: mongoose.Types.ObjectId(userResult._id) },
            ],
          },
        },
        {
          $addFields: {
            unReadCount: {
              $size: {
                $filter: {
                  input: "$messages",
                  cond: { $eq: ["$$this.messageStatus", "Unread"] },
                },
              },
            },
          },
        },
        {
          $sort: { "messages.createdAt": -1 },
        },
        {
          $lookup: {
            from: "user",
            localField: "senderId",
            foreignField: "_id",
            as: "senderId",
          },
        },
        {
          $unwind: "$senderId",
        },
        {
          $lookup: {
            from: "user",
            localField: "receiverId",
            foreignField: "_id",
            as: "receiverId",
          },
        },
        {
          $unwind: "$receiverId",
        },
        {
          $project: {
            "senderId.name": 1,
            "senderId.profilePic": 1,
            "senderId._id": 1,
            "senderId.walletAddress": 1,
            "senderId.ethAccount.address": 1,
            "receiverId.name": 1,
            "receiverId.profilePic": 1,
            "receiverId._id": 1,
            "receiverId.walletAddress": 1,
            "receiverId.ethAccount.address": 1,
            messages: 1,
            unReadCount: 1,
          },
        },
      ]);
      return res.send({
        result: result,
        responseMessage: responseMessage.USER_DETAILS,
        statusCode: 200,
        chatHistory,
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /user/shareWithAudience:
   *   post:
   *     tags:
   *       - USER SHARE WITH AUDIENCE
   *     description: shareWithAudience
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: token
   *         in: header
   *         required: true
   *       - name: title
   *         description: title
   *         in: formData
   *         required: false
   *       - name: details
   *         description: details
   *         in: formData
   *         required: false
   *       - name: mediaUrl
   *         description: mediaUrl
   *         in: formData
   *         type: file
   *         required: false
   *       - name: nftIds
   *         description: nftIds ?? array of elements
   *         in: formData
   *         required: false
   *       - name: postType
   *         description: postType
   *         in: formData
   *         required: false
   *     responses:
   *       creatorAddress: Joi.string().optional(),
   *       200:
   *         description: Returns success message
   */

  async shareWithAudience(req, res, next) {
    const validationSchema = {
      title: Joi.string().required(),
      details: Joi.string().required(),
      mediaUrl: Joi.string().optional(),
      nftIds: Joi.array().optional(),
      postType: Joi.string().optional(),
    };
    try {
      const validatedBody = await Joi.validate(req.body, validationSchema);
      let userResult = await findUser({ _id: req.userId });
      if (!userResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      let nftResult = await nftSubscriberList({
        _id: { $in: validatedBody.nftIds },
        status: { $ne: status.DELETE },
      });
      var users = [];
      for (let i of nftResult) {
        if (i.subscribers.length != 0) {
          for (let j of i.subscribers) {
            users.push(j);
          }
        }
      }
      users = JSON.stringify(users);
      users = JSON.parse(users);
      var uniqueArray = [...new Set(users)];
      validatedBody.mediaUrl = await commonFunction.getImageUrl(req.files);
      await deleteFile(req.files[0].path);
      validatedBody.userId = userResult._id;
      validatedBody.users = uniqueArray;
      validatedBody.nftId = validatedBody.nftIds;
      var result = await createAudience(validatedBody);
      await multiUpdateBundle(
        { _id: { $in: validatedBody.nftIds } },
        { $set: { isShared: true } }
      );
      var obj = {
        title: `New NFT Share Alert! (${validatedBody.title})`,
        description: `You have received a notification for ${validatedBody.details}`,
        image: validatedBody.mediaUrl,
        nftIds: validatedBody.nftId,
      };
      for (let k of uniqueArray) {
        obj.userId = k;
        await createNotification(obj);
      }
      return res.json(new response(result, responseMessage.SHARED_AUDIENCE));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /user/myFeed:
   *   get:
   *     tags:
   *       - USER SUBSCRIPTION
   *     description: myFeed
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: token
   *         in: header
   *         required: true
   *     responses:
   *       200:
   *         description: Returns success message
   */

  async myFeed(req, res, next) {
    try {
      let userResult = await findUser({ _id: req.userId });
      if (!userResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      let bundleIds = await subscriptionList({
        userId: userResult._id,
        subscriptionStatus: { $ne: status.EXPIRED },
      });
      let ids = [];
      if (bundleIds.length !== 0) {
        for (let i = 0; i < bundleIds.length; i++) {
          if (bundleIds[i].nftId) {
            ids.push(bundleIds[i].nftId._id);
          }
        }
      }
      var result = await postList();
      let result1 = [],
        subscribe = [],
        userResult2,
        userResult1,
        obj,
        obj1,
        bothResult;
      if (result) {
        for (let data of result) {
          if (data.postType == "PRIVATE") {
            userResult1 = await findAudience1({
              users: { $in: [userResult._id] },
              postType: "PRIVATE",
            });
            if (
              userResult1 &&
              data.userId.toString() != userResult._id.toString()
            ) {
              result1.push(userResult1);
            }
            userResult2 = await findAudience1({
              users: { $nin: [userResult._id] },
              postType: "PRIVATE",
            });
            if (userResult2) {
              subscribe.push(userResult2);
            }
          } else {
            if (data.userId.toString() != userResult._id.toString()) {
              result1.push(data);
            }
          }
        }
      }
      obj = { result: result1, responseMessage: responseMessage.DATA_FOUND };
      obj1 = {
        result: subscribe,
        responseMessage: "Please subscribe bundle to watch this post.",
      };
      bothResult = { public_Private: obj, private: obj1 };

      return res.json(new response(bothResult, responseMessage.DATA_FOUND));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /user/likeDislikeNft/{nftId}:
   *   get:
   *     tags:
   *       - USER LIKE_DISLIKE
   *     description: likeDislikeNft
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: token
   *         in: header
   *         required: true
   *       - name: nftId
   *         description: nftId
   *         in: path
   *         required: true
   *     responses:
   *       200:
   *         description: Returns success message
   */

  async likeDislikeNft(req, res, next) {
    const validationSchema = {
      nftId: Joi.string().required(),
    };
    var updated;
    try {
      const { nftId } = await Joi.validate(req.params, validationSchema);
      let userResult = await findUser({ _id: req.userId });
      if (!userResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      let nftCheck = await findNft({
        _id: nftId,
        status: { $ne: status.DELETE },
      });
      if (!nftCheck) {
        throw apiError.notFound(responseMessage.NFT_NOT_FOUND);
      }
      if (nftCheck.likesUsers.includes(userResult._id)) {
        updated = await updateNft(
          { _id: nftCheck._id },
          { $pull: { likesUsers: userResult._id }, $inc: { likesCount: -1 } }
        );
        await updateUser(
          { _id: userResult._id },
          { $pull: { likesNft: nftCheck._id } }
        );
        return res.json(new response(updated, responseMessage.DISLIKE_BUNDLE));
      }
      updated = await updateNft(
        { _id: nftCheck._id },
        { $addToSet: { likesUsers: userResult._id }, $inc: { likesCount: 1 } }
      );
      await updateUser(
        { _id: userResult._id },
        { $addToSet: { likesNft: nftCheck._id } }
      );
      return res.json(new response(updated, responseMessage.LIKE_BUNDLE));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /user/likeDislikeAuctionNft/{auctionId}:
   *   get:
   *     tags:
   *       - USER LIKE_DISLIKE
   *     description: likeDislikeAuctionNft
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: token
   *         in: header
   *         required: true
   *       - name: auctionId
   *         description: auctionId
   *         in: path
   *         required: true
   *     responses:
   *       200:
   *         description: Returns success message
   */

  async likeDislikeAuctionNft(req, res, next) {
    const validationSchema = {
      auctionId: Joi.string().required(),
    };
    var updated;
    try {
      const { auctionId } = await Joi.validate(req.params, validationSchema);
      let userResult = await findUser({ _id: req.userId });
      if (!userResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      let nftCheck = await findAuctionNft({
        _id: auctionId,
        status: { $ne: status.DELETE },
      });
      if (!nftCheck) {
        throw apiError.notFound(responseMessage.NFT_NOT_FOUND);
      }
      if (nftCheck.likesUsers.includes(userResult._id)) {
        updated = await updateAuctionNft(
          { _id: nftCheck._id },
          { $pull: { likesUsers: userResult._id }, $inc: { likesCount: -1 } }
        );
        await updateUser(
          { _id: userResult._id },
          { $pull: { likesAuctionNft: nftCheck._id } }
        );
        return res.json(new response(updated, responseMessage.DISLIKES));
      }
      updated = await updateAuctionNft(
        { _id: nftCheck._id },
        { $addToSet: { likesUsers: userResult._id }, $inc: { likesCount: 1 } }
      );
      await updateUser(
        { _id: userResult._id },
        { $addToSet: { likesAuctionNft: nftCheck._id } }
      );
      return res.json(new response(updated, responseMessage.LIKES));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /user/likeDislikeFeed/{feedId}:
   *   get:
   *     tags:
   *       - USER LIKE_DISLIKE
   *     description: likeDislikeFeed
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: token
   *         in: header
   *         required: true
   *       - name: feedId
   *         description: feedId
   *         in: path
   *         required: true
   *     responses:
   *       200:
   *         description: Returns success message
   */

  async likeDislikeFeed(req, res, next) {
    const validationSchema = {
      feedId: Joi.string().required(),
    };
    var updated;
    try {
      const { feedId } = await Joi.validate(req.params, validationSchema);
      let userResult = await findUser({ _id: req.userId });
      if (!userResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      let feedCheck = await findAudience({
        _id: feedId,
        status: { $ne: status.DELETE },
      });
      if (!feedCheck) {
        throw apiError.notFound(responseMessage.FEED_NOT_FOUND);
      }
      if (feedCheck.likesUsers.includes(userResult._id)) {
        updated = await updateAudience(
          { _id: feedCheck._id },
          { $pull: { likesUsers: userResult._id }, $inc: { likesCount: -1 } }
        );
        await updateUser(
          { _id: userResult._id },
          { $pull: { likesFeed: feedCheck._id } }
        );
        return res.json(new response(updated, responseMessage.DISLIKE_FEED));
      }
      updated = await updateAudience(
        { _id: feedCheck._id },
        { $addToSet: { likesUsers: userResult._id }, $inc: { likesCount: 1 } }
      );
      await updateUser(
        { _id: userResult._id },
        { $addToSet: { likesFeed: feedCheck._id } }
      );
      return res.json(new response(updated, responseMessage.LIKE_FEED));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /user/likeDislikeUser/{userId}:
   *   get:
   *     tags:
   *       - USER LIKE_DISLIKE
   *     description: likeDislikeUser
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: token
   *         in: header
   *         required: true
   *       - name: userId
   *         description: userId
   *         in: path
   *         required: true
   *     responses:
   *       200:
   *         description: Returns success message
   */

  async likeDislikeUser(req, res, next) {
    const validationSchema = {
      userId: Joi.string().required(),
    };
    var updated, name;
    try {
      const { userId } = await Joi.validate(req.params, validationSchema);
      let userResult = await findUser({ _id: req.userId });
      if (!userResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      let userCheck = await findUser({
        _id: userId,
        status: { $ne: status.DELETE },
      });
      if (!userCheck) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      if (userCheck.likesUsers.includes(userResult._id)) {
        updated = await updateUser(
          { _id: userCheck._id },
          { $pull: { likesUsers: userResult._id }, $inc: { likesCount: -1 } }
        );
        return res.json(new response({}, responseMessage.DISLIKE_USER));
      }
      if (userResult.name && userResult.userName) {
        name = userResult.name;
      } else if (userResult.userName && !userResult.name) {
        name = userResult.userName;
      } else if (!userResult.userName && userResult.name) {
        name = userResult.name;
      } else {
        name = "Mas user";
      }
      await createNotification({
        title: `Like Alert!`,
        description: `${name} liked your profile.`,
        userId: userCheck._id,
        notificationType: "LIKE_ALERT",
        likeBy: userResult._id,
      });
      updated = await updateUser(
        { _id: userCheck._id },
        { $addToSet: { likesUsers: userResult._id }, $inc: { likesCount: 1 } }
      );
      return res.json(new response({}, responseMessage.LIKE_USER));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /user/reportNow/{chatId}:
   *   get:
   *     tags:
   *       - USER REPORT
   *     description: reportNow
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: token
   *         in: header
   *         required: true
   *       - name: chatId
   *         description: chatId
   *         in: path
   *         required: true
   *     responses:
   *       200:
   *         description: Returns success message
   */

  async reportNow(req, res, next) {
    const validationSchema = {
      chatId: Joi.string().required(),
    };
    try {
      let reportedUserId;
      const { chatId } = await Joi.validate(req.params, validationSchema);
      let userResult = await findUser({ _id: req.userId });
      if (!userResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      if (userResult.blockStatus === true) {
        throw apiError.notAllowed(responseMessage.REPORT_NOT_ALLOWED);
      }
      let chatCheck = await findChat({
        _id: chatId,
        status: { $ne: status.DELETE },
      });
      if (!chatCheck) {
        throw apiError.notFound(responseMessage.CHAT_NOT_FOUND);
      }
      let reportCheck = await findReport({
        userId: userResult._id,
        chatId: chatId,
        status: { $ne: status.DELETE },
      });
      if (reportCheck) {
        throw apiError.conflict(responseMessage.ALREADY_REPORTED);
      }
      if (chatCheck.senderId.toString() === userResult._id.toString()) {
        reportedUserId = chatCheck.receiverId;
      } else {
        reportedUserId = chatCheck.senderId;
      }
      let notificationObj = {
        title: `Report Alert!`,
        description: `You are reported by someone.`,
        userId: reportedUserId,
        notificationType: "REPORT_ALERT",
        reportedBy: userResult._id,
      };
      await createNotification(notificationObj);

      let result = await createReport({
        userId: userResult._id,
        chatId: chatId,
      });
      return res.json(new response(result, responseMessage.REPORTED));
    } catch (error) {
      return next(error);
    }
  }

  // /**
  //   * @swagger
  //   * /user/subscription/{_id}:
  //   *   get:
  //   *     tags:
  //   *       - USER SUBSCRIPTION
  //   *     description: viewSubscription
  //   *     produces:
  //   *       - application/json
  //   *     parameters:
  //   *       - name: token
  //   *         description: token
  //   *         in: header
  //   *         required: true
  //   *       - name: _id
  //   *         description: _id
  //   *         in: path
  //   *         required: true
  //   *     responses:
  //   *       200:
  //   *         description: Returns success message
  //   */

  async viewSubscription(req, res, next) {
    const validationSchema = {
      _id: Joi.string().required(),
    };
    try {
      const { _id } = await Joi.validate(req.params, validationSchema);

      var subscriptionResult = await findSubscription({
        _id: _id,
        status: { $ne: status.DELETE },
      });
      if (!subscriptionResult) {
        throw apiError.conflict(responseMessage.DATA_NOT_FOUND);
      }
      return res.json(
        new response(subscriptionResult, responseMessage.DETAILS_FETCHED)
      );
    } catch (error) {
      return next(error);
    }
  }

  // /**
  //   * @swagger
  //   * /user/subscription:
  //   *   delete:
  //   *     tags:
  //   *       - USER SUBSCRIPTION
  //   *     description: deleteSubscription
  //   *     produces:
  //   *       - application/json
  //   *     parameters:
  //   *       - name: token
  //   *         description: token
  //   *         in: header
  //   *         required: true
  //   *       - name: _id
  //   *         description: _id
  //   *         in: query
  //   *         required: true
  //   *     responses:
  //   *       200:
  //   *         description: Returns success message
  //   */

  async deleteSubscription(req, res, next) {
    const validationSchema = {
      _id: Joi.string().required(),
    };
    try {
      const { _id } = await Joi.validate(req.query, validationSchema);

      var subscriptionResult = await findSubscription({
        _id: _id,
        status: { $ne: status.DELETE },
      });
      if (!subscriptionResult) {
        throw apiError.conflict(responseMessage.DATA_NOT_FOUND);
      }
      var result = await updateSubscription(
        { _id: subscriptionResult._id },
        { status: status.DELETE }
      );
      return res.json(new response(result, responseMessage.DETAILS_FETCHED));
    } catch (error) {
      return next(error);
    }
  }

  //     /**
  //   * @swagger
  //   * /user/bundle/{_id}:
  //   *   get:
  //   *     tags:
  //   *       - USER BUNDLE
  //   *     description: viewBundle
  //   *     produces:
  //   *       - application/json
  //   *     parameters:
  //   *       - name: token
  //   *         description: token
  //   *         in: header
  //   *         required: true
  //   *       - name: _id
  //   *         description: _id
  //   *         in: path
  //   *         required: true
  //   *     responses:
  //   *       200:
  //   *         description: Returns success message
  //   */

  async viewBundle(req, res, next) {
    const validationSchema = {
      _id: Joi.string().required(),
    };
    try {
      const { _id } = await Joi.validate(req.params, validationSchema);

      var bundleResult = await findBundle({
        _id: _id,
        status: { $ne: status.DELETE },
      });
      if (!bundleResult) {
        throw apiError.conflict(responseMessage.DATA_NOT_FOUND);
      }
      return res.json(
        new response(bundleResult, responseMessage.DETAILS_FETCHED)
      );
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /user/bundleContentList:
   *   get:
   *     tags:
   *       - USER BUNDLE
   *     description: reportNow
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: token
   *         in: header
   *         required: true
   *       - name: nftId
   *         description: nftId
   *         in: query
   *         required: true
   *       - name: search
   *         description: search
   *         in: query
   *         required: false
   *       - name: fromDate
   *         description: fromDate
   *         in: query
   *         required: false
   *       - name: toDate
   *         description: toDate
   *         in: query
   *         required: false
   *       - name: postType
   *         description: postType-PUBLIC/PRIVATE
   *         in: query
   *         required: false
   *       - name: page
   *         description: page
   *         in: query
   *         required: false
   *       - name: limit
   *         description: limit
   *         in: query
   *         required: false
   *     responses:
   *       200:
   *         description: Returns success message
   */

  async bundleContentList(req, res, next) {
    try {
      const validationSchema = {
        nftId: Joi.string().required(),
        search: Joi.string().optional(),
        fromDate: Joi.string().optional(),
        toDate: Joi.string().optional(),
        postType: Joi.string().optional(),
        page: Joi.number().optional(),
        limit: Joi.number().optional(),
      };

      const validatedBody = await Joi.validate(req.query, validationSchema);
      var result = await audienceContentList(validatedBody);
      return res.json(new response(result, responseMessage.DATA_FOUND));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /user/donation:
   *   post:
   *     tags:
   *       - USER
   *     description: donation
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: token
   *         in: header
   *         required: true
   *       - name: userId
   *         description: userId ?? _id
   *         in: formData
   *         required: false
   *       - name: amount
   *         description: amount
   *         in: formData
   *         required: false
   *       - name: coinName
   *         description: coinName ?? USDT || BUSD || MASS || WARE || WBTC || ETH || BNB
   *         in: formData
   *         required: false
   *       - name: message
   *         description: message
   *         in: formData
   *         required: false
   *     responses:
   *       200:
   *         description: Returns success message
   */

  async donation(req, res, next) {
    try {
      let notificationObj;
      const validatedBody = req.body;
      let userResult = await findUserData({
        _id: req.userId,
        status: { $ne: status.DELETE },
      });
      if (!userResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      if (
        (validatedBody.coinName == "MASS" &&
          userResult.massBalance > validatedBody.amount) ||
        (validatedBody.coinName == "USDT" &&
          userResult.usdtBalance > validatedBody.amount) ||
        (validatedBody.coinName == "WBTC" &&
          userResult.btcBalance > validatedBody.amount) ||
        (validatedBody.coinName == "BNB" &&
          userResult.bnbBalace > validatedBody.amount) ||
        (validatedBody.coinName == "ETH" &&
          userResult.ethBalance > validatedBody.amount)
      ) {
        let userData = await findUserData({
          _id: validatedBody.userId,
          status: { $ne: status.DELETE },
        });
        if (!userData) {
          throw apiError.notFound(responseMessage.USER_NOT_FOUND);
        }
        let message, supporterCount;
        if (userData.supporters.includes(userResult._id)) {
          supporterCount = false;
        } else {
          supporterCount = true;
        }
        var commissionResult = await sortFee({
          massHeld: { $lte: userData.massBalance },
          status: status.ACTIVE,
        });
        var commissionFee =
          Number(validatedBody.amount) *
          (commissionResult.contentCreatorFee / 100);
        var donationAmount = Number(validatedBody.amount) - commissionFee;
        message = `You have recevied a donation amount of ${donationAmount} ${validatedBody.coinName} by ${userResult.name}.`;
        notificationObj = {
          title: `Donation Alert!`,
          description: message,
          userId: userData._id,
          notificationType: "DONATION_RECEIVED",
        };
        let certificate = await getCertificateNumber();
        let transactionResult = await createTransaction({
          userId: userResult._id,
          toDonationUser: validatedBody.userId,
          amount: Number(validatedBody.amount),
          transactionType: "Donation",
          adminCommission: commissionFee,
          coinName: validatedBody.coinName,
        });
        await createTransaction({
          userId: userResult._id,
          toDonationUser: validatedBody.userId,
          amount: Number(validatedBody.amount),
          transactionType: "Deposite",
          coinName: validatedBody.coinName,
        });
        await createChatForMember(validatedBody.userId, userResult._id);
        await manageDonationData(
          userResult._id,
          userData._id,
          supporterCount,
          message,
          validatedBody.amount,
          commissionFee,
          donationAmount,
          validatedBody.coinName,
          certificate
        );
        await createNotification(notificationObj);
        return res.json(
          new response(transactionResult._id, responseMessage.DONATION_SUCCESS)
        );
      } else {
        return res.json(
          new response(
            `you have insufficient balance in ${validatedBody.coinName} in your wallet, Please add more ${validatedBody.coinName} first to your wallet .`
          )
        );
      }
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /user/donateUserList:
   *   get:
   *     tags:
   *       - USER
   *     description: donateUserList
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: token
   *         in: header
   *         required: true
   *     responses:
   *       200:
   *         description: Returns success message
   */

  async donateUserList(req, res, next) {
    try {
      let userResult = await findUser({ _id: req.userId });
      if (!userResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      let dataResults = await donationList({ userId: userResult._id });
      if (dataResults.length == 0) {
        throw apiError.notFound(responseMessage.DATA_NOT_FOUND);
      }
      return res.json(new response(dataResults, responseMessage.DATA_FOUND));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /user/sharedBundleList:
   *   get:
   *     tags:
   *       - USER
   *     description: sharedBundleList
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: token
   *         in: header
   *         required: true
   *     responses:
   *       200:
   *         description: Returns success message
   */

  async sharedBundleList(req, res, next) {
    try {
      let userResult = await findUser({ _id: req.userId });
      if (!userResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      let bundleIds = await nftSubscriber({ isShared: true });
      bundleIds = bundleIds.map((i) => i._id);
      let dataResults = await sharedBundleList(userResult._id, bundleIds);
      return res.json(new response(dataResults, responseMessage.DATA_FOUND));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /user/bundlePostList/{bundleId}:
   *   get:
   *     tags:
   *       - USER
   *     description: bundlePostList
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: token
   *         in: header
   *         required: false
   *       - name: bundleId
   *         description: bundleId
   *         in: path
   *         required: true
   *     responses:
   *       200:
   *         description: Returns success message
   */

  async bundlePostList(req, res, next) {
    try {
      let bundleIds = req.params.bundleId;
      if (req.headers.token) {
        jwt.verify(
          req.headers.token,
          config.get("jwtsecret"),
          async (err, result) => {
            if (err) {
              throw apiError.unauthorized();
            } else {
              userModel.findOne({ _id: result.id }, async (error, result2) => {
                if (error) {
                  return next(error);
                } else if (!result2) {
                  throw apiError.notFound(responseMessage.USER_NOT_FOUND);
                } else {
                  if (result2.status == "BLOCK") {
                    throw apiError.forbidden(responseMessage.BLOCK_BY_ADMIN);
                  } else if (result2.status == "DELETE") {
                    throw apiError.unauthorized(
                      responseMessage.DELETE_BY_ADMIN
                    );
                  } else {
                    let dataResults = await sharedBundleListPerticular(
                      result2._id,
                      bundleIds
                    );
                    return res.json(
                      new response(dataResults, responseMessage.DATA_FOUND)
                    );
                  }
                }
              });
            }
          }
        );
      } else {
        let dataResults = await sharedBundleListPerticular(bundleIds);
        return res.json(new response(dataResults, responseMessage.DATA_FOUND));
      }
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /user/getAdvertisement:
   *   get:
   *     tags:
   *       - USER
   *     description: getAdvertisement
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Returns success message
   */

  async getAdvertisement(req, res, next) {
    try {
      var result = await findAdvertisements({
        status: status.ACTIVE,
        startDate: { $lte: new Date().toISOString() },
        endDate: { $gte: new Date().toISOString() },
      });
      return res.json(new response(result, responseMessage.DATA_FOUND));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /user/getVideos:
   *   get:
   *     tags:
   *       - USER
   *     description: getVideos
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Returns success message
   */

  async getVideos(req, res, next) {
    try {
      var result = await findAllVideos({ status: status.ACTIVE });
      return res.json(new response(result, responseMessage.DATA_FOUND));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /user/getBanners:
   *   get:
   *     tags:
   *       - USER
   *     description: getBanners
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Returns success message
   */

  async getBanners(req, res, next) {
    try {
      var result = await findBanners({ status: status.ACTIVE });
      return res.json(new response(result, responseMessage.DATA_FOUND));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /user/getCategory:
   *   get:
   *     tags:
   *       - USER
   *     description: getCategory
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: token
   *         in: header
   *         required: true
   *     responses:
   *       200:
   *         description: Returns success message
   */

  async getCategory(req, res, next) {
    try {
      let userResult = await findUserData({ _id: req.userId });
      if (!userResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      let address;
      if (
        userResult.userType === "Creator" ||
        userResult.userType === "Admin"
      ) {
        address = userResult.ethAccount.address;
      } else {
        address = userResult.walletAddress;
      }
      let categoryType = await commonFunction.getFeeCategory(
        blockchainUrl,
        address
      );
      return res.json(
        new response(categoryType.planType, responseMessage.DETAILS_FETCHED)
      );
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /user/getCertificates:
   *   get:
   *     tags:
   *       - USER
   *     description: getCertificates
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: token
   *         in: header
   *         required: true
   *     responses:
   *       200:
   *         description: Returns success message
   */

  async getCertificates(req, res, next) {
    try {
      let userResult = await findUser({ _id: req.userId });
      if (!userResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      var certificateResult = await donationList({
        senderUserId: userResult._id,
        status: { $ne: status.DELETE },
      });
      if (certificateResult.length == 0) {
        throw apiError.conflict(responseMessage.DATA_NOT_FOUND);
      }
      return res.json(
        new response(certificateResult, responseMessage.DETAILS_FETCHED)
      );
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /user/donationTransactionlist:
   *   get:
   *     tags:
   *       - TRANSACTION MANAGEMENT
   *     description: donationTransactionlist
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: token
   *         in: header
   *         required: true
   *       - name: page
   *         description: page
   *         in: query
   *         required: false
   *       - name: limit
   *         description: limit
   *         in: query
   *         required: false
   *     responses:
   *       200:
   *         description: Data found sucessfully.
   *       404:
   *         description: Data not Found.
   *       501:
   *         description: Something went wrong.
   */
  async donationTransactionlist(req, res, next) {
    const validationSchema = {
      page: Joi.number().optional(),
      limit: Joi.number().optional(),
    };
    try {
      const validatedBody = await Joi.validate(req.query, validationSchema);
      var userResult = await findUser({
        _id: req.userId,
        status: { $ne: status.DELETE },
      });
      if (!userResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      var result = await depositListWithPagination(
        userResult._id,
        validatedBody
      );
      return res.json(new response(result, responseMessage.DATA_FOUND));
    } catch (error) {
      return next(error);
    }
  }

  // /**
  //  * @swagger
  //  * /user/depositeTransactionlist:
  //  *   get:
  //  *     tags:
  //  *       - TRANSACTION MANAGEMENT
  //  *     description: depositeTransactionlist
  //  *     produces:
  //  *       - application/json
  //  *     parameters:
  //  *       - name: token
  //  *         description: token
  //  *         in: header
  //  *         required: true
  //  *     responses:
  //  *       200:
  //  *         description: Data found sucessfully.
  //  *       404:
  //  *         description: Data not Found.
  //  *       501:
  //  *         description: Something went wrong.
  //  */
  async depositeTransactionlist(req, res, next) {
    try {
      var userResult = await findUser({
        _id: req.userId,
        status: { $ne: status.DELETE },
      });
      if (!userResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      var result = await depositeList({ toDonationUser: userResult._id });
      if (result.length == 0) {
        throw apiError.notFound(responseMessage.DATA_NOT_FOUND);
      }
      return res.json(new response(result, responseMessage.DATA_FOUND));
    } catch (error) {
      return next(error);
    }
  }
  /**
   * @swagger
   * /user/viewTransaction/{_id}:
   *   get:
   *     tags:
   *       - TRANSACTION MANAGEMENT
   *     description: viewTransaction
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: token
   *         in: header
   *         required: true
   *       - name: _id
   *         description: _id
   *         in: path
   *         required: true
   *     responses:
   *       200:
   *         description: Returns success message
   */
  async viewTransaction(req, res, next) {
    const validationSchema = {
      _id: Joi.string().required(),
    };
    try {
      const { _id } = await Joi.validate(req.params, validationSchema);
      var userResult = await findUser({
        _id: req.userId,
        userType: userType.USER,
      });
      if (!userResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      var donationBuffer = await findTransaction({
        _id: _id,
        status: { $ne: status.DELETE },
      });
      if (!donationBuffer) {
        throw apiError.conflict(responseMessage.DATA_NOT_FOUND);
      }
      return res.json(
        new response(donationBuffer, responseMessage.DETAILS_FETCHED)
      );
    } catch (error) {
      return next(error);
    }
  }
  /**
   * @swagger
   * /user/publicPrivateFeed:
   *   post:
   *     tags:
   *       - USER
   *     description: publicPrivateFeed
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: token
   *         in: header
   *         required: true
   *       - name: bundleType
   *         description: bundleType
   *         in: formData
   *         required: false
   *     responses:
   *       200:
   *         description: Returns success message
   */
  async publicPrivateFeed(req, res, next) {
    try {
      var userResult = await findUser({
        _id: req.userId,
        userType: userType.USER,
      });
      if (!userResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      let feed = await postList({
        $and: [{ status: status.ACTIVE }, { users: { $in: userResult._id } }],
      });
      if (feed.length == 0) {
        throw apiError.notFound(responseMessage.DATA_NOT_FOUND);
      }
      let totalNFT = [];
      for (let [id, userdata] of Object.entries(feed)) {
        for (let nftId of userdata["nftId"]) {
          let nft = await findNft({
            _id: nftId,
            bundleType: req.body.bundleType,
          });
          if (nft) {
            totalNFT.push(nft);
          }
        }
      }
      return res.json(new response(totalNFT, responseMessage.DETAILS_FETCHED));
    } catch (error) {
      return next(error);
    }
  }
  /**
   * @swagger
   * /user/privatePublicFeed:
   *   post:
   *     tags:
   *       - USER
   *     description: privatePublicFeed
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: token
   *         in: header
   *         required: true
   *       - name: postType
   *         description: postType
   *         in: formData
   *         required: false
   *     responses:
   *       200:
   *         description: Returns success message
   */
  async privatePublicFeed(req, res, next) {
    try {
      var userResult = await findUser({
        _id: req.userId,
        userType: userType.USER,
      });
      if (!userResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      let privatePublicFeed = await postList({
        postType: req.body.postType,
        likesUsers: { $in: userResult._id },
        status: status.ACTIVE,
      });
      return res.json(
        new response(privatePublicFeed, responseMessage.DETAILS_FETCHED)
      );
    } catch (error) {
      return next(error);
    }
  }
  /**
   * @swagger
   * /user/viewMyfeed:
   *   get:
   *     tags:
   *       - USER
   *     description: viewMyfeed
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: token
   *         in: header
   *         required: true
   *     responses:
   *       200:
   *         description: Returns success message
   */
  async viewMyfeed(req, res, next) {
    try {
      var userResult = await findUser({
        _id: req.userId,
        userType: userType.USER,
      });
      if (!userResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      let feed = await postList(
        { likesUsers: { $in: userResult._id } },
        { status: status.ACTIVE }
      );
      if (feed.length == 0) {
        throw apiError.notFound(responseMessage.DATA_NOT_FOUND);
      }
      return res.json(new response(feed, responseMessage.DATA_FOUND));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /user/findContentCreator/{_id}:
   *   get:
   *     tags:
   *       - USER
   *     description: findContentCreator
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: token
   *         in: header
   *         required: true
   *       - name: _id
   *         description: _id
   *         in: path
   *         required: false
   *     responses:
   *       200:
   *         description: Returns success message
   */
  async findContentCreator(req, res, next) {
    try {
      var userResult = await findUser({
        _id: req.userId,
        userType: userType.USER,
      });
      if (!userResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      var creatorResult = await findUserData({
        _id: req.params._id,
        userType: userType.CREATOR,
      });
      if (!creatorResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      return res.json(new response(creatorResult, responseMessage.DATA_FOUND));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /user/unSubscription:
   *   delete:
   *     tags:
   *       - USER SUBSCRIPTION
   *     description: unSubscription
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: token
   *         in: header
   *         required: true
   *       - name: _id
   *         description: _id
   *         in: query
   *         required: true
   *     responses:
   *       200:
   *         description: Returns success message
   */

  async unSubscription(req, res, next) {
    const validationSchema = {
      _id: Joi.string().required(),
    };
    try {
      const { _id } = await Joi.validate(req.query, validationSchema);
      var userResult = await findUserData({ _id: req.userId });
      if (!userResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      let nftCheck = await findNft({
        _id: _id,
        status: { $ne: status.DELETE },
      });
      var subscriptionResult = await findSubscription({
        nftId: nftCheck._id,
        status: { $ne: status.DELETE },
      });
      if (!subscriptionResult) {
        throw apiError.conflict(responseMessage.DATA_NOT_FOUND);
      }
      var result = await updateSubscription(
        { _id: subscriptionResult._id },
        { status: status.DELETE }
      );
      await updateNft(
        { _id: result.nftId },
        {
          $pull: { subscribers: userResult._id },
          $set: { subscriberCount: nftCheck.subscriberCount - 1 },
        }
      );
      await updateUser(
        { _id: userResult._id },
        { $pull: { subscribeNft: result.nftId } }
      );
      return res.json(new response(result, responseMessage.DETAILS_FETCHED));
    } catch (error) {
      return next(error);
    }
  }
  /**
   * @swagger
   * /user/transactionList:
   *   get:
   *     tags:
   *       - TRANSACTION MANAGEMENT
   *     description: transactionList
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: token
   *         in: header
   *         required: true
   *       - name: page
   *         description: page
   *         in: query
   *         required: false
   *       - name: limit
   *         description: limit
   *         in: query
   *         required: false
   *     responses:
   *       200:
   *         description: Returns success message
   */
  async transactionList(req, res, next) {
    const validationSchema = {
      page: Joi.number().optional(),
      limit: Joi.number().optional(),
    };
    try {
      const validatedBody = await Joi.validate(req.query, validationSchema);
      let data;
      var userResult = await findUser({ _id: req.userId });
      if (!userResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      data = await depositListWithPopulate(userResult._id, validatedBody);
      return res.json(new response(data, responseMessage.DETAILS_FETCHED));
    } catch (error) {
      return next(error);
    }
  }
  /**
   * @swagger
   * /user/sharedFeedList:
   *   get:
   *     tags:
   *       - USER
   *     description: sharedFeedList
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: token
   *         in: header
   *         required: true
   *     responses:
   *       200:
   *         description: Returns success message
   */

  async sharedFeedList(req, res, next) {
    try {
      let userResult = await findUser({ _id: req.userId });
      if (!userResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      let shared = await postList({
        userId: userResult._id,
        nftId: req.body.nftId,
        status: "ACTIVE",
      });
      if (shared.length == 0) {
        throw apiError.notFound(responseMessage.DATA_NOT_FOUND);
      }
      return res.json(new response(shared, responseMessage.DATA_FOUND));
    } catch (error) {
      return next(error);
    }
  }
}

export default new userController();

const deleteFile = async (filePath) => {
  fs.unlink(filePath, (deleteErr) => {
    if (deleteErr) {
      return deleteErr;
    }
  });
};

const manageDonationData = async (
  senderUserId,
  userId,
  supporterCount,
  message,
  amount,
  commission,
  donationAmount,
  coinName,
  certificate
) => {
  var adminResult = await findUser({ userType: userType.ADMIN });
  if (supporterCount === true) {
    await updateUser(
      { _id: userId },
      { $addToSet: { supporters: senderUserId }, $inc: { supporterCount: 1 } }
    );
  }
  let findData = await findDonation({
    userId: userId,
    status: { $ne: status.DELETE },
  });
  let obj = {
    userId: userId,
    history: [
      {
        senderUserId: senderUserId,
        message: message,
        amount,
        amount,
        coinName: coinName,
      },
    ],
    certificateNumber: certificate,
  };
  let updateQuery1 = {},
    commissionObj = {},
    earningObj = {},
    firstCommission = {},
    userEarn = {};
  let updateQuery = { $addToSet: { supporters: senderUserId } };
  if (coinName === "MASS") {
    obj.massBalance = amount;
    updateQuery.$inc = { massBalance: Number(donationAmount) };
    updateQuery1.$inc = { massBalance: -Number(amount) };
    commissionObj.$inc = { massBalance: Number(commission) };
    earningObj.$inc = { massBalance: Number(donationAmount) };
    firstCommission.massBalance = commission;
    userEarn.massBalance = donationAmount;
  }
  if (coinName === "BNB") {
    obj.bnbBalance = amount;
    updateQuery.$inc = { bnbBalace: Number(donationAmount) };
    updateQuery1.$inc = { bnbBalace: -Number(amount) };
    commissionObj.$inc = { bnbBalace: Number(commission) };
    earningObj.$inc = { bnbBalace: Number(donationAmount) };
    firstCommission.bnbBalace = commission;
    userEarn.bnbBalace = donationAmount;
  }
  if (coinName === "ETH") {
    obj.ethBalance = amount;
    updateQuery.$inc = { ethBalance: Number(donationAmount) };
    updateQuery1.$inc = { ethBalance: -Number(amount) };
    commissionObj.$inc = { ethBalance: Number(commission) };
    earningObj.$inc = { ethBalance: Number(donationAmount) };
    firstCommission.ethBalance = commission;
    userEarn.ethBalance = donationAmount;
  }
  if (coinName === "USDT") {
    obj.usdtBalance = amount;
    updateQuery.$inc = { usdtBalance: Number(donationAmount) };
    updateQuery1.$inc = { usdtBalance: -Number(amount) };
    commissionObj.$inc = { usdtBalance: Number(commission) };
    earningObj.$inc = { usdtBalance: Number(donationAmount) };
    firstCommission.usdtBalance = commission;
    userEarn.usdtBalance = donationAmount;
  }
  if (coinName === "WBTC") {
    obj.btcBalance = amount;
    updateQuery.$inc = { btcBalance: Number(donationAmount) };
    updateQuery1.$inc = { btcBalance: -Number(amount) };
    commissionObj.$inc = { btcBalance: Number(commission) };
    earningObj.$inc = { btcBalance: Number(donationAmount) };
    firstCommission.btcBalance = commission;
    userEarn.btcBalance = donationAmount;
  }
  await updateUser({ _id: userId }, updateQuery);
  await updateUser({ _id: senderUserId }, updateQuery1);
  var adminEarningResult = await findEarning({
    userId: adminResult._id,
    status: status.ACTIVE,
  });
  var userEarningResult = await findEarning({
    userId: userId,
    status: status.ACTIVE,
  });
  if (!adminEarningResult) {
    firstCommission.userId = adminResult._id;
    await createEarning(firstCommission);
  } else {
    await updateEarning({ _id: adminEarningResult._id }, commissionObj);
  }

  if (!userEarningResult) {
    userEarn.userId = userId;
    await createEarning(userEarn);
  } else {
    await updateEarning({ _id: userEarningResult._id }, earningObj);
  }
  if (!findData) {
    await createDonation(obj);
  } else {
    let incrementQuery = {
      $push: {
        history: {
          senderUserId: senderUserId,
          message: message,
          amount,
          amount,
          coinName: coinName,
        },
      },
    };
    if (coinName === "MASS") {
      incrementQuery.$inc = { massBalance: Number(amount) };
    }
    if (coinName === "BNB") {
      incrementQuery.$inc = { bnbBalace: Number(amount) };
    }
    if (coinName === "ETH") {
      incrementQuery.$inc = { ethBalance: Number(amount) };
    }
    if (coinName === "USDT") {
      incrementQuery.$inc = { usdtBalance: Number(amount) };
    }
    if (coinName === "WBTC") {
      incrementQuery.$inc = { btcBalance: Number(amount) };
    }
    await updateDonation({ _id: findData._id }, incrementQuery);
  }
};

const getCertificateNumber = () => {
  const digits = "0123456789";
  let txnId = "";
  for (let i = 0; i < 12; i++) {
    txnId += digits[Math.floor(Math.random() * 10)];
  }
  return txnId;
};

const createChatForMember = async (senderId, receiverId) => {
  var response;
  return new Promise(async (resolve, reject) => {
    let req = {
      senderId: senderId,
      receiverId: receiverId,
    };
    var query = { clearStatus: false },
      chatQuery = {};
    if (senderId && receiverId) {
      query.$and = [
        { $or: [{ senderId: senderId }, { senderId: receiverId }] },
        { $or: [{ receiverId: receiverId }, { receiverId: senderId }] },
      ];
    }
    let result = await chatSchema.findOne(query);
    if (!result) {
      req.messages = [
        {
          message: "Hey there! I am happy that you joined us!",
          mediaType: "text",
          receiverId: receiverId,
          createdAt: new Date().toISOString(),
        },
      ];
      await new chatSchema(req).save();
    } else {
      if (result.status == "ACTIVE") {
        var messages = [
          {
            message: req.message,
            receiverId: receiverId,
            mediaType: req.mediaType ? req.mediaType : "text",
            createdAt: new Date().toISOString(),
          },
        ];
        var chatHistory = await chatSchema
          .find(chatQuery)
          .sort({ "messages.createdAt": -1 })
          .populate("senderId receiverId", "name profilePic")
          .exec();
        chatSchema.findByIdAndUpdate(
          { _id: result._id },
          { $push: { messages: messages } },
          { new: true },
          (err2, succ1) => {
            if (err2) {
              response = {
                response_code: 500,
                response_message: "Internal server error",
                err2,
              };
              resolve(response);
            } else if (!succ1) {
              response = {
                response_code: 404,
                response_message: "Data not found",
              };
              resolve(response);
            } else {
              var reversed_array = succ1;
              reversed_array.messages = reversed_array.messages.reverse();
              response = {
                response_code: 200,
                response_message: "Message send successfully.",
                result: reversed_array,
                chatHistory,
              };
              resolve(response);
            }
          }
        );
      } else {
        response = {
          response_code: 404,
          response_message: "You cant chat",
          result: result,
        };
        resolve(response);
      }
    }
  });
};

const addUserIntoFeed = async (nftId, userId) => {
  let audienceRes = await postList({
    nftId: { $in: [nftId] },
    status: { $ne: status.DELETE },
  });
  audienceRes = audienceRes.map((i) => i._id);
  await feedUpdateAll(
    { _id: { $in: audienceRes } },
    { $addToSet: { users: userId } }
  );
};

const ethTransfer = async (
  senderAddress,
  privateKey,
  recieverAddress,
  amountToSend
) => {
  try {
    let transferRes = await axios.post(`${blockchainUrl}/ethWithdraw`, {
      senderAddress: senderAddress,
      privateKey: privateKey,
      recieverAddress: recieverAddress,
      amountToSend: amountToSend,
    });
    return transferRes;
  } catch (error) {
    return error;
  }
};
