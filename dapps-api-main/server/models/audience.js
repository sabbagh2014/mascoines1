import Mongoose, { Schema } from "mongoose";
import status from "../enums/status";
import mongoosePaginate from "mongoose-paginate";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate";
const options = {
  collection: "audience",
  timestamps: true,
};

const schemaDefination = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    nftId: [
      {
        type: Schema.Types.ObjectId,
        ref: "nft",
      },
    ],
    users: [
      {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
    ],
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
    title: {
      type: String,
    },
    details: {
      type: String,
    },
    mediaUrl: {
      type: String,
    },
    postType: {
      type: String,
      enum: ["PRIVATE", "PUBLIC"],
    },
    status: { type: String, default: status.ACTIVE },
  },
  options
);

schemaDefination.plugin(mongoosePaginate);
schemaDefination.plugin(mongooseAggregatePaginate);
module.exports = Mongoose.model("audience", schemaDefination);
