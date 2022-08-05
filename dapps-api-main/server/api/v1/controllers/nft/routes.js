import Express from "express";
import controller from "./controller";
import auth from "../../../../helper/auth";
import upload from "../../../../helper/uploadHandler";

export default Express.Router()

  .get("/addLikesArray", controller.addLikesArray)
  .get("/updateSubscribersDummy", controller.updateSubscribersDummy)

  .get("/listAllNft", controller.listAllNft)

  .post("/ipfsUploadBase64", controller.ipfsUploadBase64)

  .get("/nftList", controller.allNftAuctionList)

  .use(auth.verifyToken)

  .post("/uploadNFT", controller.uploadNFT)
  .get("/nft/:_id", controller.viewNFT)
  .get("/viewNft/:_id", controller.viewNft)
  .put("/nft", controller.editNFT)
  .delete("/nft", controller.deleteNFT)
  .get("/listNFT", controller.listNFT)
  .get("/bundleList", controller.bundleList)
  .get("/allNftList", controller.allNftList)
  .get("/allNftListWithPopulated", controller.allNftListWithPopulated)

  .post("/createNft", controller.createAuctionNft)
  .get("/viewNft/:_id", controller.viewAuctionNft)
  .put("/editNft", controller.editAuctionNft)
  .get("/myNftList", controller.myAuctionNftList)

  .use(upload.uploadFile)
  .post("/nft", controller.createNFT)
  .post("/ipfsUpload", controller.ipfsUpload);
