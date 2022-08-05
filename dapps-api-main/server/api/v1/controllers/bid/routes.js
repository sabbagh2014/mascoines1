import Express from "express";
import controller from "./controller";
import auth from "../../../../helper/auth";

export default Express.Router()

  .use(auth.verifyToken)
  .post("/bid", controller.createBid)
  .get("/bid/:_id", controller.viewBid)
  .put("/bid", controller.editBid)
  .delete("/bid", controller.deleteBid)
  .get("/acceptBid", controller.acceptBid)
  .put("/rejectBid", controller.rejectBid)
  .get("/listBid", controller.listBid)
  .get("/myBid", controller.myBid);
