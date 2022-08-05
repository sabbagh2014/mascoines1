import Express from "express";
import controller from "./controller";
import auth from "../../../../helper/auth";
import upload from "../../../../helper/uploadHandler";

export default Express.Router()

  .get("/content", controller.viewContent)
  .get("/landingContentList", controller.landingContentList)

  .use(upload.uploadFile)
  .post("/uploadFile", controller.uploadFile)

  .use(auth.verifyToken)
  .put("/content", controller.editContent);
