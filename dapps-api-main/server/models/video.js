import Mongoose, { Schema } from "mongoose";
import status from "../enums/status";
import mongoosePaginate from "mongoose-paginate";

const options = {
  collection: "video",
  timestamps: true,
};

const schemaDefination = new Schema(
  {
    title: { type: String },
    video: { type: String },
    status: { type: String, default: status.ACTIVE },
  },
  options
);
schemaDefination.plugin(mongoosePaginate);
module.exports = Mongoose.model("video", schemaDefination);
