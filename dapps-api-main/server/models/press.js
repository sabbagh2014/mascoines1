import Mongoose, { Schema } from "mongoose";
import status from "../enums/status";
import mongoosePaginate from "mongoose-paginate";

const options = {
  collection: "press",
  timestamps: true,
};

const schemaDefination = new Schema(
  {
    logo: { type: String },
    title: { type: String },
    link: { type: String },
    status: { type: String, default: status.ACTIVE },
  },
  options
);
schemaDefination.plugin(mongoosePaginate);
module.exports = Mongoose.model("press", schemaDefination);
