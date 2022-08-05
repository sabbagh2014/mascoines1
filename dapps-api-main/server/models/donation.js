import Mongoose, { Schema } from "mongoose";
import status from "../enums/status";

const options = {
  collection: "donation",
  timestamps: true,
};

const schemaDefination = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    massBalance: { type: Number, default: 0 },
    usdtBalance: { type: Number, default: 0 },
    ethBalance: { type: Number, default: 0 },
    bnbBalace: { type: Number, default: 0 },
    btcBalance: { type: Number, default: 0 },
    history: [
      {
        senderUserId: {
          type: Schema.Types.ObjectId,
          ref: "user",
        },
        message: { type: String },
        amount: { type: Number },
        transactionHash: { type: String },
        coinName: { type: String },
      },
    ],
    certificateNumber: { type: String },
    status: { type: String, default: status.ACTIVE },
  },
  options
);

module.exports = Mongoose.model("donation", schemaDefination);
