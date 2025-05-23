import Mongoose, { Schema } from "mongoose";
import status from "../enums/status";

const options = {
  collection: "bundle",
  timestamps: true,
};

const schemaDefination = new Schema(
  {
    title: { type: String },
    description: { type: String },
    donationAmount: { type: String },
    duration: { type: String },
    noOfSubscribers: { type: Number },
    services: { type: String },
    image: { type: String },
    status: { type: String, default: status.ACTIVE },
  },
  options
);

module.exports = Mongoose.model("bundle", schemaDefination);
