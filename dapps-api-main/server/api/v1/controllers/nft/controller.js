import Joi from "joi";
import apiError from "../../../../helper/apiError";
import response from "../../../../../assets/response";
import responseMessage from "../../../../../assets/responseMessage";
import { userServices } from "../../services/user";

import { nftServices } from "../../services/nft";
import { notificationServices } from "../../services/notification";
import { auctionNftServices } from "../../services/auctionNft";

const {
  findUser,
  findUserData,
  updateUserById,
  userSubscriberList,
} = userServices;
const {
  createNft,
  findNft,
  updateNft,
  findNft1,
  nftListWithoutShared,
  nftListWithAggregate,
  listAllNft,
  multiUpdate,
  nftListWithAggregatePipeline,
  findNftWithPopulateDetails,
} = nftServices;
const {
  createNotification,
} = notificationServices;
const {
  createAuctionNft,
  findAuctionNft,
  updateAuctionNft,
  auctionNftList,
  allNftAuctionList,
} = auctionNftServices;
import activityModel from "../../../../models/activityModel";

import commonFunction from "../../../../helper/util";

import status from "../../../../enums/status";

import fs from "fs";
import ipfsClient from "ipfs-http-client";
const ipfs = ipfsClient({
  host: "ipfs.infura.io",
  port: "5001",
  protocol: "https",
});
import base64ToImage from "base64-to-image";
import doAsync from "doasync";

const rawImage = "rawImage/";
//************************************************ Web3 ******************************************/
export class nftController {
  /**
   * @swagger
   * /nft/ipfsUpload:
   *   post:
   *     tags:
   *       - USER NFT
   *     description: ipfsUpload
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: token
   *         in: header
   *         required: true
   *       - name: file
   *         description: file
   *         in: formData
   *         type: file
   *         required: true
   *     responses:
   *       creatorAddress: Joi.string().optional(),
   *       200:
   *         description: Returns success message
   */

