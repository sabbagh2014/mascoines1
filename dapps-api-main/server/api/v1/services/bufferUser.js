import bufferModel from "../../../models/bufferUser";

const bufferServices = {
  createBuffer: async (insertObj) => {
    return await bufferModel.create(insertObj);
  },

  findBuffer: async (query) => {
    return await bufferModel.findOne(query);
  },

  updateBuffer: async (query, updateObj) => {
    return await bufferModel
      .findOneAndUpdate(query, updateObj, { new: true })
      .select("-otp");
  },

  bufferList: async (query) => {
    return await bufferModel.find(query);
  },

  bufferDelete: async (query) => {
    return await bufferModel.deleteOne(query);
  },
};

module.exports = { bufferServices };
