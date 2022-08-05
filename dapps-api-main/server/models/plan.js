import Mongoose, { Schema } from "mongoose";
import status from "../enums/status";
import mongoosePaginate from "mongoose-paginate";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate";
const options = {
  collection: "plan",
  timestamps: true,
};

const schemaDefination = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    subscriptionId: {
      type: Schema.Types.ObjectId,
      ref: "subscription",
    },
    planType: {
      type: String,
    },
    planName: {
      type: String,
    },
    status: { type: String, default: status.ACTIVE },
  },
  options
);

schemaDefination.plugin(mongoosePaginate);
schemaDefination.plugin(mongooseAggregatePaginate);
module.exports = Mongoose.model("plan", schemaDefination);
