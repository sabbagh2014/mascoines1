import Joi from "joi";
import config from "config";
import apiError from "../../../../helper/apiError";
import response from "../../../../../assets/response";
import responseMessage from "../../../../../assets/responseMessage";
import { userServices } from "../../services/user";
import { transactionServices } from "../../services/transaction";
import { feeServices } from "../../services/fee";
import { earningServices } from "../../services/earning";
const { createTransaction } = transactionServices;

const { findUser, findUserData, updateUser } = userServices;
const { sortFee } = feeServices;
const { findEarning, createEarning, updateEarning } = earningServices;
import userType from "../../../../enums/userType";
import status from "../../../../enums/status";
import axios from "axios";
import blockchainWithdraw from "../../../../helper/withdraw";
const blockchainBaseUrl = config.get("blockchainBaseUrl");
const blockchainUrl = config.get("blockchainMainnetBaseUrl");

export class blockchainController {
  /**
   * @swagger
   * /blockchain/getBalance/{address}/{coin}:
   *   get:
   *     tags:
   *       - BLOCKCHAIN
   *     description: getBalance
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: token
   *         in: header
   *         required: true
   *       - name: address
   *         description: address
   *         in: path
   *         required: false
   *       - name: coin
   *         description: coin
   *         in: path
   *         required: false
   *     responses:
   *       200:
   *         description: Returns success message
   */
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
   * /blockchain/balance:
   *   get:
   *     tags:
   *       - BLOCKCHAIN
   *     description: balance
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
  async balance(req, res, next) {
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
   * /blockchain/importBTCWallet/{privatekey}:
   *   get:
   *     tags:
   *       - BLOCKCHAIN
   *     description: importBTCWallet
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: token
   *         in: header
   *         required: true
   *       - name: privatekey
   *         description: privatekey
   *         in: path
   *         required: false
   *     responses:
   *       200:
   *         description: Returns success message
   */
  async importBTCWallet(req, res, next) {
    const validationSchema = {
      privatekey: Joi.string().required(),
    };
    try {
      const { privatekey } = await Joi.validate(req.params, validationSchema);
      let userResult = await findUser({ _id: req.userId });
      if (!userResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      let result = await axios.post(
        `${blockchainBaseUrl}/api/importBTCWallet/${privatekey}`
      );
      return res.json(new response(result.data, responseMessage.USER_DETAILS));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /blockchain/importTRONWallet/{privatekey}:
   *   get:
   *     tags:
   *       - BLOCKCHAIN
   *     description: importTRONWallet
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: token
   *         in: header
   *         required: true
   *       - name: privatekey
   *         description: privatekey
   *         in: path
   *         required: false
   *     responses:
   *       200:
   *         description: Returns success message
   */
  async importTRONWallet(req, res, next) {
    const validationSchema = {
      privatekey: Joi.string().required(),
    };
    try {
      const { privatekey } = await Joi.validate(req.params, validationSchema);
      let userResult = await findUser({ _id: req.userId });
      if (!userResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      let result = await axios.post(
        `${blockchainBaseUrl}/api/importTRONWallet/${privatekey}`
      );
      return res.json(new response(result.data, responseMessage.USER_DETAILS));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /blockchain/transfer:
   *   post:
   *     tags:
   *       - BLOCKCHAIN
   *     description: transfer
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: token
   *         in: header
   *         required: true
   *       - name: senderAddress
   *         description: senderAddress
   *         in: formData
   *         required: false
   *       - name: amountToSend
   *         description: amountToSend
   *         in: formData
   *         required: false
   *       - name: coin
   *         description: coin ?? USDT || BUSD || MASS
   *         in: formData
   *         required: false
   *     responses:
   *       200:
   *         description: Returns success message
   */
  async transfer(req, res, next) {
    const validationSchema = {
      senderAddress: Joi.string().required(),
      amountToSend: Joi.string().required(),
      coin: Joi.string().required(),
    };
    try {
      const { senderAddress, amountToSend, coin } = await Joi.validate(
        req.body,
        validationSchema
      );
      let userResult = await findUserData({ _id: req.userId });
      if (!userResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      let admin = await findUser({ userType: userType.ADMIN });

      let transferRes = await axios.post(`${blockchainUrl}/withdraw`, {
        fromAddress: senderAddress,
        privateKey: userResult.ethAccount.privateKey,
        toAddress: admin.ethAccount.address,
        amount: amountToSend,
        coin: coin,
      });

      let updateQuery = {};
      if (coin === "MASS") {
        updateQuery.$inc = { massBalance: Number(amountToSend) };
      }
      if (coin === "BNB") {
        updateQuery.$inc = { bnbBalace: Number(amountToSend) };
      }
      if (coin === "ETH") {
        updateQuery.$inc = { ethBalance: Number(amountToSend) };
      }
      if (coin === "USDT") {
        updateQuery.$inc = { usdtBalance: Number(amountToSend) };
      }
      if (coin === "BUSD") {
        updateQuery.$inc = { btcBalance: Number(amountToSend) };
      }
      let adminUp = await updateUser({ _id: admin._id }, updateQuery);
      if (adminUp) {
        await updateUser({ _id: userResult._id }, updateQuery);
      }
      await createTransaction({
        userId: userResult._id,
        amount: amountToSend,
        transactionHash: transferRes.data.Hash,
        coinName: coin,
        transactionType: "Deposite",
      });
      return res.json(
        new response(transferRes.data, responseMessage.USER_DETAILS)
      );
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /blockchain/withdraw:
   *   post:
   *     tags:
   *       - BLOCKCHAIN
   *     description: withdraw
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: token
   *         in: header
   *         required: true
   *       - name: senderAddress
   *         description: senderAddress
   *         in: formData
   *         required: false
   *       - name: amountToSend
   *         description: amountToSend
   *         in: formData
   *         required: false
   *       - name: coin
   *         description: coin
   *         in: formData
   *         required: false
   *     responses:
   *       200:
   *         description: Returns success message
   */
  async withdraw(req, res, next) {
    const validationSchema = {
      senderAddress: Joi.string().required(),
      amountToSend: Joi.number().required(),
      coin: Joi.string().required(),
    };
    try {
      const { senderAddress, amountToSend, coin } = await Joi.validate(
        req.body,
        validationSchema
      );
      let userResult = await findUserData({ _id: req.userId });
      if (!userResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      let admin = await findUser({ userType: userType.ADMIN });
      var transferRes,
        updateQuery = {},
        updateObj = {};
      var commissionObj = {},
        firstCommission = {};
      var commissionResult = await sortFee({
        massHeld: { $lte: userResult.massBalance },
        status: status.ACTIVE,
      });
      var commissionFee =
        amountToSend * (commissionResult.contentCreatorFee / 100);
      var amount = amountToSend - commissionFee;
      if (coin == "ETH") {
        if (amountToSend > userResult.ethBalance) {
          throw apiError.badRequest(responseMessage.INSUFFICIENT_BALANCE(coin));
        }
        transferRes = await ethTransfer(
          admin.ethAccount.address,
          admin.ethAccount.privateKey,
          senderAddress,
          amount
        );
        if (transferRes.response.status == 200) {
          updateQuery = { $inc: { ethBalance: -amountToSend } };
          updateObj = { $inc: { ethBalance: amountToSend } };
          commissionObj = { $inc: { ethBalance: commissionFee } };
          firstCommission.ethBalance = commissionFee;
        }
      }

      if (coin == "MASS") {
        if (amountToSend > userResult.massBalance) {
          throw apiError.badRequest(responseMessage.INSUFFICIENT_BALANCE(coin));
        }
        transferRes = await blockchainWithdraw.massWithdraw(
          admin.ethAccount.address,
          admin.ethAccount.privateKey,
          senderAddress,
          amount
        );
        if (transferRes.Success == true) {
          updateQuery = { $inc: { massBalance: -amountToSend } };
          updateObj = { $inc: { massBalance: amountToSend } };
          commissionObj = { $inc: { massBalance: commissionFee } };
          firstCommission.massBalance = commissionFee;
        }
      }

      if (coin == "USDT") {
        if (amountToSend > userResult.usdtBalance) {
          throw apiError.badRequest(responseMessage.INSUFFICIENT_BALANCE(coin));
        }
        transferRes = await blockchainWithdraw.usdtWithdraw(
          admin.ethAccount.address,
          admin.ethAccount.privateKey,
          senderAddress,
          amount
        );
        if (transferRes.Success == true) {
          updateQuery = { $inc: { usdtBalance: -amountToSend } };
          updateObj = { $inc: { usdtBalance: amountToSend } };
          commissionObj = { $inc: { usdtBalance: commissionFee } };
          firstCommission.usdtBalance = commissionFee;
        }
      }

      if (coin == "WBTC") {
        if (amountToSend > userResult.btcBalance) {
          throw apiError.badRequest(responseMessage.INSUFFICIENT_BALANCE(coin));
        }
        transferRes = await blockchainWithdraw.wbtcWithdraw(
          admin.ethAccount.address,
          admin.ethAccount.privateKey,
          senderAddress,
          amount
        );
        if (transferRes.Success == true) {
          updateQuery = { $inc: { btcBalance: -amountToSend } };
          updateObj = { $inc: { btcBalance: amountToSend } };
          commissionObj = { $inc: { btcBalance: commissionFee } };
          firstCommission.btcBalance = commissionFee;
        }
      }

      if (coin == "BNB") {
        if (amountToSend > userResult.bnbBalace) {
          throw apiError.badRequest(responseMessage.INSUFFICIENT_BALANCE(coin));
        }
        transferRes = await blockchainWithdraw.bnbWithdraw(
          admin.ethAccount.address,
          admin.ethAccount.privateKey,
          senderAddress,
          amount.toString()
        );
        updateQuery = { $inc: { bnbBalace: -amountToSend } };
        updateObj = { $inc: { bnbBalace: amountToSend } };
        commissionObj = { $inc: { bnbBalace: commissionFee } };
        firstCommission.bnbBalace = commissionFee;
      }

      await updateUser({ _id: userResult._id }, updateQuery);
      await updateUser({ _id: admin._id }, updateQuery);
      var adminEarningResult = await findEarning({
        userId: admin._id,
        status: status.ACTIVE,
      });
      if (!adminEarningResult) {
        firstCommission.userId = adminResult._id;
        await createEarning(firstCommission);
      } else {
        await updateEarning({ _id: adminEarningResult._id }, commissionObj);
      }
      var senderResult = await findUser({
        $or: [
          { walletAddress: senderAddress },
          { "ethAccount.address": senderAddress },
        ],
      });
      if (senderResult) {
        await updateUser({ _id: senderResult._id }, updateObj);
      }
      await createTransaction({
        userId: userResult._id,
        amount: amount,
        transactionHash:
          coin == "ETH" ? transferRes.data.Hash : transferRes.Hash,
        coinName: coin,
        adminCommission: commissionFee,
        transactionType: "withdraw",
      });
      return res.json(
        new response(
          coin == "ETH" ? transferRes.data : transferRes,
          responseMessage.USER_DETAILS
        )
      );
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /blockchain/bnbGetBalance/{senderAddress}:
   *   get:
   *     tags:
   *       - BLOCKCHAIN
   *     description: bnbGetBalance
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: token
   *         in: header
   *         required: true
   *       - name: senderAddress
   *         description: senderAddress
   *         in: path
   *         required: false
   *     responses:
   *       200:
   *         description: Returns success message
   */
  async bnbGetBalance(req, res, next) {
    const validationSchema = {
      senderAddress: Joi.string().required(),
    };
    try {
      const { senderAddress } = await Joi.validate(
        req.params,
        validationSchema
      );
      let userResult = await findUser({ _id: req.userId });
      if (!userResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      let result = await axios.post(
        `${blockchainUrl}/bnbGetBalance/${senderAddress}`
      );
      return res.json(new response(result.data, responseMessage.USER_DETAILS));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /blockchain/bnbTransfer:
   *   post:
   *     tags:
   *       - BLOCKCHAIN
   *     description: bnbTransfer
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: token
   *         in: header
   *         required: true
   *       - name: senderAddress
   *         description: senderAddress
   *         in: formData
   *         required: false
   *       - name: privateKey
   *         description: privateKey
   *         in: formData
   *         required: false
   *       - name: amountToSend
   *         description: amountToSend
   *         in: formData
   *         required: false
   *       - name: coin
   *         description: coin
   *         in: formData
   *         required: false
   *     responses:
   *       200:
   *         description: Returns success message
   */
  async bnbTransfer(req, res, next) {
    const validationSchema = {
      senderAddress: Joi.string().required(),
      amountToSend: Joi.string().required(),
      coin: Joi.string().required(),
    };
    try {
      const { senderAddress, amountToSend, coin } = await Joi.validate(
        req.body,
        validationSchema
      );
      let userResult = await findUserData({ _id: req.userId });
      if (!userResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      let admin = await findUser({ userType: userType.ADMIN });

      let transferRes = await axios.post(`${blockchainUrl}/bnbwithdraw`, {
        senderAddress: senderAddress,
        privateKey: userResult.ethAccount.privateKey,
        recieverAddress: admin.ethAccount.address,
        amountToSend: amountToSend,
      });

      let updateQuery = {};

      if (coin === "BNB") {
        updateQuery.$inc = { bnbBalace: Number(amountToSend) };
      }
      let adminUp = await updateUser({ _id: admin._id }, updateQuery);
      if (adminUp) {
        await updateUser({ _id: userResult._id }, updateQuery);
      }
      await createTransaction({
        userId: userResult._id,
        amount: amountToSend,
        transactionHash: transferRes.data.Hash,
        coinName: coin,
        transactionType: "Deposite",
      });
      return res.json(
        new response(transferRes.data, responseMessage.USER_DETAILS)
      );
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /blockchain/ethGetBalance/{senderAddress}:
   *   get:
   *     tags:
   *       - BLOCKCHAIN
   *     description: ethGetBalance
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: token
   *         in: header
   *         required: true
   *       - name: senderAddress
   *         description: senderAddress
   *         in: path
   *         required: false
   *     responses:
   *       200:
   *         description: Returns success message
   */
  async ethGetBalance(req, res, next) {
    const validationSchema = {
      senderAddress: Joi.string().required(),
    };
    try {
      const { senderAddress } = await Joi.validate(
        req.params,
        validationSchema
      );
      let userResult = await findUser({ _id: req.userId });
      if (!userResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      let result = await axios.post(
        `${blockchainUrl}/ethGetBalance/${senderAddress}`
      );
      return res.json(new response(result.data, responseMessage.USER_DETAILS));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /blockchain/ethTransfer:
   *   post:
   *     tags:
   *       - BLOCKCHAIN
   *     description: ethTransfer
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: token
   *         in: header
   *         required: true
   *       - name: senderAddress
   *         description: senderAddress
   *         in: formData
   *         required: false
   *       - name: amountToSend
   *         description: amountToSend
   *         in: formData
   *         required: false
   *       - name: coin
   *         description: coin
   *         in: formData
   *         required: false
   *     responses:
   *       200:
   *         description: Returns success message
   */
  async ethTransfer(req, res, next) {
    const validationSchema = {
      senderAddress: Joi.string().required(),
      amountToSend: Joi.string().required(),
      coin: Joi.string().required(),
    };
    try {
      const { senderAddress, amountToSend, coin } = await Joi.validate(
        req.body,
        validationSchema
      );
      let userResult = await findUser({ _id: req.userId });
      if (!userResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      let admin = await findUser({ userType: userType.ADMIN });
      let transferRes = await axios.post(`${blockchainUrl}/ethwithdraw`, {
        senderAddress: senderAddress,
        privateKey: userResult.ethAccount.privateKey,
        recieverAddress: admin.ethAccount.address,
        amountToSend: amountToSend,
      });
      let updateQuery = {};
      if (coin === "ETH") {
        updateQuery.$inc = { ethBalance: Number(amountToSend) };
      }
      await updateUser({ _id: userResult._id }, updateQuery);
      await updateUser({ _id: admin._id }, updateQuery);
      await createTransaction({
        userId: userResult._id,
        amount: amountToSend,
        transactionHash: transferRes.data.Hash,
        coinName: coin,
      });
      return res.json(
        new response(transferRes.data, responseMessage.USER_DETAILS)
      );
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /blockchain/btcGetBalance/{senderAddress}:
   *   get:
   *     tags:
   *       - BLOCKCHAIN
   *     description: btcGetBalance
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: token
   *         in: header
   *         required: true
   *       - name: senderAddress
   *         description: senderAddress
   *         in: path
   *         required: false
   *     responses:
   *       200:
   *         description: Returns success message
   */
  async btcGetBalance(req, res, next) {
    const validationSchema = {
      senderAddress: Joi.string().required(),
    };
    try {
      const { senderAddress } = await Joi.validate(
        req.params,
        validationSchema
      );
      let userResult = await findUser({ _id: req.userId });
      if (!userResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      let result = await axios.post(
        `${blockchainUrl}/btcGetBalance/${senderAddress}`
      );
      return res.json(new response(result.data, responseMessage.USER_DETAILS));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /blockchain/btcTransfer:
   *   post:
   *     tags:
   *       - BLOCKCHAIN
   *     description: btcTransfer
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: token
   *         in: header
   *         required: true
   *       - name: senderAddress
   *         description: senderAddress
   *         in: formData
   *         required: false
   *       - name: amountToSend
   *         description: amountToSend
   *         in: formData
   *         required: false
   *       - name: coin
   *         description: coin
   *         in: formData
   *         required: false
   *     responses:
   *       200:
   *         description: Returns success message
   */
  async btcTransfer(req, res, next) {
    const validationSchema = {
      senderAddress: Joi.string().required(),
      amountToSend: Joi.string().required(),
      coin: Joi.string().required(),
    };
    try {
      const { senderAddress, amountToSend, coin } = await Joi.validate(
        req.body,
        validationSchema
      );
      let userResult = await findUser({ _id: req.userId });
      if (!userResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      let admin = await findUser({ userType: userType.ADMIN });
      let transferRes = await axios.post(`${blockchainUrl}/btcWithdraw`, {
        senderAddress: senderAddress,
        privateKey: userResult.ethAccount.privateKey,
        recieverAddress: admin.ethAccount.address,
        amountToSend: amountToSend,
      });
      let updateQuery = {};
      if (coinName === "WBTC") {
        obj.bnbBalance = amount;
        updateQuery.$inc = { btcBalance: Number(amount) };
      }
      await updateUser({ _id: userResult._id }, updateQuery);
      await updateUser({ _id: admin._id }, updateQuery);
      await createTransaction({
        userId: userResult._id,
        amount: amountToSend,
        transactionHash: transferRes.data.Hash,
        coinName: coin,
      });
      return res.json(
        new response(transferRes.data, responseMessage.USER_DETAILS)
      );
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /blockchain/trxGetBalance/{address}:
   *   get:
   *     tags:
   *       - BLOCKCHAIN
   *     description: trxGetBalance
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: token
   *         in: header
   *         required: true
   *       - name: address
   *         description: address
   *         in: path
   *         required: false
   *     responses:
   *       200:
   *         description: Returns success message
   */
  async trxGetBalance(req, res, next) {
    const validationSchema = {
      address: Joi.string().required(),
    };
    try {
      const { address } = await Joi.validate(req.params, validationSchema);
      let userResult = await findUser({ _id: req.userId });
      if (!userResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      let result = await axios.post(
        `${blockchainUrl}/trxGetBalance/${address}`
      );
      return res.json(new response(result.data, responseMessage.USER_DETAILS));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /blockchain/trxTransfer:
   *   post:
   *     tags:
   *       - BLOCKCHAIN
   *     description: trxTransfer
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: token
   *         in: header
   *         required: true
   *       - name: senderAddress
   *         description: senderAddress
   *         in: formData
   *         required: false
   *       - name: privateKey
   *         description: privateKey
   *         in: formData
   *         required: false
   *       - name: recieverAddress
   *         description: recieverAddress
   *         in: formData
   *         required: false
   *     responses:
   *       200:
   *         description: Returns success message
   */
  async trxTransfer(req, res, next) {
    const validationSchema = {
      senderAddress: Joi.string().required(),
      privateKey: Joi.string().required(),
      recieverAddress: Joi.string().required(),
    };
    try {
      const { senderAddress, privateKey, recieverAddress, amountToSend } =
        await Joi.validate(req.body, validationSchema);
      let userResult = await findUser({ _id: req.userId });
      if (!userResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      let transferRes = await axios.post(`${blockchainUrl}/trxTransfer`, {
        senderAddress: senderAddress,
        privateKey: privateKey,
        recieverAddress: recieverAddress,
      });
      return res.json(
        new response(transferRes.data, responseMessage.USER_DETAILS)
      );
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /blockchain/trxWithdraw:
   *   post:
   *     tags:
   *       - BLOCKCHAIN
   *     description: trxWithdraw
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: token
   *         in: header
   *         required: true
   *       - name: senderAddress
   *         description: senderAddress
   *         in: formData
   *         required: false
   *       - name: privateKey
   *         description: privateKey
   *         in: formData
   *         required: false
   *       - name: recieverAddress
   *         description: recieverAddress
   *         in: formData
   *         required: false
   *       - name: amount
   *         description: amount
   *         in: formData
   *         required: false
   *     responses:
   *       200:
   *         description: Returns success message
   */
  async trxWithdraw(req, res, next) {
    const validationSchema = {
      senderAddress: Joi.string().required(),
      privateKey: Joi.string().required(),
      recieverAddress: Joi.string().required(),
      amount: Joi.string().required(),
    };
    try {
      const { senderAddress, privateKey, recieverAddress, amount } =
        await Joi.validate(req.body, validationSchema);
      let userResult = await findUser({ _id: req.userId });
      if (!userResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      let transferRes = await axios.post(`${blockchainUrl}/trxWithdraw`, {
        senderAddress: senderAddress,
        privateKey: privateKey,
        recieverAddress: recieverAddress,
        amount: amount,
      });
      return res.json(
        new response(transferRes.data, responseMessage.USER_DETAILS)
      );
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /blockchain/trcBalanceOf/{address}/{privateKey}:
   *   get:
   *     tags:
   *       - BLOCKCHAIN
   *     description: trcBalanceOf
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: token
   *         in: header
   *         required: true
   *       - name: address
   *         description: address
   *         in: path
   *         required: false
   *       - name: privateKey
   *         description: privateKey
   *         in: path
   *         required: false
   *     responses:
   *       200:
   *         description: Returns success message
   */
  async trcBalanceOf(req, res, next) {
    const validationSchema = {
      address: Joi.string().required(),
      privateKey: Joi.string().required(),
    };
    try {
      const { address, privateKey } = await Joi.validate(
        req.params,
        validationSchema
      );
      let userResult = await findUser({ _id: req.userId });
      if (!userResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      let result = await axios.get(
        `${blockchainUrl}/trcBalanceOf/${address}/${privateKey}`
      );
      return res.json(new response(result.data, responseMessage.USER_DETAILS));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /blockchain/trcTransfer:
   *   post:
   *     tags:
   *       - BLOCKCHAIN
   *     description: trcTransfer
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: token
   *         in: header
   *         required: true
   *       - name: senderAddress
   *         description: senderAddress
   *         in: formData
   *         required: false
   *       - name: privateKey
   *         description: privateKey
   *         in: formData
   *         required: false
   *       - name: recieverAddress
   *         description: recieverAddress
   *         in: formData
   *         required: false
   *     responses:
   *       200:
   *         description: Returns success message
   */
  async trcTransfer(req, res, next) {
    const validationSchema = {
      senderAddress: Joi.string().required(),
      privateKey: Joi.string().required(),
      recieverAddress: Joi.string().required(),
    };
    try {
      const { senderAddress, privateKey, recieverAddress, amountToSend } =
        await Joi.validate(req.body, validationSchema);
      let userResult = await findUser({ _id: req.userId });
      if (!userResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      let transferRes = await axios.post(`${blockchainUrl}/trcTransfer`, {
        senderAddress: senderAddress,
        privateKey: privateKey,
        recieverAddress: recieverAddress,
      });
      return res.json(
        new response(transferRes.data, responseMessage.USER_DETAILS)
      );
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /blockchain/trcWithdraw:
   *   post:
   *     tags:
   *       - BLOCKCHAIN
   *     description: trcWithdraw
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: token
   *         in: header
   *         required: true
   *       - name: privateKey
   *         description: privateKey
   *         in: formData
   *         required: false
   *       - name: recieverAddress
   *         description: recieverAddress
   *         in: formData
   *         required: false
   *       - name: value
   *         description: value
   *         in: formData
   *         required: false
   *     responses:
   *       200:
   *         description: Returns success message
   */
  async trcWithdraw(req, res, next) {
    const validationSchema = {
      privateKey: Joi.string().required(),
      recieverAddress: Joi.string().required(),
      value: Joi.string().required(),
    };
    try {
      const { senderAddress, privateKey, recieverAddress, value } =
        await Joi.validate(req.body, validationSchema);
      let userResult = await findUser({ _id: req.userId });
      if (!userResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      let transferRes = await axios.post(`${blockchainUrl}/trcWithdraw`, {
        privateKey: privateKey,
        recieverAddress: recieverAddress,
        value: value,
      });
      return res.json(
        new response(transferRes.data, responseMessage.USER_DETAILS)
      );
    } catch (error) {
      return next(error);
    }
  }
}

export default new blockchainController();

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
