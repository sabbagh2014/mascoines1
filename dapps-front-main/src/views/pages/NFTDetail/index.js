import React, { useState, useEffect, useContext } from "react";
import {
  calculateTimeLeft,
  getContract,
  getWeb3Obj,
  getWeb3ContractObject,
  getWallet,
  getContractWallet,
  sortAddress,
} from "src/utils";
import { RPC_URL } from "src/constants";
import {
  OpenMarketplace,
  massToken,
  WBTCToken,
  USDTToken,
  NFTTokenContract,
  ACTIVE_NETWORK,
  NetworkContextName,
  deadAddress,
} from "src/constants/index";
// import openMarketplaceabi from "src/abis/OpenMarketplaceABI.json";
import CircularProgress from "@material-ui/core/CircularProgress";
import Nfttokenabi from "../../../abis/NFTokenABI.json";
import OpenMarketplaceABI from "src/abis/OpenMarketplaceABI.json";
import { useWeb3React } from "@web3-react/core";
import ButtonCircularProgress from "src/component/ButtonCircularProgress";
import moment, { months } from "moment";
import { ethers } from "ethers";
import NFTokenABI from "src/abis/NFTokenABI.json";
import {
  Box,
  Container,
  Button,
  TextField,
  Typography,
  makeStyles,
  Grid,
  List,
  ListItem,
  Dialog,
  DialogContent,
  DialogContentText,
  Slide,
  IconButton,
  FormControl,
  InputAdornment,
  DialogActions,
} from "@material-ui/core";
import { FiCopy } from "react-icons/fi";
import { Link, useHistory } from "react-router-dom";
import History from "./History";
import Profile from "./Profile";
import { MdReport } from "react-icons/md";
import { GrFormAdd } from "react-icons/gr";
import { FiMinus } from "react-icons/fi";
import { useLocation } from "react-router";
import axios from "axios";
import Apiconfigs from "src/Apiconfig/Apiconfigs";
import { UserContext } from "src/context/User";
import MuiAlert from "@material-ui/lab/Alert";
import DataLoading from "src/component/DataLoading";
import IERC20ABI from "src/abis/IERC20ABI.json";
import { PlaneListPopup } from "../Profile/Profile";
import NoDataFound from "src/component/NoDataFound";
import { toast } from "react-toastify";
import { BiLockOpen } from "react-icons/bi";
import Loader from "src/component/Loader";
import CopyToClipboard from "react-copy-to-clipboard";
const useStyles = makeStyles((theme) => ({
  LoginBox: {
    paddingTop: "50px",
    paddingBottom: "50px",
  },
  websiteButton: {
    border: "solid 0.5px #707070",
    backgroundColor: "#fff",
    textAlign: "center",
    fontSize: "17.5px",
    color: "#141518",
    width: "100%",
    borderRadius: "0",
  },
  NFTbg: {
    width: "100%",

    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "40px",
    fontWeight: "500",
    color: "#fff",
    marginBottom: "30px",
    // backgroundImage: "linear-gradient(to bottom, #4fc5c5, #286363)",
  },
  modaltitel: {
    fontSize: "30px",
    fontWeight: "600",
    marginBottom: "10px",
    textAlign: "center",
    color: "#141518",
    [theme.breakpoints.down("sm")]: {
      fontSize: "20px",
    },
  },
  timeing: {
    display: "flex",
    "& li": {
      backgroundColor: "#fff",
      border: "solid 0.5px #e5e3dd",
      fontSize: "20px",
      textAlign: "center",
      width: "auto",
      padding: "10px 15px",
      marginLeft: "3px",
      color: "#141518",
      [theme.breakpoints.down("sm")]: {
        padding: "5px",
        fontSize: "12px",
      },
    },
  },
  labelText: {
    fontSize: "20px",
    fontWeight: "bold",
    color: "#000",
    alignItems: "center",
  },
  labelText1: {
    fontSize: "30px",
    fontWeight: "bold",
    color: "#000",
    alignItems: "center",
  },
  price: {
    fontSize: "30px",
    fontWeight: "normal",
    textAlign: "center",
    color: "#d15b5b",
  },
  masBox: {
    backdropFilter: " blur(15px)",
    border: "solid 0.5px #e5e3dd",
    backgroundColor: "#fff",
    padding: "40px 20px",
  },
  customModal: {
    "& .MuiDialog-paperWidthSm": {
      width: "1100px",
      minWidth: "300px",
      maxWidth: "100%",
    },
    "& .makeStyles-paper-70": {
      width: "1100px",
      minWidth: "300px",
      maxWidth: "100%",
    },
  },
  timeBox: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  input_fild: {
    backgroundColor: "#ffffff6e",
    borderRadius: "5.5px",
    border: " solid 0.5px #e5e3dd",
    color: "#141518",
    width: "100%",
    "&:hover": {
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "transparent",
      },
    },
    "& .MuiInputBase-input": {
      color: "#141518",
    },
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "transparent",
      borderWidth: 0,
    },
  },
  nftimg: {
    border: " solid 0.5px #e5e3dd",
    height: "500px",
    // width: '100%',
    margin: "10px 0",
    "& img": {
      width: "100%",
      height: "100%",
    },
  },
  dilogBody2: {
    boxShadow: "0 1.5px 3px 0 rgb(0 0 0 / 16%)",
    backgroundImage: "linear-gradient(to bottom, #c04848, #480048)",
    borderRadius: "50px",
    overflow: "hidden",
  },
  dilogBody3: {
    backgroundColor: "#3e3e3e",
  },
  table: {
    "& th": {
      color: "#fff",
    },
    "& td": {
      color: "#fff",
    },
  },
  nftImg: {
    width: "100%",
    height: "165px",
    overflow: "hidden",
    backgroundPosition: "center !important",
    backgroundSize: "cover !important",
    backgroundRepeat: " no-repeat !important",
    // borderRadius: "40px 40px 10px 10px",
    // borderRadius: "18px",
    backgroundColor: "#ccc !important",
  },
  PhotoBox: {
    display: "flex",
    justifyContent: "center",
  },
}));
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function Login({ data, index, callbackFn }) {
  const classes = useStyles();
  const { account, library } = useWeb3React();
  const auth = useContext(UserContext);
  const history = useHistory();
  const [openBlock, setOpen1] = React.useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [bid, setbid] = useState(0);
  const location = useLocation();
  const [isBidding, setIsBidding] = useState(false);
  const [isBuyBid, setIsBuyBid] = useState(false);
  const [openPlaceBid, setOpenPlaceBid] = useState(false);
  const [details, setdetails] = useState({});
  const [userdetails, setuserdetails] = useState();
  const [processing, setprocessing] = React.useState(false);
  const [auctionDetails, setAuctionDetails] = useState();
  const [allBidList, setAllBidList] = useState([]);
  const [openBlock4, setOpen4] = React.useState(false);
  const [closeTimeLeft, setCloseTimeLeft] = useState();
  const [openBlock3, setOpen3] = React.useState(false);
  const [price, setPrice] = useState("");
  const [openResale, setOpenResale] = useState(false);
  const [minBid, setMinBid] = useState("");
  const [isUpdatingOrder, setIsUpdatingOrder] = useState(false);
  const [isCancelingOrder, setIsCancelingOrder] = useState(false);
  const [isResaleingOrder, setIsResalingOrder] = useState(false);
  const [expiryDate, setExpiryDate] = useState(new Date());
  const [openBlock2, setOpen2] = React.useState(false);
  const [open5, setOpen5] = React.useState(false);
  const [nftId, setNFTId] = useState("");
  const [orderExtraDeails, setOderExtraDeails] = useState();
  const [bidExtraDetails, setBidExtraDetails] = useState();
  const [currentOwner, setCurrentOwner] = useState("");
  const [isAcceptingBid, setIsAcceptingBid] = useState(false);
  const [isOrderExpired, setIsOrderExpired] = useState(false);
  const [exportPop, setExportPop] = useState(false);
  const [exportAddress, setExportAddress] = useState("");
  const [isValidate, setIsValidate] = useState(false);
  const [isExportingNft, setIsExportingNft] = useState(false);

  const ProfileId = auth?.userData?._id;
  const privateKey = auth?.userData?.ethAccount?.privateKey;
  const isVideo =
    auctionDetails?.nftId?.mediaType &&
    auctionDetails?.nftId?.mediaType === "mp4"
      ? true
      : false;
  const getAuctionDetails = async (id) => {
    // setIsLoading(true);
    await axios({
      method: "GET",
      url: Apiconfigs.orderwithid + id,
      headers: {
        token: window.localStorage.getItem("token"),
      },
    })
      .then(async (res) => {
        console.log("res.data.result", res.data.result);
        if (res.data.statusCode === 200) {
          console.log("responseNFT---", res.data.result);
          setAuctionDetails(res.data.result);
          setuserdetails(res.data.result.userId);
          setAllBidList(res.data.result.bidId.reverse());
          // getBidList(res.data.result.orderId._id);
          getOrderExtraDetails(res?.data?.result?.nftId?.tokenId);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        console.log(err.message);
      });
  };
  const getOrderExtraDetails = async (tokenID) => {
    try {
      const contractObj = await getWeb3ContractObject(
        OpenMarketplaceABI,
        OpenMarketplace,
        RPC_URL
      );
      const ordersData = await contractObj.methods
        .orderByAssetId(NFTTokenContract, parseInt(tokenID))
        .call();
      const bidByOrderId = await contractObj.methods
        .bidByOrderId(NFTTokenContract, parseInt(tokenID))
        .call();
      setBidExtraDetails(bidByOrderId);

      const orderByAssetId = await contractObj.methods
        .orderByAssetId(NFTTokenContract, tokenID)
        .call();

      setOderExtraDeails(ordersData);
      const nftContract = await getWeb3ContractObject(
        NFTokenABI,
        NFTTokenContract
      );
      const ownerOf = await nftContract.methods.ownerOf(tokenID).call();

      setCurrentOwner(ownerOf);
    } catch (error) {
      console.log("ERROR", error);
    }
  };
  const palceBidBlockChainHandler = async () => {
    const web3 = await getWeb3Obj();
    if (
      !isOrderExpired &&
      orderExtraDeails?.seller?.toLowerCase() !== deadAddress?.toLowerCase()
    ) {
      // if (orderExtraDeails?.seller?.toLowerCase() !== account.toLowerCase()) {
      if (parseFloat(bid) > 0) {
        const checkPrice =
          allBidList.length > 0
            ? parseFloat(bid) > parseFloat(allBidList[0].bid)
            : true;

        if (checkPrice) {
          if (parseFloat(auctionDetails?.startingBid) <= parseFloat(bid)) {
            setIsBidding(true);
            try {
              // if (auth?.userData?.userType === 'Creator') {
              if (parseFloat(auth?.userData?.massBalance) > 0) {
                if (parseFloat(auth?.userData?.massBalance) > parseFloat(bid)) {
                  // const walletKeyFun = getWallet(privateKey)
                  // const contractObj = getContractWallet(
                  //   OpenMarketplace,
                  //   OpenMarketplaceABI,
                  //   walletKeyFun,
                  // )
                  // const acceptedTokenFun = await contractObj.acceptedToken()
                  // const NFTcontract = getContractWallet(
                  //   acceptedTokenFun,
                  //   IERC20ABI,
                  //   walletKeyFun,
                  // )

                  // const apprveFun = await NFTcontract.approve(
                  //   OpenMarketplace,
                  //   web3.utils.toWei(bid?.toString()),
                  //   { gasLimit: 300000 },
                  // )

                  // await apprveFun.wait()
                  // toast.success(
                  //   'Your transaction has been approved suucessfully',
                  // )
                  // const safePlaceBidFun = await contractObj.safePlaceBid(
                  //   NFTTokenContract,
                  //   auctionDetails?.nftId?.tokenId,
                  //   web3.utils.toWei(bid?.toString()),
                  //   moment(auctionDetails?.time).unix(),
                  //   { gasLimit: 300000 },
                  // )
                  // await safePlaceBidFun.wait()
                  placingbid();
                } else {
                  toast.error(
                    "Your MASS balance is insufficient for placing a bid "
                  );
                  setIsBidding(false);
                }
              } else {
                toast.error("Your MASS balance is too low.");
                setIsBidding(false);
              }
              // } else {
              //   if (parseFloat(bid) < parseFloat(auth?.yourWalletBalance)) {
              //     // const contractObj = getContract(
              //     //   OpenMarketplace,
              //     //   OpenMarketplaceABI,
              //     //   library,
              //     //   account,
              //     // )
              //     // const acceptedTokenFun = await contractObj.acceptedToken()
              //     // const NFTcontract = getContract(
              //     //   acceptedTokenFun,
              //     //   IERC20ABI,
              //     //   library,
              //     //   account,
              //     // )
              //     // const apprveFun = await NFTcontract.approve(
              //     //   OpenMarketplace,
              //     //   web3.utils.toWei(bid?.toString()),
              //     //   { gasLimit: 300000 },
              //     // )

              //     // await apprveFun.wait()
              //     // toast.success(
              //     //   'Your transaction has been approved suucessfully',
              //     // )
              //     // const safePlaceBidFun = await contractObj.safePlaceBid(
              //     //   NFTTokenContract,
              //     //   auctionDetails?.nftId?.tokenId,
              //     //   web3.utils.toWei(bid?.toString()),
              //     //   moment(auctionDetails?.time).unix(),
              //     //   { gasLimit: 300000 },
              //     // )
              //     // await safePlaceBidFun.wait()
              //     placingbid()
              //   } else {
              //     toast.error('Your wallet balance is too low.')
              //     setIsBidding(false)
              //   }
              // }
            } catch (error) {
              console.log(error);
              setIsBidding(false);
            }
          } else {
            toast.error(
              "Bid amount should be greater then starting bid amount"
            );
            setIsBidding(false);
          }
        } else {
          toast.error("Bid amount should be greater then last bid amount");
        }
      } else {
        toast.error("Please enter valid price");
      }
      // } else {
      //   toast.warn("Owner can't place a bid")
      // }
    } else {
      toast.warn("Order expired");
    }
  };
  const placingbid = async () => {
    await axios({
      method: "post",
      url: Apiconfigs.placebid,
      headers: {
        token: window.localStorage.getItem("token"),
      },
      data: {
        orderId: auctionDetails?._id,
        bid: bid.toString(),
        date: auctionDetails?.nftId?.time,
      },
    })
      .then((res) => {
        setIsBidding(false);
        getAuctionDetails(location.search.substring(1, location.search.length));
        if (res.data.statusCode === 200) {
          auth.updateUserData();
          toast.success("Your bid has been placed successfully");
          setprocessing(false);
          setOpen4(false);
          setOpen1(false);
        } else {
          toast.error(res.data.responseMessage);
        }
      })
      .catch((err) => {
        setIsBidding(false);
        getAuctionDetails(location.search.substring(1, location.search.length));
        setprocessing(false);
        if (err.response) {
          toast.error(err.response.data.responseMessage);
        } else {
          toast.error(err.message);
        }
        console.log(err);
      });
  };

  //cancelOrderFunction
  const cancelOrderBlockChainHandler = async () => {
    try {
      setIsCancelingOrder(true);
      const walletKeyFun = getWallet(privateKey);
      const contractObj = getContractWallet(
        OpenMarketplace,
        OpenMarketplaceABI,
        walletKeyFun
      );
      console.log("contract--->>>", contractObj);
      const cancelOrderFun = await contractObj.cancelOrder(
        NFTTokenContract,
        auctionDetails?.nftId?.tokenId
      );
      await cancelOrderFun.wait();
      orderCancelHandler();
    } catch (error) {
      console.log(error);
      toast.error(error.message);
      setIsCancelingOrder(false);
    }
  };
  const orderCancelHandler = async () => {
    try {
      setIsCancelingOrder(true);
      const res = await axios({
        method: "PUT",
        url: Apiconfigs.cancelOrder + auctionDetails?._id,
        headers: {
          token: window.localStorage.getItem("token"),
        },
      });
      if (res.data.statusCode === 200) {
        toast.success("Your order has been cancelled successfully");
        setIsCancelingOrder(false);
        getAuctionDetails(nftId);
        // history.push('/profile')
      } else {
        toast.success(res.data.responseMessage);
        setIsCancelingOrder(false);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
      setIsBidding(false);
      setIsCancelingOrder(false);
    }
  };

  //acceptbidFunction
  const acceptBidBlockChainHandler = async () => {
    if (allBidList.length !== 0 && allBidList[0].bid) {
      try {
        setIsAcceptingBid(true);
        // const web3 = await getWeb3Obj()
        // const walletKeyFun = getWallet(privateKey)
        // const contractObj = getContractWallet(
        //   OpenMarketplace,
        //   OpenMarketplaceABI,
        //   walletKeyFun,
        // )
        // const acceptBid = await contractObj.acceptBid(
        //   NFTTokenContract,
        //   auctionDetails?.nftId?.tokenId,
        //   web3.utils.toWei(allBidList[0].bid?.toString()),
        //   { gasLimit: 300000 },
        // )
        // await acceptBid.wait()
        sendOrderToUserHandler();
      } catch (error) {
        console.log(error);
        setIsAcceptingBid(false);
      }
    } else {
      toast.warn("Bid not found");
    }
  };
  const sendOrderToUserHandler = async () => {
    try {
      const res = await axios.post(
        Apiconfigs.sendOrderToUser,
        {
          orderId: auctionDetails._id,
          userId: allBidList[0].userId,
        },
        {
          headers: {
            token: window.localStorage.getItem("token"),
          },
        }
      );
      if (res.data.statusCode === 200) {
        toast.success(res.data.responseMessage);
        // history.push('/profile')
        getAuctionDetails(nftId);
        setIsAcceptingBid(false);
      } else {
        setIsAcceptingBid(false);
        toast.success(res.data.responseMessage);
      }
      setIsBidding(false);
    } catch (error) {
      toast.error(error.message);
      setIsBidding(false);
      setIsAcceptingBid(false);
    }
  };

  //buyNowFunction
  const buyNowhandler = async () => {
    try {
      const web3 = await getWeb3Obj();

      // if (auth?.userData?.userType === 'Creator') {
      if (
        parseFloat(auth?.userData?.massBalance) >=
        parseFloat(auctionDetails?.nftId?.startingBid)
      ) {
        setIsBuyBid(true);
        // const walletKeyFun = getWallet(privateKey)
        // const cnotractObj = getContractWallet(
        //   OpenMarketplace,
        //   OpenMarketplaceABI,
        //   walletKeyFun,
        // )
        // const acceptedTokenFun = await cnotractObj.acceptedToken()
        // const NFTcontract = getContractWallet(
        //   acceptedTokenFun,
        //   IERC20ABI,
        //   walletKeyFun,
        // )
        // const apprveFun = await NFTcontract.approve(
        //   OpenMarketplace,
        //   web3.utils.toWei(auctionDetails?.nftId?.startingBid),
        //   { gasLimit: 300000 },
        // )

        // await apprveFun.wait()
        // toast.success('Your transaction has been approved sucessfully')
        // const acceptBidRes = await cnotractObj.safeExecuteOrder(
        //   NFTTokenContract,
        //   auctionDetails?.nftId?.tokenId,
        //   web3.utils.toWei(auctionDetails?.nftId?.startingBid),
        //   { gasLimit: 300000 },
        // )
        // await acceptBidRes.wait()
        buyOrderToUserHandler();
        if (auth?.userData?.userType !== "Creator") {
          nftExportHandler(account);
        }
      } else {
        toast.error("Your wallet balance is too low.");
        setIsBuyBid(false);
      }
      // } else {
      //   if (
      //     parseFloat(auctionDetails?.nftId?.startingBid) <=
      //     parseFloat(auth?.yourWalletBalance)
      //   ) {
      //     const cnotractObj = getContract(
      //       OpenMarketplace,
      //       OpenMarketplaceABI,
      //       library,
      //       account,
      //     )
      //     const acceptedTokenFun = await cnotractObj.acceptedToken()
      //     const NFTcontract = getContract(
      //       acceptedTokenFun,
      //       IERC20ABI,
      //       library,
      //       account,
      //     )
      //     const apprveFun = await NFTcontract.approve(
      //       OpenMarketplace,
      //       web3.utils.toWei(auctionDetails?.nftId?.startingBid),
      //       { gasLimit: 300000 },
      //     )

      //     await apprveFun.wait()
      //     toast.success('Your transaction has been approved suucessfully')
      //     const acceptBidRes = await cnotractObj.safeExecuteOrder(
      //       NFTTokenContract,
      //       auctionDetails?.nftId?.tokenId,
      //       web3.utils.toWei(auctionDetails?.nftId?.startingBid),
      //       { gasLimit: 300000 },
      //     )
      //     await acceptBidRes.wait()
      //     buyOrderToUserHandler()
      //   } else {
      //     toast.error('Your wallet balance is too low.')
      //     setIsBuyBid(false)
      //   }
      // }
    } catch (error) {
      setIsBuyBid(false);
      toast.error(error.message);
      console.log("ERROR", error);
    }
    // } else {
    //   toast.error("Bid not found");
    // }
  };
  const buyOrderToUserHandler = async () => {
    try {
      const res = await axios.post(
        Apiconfigs.sendOrderToUser,
        {
          orderId: auctionDetails._id,
          userId: ProfileId,
        },
        {
          headers: {
            token: window.localStorage.getItem("token"),
          },
        }
      );
      if (res.data.statusCode === 200) {
        setIsBuyBid(false);

        // toast.success(res.data.responseMessage)
        toast.success("You have successfully purchased this NFT");
        getAuctionDetails(nftId);
      } else {
        setIsBuyBid(false);

        toast.success(res.data.responseMessage);
      }
      setIsBuyBid(false);
    } catch (error) {
      toast.error(error.message);
      setIsBuyBid(false);
    }
  };

  //updateOrderFunction
  const updateOrderhandler = async () => {
    setIsUpdatingOrder(true);
    try {
      const web3 = await getWeb3Obj();
      const walletKeyFun = getWallet(privateKey);
      const contractObj = getContractWallet(
        OpenMarketplace,
        OpenMarketplaceABI,
        walletKeyFun
      );
      console.log("***contract***", contractObj);
      const updateOrderFun = await contractObj.updateOrder(
        NFTTokenContract,
        auctionDetails?.nftId?.tokenId,
        web3.utils.toWei(price?.toString()),
        moment(expiryDate).unix()
      );
      await updateOrderFun.wait();
      updateOrderAPIHandler();
    } catch (error) {
      console.log(error);
      setIsUpdatingOrder(false);
    }
  };
  const updateOrderAPIHandler = async () => {
    if (parseFloat(price) > 0) {
      try {
        setIsUpdatingOrder(true);
        const res = await axios.put(
          Apiconfigs.order,
          {
            mediaUrl: auctionDetails?.nftId.mediaUrl,
            details: auctionDetails?.nftId?.details,
            time: moment(expiryDate).format("YYYY-MM-DDThh:mm"),
            startingBid: price,
            _id: auctionDetails._id,
          },
          {
            headers: {
              token: window.localStorage.getItem("token"),
            },
          }
        );
        if (res.data.statusCode === 200) {
          toast.success("Your order has been updated successfully");
          getAuctionDetails(nftId);
          setIsUpdatingOrder(false);
          setOpenPlaceBid(false);
        } else {
          toast.warn(res.data.responseMessage);
          setIsUpdatingOrder(false);
          setOpenPlaceBid(false);
        }
      } catch (error) {
        console.log(error);
        toast.error(error.message);
        setIsUpdatingOrder(false);
      }
    } else {
      toast.error("You have entered a wrong amount!");
    }
  };

  //resaleOrderFunction
  const resaleOrderHandler = async () => {
    if (price !== "" && parseFloat(price) > 0) {
      setIsResalingOrder(true);
      try {
        // const web3 = await getWeb3Obj()
        // const walletKeyFun = getWallet(privateKey)

        // const NFTcontract = getContractWallet(
        //   NFTTokenContract,
        //   NFTokenABI,
        //   walletKeyFun,
        // )
        // const contract = getContractWallet(
        //   OpenMarketplace,
        //   OpenMarketplaceABI,
        //   walletKeyFun,
        // )

        // const apprveFun = await NFTcontract.approve(
        //   OpenMarketplace,
        //   auctionDetails?.nftId?.tokenId,
        // )
        // await apprveFun.wait()
        // const createOrderFun = await contract.createOrder(
        //   NFTTokenContract,
        //   auctionDetails?.nftId?.tokenId,
        //   web3.utils.toWei(price),
        //   moment(expiryDate).unix(),
        // )
        // await createOrderFun.wait()
        placeOrderAPIHandler();
      } catch (error) {
        console.log(error);
        setIsResalingOrder(false);
      }
    } else {
      toast.error("Please enter valid price");
      setIsResalingOrder(false);
    }
  };
  const placeOrderAPIHandler = async () => {
    try {
      const credentials = {
        mediaUrl: auctionDetails?.nftId.mediaUrl,
        details: auctionDetails?.nftId?.details,
        time: moment(expiryDate).format("YYYY-MM-DDThh:mm"),
        startingBid: price,
        _id: auctionDetails._id,
      };
      const res = await axios({
        method: "PUT",
        url: Apiconfigs.order,
        headers: {
          token: window.localStorage.getItem("token"),
        },
        data: credentials,
      });

      if (res.data.statusCode === 200) {
        console.log("resPonse---", res.data.result);
        toast.success("Your NFT has been placed successfully");
        setIsResalingOrder(false);
        getAuctionDetails(nftId);
        setOpenResale(false);
      }
    } catch (err) {
      console.log(err);
      setIsResalingOrder(false);
    }
  };

  const updateDimensions = () => {
    if (data?._id) {
      let offsetWidth = document.getElementById(
        "imagecard" + data?._id
      ).offsetWidth;
      let newoofsetWidth = offsetWidth - 60;
      document.getElementById("imagecard" + data?._id).style.height =
        newoofsetWidth + "px";
    }
  };

  const nftExportHandler = async (address) => {
    setIsValidate(true);

    if (exportAddress !== "") {
      setIsValidate(false);
      setIsExportingNft(true);
      try {
        const res = await axios({
          method: "POST",
          url: Apiconfigs.exportNFT,
          headers: {
            token: window.localStorage.getItem("token"),
          },
          data: {
            walletAddress: address,
            nftId: auctionDetails?.nftId?._id,
            orderId: auctionDetails?._id,
          },
        });
        if (res.data.statusCode === 200) {
          toast.success("Your NFT has been exported successfully.");
          setExportPop(false);
          setIsExportingNft(false);
          getAuctionDetails(nftId);
        }
      } catch (error) {
        console.log(error);
        setIsExportingNft(false);
      }
    }
  };

  useEffect(() => {
    const id = location.search.substring(1, location.search.length);
    setNFTId(id);
    if (id) {
      // mynft(id);
      getAuctionDetails(id);
    }
  }, []);
  useEffect(() => {
    const timer = setTimeout(() => {
      setCloseTimeLeft(calculateTimeLeft(new Date(auctionDetails?.time)));
    }, 1000);
    return () => clearTimeout(timer);
  });
  useEffect(() => {
    updateDimensions();
  }, [data, index]);
  useEffect(() => {
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);
  useEffect(() => {
    if (auctionDetails) {
      setPrice(auctionDetails?.startingBid ? auctionDetails?.startingBid : "");
      setExpiryDate(auctionDetails?.time ? auctionDetails?.time : "");
    }
  }, [auctionDetails]);

  return (
    <Box className={classes.LoginBox}>
      {isLoading ? (
        // <DataLoading />
        <Loader />
      ) : (
        <>
          {!isLoading && !auctionDetails ? (
            <Box align="center" mt={4} mb={5}>
              <NoDataFound />
            </Box>
          ) : (
            <>
              <Container maxWidth="lg">
                {" "}
                <Box className={classes.NFTbg}>
                  {isVideo ? (
                    <video width="100%" controls>
                      <source
                        src={auctionDetails?.nftId.mediaUrl}
                        type="video/mp4"
                      />
                    </video>
                  ) : (
                    <img
                      src={auctionDetails?.nftId.mediaUrl}
                      className={classes.nftimg}
                      width="400px"
                    />
                  )}
                </Box>
                <Typography
                  variant="h3"
                  className={`${classes.modaltitel} seats`}
                >
                  {auctionDetails?.nftId?.title}
                </Typography>
                <Box mb={3} className="seats">
                  <label className={classes.labelText}>Details:</label>
                  <Typography variant="body2" component="p">
                    {auctionDetails?.nftId?.details}
                  </Typography>
                </Box>
                <Grid container style={{ alignItems: "center" }}>
                  <Grid item xs={12} md={1}>
                    <label className={classes.labelText}>Time left:</label>
                  </Grid>
                  <Grid item xs={12} md={11}>
                    {auctionDetails?.isExport ? (
                      <List className={classes.timeing}>
                        <ListItem>Exported</ListItem>
                      </List>
                    ) : (
                      <>
                        {moment(auctionDetails?.nftId.time).unix() <
                          moment().unix() ||
                        !auctionDetails.orderPlace ||
                        auctionDetails?.isCancel ? (
                          <List className={classes.timeing}>
                            <ListItem>
                              {auctionDetails?.isCancel
                                ? "Cancelled"
                                : "Expired"}
                            </ListItem>
                          </List>
                        ) : (
                          <List className={classes.timeing}>
                            <ListItem>
                              {closeTimeLeft?.days ? closeTimeLeft?.days : "0"}{" "}
                              d
                            </ListItem>
                            <ListItem>
                              {closeTimeLeft?.hours
                                ? closeTimeLeft?.hours
                                : "0"}{" "}
                              h
                            </ListItem>
                            <ListItem>
                              {closeTimeLeft?.minutes
                                ? closeTimeLeft?.minutes
                                : "0"}{" "}
                              m
                            </ListItem>
                            <ListItem>
                              {closeTimeLeft?.seconds
                                ? closeTimeLeft?.seconds
                                : "0"}{" "}
                              s
                            </ListItem>
                          </List>
                        )}
                      </>
                    )}
                  </Grid>
                </Grid>
                <Box align="center">
                  {" "}
                  <label className={classes.labelText1} align="center">
                    Starting price
                  </label>
                  <Typography
                    variant="body1"
                    component="p"
                    className={classes.price}
                  >
                    {auctionDetails?.startingBid
                      ? auctionDetails?.startingBid
                      : "0"}{" "}
                    MAS
                  </Typography>
                  {auth?.userData?.userType === "Creator" ? (
                    <>
                      {!auctionDetails?.isExport ? (
                        <>
                          {auth.userLoggedIn && auth.userData?._id ? (
                            <>
                              {ProfileId.toLowerCase() ===
                                auctionDetails?.nftId?.userId.toLowerCase() &&
                                !auctionDetails?.orderPlace && (
                                  <Button
                                    variant="contained"
                                    size="large"
                                    color="secondary"
                                    className=""
                                    onClick={() => setOpenResale(true)}
                                    disabled={
                                      isResaleingOrder ||
                                      isCancelingOrder ||
                                      isAcceptingBid ||
                                      isBidding
                                    }
                                  >
                                    Resale{" "}
                                    {isResaleingOrder && (
                                      <ButtonCircularProgress />
                                    )}
                                  </Button>
                                )}
                              {auctionDetails?.nftId?.userId === ProfileId &&
                                !auctionDetails?.isSold &&
                                !auctionDetails?.isCancel &&
                                auctionDetails?.orderPlace &&
                                orderExtraDeails?.seller?.toLowerCase() !==
                                  deadAddress?.toLowerCase() && (
                                  <Button
                                    variant="contained"
                                    size="large"
                                    color="secondary"
                                    className=""
                                    onClick={orderCancelHandler}
                                    disabled={
                                      isCancelingOrder ||
                                      isAcceptingBid ||
                                      isBidding
                                    }
                                    style={{ marginRight: "10px" }}
                                  >
                                    cancel Order{" "}
                                    {isCancelingOrder && (
                                      <ButtonCircularProgress />
                                    )}
                                  </Button>
                                )}
                              {auctionDetails?.nftId?.userId === ProfileId &&
                                !auctionDetails?.isSold &&
                                !auctionDetails?.isCancel &&
                                auctionDetails?.orderPlace &&
                                orderExtraDeails?.seller?.toLowerCase() !==
                                  deadAddress?.toLowerCase() && (
                                  <Button
                                    variant="contained"
                                    size="large"
                                    color="secondary"
                                    className=""
                                    onClick={() => setOpenPlaceBid(true)}
                                    disabled={
                                      isBuyBid ||
                                      isCancelingOrder ||
                                      isAcceptingBid ||
                                      isBidding
                                    }
                                  >
                                    Update Order{" "}
                                    {isBuyBid && <ButtonCircularProgress />}
                                  </Button>
                                )}
                              &nbsp;&nbsp;&nbsp;
                              {ProfileId === auctionDetails?.nftId?.userId &&
                                allBidList.length !== 0 &&
                                !auctionDetails?.isSold &&
                                !auctionDetails?.isCancel &&
                                !auctionDetails?.isBuy && (
                                  <Button
                                    variant="contained"
                                    size="large"
                                    color="secondary"
                                    className=""
                                    onClick={acceptBidBlockChainHandler}
                                    disabled={
                                      isAcceptingBid ||
                                      isBidding ||
                                      isCancelingOrder
                                    }
                                  >
                                    Accept Bid{" "}
                                    {isAcceptingBid && (
                                      <ButtonCircularProgress />
                                    )}
                                  </Button>
                                )}
                              {auctionDetails?.nftId?.userId !== ProfileId &&
                                !auctionDetails?.isSold &&
                                !auctionDetails?.isCancel &&
                                orderExtraDeails?.seller?.toLowerCase() !==
                                  deadAddress?.toLowerCase() && (
                                  <Button
                                    variant="contained"
                                    size="large"
                                    color="secondary"
                                    className=""
                                    onClick={buyNowhandler}
                                    disabled={
                                      isBuyBid || isBidding || isAcceptingBid
                                    }
                                  >
                                    Buy Now{" "}
                                    {isBuyBid && <ButtonCircularProgress />}
                                  </Button>
                                )}
                              &nbsp;&nbsp;
                              {auctionDetails?.nftId?.userId !== ProfileId &&
                                !auctionDetails?.isSold &&
                                !auctionDetails?.isCancel &&
                                orderExtraDeails?.seller?.toLowerCase() !==
                                  deadAddress?.toLowerCase() && (
                                  <Button
                                    variant="contained"
                                    size="large"
                                    color="secondary"
                                    className=""
                                    onClick={() => setOpen1(true)}
                                    disabled={
                                      isBidding ||
                                      moment(
                                        auctionDetails?.nftId?.time
                                      ).unix() < moment().unix() ||
                                      isBuyBid
                                    }
                                  >
                                    Bid Now
                                  </Button>
                                )}
                              {auctionDetails?.nftId?.userId === ProfileId &&
                                auctionDetails?.orderPlace &&
                                !auctionDetails?.isSold && (
                                  <Button
                                    variant="contained"
                                    size="large"
                                    color="secondary"
                                    className=""
                                    onClick={() => setExportPop(true)}
                                    disabled={
                                      isAcceptingBid ||
                                      isBidding ||
                                      isCancelingOrder
                                    }
                                  >
                                    Export NFT
                                  </Button>
                                )}
                            </>
                          ) : (
                            ""
                          )}
                        </>
                      ) : (
                        <Box
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Typography variant="h4">
                            {`This NFT has already been exported to this address ${sortAddress(
                              auctionDetails?.exportedWalletAddress
                            )}`}
                          </Typography>
                          <Box>
                            <CopyToClipboard
                              text={auctionDetails?.exportedWalletAddress}
                            >
                              <IconButton>
                                <FiCopy onClick={() => toast.info("Copied")} />
                              </IconButton>
                            </CopyToClipboard>
                          </Box>
                        </Box>
                      )}
                    </>
                  ) : (
                    <>
                      {account ? (
                        <>
                          {auctionDetails?.nftId?.userId !== ProfileId &&
                            !auctionDetails?.isSold &&
                            !auctionDetails?.isCancel && (
                              <Button
                                variant="contained"
                                size="large"
                                color="secondary"
                                className=""
                                onClick={buyNowhandler}
                                disabled={isBuyBid || isBidding}
                              >
                                Buy Now {isBuyBid && <ButtonCircularProgress />}
                              </Button>
                            )}
                          &nbsp;&nbsp;
                          {auctionDetails?.nftId?.userId !== ProfileId &&
                            !auctionDetails?.isSold &&
                            !auctionDetails?.isCancel && (
                              <Button
                                variant="contained"
                                size="large"
                                color="secondary"
                                className=""
                                onClick={() => setOpen1(true)}
                                disabled={
                                  isBidding ||
                                  moment(auctionDetails?.nftId?.time).unix() <
                                    moment().unix() ||
                                  isBuyBid
                                }
                              >
                                Bid Now
                              </Button>
                            )}
                        </>
                      ) : (
                        ""
                      )}
                    </>
                  )}
                  <Box mt={2}>
                    <span>
                      ETH fees and{" "}
                      <Link
                        style={{ color: "#000", textDecoration: "underline" }}
                        onClick={() => setOpen5(true)}
                      >
                        {" "}
                        MAS fees
                      </Link>{" "}
                      apply.
                    </span>
                  </Box>
                </Box>
                <Box mb={5}>
                  <History data={allBidList} />
                </Box>
                <Box className={classes.masBox}>
                  <Grid container spacing="2">
                    <Grid item xs={12} md={4} align="center">
                      <Button
                        startIcon={<img src="images/IPFS.png" />}
                        style={{ fontSize: "20px", color: "#000" }}
                        onClick={() =>
                          window.open(auctionDetails?.nftId.fontSizemediaUrl)
                        }
                      >
                        View on IPFS
                      </Button>
                    </Grid>
                    <Grid item xs={12} md={4} align="center">
                      <Button
                        startIcon={<img src="images/eth.png" />}
                        style={{ fontSize: "20px", color: "#000" }}
                        onClick={() =>
                          window.open(
                            `https://etherscan.io/token/${NFTTokenContract}`
                          )
                        }
                      >
                        View on etherscan
                      </Button>
                    </Grid>
                    {/* <Grid item xs={12} md={4} align="center">
                      <Button
                        onClick={handleClickOpen2}
                        startIcon={
                          <MdReport
                            style={{ fontSize: "30px", color: "#000" }}
                          />
                        }
                        style={{ fontSize: "20px", color: "#000" }}
                      >
                        Report
                      </Button>
                    </Grid> */}
                  </Grid>
                </Box>
              </Container>
              <Box mt={5}>
                <Profile data={userdetails} />
              </Box>
            </>
          )}{" "}
        </>
      )}
      {/* resale modal */}
      {openResale && (
        <Dialog
          fullWidth="sm"
          maxWidth="sm"
          open={openResale}
          onClose={() => {
            if (!isResaleingOrder) {
              setOpenResale(false);
            }
          }}
          aria-labelledby="max-width-dialog-title"
          // disableBackdropClick={isUpdatingData}
          // disableEscapeKeyDown={isUpdatingData}
        >
          <DialogContent>
            <Typography variant="h4" className="modalTitle">
              Resale NFT
            </Typography>

            <Box>
              <label style={{ color: "#fff" }}>Price</label>
              <FormControl fullWidth className={classes.margin}>
                <TextField
                  disabled={isResaleingOrder}
                  type="number"
                  placeholder="0.124"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  onKeyPress={(event) => {
                    if (event?.key === "-" || event?.key === "+") {
                      event.preventDefault();
                    }
                  }}
                  endAdornment={
                    <InputAdornment position="end">MAS</InputAdornment>
                  }
                />
              </FormControl>
            </Box>

            <Box mt={1}>
              <label style={{ color: "#fff" }}>Expiry Time</label>
              <FormControl fullWidth className={classes.margin}>
                <TextField
                  value={moment(expiryDate).format("YYYY-MM-DDTHH:mm")}
                  type="datetime-local"
                  onChange={(e) => {
                    setExpiryDate(e.target.value);
                  }}
                  disabled={isResaleingOrder}
                  inputProps={{
                    min: moment().format("YYYY-MM-DDTHH:mm"),
                  }}
                />
              </FormControl>
            </Box>

            <Box align="center" className="modal_button_div" mt={4}>
              <Button
                disabled={isResaleingOrder}
                variant="contained"
                color="secondary"
                size="large"
                className={classes.btnWidth}
                mb={2}
                onClick={resaleOrderHandler}
                style={{ marginRight: "6px" }}
              >
                Submit
                {isResaleingOrder && <ButtonCircularProgress />}
              </Button>
              <Button
                disabled={isResaleingOrder}
                variant="contained"
                color="secondary"
                size="large"
                onClick={() => setOpenResale(false)}
                className={classes.btnWidth}
              >
                CANCEL
              </Button>
            </Box>
          </DialogContent>
        </Dialog>
      )}
      {/* bit modal */}
      {openBlock && (
        <Dialog
          open={openBlock}
          TransitionComponent={Transition}
          keepMounted
          onClose={() => setOpen1(false)}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
          className={classes.customModal}
        >
          <DialogContent className={classes.paper}>
            <DialogContentText id="alert-dialog-slide-description">
              <Box className={classes.NFTbg}>
                {" "}
                {isVideo ? (
                  <video width="100%" controls>
                    <source
                      src={auctionDetails?.nftId.mediaUrl}
                      type="video/mp4"
                    />
                  </video>
                ) : (
                  <img
                    src={auctionDetails?.nftId.mediaUrl}
                    className={classes.nftimg}
                    width="400px"
                  />
                  // <Box
                  //   id={`imagecard${data?._id}`}
                  //   className={classes.nftImg}
                  //   style={{
                  //     background: "url(" + auctionDetails.nftId.mediaUrl + ")",
                  //   }}
                  // ></Box>
                )}
              </Box>
              <Typography variant="h3" className={classes.modaltitel}>
                {auctionDetails?.nftId.title}
              </Typography>
              <Box mb={3}>
                <label className={classes.labelText}>Details:</label>
                <Typography variant="body2" component="p">
                  {auctionDetails?.nftId.details}
                </Typography>
              </Box>
              <Box className={classes.timeBox}>
                <Box item xs={12} md={1}>
                  <label className={classes.labelText}>Time left:</label>
                </Box>
                <Box item xs={12} md={11}>
                  <List className={classes.timeing}>
                    <ListItem>
                      {closeTimeLeft?.days ? closeTimeLeft?.days : "0"} d
                    </ListItem>
                    <ListItem>
                      {closeTimeLeft?.hours ? closeTimeLeft?.hours : "0"} h
                    </ListItem>
                    <ListItem>
                      {closeTimeLeft?.minutes ? closeTimeLeft?.minutes : "0"} m
                    </ListItem>
                    <ListItem>
                      {closeTimeLeft?.seconds ? closeTimeLeft?.seconds : "0"} s
                    </ListItem>
                  </List>
                </Box>
              </Box>
              <Box align="center">
                {" "}
                <label className={classes.labelText} align="center">
                  Starting price
                </label>
                <Typography
                  variant="body1"
                  component="p"
                  className={classes.price}
                >
                  {auctionDetails?.startingBid} MAS
                </Typography>
              </Box>
              <Container>
                <Box paddingTop="30px">
                  <Grid container spacing={6} alignItems="center">
                    <Grid item xs={12} md={4}></Grid>
                    <Grid item xs={12} md={4} align="right">
                      <Button
                        variant="contained"
                        size="large"
                        color="primery"
                        onClick={() => setOpen1(false)}
                        className="btn-block btnWidth removeredius"
                      >
                        Cancel
                      </Button>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <>
                        <Button
                          variant="contained"
                          size="large"
                          color="secondary"
                          onClick={() => setOpen4(true)}
                          className="btn-block btnWidth removeredius"
                        >
                          Apply
                        </Button>
                      </>
                    </Grid>
                  </Grid>
                </Box>
              </Container>
            </DialogContentText>
          </DialogContent>
        </Dialog>
      )}
      {/* report modal */}
      {openBlock2 && (
        <Dialog
          open={openBlock2}
          TransitionComponent={Transition}
          keepMounted
          fullWidth="sm"
          maxWidth="sm"
          onClose={() => setOpen2(false)}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogContent className={classes.paper}>
            <DialogContentText id="alert-dialog-slide-description">
              <Typography variant="h3" className={classes.modaltitel}>
                Report
              </Typography>
              <Box>
                <label>select a problem</label>
                <Box className="reposr-btn">
                  <Button>NSFW</Button>
                  <Button>Anti religions</Button>
                  <Button className="active">copyright violation</Button>
                  <Button>Other</Button>
                </Box>
              </Box>
              <Box mt={4}>
                <label>Comments</label>
                <TextField
                  id="outlined-multiline-static"
                  multiline
                  rows={4}
                  className={classes.input_fild}
                  variant="outlined"
                />
              </Box>
              <Box mt={2} className={classes.btnBox} align="center">
                <Button
                  variant="contained"
                  size="large"
                  color="secondary"
                  className=" "
                  onClick={() => setOpen2(false)}
                >
                  Confirm your report
                </Button>
              </Box>
            </DialogContentText>
          </DialogContent>
        </Dialog>
      )}
      {/* approve bid modal */}
      {openBlock3 && (
        <Dialog
          open={openBlock3}
          TransitionComponent={Transition}
          keepMounted
          fullWidth="sm"
          maxWidth="sm"
          onClose={() => setOpen3(false)}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
          disableBackdropClick={isBidding}
          disableEscapeKeyDown={isBidding}
        >
          <DialogContent className={classes.paper}>
            <DialogContentText id="alert-dialog-slide-description">
              <Typography variant="h3" className={classes.modaltitel}>
                {details.tokenName}
              </Typography>
              <Box align="center">
                {" "}
                <label className={classes.labelText} align="center">
                  Bid:
                </label>
                <Typography
                  variant="body1"
                  component="p"
                  className={classes.price}
                >
                  {bid} MAS
                </Typography>
              </Box>
              <Box mt={2} className={classes.btnBox} align="center">
                <Button
                  variant="contained"
                  size="large"
                  color="secondary"
                  className=" "
                  // onClick={placingbid}
                  disabled={isBidding}
                >
                  approve bid {isBidding && <ButtonCircularProgress />}
                </Button>
              </Box>
            </DialogContentText>
          </DialogContent>
        </Dialog>
      )}
      {/*bid modal */}
      {openBlock4 && (
        <Dialog
          open={openBlock4}
          TransitionComponent={Transition}
          keepMounted
          fullWidth="sm"
          maxWidth="sm"
          onClose={() => setOpen4(false)}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
          disableBackdropClick={isBidding}
          disableEscapeKeyDown={isBidding}
        >
          <DialogContent className={classes.paper}>
            <DialogContentText id="alert-dialog-slide-description">
              <Typography variant="h3" className={classes.modaltitel}>
                Bid
              </Typography>
              <Box className={classes.nftimg}>
                {isVideo ? (
                  <video width="100%" controls>
                    <source
                      src={auctionDetails?.nftId.mediaUrl}
                      type="video/mp4"
                    />
                  </video>
                ) : (
                  <img
                    src={auctionDetails?.nftId.mediaUrl}
                    className={classes.nftimg}
                    width="400px"
                  />
                )}
              </Box>

              <Box mt={3} className="bitText">
                <Typography variant="body" componant="p">
                  <TextField
                    fullWidth
                    value={bid}
                    onChange={(e) => setbid(e.target.value)}
                    type="number"
                    disabled={isBidding}
                  />
                </Typography>
                <Box>
                  <IconButton
                    color="primary"
                    aria-label="upload picture"
                    component="span"
                    disabled={isBidding}
                  >
                    <GrFormAdd onClick={() => setbid(bid + 1)} />
                  </IconButton>
                  <IconButton
                    color="primary"
                    aria-label="upload picture"
                    component="span"
                    disabled={isBidding}
                  >
                    <FiMinus
                      onClick={() => {
                        if (bid > 0) {
                          setbid(bid - 1);
                        }
                      }}
                    />
                  </IconButton>
                </Box>
              </Box>

              <Box mt={2} className={classes.btnBox} align="center">
                {allBidList[0]?.bid && (
                  <Box>
                    <Typography
                      variant="h4"
                      style={{ fontSize: "14px", marginBottom: "10px" }}
                    >
                      Last bid price:{" "}
                      {allBidList[0]?.bid ? allBidList[0]?.bid : "0"}
                    </Typography>
                  </Box>
                )}
                <Button
                  variant="contained"
                  size="large"
                  color="secondary"
                  className=" "
                  disabled={isBidding}
                  onClick={palceBidBlockChainHandler}
                >
                  Confirm your bid {isBidding && <ButtonCircularProgress />}
                </Button>
              </Box>
            </DialogContentText>
          </DialogContent>
        </Dialog>
      )}
      {/* mas table */}
      {open5 && (
        <PlaneListPopup open={open5} handleClose={() => setOpen5(false)} />
      )}
      {/* Update Order */}
      {openPlaceBid && (
        <Dialog
          fullWidth="sm"
          maxWidth="sm"
          open={openPlaceBid}
          onClose={() => {
            if (!isUpdatingOrder) {
              setOpenPlaceBid(false);
            }
          }}
          aria-labelledby="max-width-dialog-title"
        >
          <DialogContent>
            <Box className="dilogBox">
              <Typography variant="h4" className="modalTitle">
                Update Order
              </Typography>

              <Box mt={2}>
                <label className={classes.stylecolor}>Price</label>
                <FormControl fullWidth className={classes.margin}>
                  <TextField
                    type="number"
                    placeholder="0.124"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    onKeyPress={(event) => {
                      if (event?.key === "-" || event?.key === "+") {
                        event.preventDefault();
                      }
                    }}
                    endAdornment={
                      <InputAdornment position="end">
                        <BiLockOpen style={{ color: "#fff" }} />{" "}
                        <span style={{ color: "#fff" }}>MAS</span>
                      </InputAdornment>
                    }
                  />
                </FormControl>
              </Box>

              <Box mt={1}>
                <label>Expiry Time</label>
                <FormControl fullWidth className={classes.margin}>
                  <TextField
                    type="datetime-local"
                    disabled={isUpdatingOrder}
                    value={expiryDate}
                    onChange={(e) => {
                      setExpiryDate(e.target.value);
                    }}
                    inputProps={{
                      min: moment().format("YYYY-MM-DDTHH:mm"),
                    }}
                    animateYearScrolling
                    format="DD/MM/yyyy hh:mm"
                    minDate={new Date()}
                    // maxDate={new Date(parseFloat(orderDetails.endTime) * 1000)}
                  />
                </FormControl>
              </Box>

              <Box align="center" className="modal_button_div" mt={4}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={updateOrderAPIHandler}
                  className={classes.btnWidth}
                  mb={2}
                  disabled={isUpdatingOrder}
                >
                  Update
                  {isUpdatingOrder && <ButtonCircularProgress />}
                </Button>
              </Box>
            </Box>
          </DialogContent>
        </Dialog>
      )}
      {exportPop && (
        <Dialog
          fullWidth="sm"
          maxWidth="sm"
          open={exportPop}
          onClose={() => setExportPop(false)}
          aria-labelledby="max-width-dialog-title"
          disableBackdropClick={isExportingNft}
          disableEscapeKeyDown={isExportingNft}
        >
          <DialogContent>
            {isExportingNft && (
              <Typography style={{ color: "red" }}>
                <b>
                  <i>
                    Please do not refresh the page it will take time to export
                    your NFT
                  </i>
                </b>
              </Typography>
            )}
            <Box className={classes.PhotoBox}>
              {isVideo ? (
                <div>
                  <video width="100%" controls>
                    <source
                      src={auctionDetails?.nftId.mediaUrl}
                      type="video/mp4"
                    />
                  </video>
                </div>
              ) : (
                <img
                  src={auctionDetails?.nftId.mediaUrl}
                  alt=""
                  // style={{ height: '368px', width: '553px' }}
                />
              )}
              {/* <img src={data.mediaUrl} alt="" /> */}
            </Box>
            <Box mt={3} className={classes.bundleText} textAlign="center">
              <Typography variant="h4" className="red seats">
                {auctionDetails?.nftId?.title}
              </Typography>
            </Box>

            <Box mt={2} className={classes.deskiText}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4} lg={2}>
                  <Typography
                    variant="h4"
                    align="left"
                    color="textSecondary"
                    style={{ fontSize: "16px" }}
                  >
                    Details:{" "}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={8} lg={10}>
                  <Typography
                    fullWidth
                    variant="body2"
                    align="left"
                    color="textSecondary"
                    className="seats"
                  >
                    {auctionDetails?.nftId?.details}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4} lg={2}>
                  <Typography
                    variant="h4"
                    align="left"
                    color="textSecondary"
                    style={{ fontSize: "16px" }}
                  >
                    Export to:{" "}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={8} lg={10}>
                  <TextField
                    // variant="outlined"
                    fullWidth
                    type="text"
                    onChange={(e) => setExportAddress(e.target.value)}
                    value={exportAddress}
                    error={isValidate && exportAddress === ""}
                    helperText={
                      isValidate &&
                      exportAddress === "" &&
                      "Please enter a wallet address to transfer"
                    }
                  />
                </Grid>
              </Grid>
            </Box>
          </DialogContent>
          <DialogActions>
            <Box display="flex" justifyContent="center" width="100%">
              <Button
                onClick={() => {
                  setExportPop(false);
                  setExportAddress("");
                }}
                variant="contained"
                size="large"
                color="secondary"
                style={{ marginRight: "10px" }}
                disabled={isExportingNft}
              >
                Close
              </Button>
              <Button
                onClick={() => nftExportHandler(exportAddress)}
                variant="contained"
                size="large"
                color="secondary"
                disabled={isExportingNft}
              >
                Export {isExportingNft && <ButtonCircularProgress />}
              </Button>
            </Box>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
}
