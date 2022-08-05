import donationModel from "../../../models/donation";
import userModel from "../../../models/user";

const donationServices = {
  createDonation: async (insertObj) => {
    return await donationModel.create(insertObj);
  },

  findDonation: async (query) => {
    return await donationModel.findOne(query);
  },

  updateDonation: async (query, updateObj) => {
    return await donationModel.findOneAndUpdate(query, updateObj, {
      new: true,
    });
  },

  donationList: async (query) => {
    // let activeIds = await getActiveUser();
    // query.userId = { $in: activeIds };
    return await donationModel.find(query).populate([
      {
        path: "userId",
        select:
          "-ethAccount.privateKey -password -referralCode -email -permissions",
      },
      {
        path: "history.senderUserId",
        select:
          "-ethAccount.privateKey -password -referralCode -email -permissions",
      },
    ]);
  },
};

module.exports = { donationServices };

const getActiveUser = async () => {
  let userId = await userModel.find({ blockStatus: false }).select("_id");
  userId = userId.map((i) => i._id);
  return userId;
};
