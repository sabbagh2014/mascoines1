import Mongoose, { Schema } from "mongoose";
import status from "../enums/status";
import mongoosePaginate from "mongoose-paginate";

const options = {
  collection: "banner",
  timestamps: true,
};

const schemaDefination = new Schema(
  {
    title: { type: String },
    description: { type: String },
    image: { type: String },
    url: { type: String },
    mediaType: {
      type: String,
      enum: ["image", "video"],
    },
    status: { type: String, default: status.ACTIVE },
  },
  options
);
schemaDefination.plugin(mongoosePaginate);
module.exports = Mongoose.model("banner", schemaDefination);
