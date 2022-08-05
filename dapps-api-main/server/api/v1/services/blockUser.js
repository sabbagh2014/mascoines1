import blockUserModel from "../../../models/blockUser";

const blockUserServices = {
  createBlockUser: async (insertObj) => {
    return await blockUserModel.create(insertObj);
  },

  findBlockUser: async (query) => {
    return await blockUserModel
      .findOne(query)
      .populate("userId")
      .select("-ethAccount.privateKey -password -referralCode -permissions");
  },

  updateBlockUser: async (query, updateObj) => {
    return await blockUserModel.findOneAndUpdate(query, updateObj, {
      new: true,
    });
  },

  blockUserList: async (query) => {
    return await blockUserModel
      .find(query)
      .populate([
        {
          path: "userId",
          select: "-ethAccount.privateKey -password -referralCode -permissions",
        },
        { path: "chatId" },
      ]);
  },
};

module.exports = { blockUserServices };
