import Express from "express";
import controller from "./controller";
import auth from "../../../../helper/auth";

export default Express.Router()

  .use(auth.verifyToken)
  .get("/getBalance/:address/:coin", controller.getBalance)

  .get("/importBTCWallet/:privatekey", controller.importBTCWallet)
  .get("/importTRONWallet/:privatekey", controller.importTRONWallet)
  .post("/withdraw", controller.withdraw)
  .post("/transfer", controller.transfer)

  .get("/bnbGetBalance/:senderAddress", controller.bnbGetBalance)
  .post("/bnbTransfer", controller.bnbTransfer)
  .get("/ethGetBalance/:senderAddress", controller.ethGetBalance)
  .post("/ethTransfer", controller.ethTransfer)
  .get("/btcGetBalance/:senderAddress", controller.btcGetBalance)
  .post("/btcTransfer", controller.btcTransfer)
  .get("/trxGetBalance/:address", controller.trxGetBalance)
  .post("/trxTransfer", controller.trxTransfer)
  .post("/trxWithdraw", controller.trxWithdraw)
  .get("/trcBalanceOf/:address/:privateKey", controller.trcBalanceOf)
  .post("/trcTransfer", controller.trcTransfer)
  .post("/trcWithdraw", controller.trcWithdraw);
