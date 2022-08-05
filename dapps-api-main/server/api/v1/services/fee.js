import feeModel from "../../../models/fee";
import userModel from "../../../models/user";

const feeServices = {
  createFee: async (insertObj) => {
    return await feeModel.create(insertObj);
  },

  findFee: async (query) => {
    return await feeModel.findOne(query);
  },

  updateFee: async (query, updateObj) => {
    return await feeModel.findOneAndUpdate(query, updateObj, { new: true });
  },

  feeList: async (query) => {
    return await feeModel.find(query);
  },

  sortFee: async (query) => {
    return await feeModel.findOne(query).sort({ massHeld: -1 });
  },
};

module.exports = { feeServices };