  async ipfsUpload(req, res, next) {
    try {
      let userResult = await findUser({ _id: req.userId });
      if (!userResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      const fileName = req.files[0].filename;
      const filePath = req.files[0].path;
      const fileHash = await addFile(fileName, filePath);
      await deleteFile(filePath);
      let tokenData = {
        image: "https://ipfs.io/ipfs/" + fileHash, // hash
      };
      let ipfsRes = await ipfsUpload(tokenData);
      let result = {
        ipfsHash: ipfsRes,
        fileHash: fileHash,
        imageUrl: tokenData.image,
      };
      return res.json(new response(result, responseMessage.DETAILS_FETCHED));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /nft/ipfsUploadBase64:
   *   post:
   *     tags:
   *       - USER NFT
   *     description: ipfsUploadBase64
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: image
   *         description: image?? base 64
   *         in: formData
   *         required: true
   *     responses:
   *       creatorAddress: Joi.string().optional(),
   *       200:
   *         description: Returns success message
   */

  async ipfsUploadBase64(req, res, next) {
    try {
      const fileHash = await addBase64File(req.body.image);
      let tokenData = {
        image: "https://ipfs.io/ipfs/" + fileHash, // hash
      };
      let ipfsRes = await ipfsUpload(tokenData);
      let result = {
        ipfsHash: ipfsRes,
        fileHash: fileHash,
        imageUrl: tokenData.image,
      };
      return res.json(new response(result, responseMessage.DETAILS_FETCHED));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /nft/uploadNFT:
   *   post:
   *     tags:
   *       - USER NFT
   *     description: uploadNFT
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: token
   *         in: header
   *         required: true
   *       - name: tokenName
   *         description: tokenName
   *         in: formData
   *         required: false
   *       - name: description
   *         description: description
   *         in: formData
   *         required: false
   *       - name: image
   *         description: image
   *         in: formData
   *         required: false
   *     responses:
   *       creatorAddress: Joi.string().optional(),
   *       200:
   *         description: Returns success message
   */

  async uploadNFT(req, res, next) {
    const validationSchema = {
      tokenName: Joi.string().optional(),
      description: Joi.string().optional(),
      image: Joi.string().optional(),
    };
    try {
      const { tokenName, description, image } = await Joi.validate(
        req.body,
        validationSchema
      );
      let tokenData = {
        name: tokenName ? tokenName : "Test",
        description: description ? description : "Testing Data",
        image: image, // hash
      };
      let ipfsRes = await ipfsUpload(tokenData);
      tokenData.ipfsHash = ipfsRes;
      return res.json(new response(tokenData, responseMessage.DETAILS_FETCHED));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /nft/createNft:
   *   post:
   *     tags:
   *       - USER NFT
   *     description: createAuctionNft
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
   *       - name: time
   *         description: time
   *         in: formData
   *         required: false
   *       - name: startingBid
   *         description: startingBid
   *         in: formData
   *         required: false
   *       - name: tokenName
   *         description: tokenName
   *         in: formData
   *         required: false
   *       - name: tokenId
   *         description: tokenId
   *         in: formData
   *         required: false
   *       - name: mediaUrl
   *         description: mediaUrl
   *         in: formData
   *         required: false
   *       - name: mediaType
   *         description: mediaType
   *         in: formData
   *         required: false
   *       - name: network
   *         description: network
   *         in: formData
   *         required: false
   *       - name: mediaFile
   *         description: mediaFile
   *         in: formData
   *         required: false
   *       - name: coverImage
   *         description: coverImage
   *         in: formData
   *         required: false
   *     responses:
   *       creatorAddress: Joi.string().optional(),
   *       200:
   *         description: Returns success message
   */

  async createAuctionNft(req, res, next) {
    const validationSchema = {
      title: Joi.string().optional(),
      tokenId: Joi.string().optional(),
      tokenName: Joi.string().optional(),
      mediaUrl: Joi.string().optional(),
      details: Joi.string().optional(),
      time: Joi.string().optional(),
      startingBid: Joi.string().optional(),
      mediaFile: Joi.string().optional(),
      coverImage: Joi.string().optional(),
      mediaType: Joi.string().optional(),
      network: Joi.string().optional(),
    };
    try {
      const validatedBody = await Joi.validate(req.body, validationSchema);
      let userResult = await findUserData({ _id: req.userId });
      if (!userResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      if (validatedBody.mediaFile || validatedBody.coverImage) {
        validatedBody.mediaFile = await commonFunction.getSecureUrl(
          validatedBody.mediaFile
        );
        validatedBody.coverImage = await commonFunction.getSecureUrl(
          validatedBody.coverImage
        );
      }

      validatedBody.userId = userResult._id;
      let auctionNftResult = await createAuctionNft(validatedBody);
      let obj = {
        userId: userResult._id,
        nftId: auctionNftResult._id,
        tokenId: auctionNftResult.tokenId,
        title: "Create a new nft ",
        type: "MINT",
        description: "NFT MINT",
      };
      await activityModel(obj).save();
      return res.json(
        new response(auctionNftResult, responseMessage.NFT_ADDED)
      );
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /nft/viewNft/{_id}:
   *   get:
   *     tags:
   *       - USER NFT
   *     description: viewAuctionNft
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: token
   *         in: header
   *         required: false
   *       - name: _id
   *         description: _id
   *         in: path
   *         required: true
   *     responses:
   *       200:
   *         description: Returns success message
   */

  async viewAuctionNft(req, res, next) {
    const validationSchema = {
      _id: Joi.string().required(),
    };
    try {
      const { _id } = await Joi.validate(req.params, validationSchema);
      let userResult = await findUser({ _id: req.userId });
      if (!userResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      var orderResult = await findAuctionNft({
        _id: _id,
        status: { $ne: status.DELETE },
      });
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
   * /nft/editNft:
   *   put:
   *     tags:
   *       - USER NFT
   *     description: editAuctionNft
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
   *         required: false
   *       - name: title
   *         description: title
   *         in: formData
   *         required: false
   *       - name: details
   *         description: details
   *         in: formData
   *         required: false
   *       - name: time
   *         description: time
   *         in: formData
   *         required: false
   *       - name: startingBid
   *         description: startingBid
   *         in: formData
   *         required: false
   *       - name: tokenName
   *         description: tokenName
   *         in: formData
   *         required: false
   *       - name: tokenId
   *         description: tokenId
   *         in: formData
   *         required: false
   *       - name: mediaType
   *         description: mediaType
   *         in: formData
   *         required: false
   *       - name: network
   *         description: network
   *         in: formData
   *         required: false
   *       - name: mediaFile
   *         description: mediaFile
   *         in: formData
   *         required: false
   *       - name: coverImage
   *         description: coverImage
   *         in: formData
   *         required: false
   *     responses:
   *       creatorAddress: Joi.string().optional(),
   *       200:
   *         description: Returns success message
   */

  async editAuctionNft(req, res, next) {
    const validationSchema = {
      _id: Joi.string().required(),
      title: Joi.string().optional(),
      tokenId: Joi.string().optional(),
      tokenName: Joi.string().optional(),
      mediaUrl: Joi.string().optional(),
      details: Joi.string().optional(),
      time: Joi.string().optional(),
      startingBid: Joi.string().optional(),
      mediaFile: Joi.string().optional(),
      coverImage: Joi.string().optional(),
      mediaType: Joi.string().optional(),
      network: Joi.string().optional(),
    };
    try {
      const validatedBody = await Joi.validate(req.body, validationSchema);
      let userResult = await findUserData({ _id: req.userId });
      if (!userResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      let nftRes = await findAuctionNft({ _id: validatedBody._id });
      if (!nftRes) {
        throw apiError.notFound(responseMessage.NFT_NOT_FOUND);
      }
      if (validatedBody.mediaFile || validatedBody.coverImage) {
        validatedBody.mediaFile = await commonFunction.getSecureUrl(
          validatedBody.mediaFile
        );
        validatedBody.coverImage = await commonFunction.getSecureUrl(
          validatedBody.coverImage
        );
      }
      let auctionNftResult = await updateAuctionNft(
        { _id: nftRes._id },
        validatedBody
      );
      return res.json(
        new response(auctionNftResult, responseMessage.UPDATE_SUCCESS)
      );
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /nft/myNftList:
   *   get:
   *     tags:
   *       - USER NFT
   *     description: myAuctionNftList
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

  async myAuctionNftList(req, res, next) {
    try {
      let userResult = await findUser({ _id: req.userId });
      if (!userResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      let dataResults = await auctionNftList({
        userId: userResult._id,
        status: { $ne: status.DELETE },
      });
      if (dataResults.length == 0) {
        throw apiError.conflict(responseMessage.DATA_NOT_FOUND);
      }
      return res.json(new response(dataResults, responseMessage.DATA_FOUND));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /nft/nftList:
   *   get:
   *     tags:
   *       - USER NFT
   *     description: allNftAuctionList
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: search
   *         description: search ?? tokenId || tokenName || network || mediaType || title
   *         in: query
   *         required: false
   *     responses:
   *       200:
   *         description: Returns success message
   */

  async allNftAuctionList(req, res, next) {
    const validationSchema = {
      search: Joi.string().optional(),
    };
    try {
      const validatedBody = await Joi.validate(req.query, validationSchema);
      let dataResults = await allNftAuctionList(validatedBody);
      if (dataResults.docs.length == 0) {
        throw apiError.conflict(responseMessage.DATA_NOT_FOUND);
      }
      return res.json(new response(dataResults, responseMessage.DATA_FOUND));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /nft/nft:
   *   post:
   *     tags:
   *       - USER BUNDLE
   *     description: createNFT
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: token
   *         in: header
   *         required: true
   *       - name: tokenName
   *         description: tokenName
   *         in: formData
   *         required: true
   *       - name: bundleTitle
   *         description: bundleTitle
   *         in: formData
   *         required: true
   *       - name: bundleName
   *         description: bundleName
   *         in: formData
   *         required: true
   *       - name: donationAmount
   *         description: donationAmount
   *         in: formData
   *         required: true
   *       - name: coinName
   *         description: coinName ?? USDT || BUSD || MASS || BNB || ETH
   *         in: formData
   *         required: true
   *       - name: duration
   *         description: duration
   *         in: formData
   *         required: true
   *       - name: file
   *         description: file
   *         in: formData
   *         type: file
   *         required: true
   *       - name: details
   *         description: details
   *         in: formData
   *         required: false
   *     responses:
   *       creatorAddress: Joi.string().optional(),
   *       200:
   *         description: Returns success message
   */

  async createNFT(req, res, next) {
    try {
      const validatedBody = req.body;
      let userResult = await findUserData({ _id: req.userId });
      if (!userResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      validatedBody.mediaUrl = await commonFunction.getImageUrl(req.files);
      validatedBody.userId = userResult._id;
      var result = await createNft(validatedBody);
      await updateUserById(
        { _id: userResult._id },
        { $inc: { noOfBundle: 1 } }
      );
      let mesage = `A new bundle (${validatedBody.bundleName}) has been created by ${userResult.name}, with the donation amount of ${validatedBody.donationAmount} ${validatedBody.coinName} for ${validatedBody.duration}.`;
      notificattionToAllSubscriber(
        userResult.subscriberList,
        mesage,
        validatedBody.mediaUrl
      );
      return res.json(new response(result, responseMessage.NFT_ADDED));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /nft/nft/{_id}:
   *   get:
   *     tags:
   *       - USER BUNDLE
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
      var nftResult = await findNftWithPopulateDetails(_id, userResult._id);
      if (nftResult.length == 0) {
        throw apiError.conflict(responseMessage.DATA_NOT_FOUND);
      }
      return res.json(
        new response(nftResult[0], responseMessage.DETAILS_FETCHED)
      );
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /nft/viewNft/{_id}:
   *   get:
   *     tags:
   *       - USER BUNDLE
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

  async viewNft(req, res, next) {
    const validationSchema = {
      _id: Joi.string().required(),
    };
    try {
      const { _id } = await Joi.validate(req.params, validationSchema);
      let userResult = await findUser({ _id: req.userId });
      if (!userResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      var nftResult = await findNft1({ _id: _id });
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
   * /nft/nft:
   *   put:
   *     tags:
   *       - USER BUNDLE
   *     description: editNFT
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
   *       - name: bundleTitle
   *         description: bundleTitle
   *         in: formData
   *         required: false
   *       - name: tokenName
   *         description: tokenName
   *         in: formData
   *         required: false
   *       - name: bundleName
   *         description: bundleName
   *         in: formData
   *         required: false
   *       - name: donationAmount
   *         description: donationAmount
   *         in: formData
   *         required: false
   *       - name: duration
   *         description: duration
   *         in: formData
   *         required: false
   *       - name: mediaUrl
   *         description: mediaUrl
   *         in: formData
   *         required: false
   *       - name: details
   *         description: details
   *         in: formData
   *         required: false
   *     responses:
   *       200:
   *         description: Returns success message
   */

  async editNFT(req, res, next) {
    const validationSchema = {
      _id: Joi.string().required(),
      bundleTitle: Joi.string().optional(),
      bundleName: Joi.string().optional(),
      tokenName: Joi.string().optional(),
      donationAmount: Joi.string().optional(),
      duration: Joi.string().optional(),
      mediaUrl: Joi.string().optional(),
      details: Joi.string().optional(),
    };
    try {
      var validatedBody = await Joi.validate(req.body, validationSchema);
      let userResult = await findUser({ _id: req.userId });
      if (!userResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      var nftResult = await findNft({
        _id: validatedBody._id,
        status: { $ne: status.DELETE },
      });
      if (!nftResult) {
        throw apiError.conflict(responseMessage.DATA_NOT_FOUND);
      }
      var result = await updateNft({ _id: nftResult._id }, validatedBody);
      return res.json(new response(result, responseMessage.DETAILS_FETCHED));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /nft/nft:
   *   delete:
   *     tags:
   *       - USER BUNDLE
   *     description: deleteNFT
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

  async deleteNFT(req, res, next) {
    const validationSchema = {
      _id: Joi.string().required(),
    };
    try {
      const { _id } = await Joi.validate(req.query, validationSchema);
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
      var result = await updateNft(
        { _id: nftResult._id },
        { status: status.DELETE }
      );
      return res.json(new response(result, responseMessage.DELETE_SUCCESS));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /nft/listNFT:
   *   get:
   *     tags:
   *       - USER BUNDLE
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
      let dataResults = await nftListWithAggregatePipeline(
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
   * /nft/bundleList:
   *   get:
   *     tags:
   *       - USER BUNDLE
   *     description: bundleList
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

  async bundleList(req, res, next) {
    const validationSchema = {
      search: Joi.string().optional(),
    };
    try {
      const validatedBody = await Joi.validate(req.query, validationSchema);
      let userResult = await findUser({ _id: req.userId });
      if (!userResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      let dataResults = await nftListWithoutShared(
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
   * /nft/listAllNft:
   *   get:
   *     tags:
   *       - USER BUNDLE
   *     description: listAllNft
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: search
   *         description: search ?? tokenId || tokenName || bundleTitle || bundleName || contractAddress
   *         in: query
   *         required: false
   *     responses:
   *       200:
   *         description: Returns success message
   */

  async listAllNft(req, res, next) {
    const validationSchema = {
      search: Joi.string().optional(),
    };
    try {
      const validatedBody = await Joi.validate(req.query, validationSchema);
      let dataResults = await listAllNft(validatedBody);
      return res.json(new response(dataResults, responseMessage.DATA_FOUND));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /nft/allNftList:
   *   get:
   *     tags:
   *       - USER BUNDLE
   *     description: allNftList
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

  async allNftList(req, res, next) {
    const validationSchema = {
      search: Joi.string().optional(),
    };
    try {
      const validatedBody = await Joi.validate(req.query, validationSchema);
      let userResult = await findUser({ _id: req.userId });
      if (!userResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      let dataResults = await nftListWithAggregate(
        validatedBody,
        userResult._id,
        userResult.subscribeNft
      );
      return res.json(new response(dataResults, responseMessage.DATA_FOUND));
    } catch (error) {
      return next(error);
    }
  }

  // /**
  //  * @swagger
  //  * /nft/allNftListWithPopulated:
  //  *   get:
  //  *     tags:
  //  *       - USER BUNDLE
  //  *     description: allNftList
  //  *     produces:
  //  *       - application/json
  //  *     parameters:
  //  *       - name: token
  //  *         description: token
  //  *         in: header
  //  *         required: true
  //  *       - name: search
  //  *         description: search ?? tokenId || tokenName || bundleTitle || bundleName || contractAddress
  //  *         in: query
  //  *         required: false
  //  *     responses:
  //  *       200:
  //  *         description: Returns success message
  //  */

  async allNftListWithPopulated(req, res, next) {
    const validationSchema = {
      search: Joi.string().optional(),
    };
    try {
      const validatedBody = await Joi.validate(req.query, validationSchema);
      let userResult = await findUser({ _id: req.userId });
      if (!userResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      let dataResults = await nftListWithAggregatePipeline(
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
   * /nft/addLikesArray:
   *   get:
   *     tags:
   *       - USER BUNDLE
   *     description: allNftList
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Returns success message
   */

  async addLikesArray(req, res, next) {
    try {
      let dataResults = await multiUpdate({ likesUsers: [], likesCount: 0 });
      return res.json(new response(dataResults, responseMessage.DATA_FOUND));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /nft/updateSubscribersDummy:
   *   get:
   *     tags:
   *       - USER BUNDLE
   *     description: allNftList
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Returns success message
   */

  async updateSubscribersDummy(req, res, next) {
    try {
      let dataResults = await multiUpdate({
        subscribers: [],
        subscriberCount: 0,
      });
      return res.json(new response(dataResults, responseMessage.DATA_FOUND));
    } catch (error) {
      return next(error);
    }
  }
}

export default new nftController();

const ipfsUpload = async (tokenData) => {
  try {
    const { cid } = await ipfs.add(
      { content: JSON.stringify(tokenData) },
      { cidVersion: 0, hashAlg: "sha2-256" }
    );
    await ipfs.pin.add(cid);
    return cid.toString();
  } catch (error) {
    return error;
  }
};

const addFile = async (fileName, filePath) => {
  const file = fs.readFileSync(filePath);
  const fileAdded = await ipfs.add(
    { path: fileName, content: file },
    { cidVersion: 0, hashAlg: "sha2-256" }
  );
  const fileHash = fileAdded.cid.toString();
  await ipfs.pin.add(fileAdded.cid);
  return fileHash;
};

const addBase64File = async (base64) => {
  let fileName = "image";
  var optionalObj = { fileName: fileName, type: "png" };
  var imageInfo = base64ToImage(base64, rawImage, optionalObj);
  let filePath = `${rawImage}${fileName}.png`;
  const file = await readData(filePath);
  const fileAdded = await ipfs.add(
    { path: fileName, content: file },
    { cidVersion: 0, hashAlg: "sha2-256" }
  );
  const fileHash = fileAdded.cid.toString();
  await ipfs.pin.add(fileAdded.cid);
  deleteFile(filePath);
  return fileHash;
};

const readData = async (path) => {
  return new Promise((resolve, reject) => {
    doAsync(fs)
      .readFile(path)
      .then((data) => {
        resolve(data);
      });
  });
};

const deleteFile = async (filePath) => {
  fs.unlink(filePath, (deleteErr) => {
    if (deleteErr) {
      return deleteErr;
    }
  });
};

// https://kovan.infura.io/v3/fc439845d9a84831a45ada863efce35f

const alluserNotificationTrigger = async (nftId, description, image) => {
  let userData = await userSubscriberList({ userType: "User" });
  for (let i of userData) {
    let obj = {
      title: `New Bundle Alert!`,
      notificationType: "Bundle_Create",
      description: description,
      userId: i._id,
      nftIds: nftId,
      image: image,
    };
    await createNotification(obj);
  }
};

const notificattionToAllSubscriber = async (
  subscriberList,
  description,
  image
) => {
  // let userData = await userSubscriberList({ userType: "User" });
  for (let i of subscriberList) {
    let obj = {
      title: `New Bundle Alert!`,
      notificationType: "Bundle_Create",
      description: description,
      userId: i,
      image: image,
    };
    await createNotification(obj);
  }
};
