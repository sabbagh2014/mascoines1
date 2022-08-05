import Joi from "joi";
import config from "config";
import apiError from "../../../../helper/apiError";
import response from "../../../../../assets/response";
import bcrypt from "bcryptjs";
import nftModel from "../../../../models/nft";
import userModel from "../../../../models/user";
import donationModel from "../../../../models/donation";

import responseMessage from "../../../../../assets/responseMessage";
import { userServices } from "../../services/user";
import { subscriptionServices } from "../../services/subscription";
import { nftServices } from "../../services/nft";
import { orderServices } from "../../services/order";
import { bidServices } from "../../services/bid";
import { moderatorServices } from "../../services/moderator";
import { reportServices } from "../../services/report";
import { notificationServices } from "../../services/notification";
import { blockUserServices } from "../../services/blockUser";
import { feeServices } from "../../services/fee";
import { transactionServices } from "../../services/transaction";
import { pressServices } from "../../services/press";
import { partnerServices } from "../../services/partner";
import { advertisementServices } from "../../services/advertisement";
import { socialServices } from "../../services/social";
import { logoServices } from "../../services/logo";
import { earningServices } from "../../services/earning";
import { referralServices } from "../../services/referral";
import { bannerServices } from "../../services/banner";
import { videoServices } from "../../services/video";

const {
  createUser,
  findUser,
  updateUser,
  userAllDetailsWithBundleCount,
  userCount,
  adminModeratorList,
  adminPaginationList,
  userList,
  listSubAdmin,
  usersFundAggregate,
} = userServices;
const {
  createSubscription,
  findSubscription,
  updateSubscription,
  subscriptionList,
} = subscriptionServices;
const { findNft, nftListWithAggregatePipelineForAll } = nftServices;
const {
  findOrder,
  findOrderWithPopulate,
  updateOrder,
  orderList,
} = orderServices;
const { findBid, updateBid, bidList } = bidServices;
const { findModerator, updateModerator, moderatorList } =
  moderatorServices;
const { findReport, updateReport, reportList } = reportServices;
const { createNotification } = notificationServices;
const { createBlockUser } = blockUserServices;
const { findFee, updateFee, feeList } = feeServices;
const {
  createTransaction,
  findTransaction,
  transactionList,
  depositeList,
  allTransactions,
} = transactionServices;
const { createLogo, findLogo, updateLogoById, logoList } = logoServices;
const { createPress, findPress, updatePress, paginatePressList } =
  pressServices;
const {
  createPartner,
  findPartner,
  updatePartner,
  paginatePartnerList,
} = partnerServices;
const {
  createAdvertisement,
  findAdvertisement,
  updateAdvertisementById,
  paginateSearchAdvertisement,
} = advertisementServices;
const {
  findSocial,
  findAllSocial,
  updateSocialById,
} = socialServices;
const { findEarning } = earningServices;
const { findReferral, updateReferral } = referralServices;
const { createBanner, findBanner, updateBanner, paginateSearchBanner } =
  bannerServices;
const { createVideo, findVideo, updateVideo, videoList } = videoServices;

import commonFunction from "../../../../helper/util";
import jwt from "jsonwebtoken";
import status from "../../../../enums/status";
import userType from "../../../../enums/userType";
import planType from "../../../../enums/planType";
import axios from "axios";
import bnbHelper from "../../../../helper/bnb";
const mnemonic = config.get("mnemonic");
const blockchainUrl = config.get("blockchainBaseUrl");
const adminAddress = config.get("adminAddress");
const adminPrivateKey = config.get("adminPrivateKey");

import Web3 from "web3";
var NFTTokenContract = config.get("NFTTokenContract");

let openMarketPlaceABI = config.get("openMarketPlaceABI");
openMarketPlaceABI = openMarketPlaceABI.map((method) => ({ ...method }));
let OpenMarketplaceContract = config.get("OpenMarketplaceContract");

let rpc = config.get("rpc");
let web3 = new Web3(new Web3.providers.HttpProvider(rpc));

let openMarketPlaceContract = new web3.eth.Contract(
  openMarketPlaceABI,
  OpenMarketplaceContract
);

export class adminController {
  /**
   * @swagger
   * /admin/addAdmin:
   *   post:
   *     tags:
   *       - ADMIN
   *     description: addAdmin
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: addAdmin
   *         description: addAdmin
   *         in: body
   *         required: true
   *         schema:
   *           $ref: '#/definitions/addAdmin'
   *     responses:
   *       200:
   *         description: Returns success message
   */

