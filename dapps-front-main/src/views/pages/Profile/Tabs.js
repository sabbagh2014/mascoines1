import React, { useState, useEffect, useContext } from "react";
import { Box, Container, makeStyles, Button } from "@material-ui/core";
import Page from "src/component/Page";
import Auction from "./Auction";
import Bundles from "./Bundles";
import Subscribtions from "./Subscribtions";
import Feed from "./Feed";
import Apiconfigs from "src/Apiconfig/Apiconfigs";
import axios from "axios";
import DataLoading from "src/component/DataLoading";
import { UserContext } from "src/context/User";
import MyBids from "./MyBids";
import UserDeatilsCardPage from "./UserDeatilsCardPage";
import { toast } from "react-toastify";
import SoldBuyList from "./SoldBuyList";

import DepositTrnsaction from "./DepositTrnsaction";
import DepositAllTransaction from "./DepositAllTransaction";
import Loader from "src/component/Loader";
import { useLocation } from "react-router-dom";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  Padding_Top: {
    paddingTop: "50px",
    backgroundColor: "#fff",
  },
  PageHeading: {
    fontWeight: "500",
    fontSize: "32px",
    lineHeight: "39px",
    color: "#000",
    paddingBottom: "10px",
  },
  active: {
    borderBottom: "2px solid #792034",
    borderRadius: "0px",
  },
}));

const dataDummyArray = [
  {
    img: "images/user-profile.png",
    mediaUrl: "images/feed1.png",
  },
];

