import Express from "express";
import controller from "./controller";
import auth from "../../../../helper/auth";
import upload from "../../../../helper/uploadHandler";

export default Express.Router()

  .get("/allListOrder", controller.allListOrder)

  .use(auth.verifyToken)
  .get("/order/:_id", controller.viewOrder)
  .put("/order", controller.editOrder)
  .delete("/order", controller.deleteOrder)
  .get("/listOrder", controller.listOrder)
  .get("/soldOrderList", controller.soldOrder)
  .get("/buyOrderList", controller.buyOrder)
  .put("/cancelOrder", controller.cancelOrder)

  .post("/order", controller.createOrder)

  .post("/sendOrderToUser", controller.sendOrderToUser)

  .use(upload.uploadFile);
