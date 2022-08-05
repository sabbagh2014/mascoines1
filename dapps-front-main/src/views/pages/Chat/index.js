import React, { useEffect, useState, useContext } from "react";
import {
  Box,
  Container,
  Button,
  TextField,
  Typography,
  makeStyles,
  Grid,
  Link,
} from "@material-ui/core";
import axios from "axios";
import Apiconfigs, { baseURL } from "src/Apiconfig/Apiconfigs.js";
import RightChat from "./RightChat";
import LeftUser from "./LeftUser";
import { UserContext } from "src/context/User";
import { useHistory, useLocation } from "react-router-dom";
import DataLoading from "src/component/DataLoading";
import NoDataFound from "src/component/NoDataFound";
import { toast } from "react-toastify";
const useStyles = makeStyles((theme) => ({
  LoginBox: {
    paddingBottom: "50px",
  },
  chatmain: {
    display: "flex",
  },
  leftUser: {
    width: "20%",
    height: " 80vh",
    overflowY: "scroll",
    [theme.breakpoints.down("md")]: {
      width: "25%",
    },
  },
  rightUser: {
    width: "80%",
  },
}));
var socket = window.io("https://node-donations.mobiloitte.com");

function isEmpty(obj) {
  if (obj) {
    return Object.keys(obj).length === 0;
  } else {
    return false;
  }
}

