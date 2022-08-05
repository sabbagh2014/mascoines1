import subscribeBufferModel from "../../../models/subscribeBuffer";

const subscribeBufferServices = {
  createSubscribeBuffer: async (insertObj) => {
    return await subscribeBufferModel.create(insertObj);
  },

  findSubscribeBuffer: async (query) => {
    return await subscribeBufferModel.findOne(query);
  },

  updateSubscribeBuffer: async (query, updateObj) => {
    return await subscribeBufferModel.findOneAndUpdate(query, updateObj, {
      new: true,
    });
  },

  subscribeBufferList: async (query) => {
    return await subscribeBufferModel.find(query);
  },
};

module.exports = { subscribeBufferServices };
