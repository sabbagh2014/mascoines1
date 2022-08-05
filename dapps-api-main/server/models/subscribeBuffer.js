import Mongoose, { Schema } from "mongoose";
import status from "../enums/status";

const options = {
  collection: "subscribebuffer",
  timestamps: true,
};

const schemaDefination = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    nftId: {
      type: Schema.Types.ObjectId,
      ref: "nft",
    },
    fromAddress: { type: String },
    privateKey: { type: String },
    toAddress: { type: String },
    amount: { type: Number },
    coin: { type: String },
    title: { type: String },
    name: { type: String },
    description: { type: String },
    validTillDate: { type: String },
    masPrice: { type: String },
    duration: { type: String },
    transactionHash: { type: String },
    transactionStatus: {
      type: String,
      enum: ["PENDING", "SUCCESS", "FAILED"],
      default: "PENDING",
    },
    status: { type: String, default: status.ACTIVE },
  },
  options
);

module.exports = Mongoose.model("subscribebuffer", schemaDefination);
