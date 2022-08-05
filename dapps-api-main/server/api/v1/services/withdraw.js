import withdrawModel from "../../../models/withdrawBuffer";

const withdrawServices = {
  createWithdraw: async (insertObj) => {
    return await withdrawModel.create(insertObj);
  },

  findWithdraw: async (query) => {
    return await withdrawModel.findOne(query);
  },

  updateWithdraw: async (query, updateObj) => {
    return await withdrawModel.findOneAndUpdate(query, updateObj, {
      new: true,
    });
  },

  withdrawList: async (query) => {
    return await withdrawModel.find(query);
  },
};

module.exports = { withdrawServices };
