import Mongoose, { Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate";
import status from "../enums/status";
const options = {
  collection: "referral",
  timestamps: true,
};

const referralSchema = new Schema(
  {
    referralAmount: {
      type: Number,
    },
    refereeAmount: {
      type: Number,
    },
    coin: { type: String },
    status: { type: String, default: status.ACTIVE },
  },
  options
);
referralSchema.plugin(mongoosePaginate);
referralSchema.plugin(mongooseAggregatePaginate);
module.exports = Mongoose.model("referral", referralSchema);

Mongoose.model("referral", referralSchema).find(
  { status: { $ne: status.DELETE } },
  async (err, result) => {
    if (err) {
      console.log("Default fee creation error", err);
    } else if (result.length != 0) {
      console.log("Default fee already created.");
    } else {
      let obj = {
        coin: "MASS",
        referralAmount: 100,
        refereeAmount: 50,
      };
      Mongoose.model("referral", referralSchema).create(
        obj,
        (err1, staticResult) => {
          if (err1) {
            console.log("Default referral error.", err1);
          } else {
            console.log("Default referral created.", staticResult);
          }
        }
      );
    }
  }
);
