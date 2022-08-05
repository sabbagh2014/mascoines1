import Mongoose, { Schema } from "mongoose";
import status from "../enums/status";
import mongoosePaginate from "mongoose-paginate";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate";
const options = {
  collection: "bid",
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
    orderId: {
      type: Schema.Types.ObjectId,
      ref: "order",
    },
    name: {
      type: String,
    },
    bid: {
      type: String,
    },
    date: {
      type: String,
    },
    statues: {
      type: String,
    },
    bidStatus: {
      type: String,
      enum: ["ACCEPTED", "REJECTED"],
      default: "ACCEPTED",
    },
    status: { type: String, default: status.ACTIVE },
  },
  options
);

schemaDefination.plugin(mongoosePaginate);
schemaDefination.plugin(mongooseAggregatePaginate);
module.exports = Mongoose.model("bid", schemaDefination);
