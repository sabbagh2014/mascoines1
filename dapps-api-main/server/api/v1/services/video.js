import videoModel from "../../../models/video";
import status from "../../../enums/status";

const videoServices = {
  createVideo: async (insertObj) => {
    return await videoModel.create(insertObj);
  },

  findVideo: async (query) => {
    return await videoModel.findOne(query);
  },

  findAllVideos: async (query) => {
    return await videoModel.find(query);
  },

  updateVideo: async (query, updateObj) => {
    return await videoModel.findOneAndUpdate(query, updateObj, { new: true });
  },

  videoList: async (validatedBody) => {
    let query = { status: { $ne: status.DELETE } };
    const { search, fromDate, toDate, page, limit } = validatedBody;
    if (search) {
      query.title = { $regex: search, $options: "i" };
    }
    if (fromDate && !toDate) {
      query.createdAt = { $gte: fromDate };
    }
    if (!fromDate && toDate) {
      query.createdAt = { $lte: toDate };
    }
    if (fromDate && toDate) {
      query.$and = [
        { createdAt: { $gte: fromDate } },
        { createdAt: { $lte: toDate } },
      ];
    }
    let options = {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 15,
      sort: { createdAt: -1 },
    };
    return await videoModel.paginate(query, options);
  },
};

module.exports = { videoServices };
