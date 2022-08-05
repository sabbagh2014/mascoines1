import Express from "express";
import controller from "./controller";
import auth from "../../../../helper/auth";

export default Express.Router()

  .use(auth.verifyToken)
  .post("/notification", controller.createNotification)
  .get("/notification/:_id", controller.viewNotification)
  .delete("/notification", controller.deleteNotification)
  .get("/listNotification", controller.listNotification)
  .get("/readNotification", controller.readNotification);
