import Mongoose, { Schema } from "mongoose";
import status from "../enums/status";
import mongoosePaginate from "mongoose-paginate";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate";
const options = {
  collection: "notification",
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
    likeBy: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    nftIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "auctionNft",
      },
    ],
    nftId: {
      type: Schema.Types.ObjectId,
      ref: "auctionNft",
    },
    orderId: {
      type: Schema.Types.ObjectId,
      ref: "order",
    },
    chatId: {
      type: Schema.Types.ObjectId,
      ref: "chatting",
    },
    subscriberId: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    reportedBy: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    image: {
      type: String,
    },
    notificationType: {
      type: String,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    status: { type: String, default: status.ACTIVE },
  },
  options
);

schemaDefination.plugin(mongoosePaginate);
schemaDefination.plugin(mongooseAggregatePaginate);
module.exports = Mongoose.model("notification", schemaDefination);
