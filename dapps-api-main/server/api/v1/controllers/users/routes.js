import Express from "express";
import controller from "./controller";
import auth from "../../../../helper/auth";
import upload from "../../../../helper/uploadHandler";

export default Express.Router()
  .post("/connectWallet", controller.connectWallet)
  .post("/register", controller.register)
  .put("/verifyOtp", controller.verifyOtp)
  .put("/emailOtp", controller.emailOtp)
  .put("/resendOtp", controller.resendOtp)
  .post("/login", controller.login)
  .get("/getUser/:userName", controller.getUser)
  .get("/getUserDetail/:userName", controller.getUserDetail)
  .get("/userList", controller.userList)
  .get("/latestUserList", controller.latestUserList)
  .get("/bundlePostList/:bundleId", controller.bundlePostList)
  .get("/getAdvertisement", controller.getAdvertisement)
  .get("/getVideos", controller.getVideos)
  .get("/getBanners", controller.getBanners)

  .use(auth.verifyToken)
  .get("/profile", controller.profile)
  .get("/getCoinBalance", controller.getCoinBalance)
  .get("/totalEarnings", controller.getTotalEarnings)
  .post("/exportNFT", controller.exportNFT)
  .get("/commissionFee", controller.getCommissionFee)
  .get("/allUserList", controller.allUserList)
  .get("/nftTransactionList", controller.nftTransactionList)
  .get("/myTransactionHistory", controller.myTransactionHistory)
  .get("/userAllDetails/:_id", controller.userAllDetails)
  .get("/getBalance/:address/:coin", controller.getBalance)

  .put("/updateProfile", controller.updateProfile)
  .get("/subscribeNow/:nftId", controller.subscribeNow)
  .get("/subscribeProfile/:userId", controller.subscribeProfile)
  .get("/profileSubscriberList", controller.profileSubscriberList)
  .get("/profileSubscribeList", controller.profileSubscribeList)
  .get("/subscription/:_id", controller.viewSubscription)
  .delete("/subscription", controller.deleteSubscription)
  .get("/mySubscriptions", controller.mySubscriptions)
  .get("/subscriberList", controller.subscriberList)
  .get("/myFeed", controller.myFeed)
  .get("/likeDislikeNft/:nftId", controller.likeDislikeNft)
  .get("/likeDislikeAuctionNft/:auctionId", controller.likeDislikeAuctionNft)
  .get("/likeDislikeFeed/:feedId", controller.likeDislikeFeed)
  .get("/likeDislikeUser/:userId", controller.likeDislikeUser)

  .get("/reportNow/:chatId", controller.reportNow)
  .get("/bundle/:_id", controller.viewBundle)
  .get("/bundleContentList", controller.bundleContentList)
  .post("/donation", controller.donation)
  .get("/donateUserList", controller.donateUserList)
  .get("/getCategory", controller.getCategory)
  .get("/getCertificates", controller.getCertificates)
  .get("/sharedBundleList", controller.sharedBundleList)
  .get("/viewTransaction/:_id", controller.viewTransaction)
  .get("/transactionList", controller.transactionList)
  .get("/donationTransactionlist", controller.donationTransactionlist)
  .post("/publicPrivateFeed", controller.publicPrivateFeed)
  .get("/viewMyfeed", controller.viewMyfeed)
  .get("/userprofile", controller.userprofile)
  .post("/privatePublicFeed", controller.privatePublicFeed)
  .get("/findContentCreator/:_id", controller.findContentCreator)
  .delete("/unSubscription", controller.unSubscription)
  .get("/depositeTransactionlist", controller.depositeTransactionlist)
  .get("/sharedFeedList", controller.sharedFeedList)

  .use(upload.uploadFile)
  .post("/shareWithAudience", controller.shareWithAudience);
