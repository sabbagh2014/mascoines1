import notificationModel from "../../../models/notification";
import userModel from "../../../models/user";

const notificationServices = {
  createNotification: async (insertObj) => {
    return await notificationModel.create(insertObj);
  },

  findNotification: async (query) => {
    return await notificationModel.findOne(query);
  },

  updateNotification: async (query, updateObj) => {
    return await notificationModel.findOneAndUpdate(query, updateObj, {
      new: true,
    });
  },

  multiUpdateNotification: async (query, updateObj) => {
    return await notificationModel.updateMany(query, updateObj, {
      multi: true,
    });
  },

  notificationList: async (query) => {
    let activeIds = await getActiveUser();
    query.userId = { $in: activeIds };
    return await notificationModel.find(query);
  },

  notificationListWithSort: async (query) => {
    // let activeIds = await getActiveUser();
    // query.userId = { $in: activeIds };
    return await notificationModel
      .find(query)
      .populate("nftIds chatId")
      .sort({ createdAt: -1 });
  },
};

module.exports = { notificationServices };

const getActiveUser = async () => {
  let userId = await userModel.find({ blockStatus: false }).select("_id");
  userId = userId.map((i) => i._id);
  return userId;
};
