import Mongoose, { Schema } from "mongoose";
import status from "../enums/status";

const options = {
  collection: "donationbuffer",
  timestamps: true,
};

const schemaDefination = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    receiverUserId: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    name: { type: String },
    fromAddress: { type: String },
    privateKey: { type: String },
    toAddress: { type: String },
    amount: { type: Number },
    coin: { type: String },
    certificate: { type: String },
    supporterCount: { type: Boolean },
    transactionHash: { type: String },
    transactionType: { type: String },
    transactionStatus: {
      type: String,
      enum: ["PENDING", "SUCCESS", "FAILED"],
      default: "PENDING",
    },
    status: { type: String, default: status.ACTIVE },
  },
  options
);

module.exports = Mongoose.model("donationbuffer", schemaDefination);
