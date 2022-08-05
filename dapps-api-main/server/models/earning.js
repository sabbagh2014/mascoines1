import Mongoose, { Schema } from "mongoose";
import status from "../enums/status";
import mongoosePaginate from "mongoose-paginate";

const options = {
  collection: "earning",
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
    referralBalance: { type: Number, default: 0 },
    status: { type: String, default: status.ACTIVE },
  },
  options
);

schemaDefination.plugin(mongoosePaginate);
module.exports = Mongoose.model("earning", schemaDefination);
