import Mongoose, { Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate";
import status from "../enums/status";
const options = {
  collection: "fee",
  timestamps: true,
};

const feeSchema = new Schema(
  {
    planType: {
      type: String,
    },
    massHeld: {
      type: Number,
    },
    contentCreatorFee: { type: Number },
    clientFee: { type: Number },
    status: { type: String, default: status.ACTIVE },
  },
  options
);
feeSchema.plugin(mongoosePaginate);
feeSchema.plugin(mongooseAggregatePaginate);
module.exports = Mongoose.model("fee", feeSchema);

Mongoose.model("fee", feeSchema).find(
  { status: { $ne: status.DELETE } },
  async (err, result) => {
    if (err) {
      console.log("Default fee creation error", err);
    } else if (result.length != 0) {
      console.log("Default fee already created.");
    } else {
      let obj1 = {
        planType: "Basic",
        massHeld: 0,
        contentCreatorFee: 3,
        clientFee: 0,
      };
      let obj2 = {
        planType: "Silver",
        massHeld: 100,
        contentCreatorFee: 2.5,
        clientFee: 0,
      };
      let obj3 = {
        planType: "Gold",
        massHeld: 250,
        contentCreatorFee: 2,
        clientFee: 0,
      };
      let obj4 = {
        planType: "Diamond",
        massHeld: 1500,
        contentCreatorFee: 1.5,
        clientFee: 0,
      };
      let obj5 = {
        planType: "Mass Plus",
        massHeld: 10000,
        contentCreatorFee: 1,
        clientFee: 0,
      };
      Mongoose.model("fee", feeSchema).create(
        obj1,
        obj2,
        obj3,
        obj4,
        obj5,
        (err1, staticResult) => {
          if (err1) {
            console.log("Default fee error.", err1);
          } else {
            console.log("Default fee created.", staticResult);
          }
        }
      );
    }
  }
);
