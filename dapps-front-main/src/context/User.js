import React, { createContext, useEffect, useState, useContext } from "react";
import { injected } from "src/connectors";
import { useWeb3React } from "@web3-react/core";
import Apiconfigs, { socketURL } from "src/Apiconfig/Apiconfigs";
import axios from "axios";
import { ACTIVE_NETWORK } from "src/constants";
import { toast } from "react-toastify";
import { RefreshContext } from "./RefreshContext";
import { sortAddress, getWeb3Obj } from "src/utils";
export const UserContext = createContext();

function checkLogin() {
  const accessToken = window.localStorage.getItem("token");
  return accessToken ? true : false;
}

const setSession = (userAddress) => {
  if (userAddress) {
    localStorage.setItem("userAddress", userAddress);
  } else {
    localStorage.removeItem("userAddress");
  }
};
const setTokenSession = (token) => {
  if (token) {
    localStorage.setItem("token", token);
  } else {
    localStorage.removeItem("token");
  }
};

export default function AuthProvider(props) {
  const { activate, account, deactivate } = useWeb3React();
  const { fast, slow } = useContext(RefreshContext);
  const [isLogin, setIsLogin] = useState(checkLogin());
  const [userData, setUserData] = useState();
  const [supportedNetwork, setSupportedNetwork] = useState(ACTIVE_NETWORK);
  const [unreadChats, setUnreadChats] = useState(0);
  const [unReadNotification, setUnReadNotification] = useState(0);
  const [chatMessageData, setChatMessageData] = useState();
  const [isErrorInWalletConnect, setIsErrorInWalletConnect] = useState(false);
  const [connectWalletError, setConnectWalletError] = useState("");
  const [onlyConnectWallet, setOnlyConnectWallet] = useState(false);
  const [yourWalletBalance, setYourWalletBalance] = useState(0);
  const [userEarnings, setUserEarnings] = useState({});
  window.localStorage.setItem("isProfileLoaded", false);
  const [balance, setbalance] = useState({
    MAS: "",
    BTC: "",
    ETH: "",
  });
  const [userProfileData, setUserProfileData] = useState({
    username: "",
    useremail: "",
    userurl: "",
    userbio: "",
    userprofile: "",
    usercover: "",
    userprofileurl: "",
    usercoverurl: "",
    name: "",
  });
  const [link, setlink] = useState({
    useryoutube: "",
    usertwitter: "",
    userfacebook: "",
    usertelegram: "",
  });
  const [notifyData, setNotifyData] = useState([]);
  const [notifyLoader, setNotifyLoder] = useState(false);
  const [bannerDetails, setBannerDetails] = useState({});
  const [ourSolutions, setOurSolutions] = useState({});
  const [howItWorksData, setHoeItWorksData] = useState({});
  const [bannerVideo, setBannerVideo] = useState([]);
  //CHAT COUNT
  useEffect(() => {
    const web = new WebSocket(socketURL);
    const accessToken = localStorage.getItem("token");
    if (accessToken) {
      try {
        web.onopen = () => {
          const dataToSend = {
            user_token: accessToken,
          };
          web.send(JSON.stringify(dataToSend));
          web.onmessage = async (event) => {
            if (event.data !== "[object Promise]" && event.data !== "null") {
              let obj = JSON.parse(event.data);
              setUnreadChats(obj);
            }
          };
        };
        return () => {
          web.close();
          setUnreadChats(0);
        };
      } catch (err) {
        setUnreadChats(0);
      }
    }
  }, [userData]);
  const [search, setsearch] = useState("");

  //CHAT ChatHistory
  useEffect(() => {
    const web = new WebSocket(socketURL);
    const accessToken = localStorage.getItem("token");
    if (accessToken && userData && userData._id) {
      try {
        web.onopen = () => {
          const dataToSend = {
            type: "ChatHistory",
            senderId: userData._id,
          };
          web.send(JSON.stringify(dataToSend));
          web.onmessage = async (event) => {
            if (event.data !== "[object Promise]" && event.data !== "null") {
              let obj = JSON.parse(event.data);
              setChatMessageData(obj.result);
            }
          };
        };
        return () => {
          web.close();
          setChatMessageData();
        };
      } catch (err) {
        setChatMessageData();
      }
    }
  }, [userData, search]);
  const getUserbalce = async () => {
    const web3 = await getWeb3Obj();
    const balance = await web3.eth.getBalance(account);
    const balanceImETH = await web3.utils.fromWei(balance);
    setYourWalletBalance(parseFloat(balanceImETH).toFixed(2));
  };
  const getProfileDataHandler = async () => {
    try {
      axios({
        method: "GET",
        url: Apiconfigs.profile,
        headers: {
          token: window.localStorage.getItem("token"),
        },
      }).then(async (res) => {
        if (res.data.statusCode === 200) {
          // console.log('responseProfile----->>>', res.data)
          window.localStorage.setItem("isProfileLoaded", true);
          setUserData({ ...res.data.userResult, ...res.data.obj });
          setUserProfileData({
            ...userProfileData,
            name: res?.data?.userResult?.name,
            username: res?.data?.userResult?.userName,
            useremail: res?.data?.userResult?.email,
            userurl: res?.data?.userResult?.massPageUrl,
            userbio: res?.data?.userResult?.bio,
            userprofile: res?.data?.userResult?.profilePic,
            usercover: res?.data?.userResult?.coverPic,
            userprofileurl: "",
            usercoverurl: "",
          });
          setlink({
            ...link,
            useryoutube: res?.data?.userResult?.youtube,
            usertwitter: res?.data?.userResult?.twitter,
            userfacebook: res?.data?.userResult?.facebook,
            usertelegram: res?.data?.userResult?.telegram,
          });
          // axios({
          //   method: 'GET',
          //   url:
          //     Apiconfigs.getbalance +
          //     res?.data?.result?.ethAccount?.address +
          //     '/MASS',
          //   headers: {
          //     token: window.localStorage.getItem('token'),
          //   },
          // })
          //   .then(async (res) => {
          //     if (res.data.result.responseCode === 200) {
          //       setbalance({
          //         mas: res?.data?.result?.balance,
          //         BTC: '',
          //         ETH: '',
          //       })
          //     }
          //   })
          //   .catch((err) => {
          //     console.log(err.message)
          //   })
        } else {
          setIsLogin(false);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };
  const getCoinBalanceHandler = async () => {
    try {
      const res = axios({
        method: "GET",
        url: Apiconfigs.getCoinBalance,
        headers: {
          token: window.localStorage.getItem("token"),
        },
      });
    } catch (error) {
      console.log(error);
    }
  };
  const getTotalEarningsHandler = async () => {
    try {
      const res = await axios({
        method: "GET",
        url: Apiconfigs.totalEarnings,
        headers: {
          token: window.localStorage.getItem("token"),
        },
      });
      if (res.data.statusCode == 200) {
        setUserEarnings(res.data.result);
      }
    } catch (error) {
      console.log(error);
    }
  };
  // const getBannerContentHandler = async () => {
  //   try {
  //     const res = await axios({
  //       method: 'GET',
  //       url: Apiconfigs.getBannerBackground,
  //     })
  //     if (res.data.statusCode === 200) {
  //       console.log('responeBanner', res.data.result)
  //       setBannerDetails(res.data.result)
  //     }
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }
  // const getBannerVideoDataHandler = async () => {
  //   try {
  //     const res = await axios({
  //       method: 'GET',
  //       url: Apiconfigs.getVideos,
  //     })
  //     if (res.data.statusCode === 200) {
  //       console.log('videos----', res.data.result)

  //       setBannerVideo(res.data.result)
  //     }
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }
  // const getOurSolutionContentHandler = async () => {
  //   try {
  //     const res = await axios({
  //       method: 'GET',
  //       url: Apiconfigs.content,
  //       params: {
  //         type: 'solution',
  //       },
  //     })
  //     if (res.data.statusCode === 200) {
  //       setOurSolutions(res.data.result)
  //     }
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }
  // const getHowitWorksContentHandler = async () => {
  //   try {
  //     const res = await axios({
  //       method: 'GET',
  //       url: Apiconfigs.content,
  //       params: {
  //         type: 'howItWorks',
  //       },
  //     })
  //     if (res.data.statusCode === 200) {
  //       setHoeItWorksData(res.data.result)
  //     }
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }
  // useEffect(() => {
  //   getBannerContentHandler()
  //   getOurSolutionContentHandler()
  //   getHowitWorksContentHandler()
  //   getBannerVideoDataHandler()
  // }, [])

  useEffect(() => {
    if (isLogin) {
      getTotalEarningsHandler();
    }
  }, [fast, isLogin]);

  useEffect(() => {
    if (window.localStorage.getItem("token")) {
      getProfileDataHandler();
    }
  }, []);

  useEffect(() => {
    if (window.localStorage.getItem("token")) {
      getCoinBalanceHandler();
    }
  }, [slow]);

  let data = {
    isErrorInWalletConnect,
    unreadChats,
    connectWalletError,
    chatMessageData,
    unReadNotification,
    supportedNetwork,
    userLoggedIn: isLogin,
    yourWalletBalance,
    userEarnings,
    setsearch,
    search,
    onlyConnectWallet,
    // bannerDetails,
    // ourSolutions,
    // howItWorksData,
    // bannerVideo,
    setOnlyConnectWallet: (data) => setOnlyConnectWallet(data),
    updateUser: (account) => {
      setSession(account);
    },
    link,
    balance,
    userProfileData,
    notifyLoader,
    notifyData,
    setbalances: (data) => {
      setbalance({
        ...balance,
        MAS: data.mas,
        BTC: data.btc,
        ETH: data.eth,
      });
    },
    updateUserStateData: (data) => {
      setUserProfileData({
        ...userProfileData,
        name: data.name,
        username: data.username,
        useremail: data.useremail,
        userurl: data.userurl,
        userbio: data.userbio,
        userprofile: data.profile,
        usercover: data.cover,
        userprofileurl: data.profileurl,
        usercoverurl: data.coverurl,
      });
    },
    userlink: (data) => {
      setlink({
        ...link,
        useryoutube: data.youtube,
        usertwitter: data.twitter,
        userfacebook: data.facebook,
        usertelegram: data.telegram,
      });
    },
    connectWallet: () => {
      activate(injected, undefined, true).catch((error) => {
        if (error) {
          activate(injected);
          setIsErrorInWalletConnect(true);
          setConnectWalletError(JSON.stringify(error.message));
          toast.error(JSON.stringify(error.message));
        }
      });
    },
    isLogin,
    userData,
    // getProfileHandler: (token) => getProfileHandler(token),
    logOut: () => {
      setIsLogin(false);
      setTokenSession(false);
      setUserData();
      setUserProfileData();
      localStorage.removeItem("userAddress");
      localStorage.removeItem("token");
      setOnlyConnectWallet(false);
      deactivate();
      if (account) {
        deactivate();
      }
    },
    updateSupportedNetwork: (id) => {
      setSupportedNetwork(id);
    },
    updatetoken: (token) => {
      setTokenSession(token);
      setIsLogin(true);
      data.updateUserData();
    },
    updateUserData: () => getProfileDataHandler(),
  };
  // useEffect(() => {
  //   if (!account) {
  //     setIsLogin(false);
  //   }
  // }, [account]);

  useEffect(() => {
    if (isLogin) {
      data.updateUserData();
    }
  }, [isLogin]);

  useEffect(() => {
    const web = new WebSocket(socketURL);
    const accessToken = window.localStorage.getItem("token");
    if ((userData || account) && accessToken) {
      setNotifyLoder(true);
      try {
        setNotifyLoder(true);
        web.onopen = () => {
          const dataToSend = {
            option: "notification",
            token: accessToken,
          };
          web.send(JSON.stringify(dataToSend));
          web.onmessage = async (event) => {
            setNotifyLoder(false);

            if (event.data !== "[object Promise]" && event.data !== "null") {
              setNotifyLoder(false);

              let obj = JSON.parse(event.data);
              if (obj.data && obj.data.length > 0) {
                setNotifyLoder(false);

                setNotifyData(obj.data);
                setUnReadNotification(obj.unReadCount);
              } else {
                setNotifyLoder(false);

                setNotifyData([]);
                setUnReadNotification(0);
              }
            }
          };
        };
        return () => {
          setNotifyLoder(false);

          setNotifyData([]);
          setUnReadNotification(0);
          web.close();
        };
      } catch (err) {
        setNotifyLoder(false);

        console.log("err---------------------", err);
      }
    }
  }, [userData, account]);
  const connecting = async (id) => {
    await axios({
      method: "POST",
      url: Apiconfigs.connectWallet,
      data: {
        walletAddress: id,
      },
    })
      .then(async (res) => {
        if (res.data.statusCode === 200) {
          data.updatetoken(res.data.result.token);
          if (!res.data?.result?.isNewUser) {
            toast.info(
              `Welcome Back ${sortAddress(res.data?.result?.walletAddress)}`
            );
          }
        } else {
          console.log("error");
          deactivate();
        }
      })
      .catch((error) => {
        deactivate();
        console.log(error.message);
      });
  };

  useEffect(() => {
    const userAddress = window.localStorage.getItem("userAddress");
    if (userAddress) {
      data.connectWallet();
    }
    if (account) {
      getUserbalce();
    }
  }, [account]);

  useEffect(() => {
    if (account && onlyConnectWallet) {
      connecting(account);
    }
    data.updateUser(account);
  }, [account, onlyConnectWallet]); //eslint-disable-line

  return (
    <UserContext.Provider value={data}>{props.children}</UserContext.Provider>
  );
}
