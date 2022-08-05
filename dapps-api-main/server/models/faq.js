import Mongoose, { Schema } from "mongoose";
import status from "../enums/status";

const options = {
  collection: "faq",
  timestamps: true,
};

const schemaDefination = new Schema(
  {
    question: { type: String },
    answer: { type: String },
    status: { type: String, default: status.ACTIVE },
  },
  options
);

module.exports = Mongoose.model("faq", schemaDefination);
