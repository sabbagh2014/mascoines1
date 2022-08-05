import axios from "axios";
import config from "config";

const Web3 = require("web3");

var web3 = new Web3(new Web3.providers.HttpProvider(config.get("rpc")));

var contractABI = config.get("nftContractABI");
var nftContract = config.get("nftContractAddress");

contractABI = contractABI.map((method) => ({ ...method }));

const myNFTContract = new web3.eth.Contract(contractABI, nftContract);

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

const nftMinting = async (
  fromAddress,
  privateKey,
  walletAddress,
  nftDetails
) => {
  try {
    const { tokenName, mediaUrl } = nftDetails;
    const { gasPrice } = await EthHelper();
    const Data = await myNFTContract.methods
      .create(walletAddress, mediaUrl, tokenName)
      .encodeABI();
    const rawTransaction = {
      to: nftContract,
      from: fromAddress,
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
  nftMinting,
};
