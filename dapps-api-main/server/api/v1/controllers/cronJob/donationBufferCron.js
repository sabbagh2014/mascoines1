import status from "../../../../enums/status";
import config from "config";
import axios from "axios";
const blockchainUrl = config.get("blockchainMainnetBaseUrl");

import { userServices } from "../../services/user";
import { notificationServices } from "../../services/notification";
import { transactionServices } from "../../services/transaction";
import { donationBufferServices } from "../../services/donationBuffer";
import { donationServices } from "../../services/donation";

const { updateUser } = userServices;
const { createNotification } = notificationServices;
const { createTransaction } = transactionServices;
const { findDonationBuffer, updateDonationBuffer } = donationBufferServices;
const { createDonation, findDonation, updateDonation } = donationServices;

const cronJob = require("cron").CronJob;
var transactionHash, notificationObj, transObj, transactionObj;
let jobMain = new cronJob("*/10 * * * * *", async function () {
  var getBufferResult = await findDonationBuffer({
    status: { $ne: status.DELETE },
    transactionStatus: "PENDING",
  });
  if (!getBufferResult) {
    console.log("No records found for subscribe buffer dbs.");
  } else {
    jobMain.stop();
    transactionObj = {
      userId: getBufferResult.userId,
      amount: getBufferResult.amount,
      coinName: getBufferResult.coin,
    };
    let message = `You have recevied a donation amount of ${getBufferResult.amount} ${getBufferResult.coin} by ${getBufferResult.name}.`;
    notificationObj = {
      title: `Donation Alert!`,
      description: message,
      userId: getBufferResult.receiverUserId,
      notificationType: "DONATION_RECEIVED",
    };
    if (getBufferResult.coin === "ETH" || getBufferResult.coin === "BNB") {
      jobMain.stop();
      try {
        transactionHash = await axios.post(`${blockchainUrl}/distributeEther`, {
          amountToSend: getBufferResult.amount.toString(),
          user: [getBufferResult.toAddress],
          amount: [getBufferResult.amount.toString()],
          privateKey: getBufferResult.privateKey,
          coin: getBufferResult.coin,
        });
        sendNotification(getBufferResult.userId, transactionHash.data.Hash);
        transactionObj.transactionHash = transactionHash.data.Hash;
        await createTransaction(transactionObj);
        await createNotification(notificationObj);

        await manageDonationData(
          getBufferResult.userId,
          getBufferResult.receiverUserId,
          getBufferResult.supporterCount,
          message,
          getBufferResult.amount,
          getBufferResult.coin,
          getBufferResult.certificate
        );

        await updateDonationBuffer(
          { _id: getBufferResult._id },
          {
            transactionStatus: "SUCCESS",
            transactionHash: transactionHash.data.Hash,
          }
        );
        jobMain.stop();
        jobMain.start();
      } catch (error) {
        jobMain.stop();
        jobMain.start();
      }
    } else {
      jobMain.stop();
      transObj = {
        user: [getBufferResult.toAddress],
        amount: [getBufferResult.amount.toString()],
        senderAddress: getBufferResult.fromAddress,
        privateKey: getBufferResult.privateKey,
        coin: getBufferResult.coin,
      };
      try {
        transactionHash = await axios.post(
          `${blockchainUrl}/distributeTokens`,
          transObj
        );
        sendNotification(getBufferResult.userId, transactionHash.data.Hash);
        transactionObj.transactionHash = transactionHash.data.Hash;
        await createTransaction(transactionObj);
        await createNotification(notificationObj);
        await manageDonationData(
          getBufferResult.userId,
          getBufferResult.receiverUserId,
          getBufferResult.supporterCount,
          message,
          getBufferResult.amount,
          getBufferResult.coin,
          getBufferResult.certificate
        );
        await updateDonationBuffer(
          { _id: getBufferResult._id },
          {
            transactionStatus: "SUCCESS",
            transactionHash: transactionHash.data.Hash,
          }
        );
        jobMain.stop();
        jobMain.start();
      } catch (error) {
        jobMain.stop();
        jobMain.start();
      }
    }
  }
});
jobMain.start();

const sendNotification = async (userId, txHash) => {
  await createNotification({
    title: `Transaction Successfull Alert!`,
    description: `Your payment has been confirmed successfully, your transaction id is ${txHash}.`,
    userId: userId,
    notificationType: "PAYMENT_SUCCESS",
  });
};

const manageDonationData = async (
  senderUserId,
  userId,
  supporterCount,
  message,
  amount,
  coinName,
  certificate
) => {
  if (supporterCount === true) {
    await updateUser(
      { _id: userId },
      { $addToSet: { supporters: senderUserId }, $inc: { supporterCount: 1 } }
    );
  }
  let findData = await findDonation({
    userId: userId,
    status: { $ne: status.DELETE },
  });
  let obj = {
    userId: userId,
    history: [
      {
        senderUserId: senderUserId,
        message: message,
        amount,
        coinName: coinName,
      },
    ],
    certificateNumber: certificate,
  };
  let updateQuery = { $addToSet: { supporters: senderUserId } };
  if (coinName === "MASS") {
    obj.massBalance = amount;
    updateQuery.$inc = { massBalance: Number(amount) };
  }
  if (coinName === "BNB") {
    obj.bnbBalance = amount;
    updateQuery.$inc = { bnbBalace: Number(amount) };
  }
  if (coinName === "ETH") {
    obj.ethBalance = amount;
    updateQuery.$inc = { ethBalance: Number(amount) };
  }
  if (coinName === "USDT") {
    obj.usdtBalance = amount;
    updateQuery.$inc = { usdtBalance: Number(amount) };
  }
  if (coinName === "WBTC") {
    obj.btcBalance = amount;
    updateQuery.$inc = { btcBalance: Number(amount) };
  }
  await updateUser({ _id: userId }, updateQuery);
  if (!findData) {
    await createDonation(obj);
  } else {
    let incrementQuery = {
      $push: {
        history: {
          senderUserId: senderUserId,
          message: message,
          amount,
          coinName: coinName,
        },
      },
    };
    if (coinName === "MASS") {
      incrementQuery.$inc = { massBalance: Number(amount) };
    }
    if (coinName === "BNB") {
      incrementQuery.$inc = { bnbBalace: Number(amount) };
    }
    if (coinName === "ETH") {
      incrementQuery.$inc = { ethBalance: Number(amount) };
    }
    if (coinName === "USDT") {
      incrementQuery.$inc = { usdtBalance: Number(amount) };
    }
    if (coinName === "WBTC") {
      incrementQuery.$inc = { btcBalance: Number(amount) };
    }
    await updateDonation({ _id: findData._id }, incrementQuery);
  }
};