export default function Login() {
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();
  const user = useContext(UserContext);
  const [chatuser, setchatuser] = useState();
  const [userdata, setuserdata] = useState([]);
  const [recevier, setrecevier] = useState("");
  const [historychat, sethistorychat] = useState([]);
  const [checker, setChecker] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdateChate, setIsUpdateChate] = useState(false);
  const [chatid, setchatid] = useState("");
  const [chatUserList, setChatUserList] = useState([]);
  const [receiverId, setReceiverId] = useState("");
  const [showChatHistory, setShowChatHistory] = useState([]);
  const [senderId, setSenderId] = useState("");
  const [onlineUsersList, setOnlineUsersList] = useState([]);
  const [showChat1, setShowChat1] = useState({});
  const [newuserDetails, setNewuserDetails] = useState();
  const [isNewLoading, setIsNewLoading] = useState(true);

  useEffect(() => {
    if (user.userData && user.chatMessageData) {
      if (!isNewLoading) {
        chatHistorygetSocket();
        onlineUser(user.userData._id);
        setSenderId(user.userData._id);
      }
    }
  }, [user.userData, newuserDetails, user.chatMessageData]);

  const chatHistorygetSocket = () => {
    if (user.chatMessageData) {
      let messageList = user.chatMessageData;
      if (newuserDetails) {
        var checkNew = messageList.filter(
          (data) =>
            data.senderId._id === newuserDetails._id ||
            data.receiverId._id === newuserDetails._id
        );
        if (checkNew.length === 0) {
          let obj = {
            messages: [],
            receiverId: user.userData,
            senderId: newuserDetails,
            unReadCount: 0,
          };
          messageList.splice(0, 0, obj);
        }
      }
      setShowChatHistory(messageList);
      if (isEmpty(showChat1)) {
        if (!checkNew) {
          setShowChat1(messageList[0]);
        } else if (checkNew && checkNew.length === 0) {
          setShowChat1(messageList[0]);
        } else if (checkNew && checkNew[0]) {
          setShowChat1(checkNew[0]);
        }
      } else {
        if (checkNew && checkNew.length > 0) {
          setShowChat1(checkNew[0]);
        } else {
          const lastChatData = user.chatMessageData.filter(
            (data) => data._id === showChat1?._id
          );
          setShowChat1(lastChatData[0]);
        }
      }

      setIsLoading(false);
    }
  };

  const onlineUser = (id) => {
    if (id) {
      socket.on("connect", function () {
        socket.emit("onlineUser", { userId: id });
        socket.on("onlineUser", (event) => {
          setOnlineUsersList(event);
          // chatHistorygetSocket(id);
        });
      });
    } else {
      // getidd();
    }
  };

  const checkIsOnline = (id) => {
    const isOnline = onlineUsersList.filter((chatData) => {
      return chatData.userId && chatData.userId === id;
    });
    return isOnline.length > 0;
  };

  const getUserDetails = async (id) => {
    try {
      const res = await axios.get(Apiconfigs.latestUserList, {
        params: {
          search: id,
        },
      });
      if (res.data.statusCode === 200) {
        setNewuserDetails(res.data.result.docs[0]);
      }
      setIsNewLoading(false);
    } catch (error) {
      setIsNewLoading(false);
    }
  };

  const PerticularChat = () => {
    socket.emit("viewChat", { chatId: showChat1._id });
    socket.on("viewChat", (message) => {
      setShowChat1(message.result);
    });
  };

  const chatSend = (chattext, isImage) => {
    if ((chattext && receiverId) || receiverId.length > 5) {
      let chatdetails = {
        senderId: senderId,
        receiverId: receiverId,
        message: chattext,
        mediaType: isImage ? "image" : "",
      };
      setNewuserDetails();
      history.replace({
        pathname: "/chat",
        search: "",
      });
      socket.emit("oneToOneChat", chatdetails);

      if (newuserDetails) {
        // chatHistorygetSocket(senderId);
      } else {
        PerticularChat();
      }
    } else {
      toast.error("Sorry, No Receiver found");
    }
  };

  const readChatHandler = async (id, cancelTokenSource) => {
    try {
      const res = await axios.get(Apiconfigs.readChat + id, {
        cancelToken: cancelTokenSource && cancelTokenSource.token,
        headers: {
          token: window.localStorage.getItem("token"),
        },
      });
      // chatHistorygetSocket(user.userData._id);
    } catch (error) {
      console.log("ERROR", error.message);
    }
  };

  useEffect(() => {
    const cancelTokenSource = axios.CancelToken.source();
    if (!isEmpty(showChat1)) {
      if (
        showChat1 &&
        showChat1.receiverId._id &&
        showChat1.receiverId._id !== user.userData._id
      ) {
        setReceiverId(showChat1.receiverId._id);
      } else if (
        showChat1 &&
        showChat1.senderId._id &&
        showChat1.senderId._id !== user.userData._id
      ) {
        setReceiverId(showChat1.senderId._id);
      }

      if (showChat1 && showChat1._id && parseFloat(showChat1.unReadCount) > 0) {
      }
    }
    return () => {
      cancelTokenSource.cancel();
    };
  }, [showChat1]);

  useEffect(() => {
    if (location.search) {
      const ids = location.search.split("?");
      if (ids[1]) {
        getUserDetails(ids[1]);
      } else {
        setIsNewLoading(false);
      }
    } else {
      setIsNewLoading(false);
    }
  }, [location]);

  const changeChat = (chat) => {
    setShowChat1(chat);
    setNewuserDetails();
    history.replace({
      pathname: "/chat",
      search: "",
    });
  };

  useEffect(() => {
    if (showChat1?._id) {
      readChatHandler(showChat1._id);
    }
  }, [showChat1?._id]);

  return (
    <Box className={classes.LoginBox}>
      {isLoading ? (
        <DataLoading />
      ) : (
        <Box className="chatmain">
          <Box className="leftUser">
            <LeftUser
              showChatHistory={showChatHistory}
              senderId={senderId}
              checkIsOnline={(id) => checkIsOnline(id)}
              changeChat={(chat) => changeChat(chat)}
            />
          </Box>
          <Box className="rightUser">
            {showChat1 ? (
              <>
                {isUpdateChate ? (
                  <DataLoading />
                ) : (
                  <RightChat
                    showChatHistory={showChatHistory}
                    receiverid={recevier}
                    data={chatuser}
                    histchat={historychat}
                    senderid={user.userData._id}
                    chathistoryId={chatid}
                    showChat1={showChat1}
                    senderId={senderId}
                    userChatSend={(data, isImage) => chatSend(data, isImage)}
                    history={history}
                  />
                )}
              </>
            ) : (
              <NoDataFound />
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
}
