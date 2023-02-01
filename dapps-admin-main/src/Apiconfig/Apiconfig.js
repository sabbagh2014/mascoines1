let url = "https://node.masplatform.net/api/v1";

if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
  url = "https://localhost:1865/api/v1";
}

const Apiconfigs = {
  //admin
  login: `${url}/admin/login`,
  userlist: `${url}/admin/userList`,
  listorder: `${url}/admin/listOrder`,
  listorderbyid: `${url}/admin/order/`,
  deleteorder: `${url}/admin/deleteAuction`,
  stoporder: `${url}/admin/stopAuction`,
  report: `${url}/admin/listReport`,
  delreport: `${url}/admin/report`,
  chatlist: `${url}/socket/chatHistory`,
  blockuser: `${url}/admin/blockUser`,
  warning: `${url}/admin/sendWarningMessage`,
  adminList: `${url}/admin/adminList`,
  addadmin: `${url}/admin/addAdmin`,
  deladmin: `${url}/admin/deleteAdmin`,
  Permissions: `${url}/admin/setPermissions`,
  listFee: `${url}/admin/listFee`,
  editFee: `${url}/admin/editFee`,
  dashboard: `${url}/admin/dashboard`,
  moderatorList: `${url}/admin/moderatorList`,
  addBanner: `${url}/admin/addAdvertisement`,
  listBanner: `${url}/admin/listAdvertisement`,
  viewBanner: `${url}/admin/viewAdvertisement`,
  editBanner: `${url}/admin/editAdvertisement`,
  transactionList: `${url}/admin/transactionList`,
  removeBanner: `${url}/admin/removeAdvertisement`,
  activeDeactiveAdvertisement: `${url}/admin/activeDeactiveAdvertisement`,
  subAdmin: `${url}/admin/subAdmin`,
  subAdminList: `${url}/admin/subAdminList`,
  blockUnblockSubAdmin: `${url}/admin/blockUnblockSubAdmin`,
  totalAdminBalance: `${url}/admin/totalAdminBalance`,
  getAdminTotalEarnings: `${url}/admin/getAdminTotalEarnings`,
  referralSetting: `${url}/admin/referralSetting`,
  totalUserFunds: `${url}/admin/totalUserFunds`,

  //user
  profile: `${url}/user/profile`,
  auctionNft: `${url}/order/auctionNft/`,
  listBid: `${url}/bid/listBid`,
  staticContentList: `${url}/static/staticContentList`,
  viewStaticPage: `${url}/static/staticContent`,
  editStaticPage: `${url}/static/staticContent`,
  // social
  listSocial: `${url}/admin/listSocial`,
  editSocial: `${url}/admin/editSocial`,
  viewSocial: `${url}/admin/viewSocial`,
  forgotPassword: `${url}/admin/forgotPassword`,
  resetPassword: `${url}/admin/resetPassword/`,
  viewUser: `${url}/admin/viewUser/`,
  //content
  landingContentList: `${url}/content/landingContentList`,
  content: `${url}/content/content`,
  uploadFile: `${url}/content/uploadFile`,
  //banner
  banner: `${url}/admin/banner`,
  listBannerBackground: `${url}/admin/listBanner`,
  changeBannerStatus: `${url}/admin/changeBannerStatus`,

  //video
  video: `${url}/admin/video`,
  listVideo: `${url}/admin/listVideo`,
  changeVideoStatus: `${url}/admin/changeVideoStatus`,
};

export default Apiconfigs;
