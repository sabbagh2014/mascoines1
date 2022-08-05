import apiError from "../../../../helper/apiError";
import response from "../../../../../assets/response";
import responseMessage from "../../../../../assets/responseMessage";
import { userServices } from "../../services/user";
import chatSchema from "../../../../models/chatting";
const { findUserData } = userServices;
import mongoose from "mongoose";

import auth from "../../../../helper/auth";
import commonFunction from "../../../../helper/util";
import status from "../../../../enums/status";
let responses;
export class socketController {
  /**
   * Function Name : oneToOneChat
   * Description   : oneToOneChat of practitioner
   *
   * @return response
   */

  oneToOneChat(req) {
    var query = { clearStatus: false },
      response,
      chatQuery = {},
      chatHistory = [];
    if (req.senderId && req.receiverId) {
      query.$and = [
        { $or: [{ senderId: req.senderId }, { senderId: req.receiverId }] },
        { $or: [{ receiverId: req.receiverId }, { receiverId: req.senderId }] },
      ];
    }
    if (req.senderId && req.receiverId) {
      chatQuery.$or = [
        { receiverId: req.receiverId },
        { senderId: req.receiverId },
      ];
    }

    return new Promise(async (resolve, reject) => {
      if (req.mediaType == "pdf" || req.mediaType == "image") {
        req.message = await commonFunction.getSecureUrl(req.message);
      }
      chatSchema.findOne(query).exec(async (err, result) => {
        if (err) {
          response = {
            response_code: 500,
            response_message: "Internal server error.",
            err,
          };
          resolve(response);
        } else if (!result) {
          req.messages = [
            {
              message: req.message,
              mediaType: req.mediaType ? req.mediaType : "text",
              receiverId: req.receiverId,
              createdAt: new Date().toISOString(),
            },
          ];
          new chatSchema(req).save(async (err1, succ) => {
            if (err1) {
              response = {
                response_code: 500,
                response_message: "Internal server error.",
                err1,
              };
              resolve(response);
            } else {
              chatHistory = await chatSchema
                .find(chatQuery)
                .sort({ "messages.createdAt": -1 })
                .populate("senderId receiverId", "name profilePic")
                .exec();
              var reversed_array = succ;
              reversed_array.messages = reversed_array.messages.reverse();
              response = {
                response_code: 200,
                response_message: "Message send successfully.",
                result: reversed_array,
                chatHistory,
              };
              resolve(response);
            }
          });
        } else {
          if (result.status == "ACTIVE") {
            var messages = [
              {
                message: req.message,
                receiverId: req.receiverId,
                mediaType: req.mediaType ? req.mediaType : "text",
                createdAt: new Date().toISOString(),
              },
            ];
            chatHistory = await chatSchema
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
    });
  }

  /**
   * @swagger
   * /socket/oneToOneChatApi:
   *   post:
   *     tags:
   *       - SOCKET
   *     description: oneToOneChatApi
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: senderId
   *         description: senderId
   *         in: formData
   *         required: false
   *       - name: receiverId
   *         description: receiverId
   *         in: formData
   *         required: false
   *       - name: message
   *         description: message
   *         in: formData
   *         required: false
   *       - name: mediaType
   *         description: mediaType
   *         in: formData
   *     responses:
   *       200:
   *         description: Returns success message
   */

  async oneToOneChatApi(request, res) {
    let req = request.body;
    var query = { clearStatus: false },
      response,
      chatQuery = {},
      chatHistory = [];
    if (req.senderId && req.receiverId) {
      query.$and = [
        { $or: [{ senderId: req.senderId }, { senderId: req.receiverId }] },
        { $or: [{ receiverId: req.receiverId }, { receiverId: req.senderId }] },
      ];
    }
    if (req.senderId && req.receiverId) {
      chatQuery.$or = [
        { receiverId: req.receiverId },
        { senderId: req.receiverId },
      ];
    }

    if (req.mediaType == "pdf" || req.mediaType == "image") {
      req.message = await commonFunction.getSecureUrl(req.message);
    }
    chatSchema.findOne(query).exec(async (err, result) => {
      if (err) {
        response = {
          response_code: 500,
          response_message: "Internal server error.",
          err,
        };
        return res.send(response);
      } else if (!result) {
        req.messages = [
          {
            message: req.message,
            mediaType: req.mediaType ? req.mediaType : "text",
            receiverId: req.receiverId,
            createdAt: new Date().toISOString(),
          },
        ];
        new chatSchema(req).save(async (err1, succ) => {
          if (err1) {
            response = {
              response_code: 500,
              response_message: "Internal server error.",
              err1,
            };
            return res.send(response);
          } else {
            chatHistory = await chatSchema
              .find(chatQuery)
              .sort({ "messages.createdAt": -1 })
              .populate("senderId receiverId", "name profilePic")
              .exec();
            var reversed_array = succ;
            reversed_array.messages = reversed_array.messages.reverse();
            response = {
              response_code: 200,
              response_message: "Message send successfully.",
              result: reversed_array,
              chatHistory,
            };
            return res.send(response);
          }
        });
      } else {
        if (result.status == "ACTIVE") {
          var messages = [
            {
              message: req.message,
              receiverId: req.receiverId,
              mediaType: req.mediaType ? req.mediaType : "text",
              createdAt: new Date().toISOString(),
            },
          ];
          chatHistory = await chatSchema
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
                return res.send(response);
              } else if (!succ1) {
                response = {
                  response_code: 404,
                  response_message: "Data not found",
                };
                return res.send(response);
              } else {
                var reversed_array = succ1;
                reversed_array.messages = reversed_array.messages.reverse();
                response = {
                  response_code: 200,
                  response_message: "Message send successfully.",
                  result: reversed_array,
                  chatHistory,
                };
                return res.send(response);
              }
            }
          );
        } else {
          response = {
            response_code: 404,
            response_message: "You cant chat",
            result: result,
          };
          return res.send(response);
        }
      }
    });
  }
  /**
   * Function Name : chattingHistory
   * Description   : history of user/practitioner chat
   *
   * @return response
   */

  ChattingHistory(req) {
    let query = {};
    let response = {};
    return new Promise(async (resolve, reject) => {
      if (req.senderId) {
        query.$or = [
          { receiverId: mongoose.Types.ObjectId(req.senderId) },
          { senderId: mongoose.Types.ObjectId(req.senderId) },
        ];
      }
      if (req.chatId) {
        query._id = mongoose.Types.ObjectId(req.chatId);
      }
      let result = await chatSchema.aggregate([
        { $match: query },
        {
          $addFields: {
            unReadCount: {
              $size: {
                $filter: {
                  input: "$messages",
                  cond: {
                    $and: [
                      { $eq: ["$$this.messageStatus", "Unread"] },
                      {
                        $eq: [
                          "$$this.receiverId",
                          mongoose.Types.ObjectId(req.senderId),
                        ],
                      },
                    ],
                  },
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
      if (result.length == 0) {
        response = {
          response_code: 200,
          response_message: "Data found successfully",
          result: [],
        };
        resolve(response);
      } else {
        response = {
          response_code: 200,
          response_message: "Data found successfully.",
          result: result,
        };
        resolve(response);
      }
    });
  }

  /**
   * @swagger
   * /socket/chatHistory:
   *   post:
   *     tags:
   *       - SOCKET
   *     description: chatHistory
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: token
   *         in: header
   *         required: false
   *       - name: senderId
   *         description: senderId
   *         in: formData
   *         required: false
   *       - name: chatId
   *         description: chatId
   *         in: formData
   *         required: false
   *     responses:
   *       200:
   *         description: Returns success message
   */

  async chatHistory(req, res, next) {
    try {
      var query = {};
      if (req.body.senderId) {
        query.$or = [
          { receiverId: mongoose.Types.ObjectId(req.body.senderId) },
          { senderId: mongoose.Types.ObjectId(req.body.senderId) },
        ];
      }
      if (req.body.chatId) {
        query._id = mongoose.Types.ObjectId(req.body.chatId);
      }

      let result = await chatSchema.aggregate([
        { $match: query },
        {
          $addFields: {
            unReadCount: {
              $size: {
                $filter: {
                  input: "$messages",
                  cond: {
                    $and: [
                      { $eq: ["$$this.messageStatus", "Unread"] },
                      {
                        $eq: [
                          "$$this.receiverId",
                          mongoose.Types.ObjectId(req.userId),
                        ],
                      },
                    ],
                  },
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
      if (result.length == 0) {
        return res.json(new response(result, responseMessage.DATA_FOUND));
      } else {
        return res.json(new response(result, responseMessage.DATA_FOUND));
      }
    } catch (error) {
      return next(error);
    }
  }

  /**
   * Function Name : viewChat
   * Description   : view the chat of practitioner
   *
   * @return response
   */
  viewChat(req) {
    let response = {};
    return new Promise((resolve, reject) => {
      chatSchema
        .findOne({ _id: req.chatId, status: "ACTIVE" })
        .sort({ "messages.createdAt": -1 })
        .exec((error, findRes) => {
          if (error) {
            response = {
              response_code: 500,
              response_message: "Internal server error.",
              err,
            };
            resolve(response);
          } else if (!findRes) {
            response = {
              response_code: 404,
              response_message: "Data not found",
              result: [],
            };
            resolve(response);
          } else {
            response = {
              response_code: 200,
              response_message: "Data found successfully.",
              result: findRes,
            };
            resolve(response);
          }
        });
    });
  }

  /**
   * Function Name : clearChat
   * Description   : clean all chat
   *
   * @return response
   */
  clearChat(req) {
    try {
      var query = { clearStatus: false },
        response;
      if (req.senderId && req.receiverId) {
        query.$and = [
          { $or: [{ senderId: req.senderId }, { senderId: req.receiverId }] },
          {
            $or: [{ receiverId: req.receiverId }, { receiverId: req.senderId }],
          },
        ];
      }
      return new Promise((resolve, reject) => {
        chatSchema.findOneAndUpdate(
          query,
          { $set: { messages: [] } },
          { new: true },
          (error, chatRes) => {
            if (error) {
              response = {
                response_code: 500,
                response_message: "Internal server error.",
                error,
              };
              resolve(response);
            } else if (!chatRes) {
              response = {
                response_code: 404,
                response_message: "Data not found",
                result: [],
              };
              resolve(response);
            } else {
              response = {
                response_code: 200,
                response_message: "Cleared successfully.",
                result: chatRes,
              };
              resolve(response);
            }
          }
        );
      });
    } catch (error) {
      return error;
    }
  }

  /**
   * @swagger
   * /socket/readChat/{chatId}:
   *   get:
   *     tags:
   *       - SOCKET
   *     description: readChat
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: token
   *         in: header
   *         required: false
   *       - name: chatId
   *         description: chatId
   *         in: path
   *         required: false
   *     responses:
   *       200:
   *         description: Returns success message
   */

  async readChat(req, res, next) {
    try {
      let userResult = await findUserData({ _id: req.userId });
      if (!userResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      let chatData = await chatSchema.findOne({
        _id: req.params.chatId,
        status: { $ne: status.DELETE },
      });
      if (!chatData) {
        return res.send({
          response_code: 404,
          response_message: "Data not found",
          result: [],
        });
      }
      await chatSchema.update(
        { _id: chatData._id, "messages.receiverId": userResult._id },
        { $set: { "messages.$[elem].messageStatus": "Read" } },
        { arrayFilters: [{ "elem.receiverId": userResult._id }], multi: true }
      );
      return res.json({
        response_code: 200,
        response_message: "Read all messages successfully.",
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /socket/deleteChatHistory:
   *   get:
   *     tags:
   *       - SOCKET
   *     description: deleteChatHistory
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Returns success message
   */

  async deleteChatHistory(req, res, next) {
    try {
      let dataResults = await chatSchema.deleteMany({});
      return res.json(new response(dataResults, responseMessage.DATA_FOUND));
    } catch (error) {
      return next(error);
    }
  }

  async messageReceiveUserCount(token) {
    try {
      return new Promise(async (resolve, reject) => {
        let userId = await auth.verifyTokenBySocket(token);
        var query = {};
        query.messages = {
          $elemMatch: {
            receiverId: mongoose.Types.ObjectId(userId),
            messageStatus: "Unread",
          },
        };
        let result = await chatSchema.aggregate([
          { $match: query },
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
        ]);
        let count = 0;
        for (let i of result) {
          if (i.unReadCount > 0) {
            count += 1;
          }
        }
        responses = {
          responseCode: 200,
          responseMessage: "Data fetched successfully!",
          responseResult: count,
        };
        resolve(responses);
      });
    } catch (error) {
      responses = error;
      reject(responses);
    }
  }

  async chatHistoryWebSocket(req) {
    try {
      let query = {};
      let response = {};
      return new Promise(async (resolve, reject) => {
        if (req.senderId) {
          query.$or = [
            { receiverId: mongoose.Types.ObjectId(req.senderId) },
            { senderId: mongoose.Types.ObjectId(req.senderId) },
          ];
        }
        if (req.chatId) {
          query._id = mongoose.Types.ObjectId(req.chatId);
        }
        let result = await chatSchema.aggregate([
          { $match: query },
          {
            $addFields: {
              unReadCount: {
                $size: {
                  $filter: {
                    input: "$messages",
                    cond: {
                      $and: [
                        { $eq: ["$$this.messageStatus", "Unread"] },
                        {
                          $eq: [
                            "$$this.receiverId",
                            mongoose.Types.ObjectId(req.senderId),
                          ],
                        },
                      ],
                    },
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
        if (result.length == 0) {
          response = {
            response_code: 200,
            response_message: "Data found successfully",
            result: [],
          };
          resolve(response);
        } else {
          response = {
            response_code: 200,
            response_message: "Data found successfully.",
            result: result,
          };
          resolve(response);
        }
      });
    } catch (error) {
      responses = error;
      reject(responses);
    }
  }
}

export default new socketController();
