import logoModel from "../../../models/logoModel";
import status from "../../../enums/status";

const logoServices = {
  createLogo: async (insertObj) => {
    return await logoModel.create(insertObj);
  },
  findLogo: async (query) => {
    return await logoModel.findOne(query);
  },
  updateLogoById: async (query, updateObj) => {
    return await logoModel.findByIdAndUpdate(query, updateObj, { new: true });
  },
  logoList: async () => {
    return await logoModel.find({});
  },
};

module.exports = { logoServices };
