import Mongoose, { Schema } from "mongoose";
import status from "../enums/status";
import mongoosePaginate from "mongoose-paginate";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate";
const options = {
  collection: "blockuser",
  timestamps: true,
};

const schemaDefination = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    message: {
      type: String,
    },
    time: {
      type: String,
    },
    tillValid: {
      type: Date,
    },
    blockStatus: {
      type: String,
      enum: ["ACTIVE", "BLOCK"],
      default: "BLOCK",
    },
    status: { type: String, default: status.ACTIVE },
  },
  options
);

schemaDefination.plugin(mongoosePaginate);
schemaDefination.plugin(mongooseAggregatePaginate);
module.exports = Mongoose.model("blockuser", schemaDefination);
