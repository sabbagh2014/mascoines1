import axios from "axios";
import config from "config";

const Web3 = require("web3");
const EthereumTx = require("ethereumjs-tx").Transaction;
const Common = require("ethereumjs-common");

var web3 = new Web3(new Web3.providers.HttpProvider(config.get("rpc")));

var contractABI = config.get("contractABI");
var massContract = config.get("massContractAddress");
var busdContract = config.get("busdContractAddress");
var wbtcContract = config.get("wbtcContractAddress");

contractABI = contractABI.map((method) => ({ ...method }));

const myMassContract = new web3.eth.Contract(contractABI, massContract);

const myBusdContract = new web3.eth.Contract(contractABI, busdContract);

const myWbtcContract = new web3.eth.Contract(contractABI, wbtcContract);

const getCurrentGasPrices = async () => {
  let response = await axios.get(
    "https://ethgasstation.info/api/ethgasAPI.json?api-key=ce8da4d2e680dad6465330e7869efe101517aad8274be133e44a8119d5c0"
  );
  let prices = {
    low: response.data.safeLow / 10,
    medium: response.data.average / 10,
    high: response.data.fast / 10,
  };
  return prices;
};

const EthHelper = async () => {
  let currentGasPrice = await getCurrentGasPrices();

  let gasPrice = currentGasPrice.high * 1000000000;

  let gasLimit = 21000;
  let fee = gasLimit * gasPrice;

  let txFee = Number(web3.utils.fromWei(fee.toString(), "ether"));

  return { fee: txFee, gasPrice: gasPrice };
};

const accountBalance = async (senderAddress) => {
  const response = await axios.get(
    `https://api-testnet.bscscan.com/api?module=account&action=balance&address=${senderAddress}&apikey=GQWQPRVJXUI35NTS2VK4J8KEMZCRXJAI4S`
  );
  let balance = web3.utils.fromWei(response.data.result, "ether");
  return Number(balance);
};

const preTransfer = async (senderAddress, amountToSend) => {
  const { fee } = await EthHelper();
  let balance = await accountBalance(senderAddress);

  if (balance - amountToSend - fee < 0) {
    return { status: false, message: "Low Balance" };
  } else {
    return { status: true, message: "Transfer Possible" };
  }
};

const bnbWithdraw = async (
  fromAddress,
  fromPrivateKey,
  toAddress,
  amountToSend
) => {
  try {
    var nonce = await web3.eth.getTransactionCount(fromAddress);
    const { gasPrice } = await EthHelper();

    const { status } = await preTransfer(fromAddress, amountToSend);
    if (status == false) {
      console.log({ status: status, message: "Low Balance" });
    }

    let txObject = {
      to: toAddress,
      value: web3.utils.toHex(
        web3.utils.toWei(amountToSend.toString(), "ether")
      ),
      gas: 21000,
      gasPrice: gasPrice,
      nonce: nonce,
    };
    const common = Common.default.forCustomChain(
      "mainnet",
      {
        name: "bnb",
        networkId: "0x61",
        chainId: "0x61",
      },
      "petersburg"
    );
    const transaction = new EthereumTx(txObject, { common: common });
    let privKey = Buffer.from(fromPrivateKey, "hex");
    transaction.sign(privKey);
    const serializedTransaction = transaction.serialize();
    const raw = "0x" + Buffer.from(serializedTransaction).toString("hex");
    const signTransaction = await web3.eth.sendSignedTransaction(raw);
    return {
      Status: true,
      Hash: signTransaction.transactionHash,
      message: "Success",
    };
  } catch (error) {
    return {
      Status: false,
      message: "Something went wrong!",
    };
  }
};

const getMassBalance = async (fromAddress) => {
  var balance = await myMassContract.methods.balanceOf(fromAddress).call();
  balance = web3.utils.fromWei(balance);
  return { balance: balance };
};

const massWithdraw = async (fromAddress, privateKey, toAddress, amount) => {
  try {
    var balance = web3.utils.toWei(amount.toString(), "ether");
    const { gasPrice } = await EthHelper();

    const Data = await myMassContract.methods
      .transfer(toAddress, balance.toString())
      .encodeABI();
    const rawTransaction = {
      to: massContract,
      from: fromAddress,
      value: 0,
      gasPrice: gasPrice, // Always in Wei (30 gwei)
      gasLimit: web3.utils.toHex("2000000"), // Always in Wei
      data: Data, // Setting the pid 12 with 0 alloc and 0 deposit fee
    };
    const signPromise = await web3.eth.accounts.signTransaction(
      rawTransaction,
      privateKey.toString()
    );

    let result = await web3.eth.sendSignedTransaction(
      signPromise.rawTransaction
    );
    if (result) {
      return {
        Success: true,
        Hash: signPromise.transactionHash,
      };
    }
  } catch (error) {
    return { Success: false };
  }
};

const getBusdBalance = async (fromAddress) => {
  var balance = await myBusdContract.methods.balanceOf(fromAddress).call();
  balance = web3.utils.fromWei(balance);
  return { balance: balance };
};

const usdtWithdraw = async (fromAddress, privateKey, toAddress, amount) => {
  try {
    var balance = web3.utils.toWei(amount.toString(), "ether");
    const { gasPrice } = await EthHelper();
    const Data = await myBusdContract.methods
      .transfer(toAddress, balance.toString())
      .encodeABI();
    const rawTransaction = {
      to: busdContract,
      from: fromAddress,
      value: 0,
      gasPrice: gasPrice, // Always in Wei (30 gwei)
      gasLimit: web3.utils.toHex("2000000"), // Always in Wei
      data: Data, // Setting the pid 12 with 0 alloc and 0 deposit fee
    };
    const signPromise = await web3.eth.accounts.signTransaction(
      rawTransaction,
      privateKey.toString()
    );

    let result = await web3.eth.sendSignedTransaction(
      signPromise.rawTransaction
    );
    if (result) {
      return {
        Success: true,
        Hash: signPromise.transactionHash,
      };
    }
  } catch (error) {
    return { Success: false };
  }
};

const getWbtcBalance = async (fromAddress) => {
  var balance = await myWbtcContract.methods.balanceOf(fromAddress).call();
  balance = web3.utils.fromWei(balance);
  return { balance: balance };
};

const wbtcWithdraw = async (fromAddress, privateKey, toAddress, amount) => {
  try {
    var balance = web3.utils.toWei(amount.toString(), "ether");
    const { gasPrice } = await EthHelper();

    const Data = await myWbtcContract.methods
      .transfer(toAddress, balance.toString())
      .encodeABI();
    const rawTransaction = {
      to: wbtcContract,
      from: fromAddress,
      value: 0,
      gasPrice: gasPrice, // Always in Wei (30 gwei)
      gasLimit: web3.utils.toHex("2000000"), // Always in Wei
      data: Data, // Setting the pid 12 with 0 alloc and 0 deposit fee
    };
    const signPromise = await web3.eth.accounts.signTransaction(
      rawTransaction,
      privateKey.toString()
    );

    let result = await web3.eth.sendSignedTransaction(
      signPromise.rawTransaction
    );
    if (result) {
      return {
        Success: true,
        Hash: signPromise.transactionHash,
      };
    }
  } catch (error) {
    return { Success: false };
  }
};

module.exports = {
  bnbWithdraw,
  massWithdraw,
  getMassBalance,
  getBusdBalance,
  usdtWithdraw,
  getWbtcBalance,
  wbtcWithdraw,
};
