import status from "../../../../enums/status";
import config from "config";
import axios from "axios";
const blockchainUrl = config.get("blockchainMainnetBaseUrl");

import { userServices } from "../../services/user";
import { notificationServices } from "../../services/notification";
import { subscribeBufferServices } from "../../services/subscribeBuffer";
import { subscriptionServices } from "../../services/subscription";
import { nftServices } from "../../services/nft";
import { transactionServices } from "../../services/transaction";
import { audienceServices } from "../../services/audience";

const { findUser, updateUser } = userServices;
const { createNotification } = notificationServices;
const { updateSubscribeBuffer, subscribeBufferList } = subscribeBufferServices;
const { createSubscription, findSubscription, updateSubscription } =
  subscriptionServices;
const { findNft, updateNft } = nftServices;
const { createTransaction } = transactionServices;
const { feedUpdateAll, postList } = audienceServices;

const cronJob = require("cron").CronJob;
var transactionHash, notificationObj, transObj, transactionObj;
let jobMain = new cronJob("*/10 * * * * *", async function () {
  var getBufferResult = await subscribeBufferList({
    status: { $ne: status.DELETE },
    transactionStatus: "PENDING",
  });
  if (getBufferResult.length == 0) {
    console.log("No records found for subscribe buffer dbs.");
  } else {
    jobMain.stop();
    let obj = {
      title: getBufferResult[0].title,
      name: getBufferResult[0].name,
      description: getBufferResult[0].description,
      validTillDate: getBufferResult[0].validTillDate,
      masPrice: getBufferResult[0].masPrice,
      nftId: getBufferResult[0].nftId,
      userId: getBufferResult[0].userId,
    };
    let bundleCheck = await findNft({ _id: getBufferResult[0].nftId });
    let userAddress = await findUser({
      _id: bundleCheck.userId,
      status: { $ne: status.DELETE },
    });
    let subscriptionRes = await findSubscription({
      userId: getBufferResult[0].userId,
      nftId: getBufferResult[0].nftId,
    });

    let address = [getBufferResult[0].toAddress];
    let amounts = [getBufferResult[0].amount.toString()];
    let updateQuery = {};
    let donationAmount = getBufferResult[0].amount;
    updateQuery.$addToSet = { supporters: getBufferResult[0].userId };
    if (userAddress.supporters.includes(getBufferResult[0].userId)) {
      if (getBufferResult[0].coin === "ETH") {
        updateQuery.$inc = { ethBalance: Number(donationAmount) };
      }
      if (getBufferResult[0].coin === "BNB") {
        updateQuery.$inc = { bnbBalace: Number(donationAmount) };
      }
      if (getBufferResult[0].coin === "USDT") {
        updateQuery.$inc = { usdtBalance: Number(donationAmount) };
      }
      if (getBufferResult[0].coin === "MASS") {
        updateQuery.$inc = { massBalance: Number(donationAmount) };
      }
      if (getBufferResult[0].coin === "WBTC") {
        updateQuery.$inc = { btcBalance: Number(donationAmount) };
      }
    } else {
      if (getBufferResult[0].coin === "ETH") {
        updateQuery.$inc = {
          subscriberCount: 1,
          ethBalance: Number(donationAmount),
        };
      }
      if (getBufferResult[0].coin === "BNB") {
        updateQuery.$inc = {
          subscriberCount: 1,
          bnbBalace: Number(donationAmount),
        };
      }
      if (getBufferResult[0].coin === "USDT") {
        updateQuery.$inc = {
          subscriberCount: 1,
          usdtBalance: Number(donationAmount),
        };
      }
      if (getBufferResult[0].coin === "MASS") {
        updateQuery.$inc = {
          subscriberCount: 1,
          massBalance: Number(donationAmount),
        };
      }
      if (getBufferResult[0].coin === "WBTC") {
        updateQuery.$inc = {
          subscriberCount: 1,
          btcBalance: Number(donationAmount),
        };
      }
    }
    notificationObj = {
      title: `Bundle Subscription Alert!`,
      description: `You have received amount of ${donationAmount} ${getBufferResult[0].coin} of ${bundleCheck.bundleName} bundle subscription by ${userAddress.name}.`,
      userId: bundleCheck.userId,
      nftId: bundleCheck._id,
      notificationType: "BUNDLE_SUBSCRIPTION",
      subscriberId: getBufferResult[0].userId,
    };
    transactionObj = {
      userId: getBufferResult[0].userId,
      nftId: getBufferResult[0].nftId,
      nftUserId: bundleCheck.userId,
      amount: getBufferResult[0].amount,
      coinName: getBufferResult[0].coin,
    };

    if (subscriptionRes) {
      if (subscriptionRes.subscriptionStatus !== status.EXPIRED) {
        let myDate = new Date(subscriptionRes.validTillDate);
        myDate.setDate(
          myDate.getDate() + parseInt(getBufferResult[0].duration)
        );
        getBufferResult[0].validTillDate = myDate.toISOString();
      }
      await updateSubscription(
        { _id: subscriptionRes._id },
        {
          subscriptionStatus: status.ACTIVE,
          validTillDate: getBufferResult[0].validTillDate,
        }
      );
      if (
        getBufferResult[0].coin === "ETH" ||
        getBufferResult[0].coin === "BNB"
      ) {
        jobMain.stop();
        try {
          transactionHash = await axios.post(
            `${blockchainUrl}/distributeEther`,
            {
              amountToSend: getBufferResult[0].amount.toString(),
              user: address,
              amount: amounts,
              privateKey: getBufferResult[0].privateKey,
              coin: getBufferResult[0].coin,
            }
          );
          sendNotification(
            getBufferResult[0].userId,
            transactionHash.data.Hash
          );
          transactionObj.transactionHash = transactionHash.data.Hash;
          await createTransaction(transactionObj);
          await createNotification(notificationObj);
          await updateNft(
            { _id: bundleCheck._id },
            {
              $addToSet: { subscribers: getBufferResult[0].userId },
              $inc: { subscriberCount: 1 },
            }
          );
          await updateUser({ _id: bundleCheck.userId }, updateQuery);
          await updateUser(
            { _id: getBufferResult[0].userId },
            { $addToSet: { subscribeNft: bundleCheck._id } }
          );
          addUserIntoFeed(bundleCheck._id, getBufferResult[0].userId);
          await updateSubscribeBuffer(
            { _id: getBufferResult[0]._id },
            {
              transactionStatus: "SUCCESS",
              transactionHash: transactionHash.data.Hash,
            }
          );
          console.log(
            "Successfully completed transaction for id  ",
            getBufferResult[0]._id
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
          user: address,
          amount: amounts,
          senderAddress: getBufferResult[0].fromAddress,
          privateKey: getBufferResult[0].privateKey,
          coin: getBufferResult[0].coin,
        };
        try {
          transactionHash = await axios.post(
            `${blockchainUrl}/distributeTokens`,
            transObj
          );
          sendNotification(
            getBufferResult[0].userId,
            transactionHash.data.Hash
          );
          transactionObj.transactionHash = transactionHash.data.Hash;
          await createTransaction(transactionObj);
          await createNotification(notificationObj);
          await updateNft(
            { _id: bundleCheck._id },
            {
              $addToSet: { subscribers: getBufferResult[0].userId },
              $inc: { subscriberCount: 1 },
            }
          );
          await updateUser({ _id: bundleCheck.userId }, updateQuery);
          await updateUser(
            { _id: getBufferResult[0].userId },
            { $addToSet: { subscribeNft: bundleCheck._id } }
          );
          addUserIntoFeed(bundleCheck._id, getBufferResult[0].userId);
          await updateSubscribeBuffer(
            { _id: getBufferResult[0]._id },
            {
              transactionStatus: "SUCCESS",
              transactionHash: transactionHash.data.Hash,
            }
          );
          console.log(
            "Successfully completed transaction for id  ",
            getBufferResult[0]._id
          );
          jobMain.stop();
          jobMain.start();
        } catch (error) {
          jobMain.stop();
          jobMain.start();
        }
      }
    } else {
      await createSubscription(obj);
      if (
        getBufferResult[0].coin === "ETH" ||
        getBufferResult[0].coin === "BNB"
      ) {
        jobMain.stop();
        try {
          transactionHash = await axios.post(
            `${blockchainUrl}/distributeEther`,
            {
              amountToSend: getBufferResult[0].amount.toString(),
              user: address,
              amount: amounts,
              privateKey: getBufferResult[0].privateKey,
              coin: getBufferResult[0].coin,
            }
          );
          console.log("106== ETH && BNB =====>>", transactionHash.data);
          sendNotification(
            getBufferResult[0].userId,
            transactionHash.data.Hash
          );
          transactionObj.transactionHash = transactionHash.data.Hash;
          await createTransaction(transactionObj);
          await createNotification(notificationObj);
          await updateNft(
            { _id: bundleCheck._id },
            {
              $addToSet: { subscribers: getBufferResult[0].userId },
              $inc: { subscriberCount: 1 },
            }
          );
          await updateUser({ _id: bundleCheck.userId }, updateQuery);
          await updateUser(
            { _id: getBufferResult[0].userId },
            { $addToSet: { subscribeNft: bundleCheck._id } }
          );
          addUserIntoFeed(bundleCheck._id, getBufferResult[0].userId);
          await updateSubscribeBuffer(
            { _id: getBufferResult[0]._id },
            {
              transactionStatus: "SUCCESS",
              transactionHash: transactionHash.data.Hash,
            }
          );
          console.log(
            "Successfully completed transaction for id  ",
            getBufferResult[0]._id
          );
          jobMain.stop();
          jobMain.start();
        } catch (error) {
          console.log("error for BNB & ETH ===>>>", error);
          jobMain.stop();
          jobMain.start();
        }
      } else {
        jobMain.stop();
        transObj = {
          user: address,
          amount: amounts,
          senderAddress: getBufferResult[0].fromAddress,
          privateKey: getBufferResult[0].privateKey,
          coin: getBufferResult[0].coin,
        };
        console.log("transObj===>>>>>", transObj);
        try {
          transactionHash = await axios.post(
            `${blockchainUrl}/distributeTokens`,
            transObj
          );
          console.log(
            "151== MASS && WBTC && BNB ====>>",
            transactionHash.data.Hash
          );
          sendNotification(
            getBufferResult[0].userId,
            transactionHash.data.Hash
          );
          transactionObj.transactionHash = transactionHash.data.Hash;
          await createTransaction(transactionObj);
          await createNotification(notificationObj);
          await updateNft(
            { _id: bundleCheck._id },
            {
              $addToSet: { subscribers: getBufferResult[0].userId },
              $inc: { subscriberCount: 1 },
            }
          );
          await updateUser({ _id: bundleCheck.userId }, updateQuery);
          await updateUser(
            { _id: getBufferResult[0].userId },
            { $addToSet: { subscribeNft: bundleCheck._id } }
          );
          addUserIntoFeed(bundleCheck._id, getBufferResult[0].userId);
          await updateSubscribeBuffer(
            { _id: getBufferResult[0]._id },
            {
              transactionStatus: "SUCCESS",
              transactionHash: transactionHash.data.Hash,
            }
          );
          console.log(
            "Successfully completed transaction for id  ",
            getBufferResult[0]._id
          );
          jobMain.stop();
          jobMain.start();
        } catch (error) {
          console.log("error for Token ===>>>", error);
          jobMain.stop();
          jobMain.start();
        }
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

const addUserIntoFeed = async (nftId, userId) => {
  let audienceRes = await postList({
    nftId: { $in: [nftId] },
    status: { $ne: status.DELETE },
  });
  audienceRes = audienceRes.map((i) => i._id);
  console.log("audienceRes==>>", audienceRes);
  await feedUpdateAll(
    { _id: { $in: audienceRes } },
    { $addToSet: { users: userId } }
  );
};
