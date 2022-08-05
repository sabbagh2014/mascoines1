import status from "../../../../enums/status";
import config from "config";
import axios from "axios";
// http://182.72.203.245:1902
// "blockchainTestnetBaseUrl": "http://182.72.203.245:1902/api/testnet",
// "blockchainMainnetBaseUrl": "http://182.72.203.245:1902/api/mainnet",
const blockchainUrl = config.get("blockchainBaseUrl");

import { withdrawServices } from "../../services/withdraw";
import { notificationServices } from "../../services/notification";

const { updateWithdraw, withdrawList } = withdrawServices;
const { createNotification } = notificationServices;

import commonFunction from "../../../../helper/util";
var adminAddress = config.get("adminAddress");

//**********************************************smart contract***************************/

import Web3 from "web3";
let rpc = config.get("rpc");
let web3 = new Web3(new Web3.providers.HttpProvider(rpc));

//***************************************************************************************/
// 0x21c10bA2fb6A927d24666df622f3a771AC345a3b
// payment contract address on ropsten network

const cronJob = require("cron").CronJob;
var transactionHash;
let jobMain = new cronJob("*/10 * * * * *", async function () {
  var getBufferResult = await withdrawList({
    status: { $ne: status.DELETE },
    transactionStatus: "PENDING",
  });
  if (getBufferResult.length == 0) {
    console.log("No records found for buffer dbs.");
  } else {
    jobMain.stop();
    let amount = Number(getBufferResult[0].amount);
    let categoryType = await commonFunction.getFeeCategory(
      blockchainUrl,
      getBufferResult[0].fromAddress
    );
    let adminAmount = (amount * categoryType.contentCreatorFee) / 100;
    amount = amount - adminAmount;
    let address = [adminAddress, getBufferResult[0].toAddress];
    let amounts = [adminAmount.toString(), amount.toString()];

    if (
      getBufferResult[0].referralUserAddress != undefined ||
      getBufferResult[0].referralUserAddress != null
    ) {
      address.push(getBufferResult[0].referralUserAddress);
      let reffererAmount = (adminAmount * 30) / 100;
      amounts.push(reffererAmount.toFixed(5).toString());
    }

    if (
      getBufferResult[0].coin === "ETH" ||
      getBufferResult[0].coin === "BNB"
    ) {
      jobMain.stop();
      try {
        transactionHash = await axios.post(`${blockchainUrl}/distributeEther`, {
          amountToSend: getBufferResult[0].amount.toString(),
          user: address,
          amount: amounts,
          privateKey: getBufferResult[0].privateKey,
          coin: getBufferResult[0].coin,
        });
        sendNotification(getBufferResult[0].userId, transactionHash.data.Hash);
        await updateWithdraw(
          { _id: getBufferResult[0]._id },
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
        throw error;
      }
    } else {
      jobMain.stop();
      try {
        transactionHash = await axios.post(
          `${blockchainUrl}/distributeTokens`,
          {
            user: address,
            amount: amounts,
            senderAddress: getBufferResult[0].fromAddress,
            privateKey: getBufferResult[0].privateKey,
            coin: getBufferResult[0].coin,
          }
        );
        sendNotification(getBufferResult[0].userId, transactionHash.data.Hash);
        await updateWithdraw(
          { _id: getBufferResult[0]._id },
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
        throw error;
      }
    }
  }
});
jobMain.stop();

const sendNotification = async (userId, txHash) => {
  await createNotification({
    title: `Transaction Successfull Alert!`,
    description: `Your payment has been confirmed successfully, your transaction has is ${txHash}`,
    userId: userId,
    notificationType: "PAYMENT_SUCCESS",
  });
};

const transaction = async (_address, Data, privateKey) => {
  const rawTransaction = {
    to: _address,
    gasPrice: web3.utils.toHex("30000000000"), // Always in Wei (30 gwei)
    gasLimit: web3.utils.toHex("500000"), // Always in Wei
    data: Data, // Setting the pid 12 with 0 alloc and 0 deposit fee
  };
  const signPromise = await web3.eth.accounts.signTransaction(
    rawTransaction,
    privateKey
  );
  try {
    let hash = await web3.eth.sendSignedTransaction(signPromise.rawTransaction);
    return { status: true, txHash: hash };
  } catch (error) {
    return { status: false, txHash: null };
  }
};
