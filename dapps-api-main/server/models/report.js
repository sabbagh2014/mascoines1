import Mongoose, { Schema } from "mongoose";
import status from "../enums/status";
import mongoosePaginate from "mongoose-paginate";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate";
const options = {
  collection: "report",
  timestamps: true,
};

const schemaDefination = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    chatId: {
      type: Schema.Types.ObjectId,
      ref: "chatting",
    },
    actionApply: {
      type: Boolean,
      default: false,
    },
    reportStatus: {
      type: String,
      enum: ["PENDING", "RESOLVED"],
      default: "PENDING",
    },
    status: { type: String, default: status.ACTIVE },
  },
  options
);

schemaDefination.plugin(mongoosePaginate);
schemaDefination.plugin(mongooseAggregatePaginate);
module.exports = Mongoose.model("report", schemaDefination);
