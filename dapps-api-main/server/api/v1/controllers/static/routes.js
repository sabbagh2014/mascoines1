import Express from "express";
import controller from "./controller";

export default Express.Router()

  .post("/staticContent", controller.addStaticContent)
  .get("/staticContent", controller.viewStaticContent)
  .put("/staticContent", controller.editStaticContent)
  .get("/staticContentList", controller.staticContentList);