function Activity(props) {
  const auth = useContext(UserContext);
  const history = useHistory();
  const classes = useStyles();
  const [tabview, setTabView] = useState("bundles");
  const [subscriptions, setSubscription] = useState([]);
  const [feeds, setfeeds] = useState([]);
  const [privateFeeds, setPrivateFeeds] = useState([]);
  const [allFeed, setAllFeed] = useState([]);
  const [auction, setauction] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [myBidList, setmyBidList] = useState([]);
  const [bundles, setBundles] = useState([]);
  const [subscribeList, setsubscribeList] = useState([]);
  const [subscriberList, setSubscriberList] = useState([]);
  const [donateUserList, setDonateUserList] = useState([]);
  const [soldOrderList, setSoldOrderList] = useState([]);
  const [buyOrderList, setBuyOrderList] = useState([]);
  const [donateList, setdonateList] = useState([]);
  const [loaderDepost, setLoaderDeposit] = useState(false);
  const [depositList, setDepositList] = useState([]);
  const [loaderDonation, setLoaderLonation] = useState(false);
  const [page, setPage] = useState(1);
  const [noOfPages, setnoOfPages] = useState(1);
  const [page1, setPage1] = useState(1);
  const [noOfPages1, setnoOfPages1] = useState(1);
  const getBundleListHandler = async () => {
    setIsLoading(true);
    await axios({
      method: "GET",
      url: Apiconfigs.myauction,
      headers: {
        token: window.localStorage.getItem("token"),
      },
    })
      .then(async (res) => {
        setIsLoading(false);

        if (res.data.statusCode === 200) {
          setBundles(res.data.result);
        }
      })
      .catch((err) => {
        setIsLoading(false);

        console.log(err.message);
      });
  };

  const getBundlesubscriptionListHandler = async () => {
    await axios({
      method: "GET",
      url: Apiconfigs.mysubscription,
      headers: {
        token: window.localStorage.getItem("token"),
      },
    })
      .then(async (res) => {
        if (res.data.statusCode === 200) {
          // console.log(res.data.result);
          setSubscription(res.data.result);
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const getFeedListHandler = async () => {
    await axios({
      method: "GET",
      url: Apiconfigs.myfeed,
      headers: {
        token: window.localStorage.getItem("token"),
      },
    })
      .then(async (res) => {
        if (res.data.statusCode === 200) {
          console.log("responseFeeds----", res.data.result);
          setAllFeed(res.data.result);
          setfeeds(res.data.result.public_Private.result);
          setPrivateFeeds(res.data.result.private.result);
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const myAuctionNftListHandler = async () => {
    await axios({
      method: "GET",
      url: Apiconfigs.listorder,
      headers: {
        token: window.localStorage.getItem("token"),
      },
    })
      .then(async (res) => {
        if (res.data.statusCode === 200) {
          console.log("response----", res.data.result);
          setauction(res.data.result);
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const myBidListHandler = async () => {
    await axios({
      method: "GET",
      url: Apiconfigs.myBid,
      headers: {
        token: window.localStorage.getItem("token"),
      },
    })
      .then(async (res) => {
        if (res.data.statusCode === 200) {
          setmyBidList(res.data.result);
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const soldOrderListHandler = async () => {
    await axios({
      method: "GET",
      url: Apiconfigs.soldOrderList,
      headers: {
        token: window.localStorage.getItem("token"),
      },
    })
      .then(async (res) => {
        if (res.data.statusCode === 200) {
          setSoldOrderList(res.data.result);
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const buyOrderListHandler = async () => {
    await axios({
      method: "GET",
      url: Apiconfigs.buyOrderList,
      headers: {
        token: window.localStorage.getItem("token"),
      },
    })
      .then(async (res) => {
        if (res.data.statusCode === 200) {
          console.log("buyOrderList-----", res.data.result);
          setBuyOrderList(res.data.result);
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  useEffect(() => {
    // if (!window.localStorage.getItem('isProfileLoaded')) {
    if (auth?.userData?.userType !== "User") {
      getBundleListHandler();
      donateUserListtHandler();
      setTabView("bundles");
    } else {
      setTabView("subscribtions");
    }
    soldOrderListHandler();
    getFeedListHandler();
    buyOrderListHandler();
    myAuctionNftListHandler();
    getBundlesubscriptionListHandler();
    myBidListHandler();
    profileSubscriberListHandler();
    profileSubscribeListHandler();
    donationListHandler();
    depositListHandler();
    // }
  }, [auth.userData]);

  const likeDislikeNfthandler = async (id) => {
    try {
      const res = await axios.get(Apiconfigs.likeDislikeNft + id, {
        headers: {
          token: window.localStorage.getItem("token"),
        },
      });
      if (res.data.statusCode === 200) {
        toast.success(res.data.responseMessage);
        getBundlesubscriptionListHandler();
      } else {
        toast.error(res.data.responseMessage);
      }
    } catch (error) {
      console.log("ERROR", error);
    }
  };

  const profileSubscriberListHandler = async () => {
    await axios({
      method: "GET",
      url: Apiconfigs.profileSubscriberList,
      headers: {
        token: window.localStorage.getItem("token"),
      },
    })
      .then(async (res) => {
        if (res.data.statusCode === 200) {
          setSubscriberList(res.data.result);
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const profileSubscribeListHandler = async () => {
    await axios({
      method: "GET",
      url: Apiconfigs.profileSubscribeList,
      headers: {
        token: window.localStorage.getItem("token"),
      },
    })
      .then(async (res) => {
        if (res.data.statusCode === 200) {
          setsubscribeList(res.data.result);
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const donateUserListtHandler = async () => {
    await axios({
      method: "GET",
      url: Apiconfigs.donateUserList,
      headers: {
        token: window.localStorage.getItem("token"),
      },
    })
      .then(async (res) => {
        if (res.data.statusCode === 200) {
          setDonateUserList(res.data.result);
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const updateLikeData = () => {
    donateUserListtHandler();
    profileSubscribeListHandler();
    profileSubscriberListHandler();
  };

  const donationListHandler = async () => {
    setLoaderLonation(true);
    await axios({
      method: "GET",
      url: Apiconfigs.donationTransactionlist,
      headers: {
        token: window.localStorage.getItem("token"),
      },
      params: {
        limit: 10,
        page: page,
      },
    })
      .then(async (res) => {
        if (res.data.statusCode === 200) {
          setLoaderLonation(false);
          setdonateList(res?.data?.result?.docs);
        } else {
          setLoaderLonation(false);
        }
      })
      .catch((err) => {
        setLoaderLonation(false);

        console.log(err.message);
      });
  };

  const depositListHandler = async () => {
    setLoaderDeposit(true);
    await axios({
      method: "GET",
      url: Apiconfigs.transactionList,
      headers: {
        token: window.localStorage.getItem("token"),
      },
      params: {
        limit: 10,
        page: page,
      },
    })
      .then(async (res) => {
        if (res.data.statusCode === 200) {
          setLoaderDeposit(false);
          setDepositList(res.data.result.docs);
        } else {
          setLoaderDeposit(false);
        }
      })
      .catch((err) => {
        setLoaderDeposit(false);

        console.log(err.message);
      });
  };

  return (
    <Page title="Marketplace for NFTs">
      <Box className={classes.Padding_Top}>
        {isLoading ? (
          // <DataLoading />
          <Loader />
        ) : (
          <Container maxWidth="xl">
            <Box className="TabButtonsBox">
              {auth?.userData?.userType !== "User" && (
                <Button
                  className={tabview === "bundles" ? classes.active : " "}
                  onClick={() => setTabView("bundles")}
                >
                  My Bundles
                </Button>
              )}
              <Button
                className={tabview === "subscribtions" ? classes.active : " "}
                onClick={() => setTabView("subscribtions")}
              >
                My subscriptions
              </Button>
              <Button
                className={tabview === "feed" ? classes.active : " "}
                onClick={() => setTabView("feed")}
              >
                My feed
              </Button>
              {auth?.userData?.userType !== "User" && (
                <Button
                  className={tabview === "auctions" ? classes.active : " "}
                  onClick={() => setTabView("auctions")}
                >
                  My auctions
                </Button>
              )}
              <Button
                className={tabview === "bids" ? classes.active : " "}
                onClick={() => setTabView("bids")}
              >
                My Bids
              </Button>
              {auth?.userData?.userType !== "User" && (
                <Button
                  className={tabview === "subscribe" ? classes.active : " "}
                  onClick={() => setTabView("subscribe")}
                >
                  User Subscribers
                </Button>
              )}

              {auth?.userData?.userType !== "User" && (
                <Button
                  className={tabview === "donor" ? classes.active : " "}
                  onClick={() => setTabView("donor")}
                >
                  Supporter List
                </Button>
              )}
              {auth?.userData?.userType !== "User" && (
                <Button
                  className={tabview === "soldAuctions" ? classes.active : " "}
                  onClick={() => setTabView("soldAuctions")}
                >
                  Sold Auctions NFT
                </Button>
              )}
              <Button
                className={tabview === "BoughtAuctions" ? classes.active : " "}
                onClick={() => setTabView("BoughtAuctions")}
              >
                Bought Auctions NFT
              </Button>
              {/* {auth?.userData?.userType === "User" && ( */}
              <Button
                className={
                  tabview === "transactionDeposit" ? classes.active : " "
                }
                onClick={() => setTabView("transactionDeposit")}
              >
                Donate Transaction
              </Button>
              {/* )} */}
              <Button
                className={
                  tabview === "TransactionHistory" ? classes.active : " "
                }
                onClick={() => setTabView("TransactionHistory")}
              >
                Transaction History
              </Button>
            </Box>
            <Box className="TabButtonsContant">
              {tabview === "bundles" ? (
                <Bundles bundles={bundles} updateList={getBundleListHandler} />
              ) : (
                ""
              )}
              {tabview === "subscribtions" ? (
                <Subscribtions
                  likeDislikeNfthandler={(id) => likeDislikeNfthandler(id)}
                  subscriptions={subscriptions}
                  subscriberList={subscriberList}
                  callbackFn={updateLikeData}
                />
              ) : (
                ""
              )}
              {tabview === "subscribe" ? (
                <UserDeatilsCardPage
                  userList={subscribeList}
                  isSubscribe={true}
                  callbackFn={updateLikeData}
                  type="subscriber"
                />
              ) : (
                ""
              )}
              {tabview === "feed" ? (
                <Feed
                  feeds={feeds}
                  privateFeeds={privateFeeds}
                  allFeed={allFeed}
                  updateList={getFeedListHandler}
                />
              ) : (
                ""
              )}
              {tabview === "donor" ? (
                <UserDeatilsCardPage
                  userList={donateUserList}
                  isdonor={true}
                  callbackFn={updateLikeData}
                  type="donar"
                />
              ) : (
                ""
              )}
              {tabview === "auctions" ? (
                <Auction
                  auction={auction}
                  updateList={myAuctionNftListHandler}
                />
              ) : (
                ""
              )}

              {tabview === "BoughtAuctions" && (
                <SoldBuyList
                  isSold={false}
                  auction={buyOrderList}
                  updateList={myAuctionNftListHandler}
                  type="bought"
                />
              )}

              {tabview === "soldAuctions" && (
                <SoldBuyList
                  isSold={true}
                  auction={soldOrderList}
                  updateList={myAuctionNftListHandler}
                  type="sold"
                />
              )}

              {tabview === "bids" ? (
                <MyBids auction={myBidList} updateList={myBidListHandler} />
              ) : (
                ""
              )}
              {tabview === "transactionDeposit" ? (
                <DepositTrnsaction
                  donateList={donateList}
                  loaderDonation={loaderDonation}
                  updateList={donationListHandler}
                  noOfPages={noOfPages}
                  page={page}
                  setPage={(data) => setPage(data)}
                  history={history}
                  auth={auth}
                />
              ) : (
                ""
              )}
              {tabview === "TransactionHistory" ? (
                <DepositAllTransaction
                  depositList={depositList}
                  loaderDonation={loaderDepost}
                  updateList={depositListHandler}
                  page1={page1}
                  setPage1={(data) => setPage1(data)}
                  history={history}
                  auth={auth}
                />
              ) : (
                ""
              )}
            </Box>
          </Container>
        )}
      </Box>
    </Page>
  );
}

export default Activity;
