import Mongoose, { Schema } from "mongoose";
import status from "../enums/status";

const options = {
  collection: "withdraw",
  timestamps: true,
};

const schemaDefination = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    fromAddress: { type: String },
    privateKey: { type: String },
    toAddress: { type: String },
    referralUserAddress: { type: String },
    amount: { type: Number },
    coin: { type: String },
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

module.exports = Mongoose.model("withdraw", schemaDefination);
