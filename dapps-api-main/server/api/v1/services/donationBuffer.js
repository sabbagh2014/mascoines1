import donationBufferModel from "../../../models/donationBuffer";

const donationBufferServices = {
  createDonationBuffer: async (insertObj) => {
    return await donationBufferModel.create(insertObj);
  },

  findDonationBuffer: async (query) => {
    return await donationBufferModel.findOne(query);
  },

  updateDonationBuffer: async (query, updateObj) => {
    return await donationBufferModel.findOneAndUpdate(query, updateObj, {
      new: true,
    });
  },

  donationBufferList: async (query) => {
    return await donationBufferModel.find(query);
  },
};

module.exports = { donationBufferServices };
