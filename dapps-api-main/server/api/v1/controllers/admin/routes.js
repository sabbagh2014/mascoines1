import Express from "express";
import controller from "./controller";
import auth from "../../../../helper/auth";
import upload from "../../../../helper/uploadHandler";

export default Express.Router()

  .get("/testCancelOrder", controller.testCancelOrder)
  .post("/addAdmin", controller.addAdmin)
  .post("/register", controller.register)
  .post("/login", controller.login)
  .post("/forgotPassword", controller.forgotPassword)
  .put("/resetPassword/:token", controller.resetPassword)
  .get("/listPress", controller.listPress)
  .get("/viewPress", controller.viewPress)
  .get("/listPartner", controller.listPartner)
  .get("/viewPartner", controller.viewPartner)
  .get("/viewLogo", controller.viewLogo)
  .get("/listLogo", controller.listLogo)
  .get("/viewAdvertisement", controller.viewAdvertisement)
  .get("/viewSocial", controller.viewSocial)
  .get("/listSocial", controller.listSocial)
  .get("/banner", controller.viewBanner)
  .get("/video", controller.viewVideo)

  .use(auth.verifyToken)
  .delete("/deleteAdmin", controller.deleteAdmin)
  .post("/setPermissions", controller.setPermissions)
  .get("/profile", controller.profile)
  .get("/userList", controller.userList)
  .get("/adminList", controller.adminList)
  .get("/moderatorList", controller.moderatorList)
  .get("/viewUser/:_id", controller.viewUser)
  .post("/subscription", controller.addSubscription)
  .get("/subscription/:_id", controller.viewSubscription)
  .put("/subscription", controller.editSubscription)
  .delete("/subscription", controller.deleteSubscription)
  .get("/subscriptionList", controller.subscriptionList)
  .get("/nft/:_id", controller.viewNFT)
  .get("/listNFT", controller.listNFT)
  .get("/order/:_id", controller.viewOrder)
  .get("/listOrder", controller.listOrder)
  .delete("/deleteAuction", controller.deleteOrder)
  .put("/stopAuction", controller.stopAuction)
  .get("/bid/:_id", controller.viewBid)
  .get("/listBid", controller.listBid)
  .get("/dashboard", controller.dashboard)
  .get("/totalAdminBalance", controller.totalAdminBalance)
  .get("/getAdminTotalEarnings", controller.getAdminTotalEarnings)
  .get("/totalUserFunds", controller.getTotalUserFunds)
  .get("/moderator/:_id", controller.viewModerator)
  .put("/moderator", controller.editModerator)
  .get("/listModerator", controller.listModerator)
  .get("/report/:_id", controller.viewReport)
  .put("/report", controller.editReport)
  .delete("/report", controller.deleteReport)
  .get("/listReport", controller.listReport)
  .post("/blockUser", controller.blockUser)
  .post("/sendWarningMessage", controller.sendWarningMessage)
  .get("/viewFee/:_id", controller.viewFee)
  .put("/editFee", controller.editFee)
  .delete("/deleteFee", controller.deleteFee)
  .get("/listFee", controller.listFee)
  .get("/listUser", controller.listUser)
  .delete("/deletePress", controller.deletePress)
  .put("/activeDeactivePress", controller.activeDeactivePress)
  .delete("/deletePartner", controller.deletePartner)
  .put("/activeDeactivePartner", controller.activeDeactivePartner)
  .delete("/deleteLogo", controller.deleteLogo)
  .get("/subscriptionListOfParticular", controller.subscriptionListOfParticular)
  .get("/viewSubscriptionOfParticular", controller.viewSubscriptionOfParticular)
  .delete("/removeAdvertisement", controller.removeAdvertisement)
  .put("/activeDeactiveAdvertisement", controller.activeDeactiveAdvertisement)
  .put("/editSocial", controller.editSocial)
  .get("/donationTransactionlist", controller.donationTransactionlist)
  .get("/viewDepositeTransaction/:_id", controller.viewDepositeTransaction)
  .get("/viewTransaction/:_id", controller.viewTransaction)
  .get("/transactionList", controller.transactionList)
  .post("/subAdmin", controller.addSubAdmin)
  .get("/subAdmin/:_id", controller.viewSubAdmin)
  .put("/subAdmin", controller.editSubAdmin)
  .patch("/blockUnblockSubAdmin", controller.blockUnblockSubAdmin)
  .delete("/subAdmin", controller.deleteSubAdmin)
  .get("/subAdminList", controller.subAdminList)
  .get("/referralSetting", controller.getReferralSetting)
  .put("/referralSetting", controller.updateReferralSetting)
  .get("/listAdvertisement", controller.listAdvertisement)
  .delete("/banner", controller.deleteBanner)
  .get("/listBanner", controller.listBanner)
  .patch("/changeBannerStatus", controller.changeBannerStatus)
  .delete("/video", controller.deleteVideo)
  .get("/listVideo", controller.listVideo)
  .patch("/changeVideoStatus", controller.changeVideoStatus)
  .use(upload.uploadFile)
  .post("/addPress", controller.addPress)
  .put("/editPress", controller.editPress)
  .post("/addPartner", controller.addPartner)
  .put("/editPartner", controller.editPartner)
  .post("/addAdvertisement", controller.addAdvertisement)
  .put("/editAdvertisement", controller.editAdvertisement)
  .post("/addLogo", controller.addLogo)
  .put("/editLogo", controller.editLogo)
  .post("/banner", controller.addBanner)
  .put("/banner", controller.editBanner)
  .post("/video", controller.addVideo)
  .put("/video", controller.editVideo);
