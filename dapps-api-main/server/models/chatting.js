import Mongoose, { Schema } from "mongoose";
import status from "../enums/status";

const options = {
  collection: "chatting",
  timestamps: true,
};

const schemaDefination = new Schema(
  {
    senderId: {
      type: Mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    receiverId: {
      type: Mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    messages: [
      {
        receiverId: {
          type: Mongoose.Schema.Types.ObjectId,
          ref: "user",
        },
        mediaType: {
          type: String,
          enum: ["text", "image", "pdf"],
          default: "text",
        },
        messageStatus: {
          type: String,
          enum: ["Read", "Unread"],
          default: "Unread",
        },
        message: {
          type: String,
        },
        createdAt: {
          type: Date,
          default: new Date().toISOString(),
        },
      },
    ],
    clearStatus: { type: Boolean, default: false },
    status: { type: String, default: status.ACTIVE },
  },
  options
);

module.exports = Mongoose.model("chatting", schemaDefination);
