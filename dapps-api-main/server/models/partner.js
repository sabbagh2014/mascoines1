import Mongoose, { Schema } from "mongoose";
import status from "../enums/status";
import mongoosePaginate from "mongoose-paginate";

const options = {
  collection: "partner",
  timestamps: true,
};

const schemaDefination = new Schema(
  {
    logo: { type: String },
    name: { type: String },
    description: { type: String },
    status: { type: String, default: status.ACTIVE },
  },
  options
);
schemaDefination.plugin(mongoosePaginate);
module.exports = Mongoose.model("partner", schemaDefination);
