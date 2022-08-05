import Mongoose, { Schema } from "mongoose";
import status from "../enums/status";
import mongoosePaginate from "mongoose-paginate";

const options = {
  collection: "transaction",
  timestamps: true,
};

const schemaDefination = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    adminId: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    nftId: {
      type: Schema.Types.ObjectId,
      ref: "nft",
    },
    nftUserId: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    referrarId: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    toDonationUser: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    amount: { type: Number },
    adminCommission: { type: Number },
    transactionHash: { type: String },
    coinName: { type: String },
    transactionStatus: {
      type: String,
      enum: ["PENDING", "SUCCESS", "FAILED"],
      default: "SUCCESS",
    },
    transactionType: { type: String },
    status: { type: String, default: status.ACTIVE },
  },
  options
);

schemaDefination.plugin(mongoosePaginate);
module.exports = Mongoose.model("transaction", schemaDefination);