  async addAdmin(req, res, next) {
    const validationSchema = {
      userName: Joi.string().required(),
      password: Joi.string().required(),
      email: Joi.string().required(),
      permissions: Joi.object()
        .keys({
          viewPassword: Joi.boolean().optional(),
          viewAndBlockMessages: Joi.boolean().optional(),
          addOrRemoveNewAdmin: Joi.boolean().optional(),
          suspendBundles: Joi.boolean().optional(),
        })
        .optional(),
    };
    try {
      const validatedBody = await Joi.validate(req.body, validationSchema);
      const { userName, password, email, permissions } = validatedBody;
      var userInfo = await findUser({
        $and: [
          { status: { $ne: status.DELETE } },
          { $or: [{ userName: userName }, { email: email }] },
        ],
      });
      if (userInfo) {
        if (userInfo.email == email) {
          throw apiError.conflict(responseMessage.EMAIL_EXIST);
        } else {
          throw apiError.conflict(responseMessage.USER_NAME_EXIST);
        }
      }
      let count = await userCount();
      let generateETHWallet = await axios.get(
        `${blockchainUrl}/api/generateETHWallet/${mnemonic}/${count}`
      );
      var obj = {
        userName: userName,
        email: email,
        ethAccount: {
          address: generateETHWallet.data.Address,
          privateKey: generateETHWallet.data.PrivateKey,
        },
        password: bcrypt.hashSync(password),
        userType: userType.ADMIN,
        permissions: permissions,
      };
      var result = await createUser(obj);
      return res.json(new response(result, responseMessage.USER_CREATED));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /admin/register:
   *   post:
   *     tags:
   *       - ADMIN
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
    };
    try {
      var transactionObj, transferRes, result;
      const validatedBody = await Joi.validate(req.body, validationSchema);
      const { userName, password, email, referralCode } = validatedBody;
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
        `${blockchainUrl}/api/generateETHWallet/${mnemonic}/${count}`
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
        userType: userType.ADMIN,
      };
      if (referralCode) {
        let referralResult = await findUser({
          referralCode: referralCode,
          status: { $ne: status.DELETE },
        });
        transactionObj = {
          fromAddress: adminAddress,
          privateKey: adminPrivateKey,
          toAddress: referralResult.ethAccount.privateKey,
          amount: "50",
          coin: "MASS",
        };
        transferRes = await axios.post(
          `${blockchainUrl}/withdraw`,
          transactionObj
        );
        await createTransaction({
          userId: referralResult._id,
          amount: "50",
          transactionHash: transferRes.data.Hash,
          coinName: "MASS",
        });
        result = await createUser(obj);
        transactionObj = {
          fromAddress: adminAddress,
          privateKey: adminPrivateKey,
          toAddress: result.ethAccount.privateKey,
          amount: "100",
          coin: "MASS",
        };
        transferRes = await axios.post(
          `${blockchainUrl}/withdraw`,
          transactionObj
        );
        await createTransaction({
          userId: result._id,
          referrarId: referralResult._id,
          amount: "100",
          transactionHash: transferRes.data.Hash,
          coinName: "MASS",
        });
        let token = await commonFunction.getToken({
          id: result._id,
          email: result.email,
          userType: result.userType,
        });
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
      return res.json(
        new response({ result, token }, responseMessage.USER_CREATED)
      );
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /admin/adminList:
   *   get:
   *     tags:
   *       - ADMIN
   *     description: adminList
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
   *       - name: fromDate
   *         description: fromDate
   *         in: query
   *         required: false
   *       - name: toDate
   *         description: toDate
   *         in: query
   *         required: false
   *       - name: page
   *         description: page
   *         in: query
   *         type: integer
   *         required: false
   *       - name: limit
   *         description: limit
   *         in: query
   *         type: integer
   *         required: false
   *     responses:
   *       200:
   *         description: Returns success message
   */

  async adminList(req, res, next) {
    const validationSchema = {
      search: Joi.string().optional(),
      fromDate: Joi.string().optional(),
      toDate: Joi.string().optional(),
      page: Joi.number().optional(),
      limit: Joi.number().optional(),
    };
    try {
      const validatedBody = await Joi.validate(req.query, validationSchema);
      let userResult = await findUser({ _id: req.userId });
      if (!userResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      let dataResults = await adminPaginationList(validatedBody);
      return res.json(new response(dataResults, responseMessage.DATA_FOUND));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /admin/deleteAdmin:
   *   delete:
   *     tags:
   *       - ADMIN
   *     description: deleteAdmin
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: token
   *         in: header
   *         required: true
   *       - name: _id
   *         description: _id  ?? array of elements
   *         in: formData
   *         required: true
   *     responses:
   *       200:
   *         description: Returns success message
   */

  async deleteAdmin(req, res, next) {
    const validationSchema = {
      _id: Joi.string().required(),
    };
    try {
      var validatedBody = await Joi.validate(req.body, validationSchema);
      let userResult = await findUser({ _id: req.userId });
      if (!userResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      var ids = JSON.parse(validatedBody._id);
      for (let id of ids) {
        await updateUser({ _id: id }, { status: status.DELETE });
      }
      return res.json(new response({}, responseMessage.DELETE_SUCCESS));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /admin/setPermissions:
   *   post:
   *     tags:
   *       - ADMIN
   *     description: setPermissions
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: token
   *         in: header
   *         required: true
   *       - name: setPermissions
   *         description: setPermissions
   *         in: body
   *         required: true
   *         schema:
   *           $ref: '#/definitions/setPermissions'
   *     responses:
   *       200:
   *         description: Returns success message
   */

  async setPermissions(req, res, next) {
    const validationSchema = {
      _id: Joi.array().required(),
      permissions: Joi.object()
        .keys({
          viewPassword: Joi.boolean().optional(),
          viewAndBlockMessages: Joi.boolean().optional(),
          addOrRemoveNewAdmin: Joi.boolean().optional(),
          suspendBundles: Joi.boolean().optional(),
        })
        .optional(),
    };
    try {
      var validatedBody = await Joi.validate(req.body, validationSchema);
      let userResult = await findUser({ _id: req.userId });
      if (!userResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      for (let id of validatedBody._id) {
        await updateUser(
          { _id: id },
          { permissions: validatedBody.permissions }
        );
      }
      return res.json(new response({}, responseMessage.UPDATE_SUCCESS));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /admin/login:
   *   post:
   *     tags:
   *       - ADMIN
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
      const { email, password } = await Joi.validate(
        req.body,
        validationSchema
      );
      let query = {
        $and: [
          { userType: { $in: [userType.ADMIN, userType.SUB_ADMIN] } },
          { $or: [{ email: email }, { userName: email }] },
        ],
      };
      var userResult = await findUser(query);
      if (!userResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }

      if (!bcrypt.compareSync(password, userResult.password)) {
        throw apiError.invalid(responseMessage.INCORRECT_LOGIN);
      }
      let token = await commonFunction.getToken({
        id: userResult._id,
        email: userResult.email,
        userType: userResult.userType,
      });
      let obj = {
        _id: userResult._id,
        userName: userResult.userName,
        token: token,
        userType: userResult.userType,
        permissions: userResult.permissions,
      };
      return res.json(new response(obj, responseMessage.LOGIN));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /admin/forgotPassword:
   *   post:
   *     tags:
   *       - ADMIN
   *     description: forgotPassword
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: forgotPassword
   *         description: forgotPassword
   *         in: body
   *         required: true
   *         schema:
   *           $ref: '#/definitions/forgotPassword'
   *     responses:
   *       200:
   *         description: Returns success message
   */

  async forgotPassword(req, res, next) {
    var validationSchema = {
      email: Joi.string().required(),
      type: Joi.string().valid("user", "admin").required(),
    };
    try {
      var validatedBody = await Joi.validate(req.body, validationSchema);
      const { email, type } = validatedBody;
      var userResult = await findUser({ email: email });
      if (!userResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      var token = await commonFunction.getToken({
        id: userResult._id,
        userName: userResult.userName,
        mobileNumber: userResult.mobileNumber,
        userType: userResult.userType,
      });
      await commonFunction.sendMail(
        userResult.email,
        userResult.userName,
        token,
        type
      );
      await updateUser(
        { _id: userResult._id },
        { isReset: false }
      );
      return res.json(new response({}, responseMessage.RESET_LINK_SEND));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /admin/resetPassword/{token}:
   *   put:
   *     tags:
   *       - ADMIN
   *     description: resetPassword
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: token
   *         in: path
   *         required: true
   *       - name: resetPassword
   *         description: resetPassword
   *         in: body
   *         required: true
   *         schema:
   *           $ref: '#/definitions/resetPassword'
   *     responses:
   *       200:
   *         description: Returns success message
   */

  async resetPassword(req, res, next) {
    var validationSchema = {
      newPassword: Joi.string().required(),
    };
    try {
      var validatedBody = await Joi.validate(req.body, validationSchema);
      const { token } = req.params;
      var result = jwt.verify(token, config.get("jwtsecret"));
      var userResult = await findUser({ _id: result.id });
      if (!userResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      if (userResult.isReset == true) {
        throw apiError.badRequest(responseMessage.LINK_EXPIRED);
      }
      await updateUser(
        { _id: userResult._id },
        { isReset: true, password: bcrypt.hashSync(validatedBody.newPassword) }
      );
      return res.json(new response({}, responseMessage.PWD_CHANGED));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /user/profile:
   *   get:
   *     tags:
   *       - ADMIN
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
      let userResult = await findUser({ _id: req.userId });
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
   * /admin/userList:
   *   get:
   *     tags:
   *       - ADMIN
   *     description: userList
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
   *       - name: planType
   *         description: planType-Basic/Silver/Gold/Diamond/Mass Plus
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
   *       - name: page
   *         description: page
   *         in: query
   *         type: integer
   *         required: false
   *       - name: limit
   *         description: limit
   *         in: query
   *         type: integer
   *         required: false
   *     responses:
   *       200:
   *         description: Returns success message
   */

  async userList(req, res, next) {
    const validationSchema = {
      search: Joi.string().optional(),
      type: Joi.string().valid(userType.USER, userType.CREATOR).optional(),
      planType: Joi.string()
        .valid(
          planType.BASIC,
          planType.SILVER,
          planType.GOLD,
          planType.DIAMOND,
          planType.MASS_PLUS
        )
        .optional(),
      fromDate: Joi.string().optional(),
      toDate: Joi.string().optional(),
      page: Joi.number().optional(),
      limit: Joi.number().optional(),
    };
    try {
      const validatedBody = await Joi.validate(req.query, validationSchema);
      let userResult = await findUser({ _id: req.userId });
      if (!userResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      let dataResults = await userList(validatedBody, userResult._id);
      return res.json(new response(dataResults, responseMessage.DATA_FOUND));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /admin/moderatorList:
   *   get:
   *     tags:
   *       - ADMIN
   *     description: moderatorList
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
   *       - name: fromDate
   *         description: fromDate
   *         in: query
   *         required: false
   *       - name: toDate
   *         description: toDate
   *         in: query
   *         required: false
   *       - name: page
   *         description: page
   *         in: query
   *         type: integer
   *         required: false
   *       - name: limit
   *         description: limit
   *         in: query
   *         type: integer
   *         required: false
   *     responses:
   *       200:
   *         description: Returns success message
   */

  async moderatorList(req, res, next) {
    const validationSchema = {
      search: Joi.string().optional(),
      fromDate: Joi.string().optional(),
      toDate: Joi.string().optional(),
      page: Joi.number().optional(),
      limit: Joi.number().optional(),
    };
    try {
      const validatedBody = await Joi.validate(req.query, validationSchema);
      let userResult = await findUser({ _id: req.userId });
      if (!userResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      let dataResults = await adminModeratorList(validatedBody);
      return res.json(new response(dataResults, responseMessage.DATA_FOUND));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /admin/viewUser/{_id}:
   *   get:
   *     tags:
   *       - ADMIN
   *     description: viewUser
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

  async viewUser(req, res, next) {
    const validationSchema = {
      _id: Joi.string().required(),
    };
    try {
      const { _id } = await Joi.validate(req.params, validationSchema);

      var subscriptionResult = await findUser({
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

  /**
   * @swagger
   * /admin/subscription:
   *   post:
   *     tags:
   *       - ADMIN
   *     description: addSubscription
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: token
   *         in: header
   *         required: true
   *       - name: addSubscription
   *         description: addSubscription
   *         in: body
   *         required: true
   *         schema:
   *           $ref: '#/definitions/addSubscription'
   *     responses:
   *       200:
   *         description: Returns success message
   */

  async addSubscription(req, res, next) {
    const validationSchema = {
      title: Joi.string().required(),
      description: Joi.string().required(),
      validTillDate: Joi.string().required(),
      masPrice: Joi.number().required(),
      fees: Joi.number().required(),
    };
    try {
      const validatedBody = await Joi.validate(req.body, validationSchema);
      const { title, description, validTillDate, masPrice, fees } =
        validatedBody;

      var subscriptionResult = await findSubscription({
        title: title,
        status: { $ne: status.DELETE },
      });
      if (subscriptionResult) {
        throw apiError.conflict(responseMessage.TITLE_EXIST);
      }
      var obj = {
        title: title,
        description: description,
        validTillDate: validTillDate,
        masPrice: masPrice,
        fees: fees,
      };
      var result = await createSubscription(obj);
      return res.json(new response(result, responseMessage.SUBSCRIPTION_ADDED));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /admin/subscription/{_id}:
   *   get:
   *     tags:
   *       - ADMIN
   *     description: viewSubscription
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

  /**
   * @swagger
   * /admin/subscription:
   *   put:
   *     tags:
   *       - ADMIN
   *     description: editSubscription
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: token
   *         in: header
   *         required: true
   *       - name: editSubscription
   *         description: editSubscription
   *         in: body
   *         required: true
   *         schema:
   *           $ref: '#/definitions/editSubscription'
   *     responses:
   *       200:
   *         description: Returns success message
   */

  async editSubscription(req, res, next) {
    const validationSchema = {
      _id: Joi.string().required(),
      title: Joi.string().optional(),
      description: Joi.string().optional(),
      validTillDate: Joi.string().optional(),
      masPrice: Joi.number().optional(),
      fees: Joi.number().optional(),
    };
    try {
      const validatedBody = await Joi.validate(req.body, validationSchema);

      var subscriptionResult = await findSubscription({
        _id: validatedBody._id,
        status: { $ne: status.DELETE },
      });
      if (!subscriptionResult) {
        throw apiError.conflict(responseMessage.DATA_NOT_FOUND);
      }
      var result = await updateSubscription(
        { _id: subscriptionResult._id },
        validatedBody
      );
      return res.json(new response(result, responseMessage.DETAILS_FETCHED));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /admin/subscription:
   *   delete:
   *     tags:
   *       - ADMIN
   *     description: deleteSubscription
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

  /**
   * @swagger
   * /admin/subscriptionList:
   *   get:
   *     tags:
   *       - ADMIN
   *     description: subscriptionList
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

  async subscriptionList(req, res, next) {
    try {
      var result = await subscriptionList({ status: { $ne: status.DELETE } });
      return res.json(new response(result, responseMessage.DATA_FOUND));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /admin/nft/{_id}:
   *   get:
   *     tags:
   *       - ADMIN
   *     description: viewNFT
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

  async viewNFT(req, res, next) {
    const validationSchema = {
      _id: Joi.string().required(),
    };
    try {
      const { _id } = await Joi.validate(req.params, validationSchema);
      let userResult = await findUser({ _id: req.userId });
      if (!userResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      var nftResult = await findNft({
        _id: _id,
        status: { $ne: status.DELETE },
      });
      if (!nftResult) {
        throw apiError.conflict(responseMessage.DATA_NOT_FOUND);
      }
      return res.json(new response(nftResult, responseMessage.DETAILS_FETCHED));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /admin/listNFT:
   *   get:
   *     tags:
   *       - ADMIN
   *     description: listNFT
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: token
   *         in: header
   *         required: true
   *       - name: search
   *         description: search ?? tokenId || tokenName || bundleTitle || bundleName || contractAddress
   *         in: query
   *         required: false
   *     responses:
   *       200:
   *         description: Returns success message
   */

  async listNFT(req, res, next) {
    const validationSchema = {
      search: Joi.string().optional(),
    };
    try {
      const validatedBody = await Joi.validate(req.query, validationSchema);
      let userResult = await findUser({ _id: req.userId });
      if (!userResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      let dataResults = await nftListWithAggregatePipelineForAll(
        validatedBody,
        userResult._id
      );
      return res.json(new response(dataResults, responseMessage.DATA_FOUND));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /admin/order/{_id}:
   *   get:
   *     tags:
   *       - ADMIN
   *     description: viewOrder
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

  async viewOrder(req, res, next) {
    const validationSchema = {
      _id: Joi.string().required(),
    };
    try {
      const { _id } = await Joi.validate(req.params, validationSchema);
      let userResult = await findUser({ _id: req.userId });
      if (!userResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      var orderResult = await findOrderWithPopulate(_id);
      if (!orderResult) {
        throw apiError.conflict(responseMessage.DATA_NOT_FOUND);
      }
      return res.json(
        new response(orderResult, responseMessage.DETAILS_FETCHED)
      );
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /admin/listOrder:
   *   get:
   *     tags:
   *       - ADMIN
   *     description: listOrder
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

  async listOrder(req, res, next) {
    try {
      let userResult = await findUser({ _id: req.userId });
      if (!userResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      let dataResults = await orderList({ status: { $ne: status.DELETE } });
      return res.json(new response(dataResults, responseMessage.DATA_FOUND));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /admin/deleteAuction:
   *   delete:
   *     tags:
   *       - ADMIN
   *     description: deleteOrder
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

  async deleteOrder(req, res, next) {
    const validationSchema = {
      _id: Joi.string().required(),
    };
    try {
      const { _id } = await Joi.validate(req.query, validationSchema);
      let userResult = await findUser({ _id: req.userId });
      if (!userResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      var orderResult = await findOrder({
        _id: _id,
        status: { $ne: status.DELETE },
      });
      if (!orderResult) {
        throw apiError.conflict(responseMessage.DATA_NOT_FOUND);
      }

      let cancelResData = await openMarketPlaceContract.methods
        .cancelOrder(NFTTokenContract, orderResult.tokenId)
        .encodeABI();
      let transactionResult = await transaction(
        openMarketPlaceContract,
        cancelResData,
        adminPrivateKey
      );
      if (transactionResult.status === true) {
        var result = await updateOrder(
          { _id: orderResult._id },
          { status: status.DELETE }
        );
        await updateBid(
          { orderId: orderResult._id },
          { status: status.DELETE }
        );
        return res.json(new response(result, responseMessage.DETAILS_FETCHED));
      } else {
        throw apiError.internal(responseMessage.INTERNAL_ERROR);
      }
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /admin/testCancelOrder:
   *   get:
   *     tags:
   *       - ADMIN
   *     description: testCancelOrder
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Returns success message
   */
  async testCancelOrder(req, res, next) {
    try {
      let owner = await openMarketPlaceContract.methods.owner().call();
      return res.json(new response(owner, responseMessage.DATA_FOUND));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /admin/stopAuction:
   *   put:
   *     tags:
   *       - ADMIN
   *     description: deleteOrder
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

  async stopAuction(req, res, next) {
    const validationSchema = {
      _id: Joi.string().required(),
    };
    try {
      const { _id } = await Joi.validate(req.query, validationSchema);
      let userResult = await findUser({ _id: req.userId });
      if (!userResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      var orderResult = await findOrder({
        _id: _id,
        status: { $ne: status.DELETE },
      });
      if (!orderResult) {
        throw apiError.conflict(responseMessage.DATA_NOT_FOUND);
      }
      var result = await updateOrder(
        { _id: orderResult._id },
        { status: "STOPPED" }
      );
      return res.json(new response(result, responseMessage.STOPPED));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /admin/bid/{_id}:
   *   get:
   *     tags:
   *       - ADMIN
   *     description: viewBid
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

  async viewBid(req, res, next) {
    const validationSchema = {
      _id: Joi.string().required(),
    };
    try {
      const { _id } = await Joi.validate(req.params, validationSchema);
      let userResult = await findUser({ _id: req.userId });
      if (!userResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      var bidResult = await findBid({
        _id: _id,
        status: { $ne: status.DELETE },
      });
      if (!bidResult) {
        throw apiError.conflict(responseMessage.DATA_NOT_FOUND);
      }
      return res.json(new response(bidResult, responseMessage.DETAILS_FETCHED));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /admin/listBid:
   *   get:
   *     tags:
   *       - ADMIN
   *     description: listBid
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

  async listBid(req, res, next) {
    try {
      let userResult = await findUser({ _id: req.userId });
      if (!userResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      let dataResults = await bidList({ status: { $ne: status.DELETE } });
      return res.json(new response(dataResults, responseMessage.DATA_FOUND));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /admin/dashboard:
   *   get:
   *     tags:
   *       - ADMIN
   *     description: dashboard
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: token
   *         in: header
   *         required: true
   *       - name: searchBy
   *         description: searchBy ?? Daily || Weekly || Monthly || Yearly || All
   *         in: query
   *         required: false
   *     responses:
   *       200:
   *         description: Returns success message
   */

  async dashboard(req, res, next) {
    var fromDate, toDate, data, bundleCount, userCounts;
    var uniqueWalletConnected = 0;
    var userCount = 0;
    var adminCount = 0;
    var subscriberCount = 0;
    var creatorCount = 0;
    const validationSchema = {
      searchBy: Joi.string().optional(),
    };
    try {
      const { searchBy } = await Joi.validate(req.query, validationSchema);
      let userResult = await findUser({ _id: req.userId });
      if (!userResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      let d = new Date();
      toDate = new Date().toISOString();
      if (searchBy == "Daily") {
        let oneDayFromNow = d.setDate(d.getDate() - 1);
        fromDate = new Date(oneDayFromNow).toISOString();
        data = async () => {
          return await getData(donationModel, searchBy, fromDate, toDate);
        };
        userCounts = async () => {
          return await getData(userModel, searchBy, fromDate, toDate);
        };
        bundleCount = async () => {
          return await getData(nftModel, searchBy, fromDate, toDate);
        };
        [data, userCounts, bundleCount] = await Promise.all([
          data(),
          userCounts(),
          bundleCount(),
        ]);
      }
      if (searchBy == "Weekly") {
        let sevenDaysFromNow = d.setDate(d.getDate() - 7);
        fromDate = new Date(sevenDaysFromNow).toISOString();
        data = async () => {
          return await getData(donationModel, searchBy, fromDate, toDate);
        };
        userCounts = async () => {
          return await getData(userModel, searchBy, fromDate, toDate);
        };
        bundleCount = async () => {
          return await getData(nftModel, searchBy, fromDate, toDate);
        };
        [data, userCounts, bundleCount] = await Promise.all([
          data(),
          userCounts(),
          bundleCount(),
        ]);
      }
      if (searchBy == "Monthly") {
        let thirtyDaysFromNow = d.setDate(d.getDate() - 30);
        fromDate = new Date(thirtyDaysFromNow).toISOString();
        data = async () => {
          return await getData(donationModel, searchBy, fromDate, toDate);
        };
        userCounts = async () => {
          return await getData(userModel, searchBy, fromDate, toDate);
        };
        bundleCount = async () => {
          return await getData(nftModel, searchBy, fromDate, toDate);
        };
        [data, userCounts, bundleCount] = await Promise.all([
          data(),
          userCounts(),
          bundleCount(),
        ]);
      }
      if (searchBy == "Yearly") {
        let oneYearFromNow = d.setDate(d.getDate() - 365);
        fromDate = new Date(oneYearFromNow).toISOString();
        data = async () => {
          return await getData(donationModel, searchBy, fromDate, toDate);
        };
        userCounts = async () => {
          return await getData(userModel, searchBy, fromDate, toDate);
        };
        bundleCount = async () => {
          return await getData(nftModel, searchBy, fromDate, toDate);
        };
        [data, userCounts, bundleCount] = await Promise.all([
          data(),
          userCounts(),
          bundleCount(),
        ]);
      }
      if (searchBy == "All") {
        data = async () => {
          return await getData(donationModel, searchBy, fromDate, toDate);
        };
        userCounts = async () => {
          return await getData(userModel, searchBy, fromDate, toDate);
        };
        bundleCount = async () => {
          return await getData(nftModel, searchBy, fromDate, toDate);
        };
        [data, userCounts, bundleCount] = await Promise.all([
          data(),
          userCounts(),
          bundleCount(),
        ]);
      }
      if (userCounts.length != 0) {
        for (let j of userCounts) {
          if (j.userType === "Creator") {
            (userCount += 1), (creatorCount += 1);
          } else if (j.userType === "User") {
            (uniqueWalletConnected += 1), (subscriberCount += 1);
          } else {
            adminCount += 1;
          }
        }
      }
      let obj = {
        userCount: userCount,
        uniqueWalletConnected: uniqueWalletConnected,
        adminCount: adminCount,
        bundleCount: bundleCount.length,
        donationSent: data.length,
        subscriberCount: subscriberCount,
        creatorCount: creatorCount,
      };
      return res.json(new response(obj, responseMessage.DATA_FOUND));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /admin/totalAdminBalance:
   *   get:
   *     tags:
   *       - ADMIN
   *     description: totalAdminBalance
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

  async totalAdminBalance(req, res, next) {
    try {
      let adminResult = await findUser({
        _id: req.userId,
        userType: userType.ADMIN,
      });
      if (!adminResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      const eth = async () => {
        return await axios.get(
          `${blockchainUrl}/ethGetBalance/${adminResult.ethAccount.address}`
        );
      };
      const mass = async () => {
        return await bnbHelper.getMassBalance(adminResult.ethAccount.address);
      };
      const bnb = async () => {
        return await axios.get(
          `${blockchainUrl}/bnbGetBalance/${adminResult.ethAccount.address}`
        );
      };
      const usdt = async () => {
        return await bnbHelper.getBusdBalance(adminResult.ethAccount.address);
      };
      const btc = async () => {
        return await bnbHelper.getWbtcBalance(adminResult.ethAccount.address);
      };
      var [ethBalance, usdtBalance, massBalance, bnbBalance, btcBalance] =
        await Promise.all([eth(), usdt(), mass(), bnb(), btc()]);

      var obj = {
        ethBalance: ethBalance.data.Balance,
        massBalance: massBalance.balance,
        bnbBalance: bnbBalance.data.Balance,
        btcBalance: btcBalance.balance,
        usdtBalance: usdtBalance.balance,
      };

      return res.json(new response(obj, responseMessage.DATA_FOUND));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /admin/getAdminTotalEarnings:
   *   get:
   *     tags:
   *       - ADMIN
   *     description: getAdminTotalEarnings
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

  async getAdminTotalEarnings(req, res, next) {
    try {
      let adminResult = await findUser({
        _id: req.userId,
        userType: userType.ADMIN,
      });
      if (!adminResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      var result = await findEarning({
        userId: adminResult._id,
        status: status.ACTIVE,
      });
      return res.json(new response(result, responseMessage.DATA_FOUND));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /admin/totalUserFunds:
   *   get:
   *     tags:
   *       - ADMIN
   *     description: getTotalUserFunds
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

  async getTotalUserFunds(req, res, next) {
    try {
      let adminResult = await findUser({
        _id: req.userId,
        userType: userType.ADMIN,
      });
      if (!adminResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      var aggregate = [
        {
          $match: {
            userType: { $in: [userType.CREATOR, userType.USER] },
            status: { $ne: status.DELETE },
          },
        },
        {
          $group: {
            _id: req.userId,
            massBalance: { $sum: "$massBalance" },
            usdtBalance: { $sum: "$usdtBalance" },
            ethBalance: { $sum: "$ethBalance" },
            bnbBalace: { $sum: "$bnbBalace" },
            btcBalance: { $sum: "$btcBalance" },
          },
        },
      ];

      var result = await usersFundAggregate(aggregate);
      return res.json(new response(result, responseMessage.DATA_FOUND));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /admin/moderator/{_id}:
   *   get:
   *     tags:
   *       - ADMIN
   *     description: viewModerator
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

  async viewModerator(req, res, next) {
    const validationSchema = {
      _id: Joi.string().required(),
    };
    try {
      const { _id } = await Joi.validate(req.params, validationSchema);
      let userResult = await findUser({ _id: req.userId });
      if (!userResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      var moderatorResult = await findModerator({
        _id: _id,
        status: { $ne: status.DELETE },
      });
      if (!moderatorResult) {
        throw apiError.conflict(responseMessage.DATA_NOT_FOUND);
      }
      return res.json(
        new response(moderatorResult, responseMessage.DETAILS_FETCHED)
      );
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /admin/moderator:
   *   put:
   *     tags:
   *       - ADMIN
   *     description: editModerator
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: token
   *         in: header
   *         required: true
   *       - name: editModerator
   *         description: editModerator
   *         in: body
   *         required: true
   *         schema:
   *           $ref: '#/definitions/editModerator'
   *     responses:
   *       200:
   *         description: Returns success message
   */

  async editModerator(req, res, next) {
    const validationSchema = {
      _id: Joi.string().required(),
      userName: Joi.string().optional(),
      password: Joi.string().optional(),
      ip: Joi.string().optional(),
      walletAddress: Joi.string().optional(),
    };
    try {
      var validatedBody = await Joi.validate(req.body, validationSchema);
      let userResult = await findUser({ _id: req.userId });
      if (!userResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      var moderatorResult = await findModerator({
        _id: validatedBody._id,
        status: { $ne: status.DELETE },
      });
      if (!moderatorResult) {
        throw apiError.conflict(responseMessage.DATA_NOT_FOUND);
      }
      var result = await updateModerator(
        { _id: moderatorResult._id },
        validatedBody
      );
      return res.json(new response(result, responseMessage.DETAILS_FETCHED));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /admin/listModerator:
   *   get:
   *     tags:
   *       - ADMIN
   *     description: listModerator
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

  async listModerator(req, res, next) {
    try {
      let userResult = await findUser({ _id: req.userId });
      if (!userResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      let dataResults = await moderatorList({ status: { $ne: status.DELETE } });
      return res.json(new response(dataResults, responseMessage.DATA_FOUND));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /admin/report/{_id}:
   *   get:
   *     tags:
   *       - ADMIN
   *     description: viewReport
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

  async viewReport(req, res, next) {
    const validationSchema = {
      _id: Joi.string().required(),
    };
    try {
      const { _id } = await Joi.validate(req.params, validationSchema);
      let userResult = await findUser({ _id: req.userId });
      if (!userResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      var reportResult = await findReport({
        _id: _id,
        status: { $ne: status.DELETE },
      });
      if (!reportResult) {
        throw apiError.conflict(responseMessage.DATA_NOT_FOUND);
      }
      return res.json(
        new response(reportResult, responseMessage.DETAILS_FETCHED)
      );
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /admin/report:
   *   put:
   *     tags:
   *       - ADMIN
   *     description: editReport
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

  async editReport(req, res, next) {
    const validationSchema = {
      _id: Joi.string().required(),
    };
    try {
      var validatedBody = await Joi.validate(req.body, validationSchema);
      let userResult = await findUser({ _id: req.userId });
      if (!userResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      var reportResult = await findReport({
        _id: validatedBody._id,
        status: { $ne: status.DELETE },
      });
      if (!reportResult) {
        throw apiError.conflict(responseMessage.DATA_NOT_FOUND);
      }
      var result = await updateReport({ _id: reportResult._id }, validatedBody);
      return res.json(new response(result, responseMessage.DETAILS_FETCHED));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /admin/report:
   *   delete:
   *     tags:
   *       - ADMIN
   *     description: deleteReport
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

  async deleteReport(req, res, next) {
    const validationSchema = {
      _id: Joi.string().required(),
    };
    try {
      const { _id } = await Joi.validate(req.query, validationSchema);
      let reportResult = await findReport({
        _id: _id,
        status: { $ne: status.DELETE },
      });
      if (!reportResult) {
        throw apiError.notFound(responseMessage.DATA_NOT_FOUND);
      }
      let result = await updateReport(
        { _id: reportResult._id },
        { status: status.DELETE }
      );
      return res.json(new response(result, responseMessage.DELETED_REPORT));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /admin/listReport:
   *   get:
   *     tags:
   *       - ADMIN
   *     description: listReport
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

  async listReport(req, res, next) {
    try {
      let userResult = await findUser({ _id: req.userId });
      if (!userResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      let dataResults = await reportList(
        {
          status: { $ne: status.DELETE },
          actionApply: false,
          reportStatus: "PENDING",
        },
        req.query.page,
        req.query.limit
      );
      return res.json(new response(dataResults, responseMessage.DATA_FOUND));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /admin/blockUser:
   *   post:
   *     tags:
   *       - ADMIN
   *     description: blockUser
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: token
   *         in: header
   *         required: true
   *       - name: blockUser
   *         description: blockUser
   *         in: body
   *         required: true
   *         schema:
   *           $ref: '#/definitions/blockUser'
   *     responses:
   *       200:
   *         description: Returns success message
   */

  async blockUser(req, res, next) {
    const validationSchema = {
      _id: Joi.string().required(),
      message: Joi.string().required(),
      time: Joi.string().required(),
      reportId: Joi.string().required(),
    };
    try {
      var validatedBody = await Joi.validate(req.body, validationSchema);
      let userResult = await findUser({ _id: req.userId });
      if (!userResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      var userCheck = await findUser({
        _id: validatedBody._id,
        status: { $ne: status.DELETE },
      });
      if (!userCheck) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      await updateUser({ _id: userCheck._id }, { blockStatus: true });
      let tillValid = new Date(
        new Date().getTime() +
          parseFloat(validatedBody.time.split(" ")[0]) * 60 * 60 * 1000
      ).toISOString();

      let notificationObj = {
        title: `Block Alert!`,
        description: `You are blocked by admin for ${validatedBody.time}.`,
        userId: userCheck._id,
        adminId: userResult._id,
      };
      await createNotification(notificationObj);
      await updateReport(
        { _id: validatedBody.reportId },
        { actionApply: true, reportStatus: "RESOLVED" }
      );
      let obj = {
        userId: userCheck._id,
        message: validatedBody.message,
        time: validatedBody.time,
        tillValid: tillValid,
      };
      await updateReport(
        { _id: validatedBody.reportId },
        { actionApply: true, reportStatus: "RESOLVED" }
      );
      const result = await createBlockUser(obj);
      return res.json(new response(result, responseMessage.BLOCKED));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /admin/sendWarningMessage:
   *   post:
   *     tags:
   *       - ADMIN
   *     description: sendWarningMessage
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: token
   *         in: header
   *         required: true
   *       - name: sendWarningMessage
   *         description: sendWarningMessage
   *         in: body
   *         required: true
   *         schema:
   *           $ref: '#/definitions/sendWarningMessage'
   *     responses:
   *       200:
   *         description: Returns success message
   */

  async sendWarningMessage(req, res, next) {
    const validationSchema = {
      text: Joi.string().required(),
      userId: Joi.string().required(),
      chatId: Joi.string().required(),
      reportId: Joi.string().required(),
    };
    try {
      const validatedBody = await Joi.validate(req.body, validationSchema);
      var { text, userId, chatId, reportId } = validatedBody;
      let userResult = await findUser({ _id: req.userId });
      if (!userResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      let obj = {
        title: `Warning Alert!`,
        description: text,
        userId: userId,
        adminId: userResult._id,
        chatId: chatId,
      };
      var result = await createNotification(obj);
      await updateReport(
        { _id: reportId },
        { actionApply: true, reportStatus: "RESOLVED" }
      );
      return res.json(new response(result, responseMessage.WARNING_SENT));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /admin/viewFee/{_id}:
   *   get:
   *     tags:
   *       - ADMIN FEE
   *     description: viewFee
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

  async viewFee(req, res, next) {
    const validationSchema = {
      _id: Joi.string().required(),
    };
    try {
      const { _id } = await Joi.validate(req.params, validationSchema);
      let userResult = await findUser({ _id: req.userId });
      if (!userResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      var feeResult = await findFee({
        _id: _id,
        status: { $ne: status.DELETE },
      });
      if (!feeResult) {
        throw apiError.conflict(responseMessage.DATA_NOT_FOUND);
      }
      return res.json(new response(feeResult, responseMessage.DETAILS_FETCHED));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /admin/editFee:
   *   put:
   *     tags:
   *       - ADMIN FEE
   *     description: editFee
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: token
   *         in: header
   *         required: true
   *       - name: editFee
   *         description: editFee
   *         in: body
   *         required: true
   *         schema:
   *           $ref: '#/definitions/editFee'
   *     responses:
   *       200:
   *         description: Returns success message
   */

  async editFee(req, res, next) {
    const validationSchema = {
      _id: Joi.string().required(),
      massHeld: Joi.string().optional(),
      contentCreatorFee: Joi.string().optional(),
    };
    try {
      var validatedBody = await Joi.validate(req.body, validationSchema);
      let userResult = await findUser({ _id: req.userId });
      if (!userResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      var feeResult = await findFee({
        _id: validatedBody._id,
        status: { $ne: status.DELETE },
      });
      if (!feeResult) {
        throw apiError.conflict(responseMessage.DATA_NOT_FOUND);
      }
      var result = await updateFee({ _id: feeResult._id }, validatedBody);
      return res.json(new response(result, responseMessage.DETAILS_FETCHED));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /admin/listFee:
   *   get:
   *     tags:
   *       - ADMIN FEE
   *     description: listFee
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

  async listFee(req, res, next) {
    try {
      let userResult = await findUser({ _id: req.userId });
      if (!userResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      let dataResults = await feeList({ status: { $ne: status.DELETE } });
      return res.json(new response(dataResults, responseMessage.DATA_FOUND));
    } catch (error) {
      return next(error);
    }
  }

  async deleteFee(req, res, next) {
    const validationSchema = {
      _id: Joi.string().required(),
    };
    try {
      const { _id } = await Joi.validate(req.query, validationSchema);
      let feeResult = await findFee({
        _id: _id,
        status: { $ne: status.DELETE },
      });
      if (!feeResult) {
        throw apiError.notFound(responseMessage.DATA_NOT_FOUND);
      }
      let result = await updateFee(
        { _id: feeResult._id },
        { status: status.DELETE }
      );
      return res.json(new response(result, responseMessage.DETAILS_FETCHED));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /admin/listUser:
   *   get:
   *     tags:
   *       - ADMIN
   *     description: listUser
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
   *       - name: fromDate
   *         description: fromDate
   *         in: query
   *         required: false
   *       - name: toDate
   *         description: toDate
   *         in: query
   *         required: false
   *       - name: page
   *         description: page
   *         in: query
   *         type: integer
   *         required: false
   *       - name: limit
   *         description: limit
   *         in: query
   *         type: integer
   *         required: false
   *     responses:
   *       200:
   *         description: Returns success message
   */

  async listUser(req, res, next) {
    const validationSchema = {
      search: Joi.string().optional(),
      fromDate: Joi.string().optional(),
      toDate: Joi.string().optional(),
      page: Joi.number().optional(),
      limit: Joi.number().optional(),
    };
    try {
      var finalData = [];
      const validatedBody = await Joi.validate(req.query, validationSchema);
      let userResult = await findUser({ _id: req.userId });
      if (!userResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      let dataResults = await userAllDetailsWithBundleCount(
        validatedBody,
        userResult._id
      );
      return res.json(
        new response({ finalData, dataResults }, responseMessage.DATA_FOUND)
      );
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /admin/addPress:
   *   post:
   *     tags:
   *       - PRESS MANAGEMENT
   *     description: addPress
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
   *         required: true
   *       - name: link
   *         description: link
   *         in: formData
   *         required: true
   *       - name: logo
   *         description: logo
   *         in: formData
   *         type: file
   *         required: true
   *     responses:
   *       200:
   *         description: Returns success message
   */

  async addPress(req, res, next) {
    const validationSchema = {
      title: Joi.string().required(),
      link: Joi.string().required(),
      logo: Joi.array().items(Joi.string().required()),
    };
    try {
      const validatedBody = await Joi.validate(req.body, validationSchema);
      let admin = await findUser({
        _id: req.userId,
        userType: { $in: [userType.ADMIN, userType.SUB_ADMIN] },
        status: status.ACTIVE,
      });
      if (!admin) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      var press = await findPress({
        title: validatedBody.title,
        status: { $ne: status.DELETE },
      });
      if (press) {
        throw apiError.conflict(responseMessage.TITLE_EXIST);
      }
      validatedBody.logo = await commonFunction.getImageUrl(req.files);
      var result = await createPress(validatedBody);
      return res.json(new response(result, responseMessage.PRESS_SAVE));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /admin/editPress:
   *   put:
   *     tags:
   *       - PRESS MANAGEMENT
   *     description: editPress
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
   *       - name: title
   *         description: title
   *         in: formData
   *         required: false
   *       - name: link
   *         description: link
   *         in: formData
   *         required: false
   *       - name: logo
   *         description: logo
   *         in: formData
   *         type: file
   *         required: false
   *     responses:
   *       200:
   *         description: Returns success message
   */
  async editPress(req, res, next) {
    const validationSchema = {
      title: Joi.string().optional(),
      link: Joi.string().optional(),
      logo: Joi.array().items(Joi.string().optional()),
    };
    try {
      const validatedBody = await Joi.validate(req.body, validationSchema);
      let admin = await findUser({
        _id: req.userId,
        userType: { $in: [userType.ADMIN, userType.SUB_ADMIN] },
        status: status.ACTIVE,
      });
      if (!admin) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      var press = await findPress({
        _id: req.query._id,
        status: { $ne: status.DELETE },
      });
      if (!press) {
        throw apiError.notFound(responseMessage.DATA_NOT_FOUND);
      } else {
        if (req.files) {
          validatedBody.logo = await commonFunction.getImageUrl(req.files);
        }
        var update = await updatePress(
          { _id: press._id },
          { $set: validatedBody }
        );
        return res.json(new response(update, responseMessage.UPDATE_SUCCESS));
      }
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /admin/listPress:
   *   get:
   *     tags:
   *       - PRESS MANAGEMENT
   *     description: listPress
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: search
   *         description: search by title
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
   *       - name: page
   *         description: page
   *         in: query
   *         type: integer
   *         required: false
   *       - name: limit
   *         description: limit
   *         in: query
   *         type: integer
   *         required: false
   *     responses:
   *       200:
   *         description: Returns success message
   */

  async listPress(req, res, next) {
    const validationSchema = {
      search: Joi.string().optional(),
      fromDate: Joi.string().optional(),
      toDate: Joi.string().optional(),
      page: Joi.number().optional(),
      limit: Joi.number().optional(),
    };
    try {
      const validatedBody = await Joi.validate(req.query, validationSchema);
      let dataResults = await paginatePressList(validatedBody);
      if (dataResults.docs.length == 0) {
        throw apiError.notFound(responseMessage.DATA_NOT_FOUND);
      }
      return res.json(new response(dataResults, responseMessage.DATA_FOUND));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /admin/viewPress:
   *   get:
   *     tags:
   *       - PRESS MANAGEMENT
   *     description: viewPress
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: _id
   *         description: _id
   *         in: query
   *         required: true
   *     responses:
   *       200:
   *         description: Returns success message
   */

  async viewPress(req, res, next) {
    const validationSchema = {
      _id: Joi.string().required(),
    };
    try {
      var validatedBody = await Joi.validate(req.query, validationSchema);
      var feeResult = await findPress({
        _id: validatedBody._id,
        status: { $ne: status.DELETE },
      });
      if (!feeResult) {
        throw apiError.conflict(responseMessage.DATA_NOT_FOUND);
      }
      return res.json(new response(feeResult, responseMessage.DETAILS_FETCHED));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /admin/deletePress:
   *   delete:
   *     tags:
   *       - PRESS MANAGEMENT
   *     description: deletePress
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

  async deletePress(req, res, next) {
    const validationSchema = {
      _id: Joi.string().required(),
    };
    try {
      let validatedBody = await Joi.validate(req.query, validationSchema);
      let admin = await findUser({
        _id: req.userId,
        userType: { $in: [userType.ADMIN, userType.SUB_ADMIN] },
        status: status.ACTIVE,
      });
      if (!admin) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      let result = await findPress({
        _id: validatedBody._id,
        status: { $ne: status.DELETE },
      });
      if (!result) {
        throw apiError.notFound(responseMessage.DATA_NOT_FOUND);
      }
      let update = await updatePress(
        { _id: result._id },
        { $set: { status: status.DELETE } }
      );
      return res.json(new response(update, responseMessage.DELETE_SUCCESS));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /admin/activeDeactivePress:
   *   put:
   *     tags:
   *       - PRESS MANAGEMENT
   *     description: activeDeactivePress
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: admin token
   *         in: header
   *         required: true
   *       - name: _id
   *         description: _id
   *         in: query
   *         required: true
   *     responses:
   *       200:
   *         description: activeDeactivePress Sueccessfully.
   *       404:
   *         description: Data not Found.
   *       500:
   *         description: Internal server error.
   *       501:
   *         description: Something went wrong.
   */
  async activeDeactivePress(req, res, next) {
    const validateSchema = {
      _id: Joi.string().required(),
    };
    try {
      const validatedBody = await Joi.validate(req.query, validateSchema);
      let adminResult = await findUser({
        _id: req.userId,
        userType: { $in: [userType.ADMIN, userType.SUB_ADMIN] },
      });
      if (!adminResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      let pressInfo = await findPress({ _id: validatedBody._id });
      if (!pressInfo) {
        throw apiError.notFound(responseMessage.DATA_NOT_FOUND);
      }
      if (pressInfo.status == status.ACTIVE) {
        let blockRes = await updatePress(
          { _id: pressInfo._id },
          { $set: { status: status.BLOCK } }
        );
        return res.json(new response(blockRes, "Deactivate press details ."));
      }
      if (pressInfo.status == status.BLOCK) {
        let activeRes = await updatePress(
          { _id: pressInfo._id },
          { $set: { status: status.ACTIVE } }
        );
        return res.json(new response(activeRes, "Press activated ."));
      }
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /admin/addPartner:
   *   post:
   *     tags:
   *       - PARTNER MANAGEMENT
   *     description: addPartner
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: token
   *         in: header
   *         required: true
   *       - name: name
   *         description: name
   *         in: formData
   *         required: true
   *       - name: description
   *         description: description
   *         in: formData
   *         required: true
   *       - name: logo
   *         description: logo
   *         in: formData
   *         type: file
   *         required: true
   *     responses:
   *       200:
   *         description: Returns success message
   */

  async addPartner(req, res, next) {
    const validationSchema = {
      name: Joi.string().required(),
      description: Joi.string().required(),
      logo: Joi.array().items(Joi.string().required()),
    };
    try {
      const validatedBody = await Joi.validate(req.body, validationSchema);
      let admin = await findUser({
        _id: req.userId,
        userType: { $in: [userType.ADMIN, userType.SUB_ADMIN] },
        status: status.ACTIVE,
      });
      if (!admin) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      var press = await findPartner({
        name: validatedBody.name,
        status: { $ne: status.DELETE },
      });
      if (press) {
        throw apiError.conflict(responseMessage.PARTNER_EXIST);
      }
      validatedBody.logo = await commonFunction.getImageUrl(req.files);
      var result = await createPartner(validatedBody);
      return res.json(new response(result, responseMessage.PARTNER_SAVE));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /admin/editPartner:
   *   put:
   *     tags:
   *       - PARTNER MANAGEMENT
   *     description: editPartner
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
   *       - name: name
   *         description: name
   *         in: formData
   *         required: false
   *       - name: description
   *         description: description
   *         in: formData
   *         required: false
   *       - name: logo
   *         description: logo
   *         in: formData
   *         type: file
   *         required: false
   *     responses:
   *       200:
   *         description: Returns success message
   */
  async editPartner(req, res, next) {
    const validationSchema = {
      name: Joi.string().optional(),
      description: Joi.string().optional(),
      logo: Joi.array().items(Joi.string().optional()),
    };
    try {
      const validatedBody = await Joi.validate(req.body, validationSchema);
      let admin = await findUser({
        _id: req.userId,
        userType: { $in: [userType.ADMIN, userType.SUB_ADMIN] },
        status: status.ACTIVE,
      });
      if (!admin) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      var press = await findPartner({
        _id: req.query._id,
        status: { $ne: status.DELETE },
      });
      if (!press) {
        throw apiError.notFound(responseMessage.DATA_NOT_FOUND);
      } else {
        if (req.files) {
          validatedBody.logo = await commonFunction.getImageUrl(req.files);
        }
        var update = await updatePartner(
          { _id: press._id },
          { $set: validatedBody }
        );
        return res.json(new response(update, responseMessage.UPDATE_SUCCESS));
      }
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /admin/listPartner:
   *   get:
   *     tags:
   *       - PARTNER MANAGEMENT
   *     description: listPartner
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: search
   *         description: search by name
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
   *       - name: page
   *         description: page
   *         in: query
   *         type: integer
   *         required: false
   *       - name: limit
   *         description: limit
   *         in: query
   *         type: integer
   *         required: false
   *     responses:
   *       200:
   *         description: Returns success message
   */

  async listPartner(req, res, next) {
    const validationSchema = {
      search: Joi.string().optional(),
      fromDate: Joi.string().optional(),
      toDate: Joi.string().optional(),
      page: Joi.number().optional(),
      limit: Joi.number().optional(),
    };
    try {
      const validatedBody = await Joi.validate(req.query, validationSchema);
      let dataResults = await paginatePartnerList(validatedBody);
      if (dataResults.docs.length == 0) {
        throw apiError.notFound(responseMessage.DATA_NOT_FOUND);
      }
      return res.json(new response(dataResults, responseMessage.DATA_FOUND));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /admin/viewPartner:
   *   get:
   *     tags:
   *       - PARTNER MANAGEMENT
   *     description: viewPartner
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: _id
   *         description: _id
   *         in: query
   *         required: true
   *     responses:
   *       200:
   *         description: Returns success message
   */

  async viewPartner(req, res, next) {
    const validationSchema = {
      _id: Joi.string().required(),
    };
    try {
      var validatedBody = await Joi.validate(req.query, validationSchema);
      var result = await findPartner({
        _id: validatedBody._id,
        status: { $ne: status.DELETE },
      });
      if (!result) {
        throw apiError.conflict(responseMessage.DATA_NOT_FOUND);
      }
      return res.json(new response(result, responseMessage.DETAILS_FETCHED));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /admin/deletePartner:
   *   delete:
   *     tags:
   *       - PARTNER MANAGEMENT
   *     description: deletePartner
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

  async deletePartner(req, res, next) {
    const validationSchema = {
      _id: Joi.string().required(),
    };
    try {
      let validatedBody = await Joi.validate(req.query, validationSchema);
      let admin = await findUser({
        _id: req.userId,
        userType: { $in: [userType.ADMIN, userType.SUB_ADMIN] },
        status: status.ACTIVE,
      });
      if (!admin) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      let result = await findPartner({
        _id: validatedBody._id,
        status: { $ne: status.DELETE },
      });
      if (!result) {
        throw apiError.notFound(responseMessage.DATA_NOT_FOUND);
      }
      let update = await updatePartner(
        { _id: result._id },
        { $set: { status: status.DELETE } }
      );
      return res.json(new response(update, responseMessage.DELETE_SUCCESS));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /admin/activeDeactivePartner:
   *   put:
   *     tags:
   *       - PARTNER MANAGEMENT
   *     description: activeDeactivePartner
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: admin token
   *         in: header
   *         required: true
   *       - name: _id
   *         description: _id
   *         in: query
   *         required: true
   *     responses:
   *       200:
   *         description: activeDeactivePartner Sueccessfully.
   *       404:
   *         description: Data not Found.
   *       500:
   *         description: Internal server error.
   *       501:
   *         description: Something went wrong.
   */
  async activeDeactivePartner(req, res, next) {
    const validateSchema = {
      _id: Joi.string().required(),
    };
    try {
      const validatedBody = await Joi.validate(req.query, validateSchema);
      let adminResult = await findUser({
        _id: req.userId,
        userType: { $in: [userType.ADMIN, userType.SUB_ADMIN] },
      });
      if (!adminResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      let partnerInfo = await findPartner({ _id: validatedBody._id });
      if (!partnerInfo) {
        throw apiError.notFound(responseMessage.DATA_NOT_FOUND);
      }
      if (partnerInfo.status == status.ACTIVE) {
        let blockRes = await updatePartner(
          { _id: partnerInfo._id },
          { $set: { status: status.BLOCK } }
        );
        return res.json(
          new response(blockRes, "Deactivate partner successfully .")
        );
      }
      if (partnerInfo.status == status.BLOCK) {
        let activeRes = await updatePartner(
          { _id: partnerInfo._id },
          { $set: { status: status.ACTIVE } }
        );
        return res.json(
          new response(activeRes, "Partner activated successfully .")
        );
      }
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /admin/addAdvertisement:
   *   post:
   *     tags:
   *       - ADVERTISEMENT MANAGEMENT
   *     description: addAdvertisement
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
   *         required: true
   *       - name: startDate
   *         description: startDate
   *         in: formData
   *         required: true
   *       - name: endDate
   *         description: endDate
   *         in: formData
   *         required: true
   *       - name: url
   *         description: url
   *         in: formData
   *         required: false
   *       - name: mediaType
   *         description: mediaType-image/video
   *         in: formData
   *         required: true
   *       - name: image
   *         description: image
   *         in: formData
   *         type: file
   *         required: true
   *     responses:
   *       200:
   *         description: Data Saved.
   *       409:
   *         description: Already exist.
   *       401:
   *         description: Unauthorized token.
   *       500:
   *         description: Internal server error.
   *       501:
   *         description: Something went wrong.
   */
  async addAdvertisement(req, res, next) {
    const validSchema = {
      title: Joi.string().required(),
      startDate: Joi.string().required(),
      endDate: Joi.string().required(),
      url: Joi.string().allow("").optional(),
      mediaType: Joi.string().valid("image", "video").required(),
      image: Joi.array().items(Joi.string().required()),
    };
    try {
      const validBody = await Joi.validate(req.body, validSchema);
      let admin = await findUser({
        _id: req.userId,
        userType: { $in: [userType.ADMIN, userType.SUB_ADMIN] },
      });
      if (!admin) {
        throw apiError.invalid(responseMessage.USER_NOT_FOUND);
      }
      let find = await findAdvertisement({
        title: validBody.title,
        status: status.ACTIVE,
      });
      if (find) {
        throw apiError.conflict(responseMessage.ALREADY_EXITS);
      }
      let obj = {
        title: validBody.title,
        image: await commonFunction.getImageUrl(req.files),
        startDate: validBody.startDate,
        endDate: validBody.endDate,
        mediaType: validBody.mediaType,
        url: validBody.url,
      };
      let save = await createAdvertisement(obj);
      return res.json(new response(save, responseMessage.ADVERTISEMENT_ADD));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /admin/viewAdvertisement:
   *   get:
   *     tags:
   *       - ADVERTISEMENT MANAGEMENT
   *     description: viewAdvertisement
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: _id
   *         description: _id of advertisement
   *         in: query
   *         required: true
   *     responses:
   *       200:
   *         description: Data Found.
   *       404:
   *         description: Data not Found.
   *       500:
   *         description: Internal server error.
   *       501:
   *         description: Something went wrong.
   */
  async viewAdvertisement(req, res, next) {
    const validSchema = {
      _id: Joi.string().required(),
    };
    try {
      const { _id } = await Joi.validate(req.query, validSchema);
      let find = await findAdvertisement({
        _id: _id,
        status: { $ne: status.DELETE },
      });
      if (!find) {
        throw apiError.notFound(responseMessage.DATA_NOT_FOUND);
      }
      return res.json(new response(find, responseMessage.DATA_FOUND));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /admin/editAdvertisement:
   *   put:
   *     tags:
   *       - ADVERTISEMENT MANAGEMENT
   *     description: editAdvertisement
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
   *       - name: title
   *         description: title
   *         in: formData
   *         required: false
   *       - name: startDate
   *         description: startDate
   *         in: formData
   *         required: false
   *       - name: endDate
   *         description: endDate
   *         in: formData
   *         required: false
   *       - name: url
   *         description: url
   *         in: formData
   *         required: false
   *       - name: mediaType
   *         description: mediaType-image/video
   *         in: formData
   *         required: false
   *       - name: image
   *         description: image
   *         in: formData
   *         type: file
   *         required: false
   *     responses:
   *       200:
   *         description: Update sucdess.
   *       404:
   *         description: Data not Found.
   *       401:
   *         description: Unauthorized token.
   *       500:
   *         description: Internal server error.
   *       501:
   *         description: Something went wrong.
   */
  async editAdvertisement(req, res, next) {
    const validSchema = {
      title: Joi.string().optional(),
      image: Joi.array().items(Joi.string().optional()),
      startDate: Joi.string().optional(),
      endDate: Joi.string().optional(),
      mediaType: Joi.string().valid("image", "video").optional(),
      url: Joi.string().optional(),
    };
    try {
      const validBody = await Joi.validate(req.body, validSchema);
      let admin = await findUser({
        _id: req.userId,
        userType: { $in: [userType.ADMIN, userType.SUB_ADMIN] },
      });
      if (!admin) {
        throw apiError.invalid(responseMessage.UNAUTHORIZED);
      }
      let data = await findAdvertisement({
        _id: req.query._id,
        status: { $ne: status.DELETE },
      });
      if (!data) {
        throw apiError.notFound(responseMessage.DATA_NOT_FOUND);
      }
      if (req.files.length != 0) {
        validBody.image = await commonFunction.getImageUrl(req.files);
      }
      let update = await updateAdvertisementById(
        { _id: data._id },
        { $set: validBody }
      );
      return res.json(new response(update, responseMessage.UPDATE_SUCCESS));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /admin/removeAdvertisement:
   *   delete:
   *     tags:
   *       - ADVERTISEMENT MANAGEMENT
   *     description: removeAdvertisement
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: admin token
   *         in: header
   *         required: true
   *       - name: _id
   *         description: _id of advertisement
   *         in: query
   *         required: true
   *     responses:
   *       200:
   *         description: Banner is Removed.
   *       404:
   *         description: Data not Found.
   *       401:
   *         description: Unauthorized token.
   *       500:
   *         description: Internal server error.
   *       501:
   *         description: Something went wrong.
   */
  async removeAdvertisement(req, res, next) {
    const validSchema = {
      _id: Joi.string().required(),
    };
    try {
      const { _id } = await Joi.validate(req.query, validSchema);
      let admin = await findUser({
        _id: req.userId,
        userType: { $in: [userType.ADMIN, userType.SUB_ADMIN] },
      });
      if (!admin) {
        throw apiError.invalid(responseMessage.INVALID_USER);
      }
      let data = await findAdvertisement({
        _id: _id,
        status: { $ne: status.DELETE },
      });
      if (!data) {
        throw apiError.notFound(responseMessage.DATA_NOT_FOUND);
      }
      let result = await updateAdvertisementById(
        { _id: data._id },
        { $set: { status: status.DELETE } }
      );
      return res.json(new response(result, responseMessage.DELETE_SUCCESS));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /admin/listAdvertisement:
   *   get:
   *     tags:
   *       - ADVERTISEMENT MANAGEMENT
   *     description: listAdvertisement
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: admin token
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
   *       401:
   *         description: Unauthorized token.
   *       500:
   *         description: Internal server error.
   *       501:
   *         description: Something went wrong.
   */
  async listAdvertisement(req, res, next) {
    const validationSchema = {
      page: Joi.number().optional(),
      limit: Joi.number().optional(),
    };
    try {
      const validatedBody = await Joi.validate(req.query, validationSchema);
      let adminResult = await findUser({
        _id: req.userId,
        userType: { $in: [userType.ADMIN, userType.SUB_ADMIN] },
      });
      if (!adminResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      var result = await paginateSearchAdvertisement(validatedBody);
      if (!result) {
        throw apiError.notFound(responseMessage.DATA_NOT_FOUND);
      }
      return res.json(new response(result, responseMessage.DATA_FOUND));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /admin/activeDeactiveAdvertisement:
   *   put:
   *     tags:
   *       - ADVERTISEMENT MANAGEMENT
   *     description: activeDeactiveAdvertisement
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: admin token
   *         in: header
   *         required: true
   *       - name: _id
   *         description: _id of banner
   *         in: query
   *         required: true
   *     responses:
   *       200:
   *         description: Banner has been active/deactive banner .
   *       404:
   *         description: Data not Found.
   *       401:
   *         description: Unauthorized token.
   *       500:
   *         description: Internal server error.
   *       501:
   *         description: Something went wrong.
   */
  async activeDeactiveAdvertisement(req, res, next) {
    const validSchema = {
      _id: Joi.string().required(),
    };
    try {
      const { _id } = await Joi.validate(req.query, validSchema);
      let admin = await findUser({
        _id: req.userId,
        userType: { $in: [userType.ADMIN, userType.SUB_ADMIN] },
      });
      if (!admin) {
        throw apiError.invalid(responseMessage.USER_NOT_FOUND);
      }
      let advertisement = await findAdvertisement({ _id: _id });
      if (!advertisement) {
        throw apiError.notFound(responseMessage.DATA_NOT_FOUND);
      } else if (advertisement.status == status.ACTIVE) {
        let set = await updateAdvertisementById(
          { _id: advertisement._id },
          { $set: { status: status.BLOCK } }
        );
        return res.json(
          new response(set, "Advertisement deactivated successfully .")
        );
      } else {
        let set = await updateAdvertisementById(
          { _id: advertisement._id },
          { $set: { status: status.ACTIVE } }
        );
        return res.json(
          new response(set, "Advertisement activated successfully .")
        );
      }
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /admin/viewSocial:
   *   get:
   *     tags:
   *       - SOCIAL MANAGEMENT
   *     description: viewSocial
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: title
   *         description: title-Facebook/Twitter/Youtube/Telegram/Medium
   *         in: query
   *         required: true
   *     responses:
   *       200:
   *         description: Data Found.
   *       404:
   *         description: Data not Found.
   *       500:
   *         description: Internal server error.
   *       501:
   *         description: Something went wrong.
   */
  async viewSocial(req, res, next) {
    const validSchema = {
      title: Joi.string().required(),
    };
    try {
      const { title } = await Joi.validate(req.query, validSchema);
      let find = await findSocial({
        title: title,
        status: { $ne: status.DELETE },
      });
      if (!find) {
        throw apiError.notFound(responseMessage.DATA_NOT_FOUND);
      }
      return res.json(new response(find, responseMessage.VIEW_SOCIAL));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /admin/editSocial:
   *   put:
   *     tags:
   *       - SOCIAL MANAGEMENT
   *     description: editSocial
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: token
   *         in: header
   *         required: true
   *       - name: socialId
   *         description: socialId
   *         in: formData
   *         required: true
   *       - name: link
   *         description: link
   *         in: formData
   *         required: false
   *     responses:
   *       200:
   *         description: Update sucdess.
   *       404:
   *         description: Data not Found.
   *       401:
   *         description: Unauthorized token.
   *       500:
   *         description: Internal server error.
   *       501:
   *         description: Something went wrong.
   */
  async editSocial(req, res, next) {
    const validSchema = {
      socialId: Joi.string().required(),
      link: Joi.string().optional(),
    };
    try {
      const { socialId, link } = await Joi.validate(req.body, validSchema);
      let admin = await findUser({
        _id: req.userId,
        userType: { $in: [userType.ADMIN, userType.SUB_ADMIN] },
      });
      if (!admin) {
        throw apiError.invalid(responseMessage.USER_NOT_FOUND);
      }
      let data = await findSocial({
        _id: socialId,
        status: { $ne: status.DELETE },
      });
      if (!data) {
        throw apiError.notFound(responseMessage.DATA_NOT_FOUND);
      }
      let update = await updateSocialById(
        { _id: data._id },
        { $set: { link: link } }
      );
      return res.json(new response(update, responseMessage.UPDATE_SUCCESS));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /admin/listSocial:
   *   get:
   *     tags:
   *       - SOCIAL MANAGEMENT
   *     description: listSocial
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Data found sucessfully.
   *       404:
   *         description: Data not Found.
   *       401:
   *         description: Unauthorized token.
   *       500:
   *         description: Internal server error.
   *       501:
   *         description: Something went wrong.
   */
  async listSocial(req, res, next) {
    try {
      var result = await findAllSocial();
      return res.json(new response(result, responseMessage.DATA_FOUND));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /admin/addLogo:
   *   post:
   *     tags:
   *       - LOGO MANAGEMENT
   *     description: addLogo
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: token
   *         in: header
   *         required: true
   *       - name: logoTitle
   *         description: logoTitle
   *         in: formData
   *         required: true
   *       - name: logoImage
   *         description: logoImage
   *         in: formData
   *         type: file
   *         required: true
   *     responses:
   *       200:
   *         description: Data Saved.
   *       409:
   *         description: Already exist.
   *       401:
   *         description: Unauthorized token.
   *       500:
   *         description: Internal server error.
   *       501:
   *         description: Something went wrong.
   */
  async addLogo(req, res, next) {
    const validSchema = {
      logoTitle: Joi.string().required(),
      logoImage: Joi.array().items(Joi.string().required()),
    };
    try {
      const validatedBody = await Joi.validate(req.body, validSchema);
      let admin = await findUser({
        _id: req.userId,
        userType: { $in: [userType.ADMIN, userType.SUB_ADMIN] },
      });
      if (!admin) {
        throw apiError.invalid(responseMessage.UNAUTHORIZED);
      } else {
        let find = await findLogo({
          logoTitle: validatedBody.logoTitle,
          status: status.ACTIVE,
        });
        if (find) {
          throw apiError.conflict(responseMessage.ALREADY_EXITS);
        }
        let obj = {
          logoTitle: validatedBody.logoTitle,
          logoImage: await commonFunction.getImageUrl(req.files),
        };
        let saveResult = await createLogo(obj);
        return res.json(new response(saveResult, responseMessage.ADD_LOGO));
      }
    } catch (error) {
      return next(error);
    }
  }
  /**
   * @swagger
   * /admin/viewLogo:
   *   get:
   *     tags:
   *       - LOGO MANAGEMENT
   *     description: viewLogo
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: _id
   *         description: _id of logo
   *         in: query
   *         required: true
   *     responses:
   *       200:
   *         description: Data Found.
   *       404:
   *         description: Data not Found.
   *       500:
   *         description: Internal server error.
   *       501:
   *         description: Something went wrong .
   */
  async viewLogo(req, res, next) {
    const validateSchema = {
      _id: Joi.string().required(),
    };
    try {
      const validatedBody = await Joi.validate(req.query, validateSchema);
      let find = await findLogo({
        _id: validatedBody._id,
        status: { $ne: status.DELETE },
      });
      if (!find) {
        throw apiError.notFound(responseMessage.DATA_NOT_FOUND);
      }
      return res.json(new response(find, responseMessage.VIEW_LOGO));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /admin/editLogo:
   *   put:
   *     tags:
   *       - LOGO MANAGEMENT
   *     description: editLogo
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
   *       - name: logoTitle
   *         description: logoTitle
   *         in: formData
   *         required: false
   *       - name: logoImage
   *         description: logoImage
   *         in: formData
   *         type: file
   *         required: false
   *     responses:
   *       200:
   *         description: Data Update Successfully.
   *       404:
   *         description: Data not Found.
   *       500:
   *         description: Internal server error.
   *       501:
   *         description: Something went wrong.
   */
  async editLogo(req, res, next) {
    const validateSchema = {
      logoTitle: Joi.string().optional(),
      logoImage: Joi.array().items(Joi.string().optional()),
    };
    try {
      const validatedBody = await Joi.validate(req.body, validateSchema);
      let adminRes = await findUser({
        _id: req.userId,
        userType: { $in: [userType.ADMIN, userType.SUB_ADMIN] },
      });
      if (!adminRes) {
        throw apiError.invalid(responseMessage.UNAUTHORIZED);
      }
      let data = await findLogo({
        _id: req.query._id,
        status: { $ne: status.DELETE },
      });
      if (!data) {
        throw apiError.notFound(responseMessage.DATA_NOT_FOUND);
      } else {
        if (req.files) {
          validatedBody.logoImage = await commonFunction.getImageUrl(req.files);
        }
        let update = await updateLogoById(
          { _id: data._id },
          { $set: validatedBody }
        );
        return res.json(new response(update, responseMessage.EDIT_LOGO));
      }
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /admin/deleteLogo:
   *   delete:
   *     tags:
   *       - LOGO MANAGEMENT
   *     description: deleteLogo
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: admin token
   *         in: header
   *         required: true
   *       - name: _id
   *         description: _id of Logo
   *         in: query
   *         required: true
   *     responses:
   *       200:
   *         description: Logo is Deleted.
   *       404:
   *         description: Data not Found.
   *       500:
   *         description: Internal server error .
   *       501:
   *         description: Something went wrong.
   */
  async deleteLogo(req, res, next) {
    const validateSchema = {
      _id: Joi.string().required(),
    };
    try {
      const validatedBody = await Joi.validate(req.query, validateSchema);
      let admin = await findUser({
        _id: req.userId,
        userType: { $in: [userType.ADMIN, userType.SUB_ADMIN] },
      });
      if (!admin) {
        throw apiError.invalid(responseMessage.UNAUTHORIZED);
      }
      let result = await findLogo({
        _id: validatedBody._id,
        status: { $ne: status.DELETE },
      });
      if (!result) {
        throw apiError.notFound(responseMessage.DATA_NOT_FOUND);
      }
      let updateRes = await updateLogoById(
        { _id: result._id },
        { status: status.DELETE }
      );
      return res.json(new response(updateRes, responseMessage.DELETE_LOGO));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /admin/listLogo:
   *   get:
   *     tags:
   *       - LOGO MANAGEMENT
   *     description: listLogo
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Data found sucessfully.
   *       404:
   *         description: Data not Found.
   *       500:
   *         description: Internal server error.
   *       501:
   *         description: Something went wrong.
   */
  async listLogo(req, res, next) {
    try {
      var result = await logoList(req.body);
      if (result.length == 0) {
        throw apiError.notFound(responseMessage.DATA_NOT_FOUND);
      }
      return res.json(new response(result, responseMessage.DATA_FOUND));
    } catch (error) {
      return next(error);
    }
  }
  // /**
  //   * @swagger
  //   * /admin/donationTransactionlist:
  //   *   get:
  //   *     tags:
  //   *       - TRANSACTION MANAGEMENT
  //   *     description: donationTransactionlist
  //   *     produces:
  //   *       - application/json
  //   *     parameters:
  //   *       - name: token
  //   *         description: token
  //   *         in: header
  //   *         required: true
  //   *     responses:
  //   *       200:
  //   *         description: Data found sucessfully.
  //   *       404:
  //   *         description: Data not Found.
  //   *       501:
  //   *         description: Something went wrong.
  //   */
  async donationTransactionlist(req, res, next) {
    try {
      var userResult = await findUser({
        _id: req.userId,
        userType: { $in: [userType.ADMIN, userType.SUB_ADMIN] },
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
   * /admin/viewTransaction/{_id}:
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
        userType: { $in: [userType.ADMIN, userType.SUB_ADMIN] },
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
   * /admin/subscriptionListOfParticular:
   *   get:
   *     tags:
   *       - ADMIN
   *     description: subscriptionListOfParticular
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: admin token
   *         in: header
   *         required: true
   *       - name: userId
   *         description: userId
   *         in: query
   *         required: true
   *     responses:
   *       200:
   *         description: Data found sucessfully.
   *       404:
   *         description: Data not Found.
   *       500:
   *         description: Internal server error.
   *       501:
   *         description: Something went wrong.
   */
  async subscriptionListOfParticular(req, res, next) {
    try {
      let admin = await findUser({
        _id: req.userId,
        userType: { $in: [userType.ADMIN, userType.SUB_ADMIN] },
        status: status.ACTIVE,
      });
      if (!admin) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      let user = await findUser({
        _id: req.query.userId,
        status: status.ACTIVE,
        userType: { $ne: userType.ADMIN },
      });
      if (!user) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      } else {
        let details = await transactionList({ userId: user._id });
        if (details.length == 0) {
          throw apiError.notFound(responseMessage.DATA_NOT_FOUND);
        }
        return res.json(new response(details, responseMessage.DATA_FOUND));
      }
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /admin/viewSubscriptionOfParticular:
   *   get:
   *     tags:
   *       - ADMIN
   *     description: viewSubscriptionOfParticular
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: admin token
   *         in: header
   *         required: true
   *       - name: userId
   *         description: userId
   *         in: query
   *         required: true
   *     responses:
   *       200:
   *         description: Data found sucessfully.
   *       404:
   *         description: Data not Found.
   *       500:
   *         description: Internal server error.
   *       501:
   *         description: Something went wrong.
   */
  async viewSubscriptionOfParticular(req, res, next) {
    try {
      let admin = await findUser({
        _id: req.userId,
        userType: { $in: [userType.ADMIN, userType.SUB_ADMIN] },
        status: status.ACTIVE,
      });
      if (!admin) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      let user = await findTransaction({
        userId: req.query.userId,
        status: status.ACTIVE,
        userType: { $ne: userType.ADMIN },
      });
      if (!user) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      } else {
        return res.json(new response({}, responseMessage.DATA_FOUND));
      }
    } catch (error) {
      return next(error);
    }
  }

  // /**
  //  * @swagger
  //  * /admin/viewDepositeTransaction/{_id}:
  //  *   get:
  //  *     tags:
  //  *       - TRANSACTION MANAGEMENT
  //  *     description: viewDepositeTransaction
  //  *     produces:
  //  *       - application/json
  //  *     parameters:
  //  *       - name: token
  //  *         description: token
  //  *         in: header
  //  *         required: true
  //  *       - name: _id
  //  *         description: _id
  //  *         in: path
  //  *         required: true
  //  *     responses:
  //  *       200:
  //  *         description: Returns success message
  //  */
  async viewDepositeTransaction(req, res, next) {
    const validationSchema = {
      _id: Joi.string().required(),
    };
    try {
      const { _id } = await Joi.validate(req.params, validationSchema);
      var userResult = await findUser({
        _id: req.userId,
        userType: { $in: [userType.ADMIN, userType.SUB_ADMIN] },
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
   * /admin/transactionList:
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
   *       - name: userId
   *         description: userId
   *         in: query
   *         required: true
   *       - name: page
   *         description: page
   *         in: query
   *         required: false
   *       - name: limit
   *         description: limit
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
   *     responses:
   *       200:
   *         description: Returns success message
   */
  async transactionList(req, res, next) {
    const validationSchema = {
      userId: Joi.string().required(),
      fromDate: Joi.string().optional(),
      toDate: Joi.string().optional(),
      page: Joi.number().optional(),
      limit: Joi.number().optional(),
    };
    try {
      const validatedBody = await Joi.validate(req.query, validationSchema);
      let data;
      var userResult = await findUser({
        _id: req.userId,
        userType: { $in: [userType.ADMIN, userType.SUB_ADMIN] },
      });
      if (!userResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      data = await allTransactions(validatedBody);
      return res.json(new response(data, responseMessage.DETAILS_FETCHED));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /admin/subAdmin:
   *   post:
   *     tags:
   *       - ADMIN
   *     description: addSubAdmin
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: token
   *         in: header
   *         required: true
   *       - name: addSubAdmin
   *         description: addSubAdmin
   *         in: body
   *         required: true
   *         schema:
   *           $ref: '#/definitions/addSubAdmin'
   *     responses:
   *       200:
   *         description: Returns success message
   */

  async addSubAdmin(req, res, next) {
    const validationSchema = {
      name: Joi.string().required(),
      email: Joi.string().required(),
      password: Joi.string().required(),
      permissions: Joi.object()
        .keys({
          dashboard: Joi.boolean().required(),
          userManagement: Joi.boolean().required(),
          subAdminManagement: Joi.boolean().required(),
          settingsManagement: Joi.boolean().required(),
          bannerManagement: Joi.boolean().required(),
          referralManagement: Joi.boolean().required(),
          staticManagement: Joi.boolean().required(),
        })
        .required(),
    };
    try {
      const { email, name, password, permissions } = await Joi.validate(
        req.body,
        validationSchema
      );
      var userResult = await findUser({
        _id: req.userId,
        userType: userType.ADMIN,
      });
      if (!userResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      var emailResult = await findUser({
        email: email,
        status: { $ne: status.DELETE },
      });
      if (emailResult) {
        throw apiError.conflict(responseMessage.EMAIL_EXIST);
      }
      var obj = {
        name: name,
        email: email,
        password: bcrypt.hashSync(password),
        userType: userType.SUB_ADMIN,
        permissions: permissions,
      };
      await commonFunction.subAdminMail(email, name, password);
      var result = await createUser(obj);
      return res.json(new response(result, responseMessage.SUBADMIN_CREATED));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /admin/subAdmin/{_id}:
   *   get:
   *     tags:
   *       - ADMIN
   *     description: viewSubAdmin
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

  async viewSubAdmin(req, res, next) {
    const validationSchema = {
      _id: Joi.string().required(),
    };
    try {
      const { _id } = await Joi.validate(req.params, validationSchema);
      var userResult = await findUser({
        _id: req.userId,
        userType: { $in: [userType.ADMIN, userType.SUB_ADMIN] },
      });
      if (!userResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      var result = await findUser({ _id: _id, status: { $ne: status.DELETE } });
      return res.json(new response(result, responseMessage.DETAILS_FETCHED));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /admin/subAdmin:
   *   put:
   *     tags:
   *       - ADMIN
   *     description: editSubAdmin
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: token
   *         in: header
   *         required: true
   *       - name: editSubAdmin
   *         description: editSubAdmin
   *         in: body
   *         required: true
   *         schema:
   *           $ref: '#/definitions/editSubAdmin'
   *     responses:
   *       200:
   *         description: Returns success message
   */

  async editSubAdmin(req, res, next) {
    const validationSchema = {
      _id: Joi.string().required(),
      name: Joi.string().optional(),
      email: Joi.string().optional(),
      password: Joi.string().optional(),
      permissions: Joi.object()
        .keys({
          dashboard: Joi.boolean().required(),
          userManagement: Joi.boolean().required(),
          subAdminManagement: Joi.boolean().required(),
          settingsManagement: Joi.boolean().required(),
          bannerManagement: Joi.boolean().required(),
          referralManagement: Joi.boolean().required(),
          staticManagement: Joi.boolean().required(),
        })
        .optional(),
    };
    try {
      const validatedBody = await Joi.validate(req.body, validationSchema);
      var emailResult;
      var userResult = await findUser({
        _id: req.userId,
        userType: { $in: [userType.ADMIN, userType.SUB_ADMIN] },
      });
      if (!userResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      var subAdminResult = await findUser({
        _id: validatedBody._id,
        status: status.ACTIVE,
      });
      if (!subAdminResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      if (validatedBody.email) {
        emailResult = await findUser({
          email: validatedBody.email,
          status: { $ne: status.DELETE },
          _id: { $ne: subAdminResult._id },
        });
        if (emailResult) {
          throw apiError.conflict(responseMessage.EMAIL_EXIST);
        }
      }
      var result = await updateUser({ _id: subAdminResult._id }, validatedBody);
      return res.json(new response(result, responseMessage.UPDATE_SUCCESS));
    } catch (error) {
      console.error(error);
      return next(error);
    }
  }

  /**
   * @swagger
   * /admin/blockUnblockSubAdmin:
   *   patch:
   *     tags:
   *       - ADMIN
   *     description: blockUnblockSubAdmin
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: token
   *         in: header
   *         required: true
   *       - name: blockUnblockSubAdmin
   *         description: blockUnblockSubAdmin
   *         in: body
   *         required: true
   *         schema:
   *           $ref: '#/definitions/blockUnblockSubAdmin'
   *     responses:
   *       200:
   *         description: Returns success message
   */

  async blockUnblockSubAdmin(req, res, next) {
    const validationSchema = {
      _id: Joi.string().required(),
      status: Joi.string().valid(status.ACTIVE, status.BLOCK).required(),
    };
    try {
      const validatedBody = await Joi.validate(req.body, validationSchema);
      var userResult = await findUser({
        _id: req.userId,
        userType: { $in: [userType.ADMIN, userType.SUB_ADMIN] },
      });
      if (!userResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      var subResult = await findUser({
        _id: validatedBody._id,
        status: { $ne: status.DELETE },
      });
      if (!subResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      var result = await updateUser(
        { _id: subResult._id },
        { status: validatedBody.status }
      );
      return res.json(
        new response(
          result,
          validatedBody.status == status.BLOCK
            ? responseMessage.BLOCKED
            : responseMessage.UNBLOCKED
        )
      );
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /admin/subAdmin:
   *   delete:
   *     tags:
   *       - ADMIN
   *     description: deleteSubAdmin
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

  async deleteSubAdmin(req, res, next) {
    const validationSchema = {
      _id: Joi.string().required(),
    };
    try {
      const { _id } = await Joi.validate(req.query, validationSchema);
      var userResult = await findUser({
        _id: req.userId,
        userType: { $in: [userType.ADMIN, userType.SUB_ADMIN] },
      });
      if (!userResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      var subResult = await findUser({
        _id: _id,
        status: { $ne: status.DELETE },
      });
      if (!subResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      var result = await updateUser(
        { _id: subResult._id },
        { status: status.DELETE }
      );
      return res.json(new response(result, responseMessage.DELETE_SUCCESS));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /admin/subAdminList:
   *   get:
   *     tags:
   *       - ADMIN
   *     description: subAdminList
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
   *       - name: search
   *         description: search
   *         in: query
   *         required: false
   *     responses:
   *       200:
   *         description: Returns success message
   */

  async subAdminList(req, res, next) {
    const validationSchema = {
      page: Joi.number().optional(),
      limit: Joi.number().optional(),
      search: Joi.string().optional(),
    };
    try {
      const validatedBody = await Joi.validate(req.query, validationSchema);
      var userResult = await findUser({
        _id: req.userId,
        userType: { $in: [userType.ADMIN, userType.SUB_ADMIN] },
      });
      if (!userResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      var result = await listSubAdmin(validatedBody);
      return res.json(new response(result, responseMessage.DATA_FOUND));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /admin/referralSetting:
   *   get:
   *     tags:
   *       - ADMIN
   *     description: getReferralSetting
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

  async getReferralSetting(req, res, next) {
    try {
      var adminResult = await findUser({
        _id: req.userId,
        userType: { $in: [userType.ADMIN, userType.SUB_ADMIN] },
      });
      if (!adminResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      var result = await findReferral({ status: status.ACTIVE });
      return res.json(new response(result, responseMessage.DATA_FOUND));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /admin/referralSetting:
   *   put:
   *     tags:
   *       - ADMIN
   *     description: updateReferralSetting
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: token
   *         in: header
   *         required: true
   *       - name: updateReferralSetting
   *         description: updateReferralSetting
   *         in: body
   *         required: true
   *         schema:
   *           $ref: '#/definitions/updateReferralSetting'
   *     responses:
   *       200:
   *         description: Returns success message
   */

  async updateReferralSetting(req, res, next) {
    const validationSchema = {
      _id: Joi.string().required(),
      referralAmount: Joi.number().optional(),
      refereeAmount: Joi.number().optional(),
    };
    try {
      const { _id, referralAmount, refereeAmount } = await Joi.validate(
        req.body,
        validationSchema
      );
      var adminResult = await findUser({
        _id: req.userId,
        userType: { $in: [userType.ADMIN, userType.SUB_ADMIN] },
      });
      if (!adminResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      var result = await updateReferral(
        { _id: _id },
        {
          $set: {
            referralAmount: referralAmount,
            refereeAmount: refereeAmount,
          },
        }
      );
      return res.json(new response(result, responseMessage.UPDATE_SUCCESS));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /admin/banner:
   *   post:
   *     tags:
   *       - BANNER MANAGEMENT
   *     description: addBanner
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
   *         required: true
   *       - name: description
   *         description: description
   *         in: formData
   *         required: true
   *       - name: url
   *         description: url
   *         in: formData
   *         required: true
   *       - name: mediaType
   *         description: mediaType
   *         in: formData
   *         required: true
   *       - name: image
   *         description: image
   *         in: formData
   *         type: file
   *         required: true
   *     responses:
   *       200:
   *         description: Data Saved.
   *       409:
   *         description: Already exist.
   *       401:
   *         description: Unauthorized token.
   *       500:
   *         description: Internal server error.
   *       501:
   *         description: Something went wrong.
   */
  async addBanner(req, res, next) {
    const validSchema = {
      title: Joi.string().required(),
      description: Joi.string().required(),
      url: Joi.string().required(),
      mediaType: Joi.string().valid("image", "video").required(),
      image: Joi.array().items(Joi.string().required()),
    };
    try {
      const validBody = await Joi.validate(req.body, validSchema);
      let adminResult = await findUser({
        _id: req.userId,
        userType: { $in: [userType.ADMIN, userType.SUB_ADMIN] },
      });
      if (!adminResult) {
        throw apiError.invalid(responseMessage.USER_NOT_FOUND);
      }
      let bannerResult = await findBanner({
        title: validBody.title,
        status: status.ACTIVE,
      });
      if (bannerResult) {
        throw apiError.conflict(responseMessage.ALREADY_EXITS);
      }
      let obj = {
        title: validBody.title,
        url: validBody.url,
        mediaType: validBody.mediaType,
        image: await commonFunction.getImageUrl(req.files),
      };
      let result = await createBanner(obj);
      return res.json(new response(result, responseMessage.ADD_BANNER));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /admin/banner:
   *   get:
   *     tags:
   *       - BANNER MANAGEMENT
   *     description: viewBanner
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: _id
   *         description: _id of banner
   *         in: query
   *         required: true
   *     responses:
   *       200:
   *         description: Data Found.
   *       404:
   *         description: Data not Found.
   *       500:
   *         description: Internal server error.
   *       501:
   *         description: Something went wrong.
   */
  async viewBanner(req, res, next) {
    const validSchema = {
      _id: Joi.string().required(),
    };
    try {
      const { _id } = await Joi.validate(req.query, validSchema);
      let result = await findBanner({
        _id: _id,
        status: { $ne: status.DELETE },
      });
      if (!result) {
        throw apiError.notFound(responseMessage.DATA_NOT_FOUND);
      }
      return res.json(new response(result, responseMessage.DATA_FOUND));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /admin/banner:
   *   put:
   *     tags:
   *       - BANNER MANAGEMENT
   *     description: editBanner
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: token
   *         in: header
   *         required: true
   *       - name: _id
   *         description: _id
   *         in: formData
   *         required: true
   *       - name: title
   *         description: title
   *         in: formData
   *         required: false
   *       - name: description
   *         description: description
   *         in: formData
   *         required: false
   *       - name: url
   *         description: url
   *         in: formData
   *         required: false
   *       - name: mediaType
   *         description: mediaType
   *         in: formData
   *         required: false
   *       - name: image
   *         description: image
   *         in: formData
   *         type: file
   *         required: false
   *     responses:
   *       200:
   *         description: Update sucdess.
   *       404:
   *         description: Data not Found.
   *       401:
   *         description: Unauthorized token.
   *       500:
   *         description: Internal server error.
   *       501:
   *         description: Something went wrong.
   */
  async editBanner(req, res, next) {
    const validSchema = {
      _id: Joi.string().required(),
      description: Joi.string().optional(),
      title: Joi.string().optional(),
      url: Joi.string().optional(),
      mediaType: Joi.string().valid("image", "video").optional(),
      image: Joi.string().optional(),
    };
    try {
      const validBody = await Joi.validate(req.body, validSchema);
      let adminResult = await findUser({
        _id: req.userId,
        userType: { $in: [userType.ADMIN, userType.SUB_ADMIN] },
      });
      if (!adminResult) {
        throw apiError.invalid(responseMessage.USER_NOT_FOUND);
      }
      let bannerResult = await findBanner({
        _id: validBody._id,
        status: { $ne: status.DELETE },
      });
      if (!bannerResult) {
        throw apiError.notFound(responseMessage.DATA_NOT_FOUND);
      }
      if (req.files.length != 0) {
        validBody.image = await commonFunction.getImageUrl(req.files);
      }
      let result = await updateBanner(
        { _id: bannerResult._id },
        { $set: validBody }
      );
      return res.json(new response(result, responseMessage.UPDATE_SUCCESS));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /admin/banner:
   *   delete:
   *     tags:
   *       - BANNER MANAGEMENT
   *     description: deleteBanner
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: admin token
   *         in: header
   *         required: true
   *       - name: _id
   *         description: _id of banner
   *         in: query
   *         required: true
   *     responses:
   *       200:
   *         description: Successfully deleted.
   *       404:
   *         description: Data not Found.
   *       401:
   *         description: Unauthorized token.
   *       500:
   *         description: Internal server error.
   *       501:
   *         description: Something went wrong.
   */
  async deleteBanner(req, res, next) {
    const validSchema = {
      _id: Joi.string().required(),
    };
    try {
      const { _id } = await Joi.validate(req.query, validSchema);
      let adminResult = await findUser({
        _id: req.userId,
        userType: { $in: [userType.ADMIN, userType.SUB_ADMIN] },
      });
      if (!adminResult) {
        throw apiError.invalid(responseMessage.USER_NOT_FOUND);
      }
      let bannerResult = await findBanner({
        _id: _id,
        status: { $ne: status.DELETE },
      });
      if (!bannerResult) {
        throw apiError.notFound(responseMessage.DATA_NOT_FOUND);
      }
      let result = await updateBanner(
        { _id: bannerResult._id },
        { $set: { status: status.DELETE } }
      );
      return res.json(new response(result, responseMessage.DELETE_SUCCESS));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /admin/listBanner:
   *   get:
   *     tags:
   *       - BANNER MANAGEMENT
   *     description: listBanner
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: admin token
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
   *       401:
   *         description: Unauthorized token.
   *       500:
   *         description: Internal server error.
   *       501:
   *         description: Something went wrong.
   */
  async listBanner(req, res, next) {
    const validationSchema = {
      page: Joi.number().optional(),
      limit: Joi.number().optional(),
    };
    try {
      const validatedBody = await Joi.validate(req.query, validationSchema);
      let adminResult = await findUser({
        _id: req.userId,
        userType: { $in: [userType.ADMIN, userType.SUB_ADMIN] },
      });
      if (!adminResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      var result = await paginateSearchBanner(validatedBody);
      if (!result) {
        throw apiError.notFound(responseMessage.DATA_NOT_FOUND);
      }
      return res.json(new response(result, responseMessage.DATA_FOUND));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /admin/changeBannerStatus:
   *   patch:
   *     tags:
   *       - BANNER MANAGEMENT
   *     description: changeBannerStatus
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: token
   *         in: header
   *         required: true
   *       - name: changeBannerStatus
   *         description: changeBannerStatus
   *         in: body
   *         required: true
   *         schema:
   *           $ref: '#/definitions/blockUnblockSubAdmin'
   *     responses:
   *       200:
   *         description: Returns success message
   */

  async changeBannerStatus(req, res, next) {
    const validSchema = {
      _id: Joi.string().required(),
      status: Joi.string().valid(status.ACTIVE, status.BLOCK).required(),
    };
    try {
      const validatedBody = await Joi.validate(req.body, validSchema);
      let adminResult = await findUser({
        _id: req.userId,
        userType: { $in: [userType.ADMIN, userType.SUB_ADMIN] },
      });
      if (!adminResult) {
        throw apiError.invalid(responseMessage.USER_NOT_FOUND);
      }
      let bannerResult = await findBanner({
        _id: validatedBody._id,
        status: { $ne: status.DELETE },
      });
      if (!bannerResult) {
        throw apiError.notFound(responseMessage.DATA_NOT_FOUND);
      }
      var result = await updateBanner(
        { _id: bannerResult._id },
        { status: validatedBody.status }
      );
      return res.json(
        new response(
          result,
          validatedBody.status == status.BLOCK
            ? responseMessage.BLOCKED
            : responseMessage.UNBLOCKED
        )
      );
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /admin/video:
   *   post:
   *     tags:
   *       - VIDEO MANAGEMENT
   *     description: addVideo
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
   *         required: true
   *       - name: video
   *         description: video
   *         in: formData
   *         type: file
   *         required: true
   *     responses:
   *       200:
   *         description: Data Saved.
   *       409:
   *         description: Already exist.
   *       401:
   *         description: Unauthorized token.
   *       500:
   *         description: Internal server error.
   *       501:
   *         description: Something went wrong.
   */
  async addVideo(req, res, next) {
    const validSchema = {
      title: Joi.string().required(),
      video: Joi.array().items(Joi.string().required()),
    };
    try {
      const validBody = await Joi.validate(req.body, validSchema);
      let adminResult = await findUser({
        _id: req.userId,
        userType: { $in: [userType.ADMIN, userType.SUB_ADMIN] },
      });
      if (!adminResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      let videoResult = await findVideo({
        title: validBody.title,
        status: status.ACTIVE,
      });
      if (videoResult) {
        throw apiError.conflict(responseMessage.ALREADY_EXITS);
      }
      let obj = {
        title: validBody.title,
        video: await commonFunction.getImageUrl(req.files),
      };
      let result = await createVideo(obj);
      return res.json(new response(result, responseMessage.VIDEO_ADD));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /admin/video:
   *   get:
   *     tags:
   *       - VIDEO MANAGEMENT
   *     description: viewVideo
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: _id
   *         description: _id of video
   *         in: query
   *         required: true
   *     responses:
   *       200:
   *         description: Data Found.
   *       404:
   *         description: Data not Found.
   *       500:
   *         description: Internal server error.
   *       501:
   *         description: Something went wrong.
   */
  async viewVideo(req, res, next) {
    const validSchema = {
      _id: Joi.string().required(),
    };
    try {
      const { _id } = await Joi.validate(req.query, validSchema);
      let result = await findVideo({
        _id: _id,
        status: { $ne: status.DELETE },
      });
      if (!result) {
        throw apiError.notFound(responseMessage.DATA_NOT_FOUND);
      }
      return res.json(new response(result, responseMessage.DATA_FOUND));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /admin/video:
   *   put:
   *     tags:
   *       - VIDEO MANAGEMENT
   *     description: editVideo
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: token
   *         in: header
   *         required: true
   *       - name: _id
   *         description: _id
   *         in: formData
   *         required: true
   *       - name: title
   *         description: title
   *         in: formData
   *         required: false
   *       - name: video
   *         description: video
   *         in: formData
   *         type: file
   *         required: false
   *     responses:
   *       200:
   *         description: Update sucdess.
   *       404:
   *         description: Data not Found.
   *       401:
   *         description: Unauthorized token.
   *       500:
   *         description: Internal server error.
   *       501:
   *         description: Something went wrong.
   */
  async editVideo(req, res, next) {
    const validSchema = {
      _id: Joi.string().required(),
      title: Joi.string().optional(),
      video: Joi.string().optional(),
    };
    try {
      const validBody = await Joi.validate(req.body, validSchema);
      let adminResult = await findUser({
        _id: req.userId,
        userType: { $in: [userType.ADMIN, userType.SUB_ADMIN] },
      });
      if (!adminResult) {
        throw apiError.invalid(responseMessage.USER_NOT_FOUND);
      }
      let videoResult = await findVideo({
        _id: validBody._id,
        status: { $ne: status.DELETE },
      });
      if (!videoResult) {
        throw apiError.notFound(responseMessage.DATA_NOT_FOUND);
      }
      if (req.files) {
        validBody.video = await commonFunction.getImageUrl(req.files);
      }
      let result = await updateVideo(
        { _id: videoResult._id },
        { $set: validBody }
      );
      return res.json(new response(result, responseMessage.UPDATE_SUCCESS));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /admin/video:
   *   delete:
   *     tags:
   *       - VIDEO MANAGEMENT
   *     description: deleteVideo
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: admin token
   *         in: header
   *         required: true
   *       - name: _id
   *         description: _id of video
   *         in: query
   *         required: true
   *     responses:
   *       200:
   *         description: Successfully deleted.
   *       404:
   *         description: Data not Found.
   *       401:
   *         description: Unauthorized token.
   *       500:
   *         description: Internal server error.
   *       501:
   *         description: Something went wrong.
   */
  async deleteVideo(req, res, next) {
    const validSchema = {
      _id: Joi.string().required(),
    };
    try {
      const { _id } = await Joi.validate(req.query, validSchema);
      let adminResult = await findUser({
        _id: req.userId,
        userType: { $in: [userType.ADMIN, userType.SUB_ADMIN] },
      });
      if (!adminResult) {
        throw apiError.invalid(responseMessage.USER_NOT_FOUND);
      }
      let videoResult = await findVideo({
        _id: _id,
        status: { $ne: status.DELETE },
      });
      if (!videoResult) {
        throw apiError.notFound(responseMessage.DATA_NOT_FOUND);
      }
      let result = await updateVideo(
        { _id: videoResult._id },
        { $set: { status: status.DELETE } }
      );
      return res.json(new response(result, responseMessage.DELETE_SUCCESS));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /admin/listVideo:
   *   get:
   *     tags:
   *       - VIDEO MANAGEMENT
   *     description: listVideo
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: admin token
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
   *       401:
   *         description: Unauthorized token.
   *       500:
   *         description: Internal server error.
   *       501:
   *         description: Something went wrong.
   */
  async listVideo(req, res, next) {
    const validationSchema = {
      page: Joi.number().optional(),
      limit: Joi.number().optional(),
    };
    try {
      const validatedBody = await Joi.validate(req.query, validationSchema);
      let adminResult = await findUser({
        _id: req.userId,
        userType: { $in: [userType.ADMIN, userType.SUB_ADMIN] },
      });
      if (!adminResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      var result = await videoList(validatedBody);
      if (!result) {
        throw apiError.notFound(responseMessage.DATA_NOT_FOUND);
      }
      return res.json(new response(result, responseMessage.DATA_FOUND));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /admin/changeVideoStatus:
   *   patch:
   *     tags:
   *       - VIDEO MANAGEMENT
   *     description: changeVideoStatus
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: token
   *         in: header
   *         required: true
   *       - name: changeVideoStatus
   *         description: changeVideoStatus
   *         in: body
   *         required: true
   *         schema:
   *           $ref: '#/definitions/blockUnblockSubAdmin'
   *     responses:
   *       200:
   *         description: Returns success message
   */

  async changeVideoStatus(req, res, next) {
    const validSchema = {
      _id: Joi.string().required(),
      status: Joi.string().valid(status.ACTIVE, status.BLOCK).required(),
    };
    try {
      const validatedBody = await Joi.validate(req.body, validSchema);
      let adminResult = await findUser({
        _id: req.userId,
        userType: { $in: [userType.ADMIN, userType.SUB_ADMIN] },
      });
      if (!adminResult) {
        throw apiError.invalid(responseMessage.USER_NOT_FOUND);
      }
      let videoResult = await findVideo({
        _id: validatedBody._id,
        status: { $ne: status.DELETE },
      });
      if (!videoResult) {
        throw apiError.notFound(responseMessage.DATA_NOT_FOUND);
      }
      var result = await updateVideo(
        { _id: videoResult._id },
        { status: validatedBody.status }
      );
      return res.json(
        new response(
          result,
          validatedBody.status == status.BLOCK
            ? responseMessage.BLOCKED
            : responseMessage.UNBLOCKED
        )
      );
    } catch (error) {
      return next(error);
    }
  }
}

export default new adminController();

const getData = async (model, type, fromDate, toDate) => {
  var list = [];
  switch (type) {
    case "Yearly":
      {
        list = await model.aggregate([
          {
            $match: {
              status: { $ne: status.DELETE },
              createdAt: { $gte: new Date(fromDate), $lte: new Date(toDate) },
            },
          },
        ]);
      }
      break;
    case "Monthly":
      {
        list = await model.aggregate([
          {
            $match: {
              status: { $ne: status.DELETE },
              createdAt: { $gte: new Date(fromDate), $lte: new Date(toDate) },
            },
          },
        ]);
      }
      break;
    case "Weekly":
      {
        list = await model.aggregate([
          {
            $match: {
              status: { $ne: status.DELETE },
              createdAt: { $gte: new Date(fromDate), $lte: new Date(toDate) },
            },
          },
        ]);
      }
      break;
    case "Daily":
      {
        list = await model.aggregate([
          {
            $match: {
              status: { $ne: status.DELETE },
              createdAt: { $gte: new Date(fromDate), $lte: new Date(toDate) },
            },
          },
        ]);
      }
      break;
    case "All":
      {
        list = await model.aggregate([
          {
            $match: {
              status: { $ne: status.DELETE },
              createdAt: { $lte: new Date(toDate) },
            },
          },
        ]);
      }
      break;
    default:
      break;
  }
  return list;
};

const transaction = async (contract, Data, privateKey) => {
  const rawTransaction = {
    to: contract._address,
    gasPrice: web3.utils.toHex("30000000000"), // Always in Wei (30 gwei)
    gasLimit: web3.utils.toHex("500000"), // Always in Wei
    data: Data, // Setting the pid 12 with 0 alloc and 0 deposit fee
  };
  const signPromise = await web3.eth.accounts.signTransaction(
    rawTransaction,
    privateKey
  );
  try {
    let hash = await web3.eth.sendSignedTransaction(signPromise.rawTransaction);
    return { status: true, txHash: hash };
  } catch (error) {
    return { status: false, txHash: null };
  }
};
