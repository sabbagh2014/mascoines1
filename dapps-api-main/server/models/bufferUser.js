import Mongoose, { Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate";
import status from "../enums/status";
const options = {
  collection: "bufferUser",
  timestamps: true,
};
const bufferModel = new Schema(
  {
    email: { type: String },
    otp: { type: Number },
    otpVerification: { type: Boolean, default: false },
    otpTime: { type: Number },

    status: { type: String, default: status.ACTIVE },
  },
  options
);
bufferModel.plugin(mongoosePaginate);
bufferModel.plugin(mongooseAggregatePaginate);
module.exports = Mongoose.model("bufferUser", bufferModel);
