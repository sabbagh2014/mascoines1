import subscriptionModel from "../../../models/subscription";
import userModel from "../../../models/user";
import mongoose from "mongoose";

const subscriptionServices = {
  createSubscription: async (insertObj) => {
    return await subscriptionModel.create(insertObj);
  },

  findSubscription: async (query) => {
    return await subscriptionModel.findOne(query);
  },

  updateSubscription: async (query, updateObj) => {
    return await subscriptionModel.findOneAndUpdate(query, updateObj, {
      new: true,
    });
  },

  subscriptionList: async (query) => {
    // let activeIds = await getActiveUser();
    // query.userId = { $in: activeIds };
    return await subscriptionModel.find(query).populate("nftId");
  },

  subscriptionListWithAggregate: async (userId) => {
    // validTillDate: { $gt: new Date(new Date().toISOString()) }
    let query = { userId: mongoose.Types.ObjectId(userId) };
    return await subscriptionModel.aggregate([
      { $match: query },
      {
        $lookup: {
          from: "nft",
          as: "bundleDetails",
          let: {
            nft_id: "$nftId",
          },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$$nft_id", "$_id"] },
              },
            },
            {
              $addFields: {
                isLike: {
                  $cond: {
                    if: {
                      $in: [mongoose.Types.ObjectId(userId), "$likesUsers"],
                    },
                    then: true,
                    else: false,
                  },
                },
              },
            },
            {
              $lookup: {
                from: "user",
                localField: "userId",
                foreignField: "_id",
                as: "userId",
              },
            },
            {
              $unwind: "$userId",
            },
            {
              $project: {
                "userId.ethAccount.privateKey": 0,
                "userId.password": 0,
                "userId.referralCode": 0,
              },
            },
          ],
        },
      },
      { $sort: { createdAt: -1 } },
    ]);
  },
};

module.exports = { subscriptionServices };

const getActiveUser = async () => {
  let userId = await userModel.find({ blockStatus: false }).select("_id");
  userId = userId.map((i) => i._id);
  return userId;
};
