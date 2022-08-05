import Mongoose, { Schema } from "mongoose";
import status from "../enums/status";

const options = {
  Collection: "logo",
  timestamps: true,
};
const schemaDefination = new Schema(
  {
    logoImage: {
      type: String,
      default: "",
    },
    logoTitle: {
      type: String,
    },
    status: { type: String, default: status.ACTIVE },
  },
  options
);

module.exports = Mongoose.model("logo", schemaDefination);
