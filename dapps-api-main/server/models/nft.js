import Mongoose, { Schema } from "mongoose";
import status from "../enums/status";
import mongoosePaginate from "mongoose-paginate";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate";
const options = {
  collection: "nft",
  timestamps: true,
};

const schemaDefination = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    orderId: [
      {
        type: Schema.Types.ObjectId,
        ref: "order",
      },
    ],
    bidId: [
      {
        type: Schema.Types.ObjectId,
        ref: "bid",
      },
    ],
    subscribers: [
      {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    subscriberCount: {
      type: Number,
      default: 0,
    },
    likesUsers: [
      {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    likesCount: {
      type: Number,
      default: 0,
    },
    bundleId: {
      type: Number,
    },
    bundleTitle: {
      type: String,
    },
    bundleName: {
      type: String,
    },
    donationAmount: {
      type: String,
    },
    coinName: {
      type: String,
    },
    duration: {
      type: String,
    },
    expiryTime: {
      type: String,
    },
    mediaUrl: {
      type: String,
    },
    details: {
      type: String,
    },
    contractAddress: {
      type: String,
    },
    tokenId: {
      type: String,
    },
    tokenName: {
      type: String,
    },
    uri: {
      type: String,
    },
    mediaFile: {
      type: String,
    },
    coverImage: {
      type: String,
    },
    isPlace: {
      type: Boolean,
      default: false,
    },
    isShared: {
      type: Boolean,
      default: false,
    },
    bundleType: {
      type: String,
      enum: ["PRIVATE", "PUBLIC"],
    },
    status: { type: String, default: status.ACTIVE },
  },
  options
);

schemaDefination.plugin(mongoosePaginate);
schemaDefination.plugin(mongooseAggregatePaginate);
module.exports = Mongoose.model("nft", schemaDefination);
