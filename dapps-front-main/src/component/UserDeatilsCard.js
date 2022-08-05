import React, { useContext, useEffect, useState } from "react";
import { Typography, Box, makeStyles } from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
import { useHistory } from "react-router-dom";
import { sortAddress } from "src/utils";
import { FaHeart } from "react-icons/fa";
import { BsChat } from "react-icons/bs";
import axios from "axios";
import Apiconfigs from "src/Apiconfig/Apiconfigs";
import { UserContext } from "src/context/User";
import { toast } from "react-toastify";

const useStyles = makeStyles((theme) => ({
  cards: {
    border: "solid 0.5px #e5e3dd",
    backgroundImage:
      "linear-gradient(45deg, #eef2f3 90%,#8e9eab 30%, #eef2f3 90%)",
    padding: "10px",
    borderRadius: "10px",
    margin: "0 10px",
    position: "relative",
    backdropFilter: "blur(50px)",
  },
  contantCard: {
    textAlign: "left",
    position: "relative",
    "& h6": {
      marginBottom: "2px !important",
      fontSize: "15px !important",
      [theme.breakpoints.down("md")]: {
        fontSize: "10px !important",
      },
      "& span": {
        color: "#000",
        paddingLeft: "5px",
      },
      "@media(max-width:821px)": {
        fontSize: "11px !important",
      },
    },
    "& p": {
      fontSize: "12px",
    },
  },
  nftimg: {
    // height: "200px",
    width: "100%",
    margin: "10px 0",
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    display: "flex",

    "& img": {
      maxWidth: "100%",
      maxHeight: "100%",
      width: "-webkit-fill-available",
      borderRadius: "20px",
    },
  },
  nftImg: {
    width: "100%",
    // height: "165px",
    overflow: "hidden",
    backgroundPosition: "center !important",
    backgroundSize: "cover !important",
    backgroundRepeat: " no-repeat !important",

    backgroundColor: "#ccc !important",
  },
  socialbox: {
    "@media(max-width:821px)": {
      height: "12px",
      marginBottom: "3px",
    },
  },
}));

export default function UserDeatilsCard({ data, index, isdonor, callbackFn }) {
  const history = useHistory();
  const classes = useStyles();
  const userCardData = isdonor ? data.history : data;
  let isLike = false;
  const user = useContext(UserContext);
  const likeDislikeUserHandler = async (id) => {
    if (user.userData?._id) {
      if (user.userData?._id !== userCardData._id) {
        try {
          const res = await axios.get(Apiconfigs.likeDislikeUser + id, {
            headers: {
              token: window.localStorage.getItem("token"),
            },
          });
          if (res.data.statusCode === 200) {
            toast.success(res.data.responseMessage);
            if (callbackFn) {
              callbackFn();
            }
          } else {
            toast.error(res.data.responseMessage);
          }
        } catch (error) {}
      } else {
        toast.error("You can not like yourself");
      }
    } else {
      toast.error("Please Login");
    }
  };

  if (user.userData?._id && userCardData) {
    const likeUser = userCardData?.likesUsers?.filter(
      (data) => data === user.userData._id
    );
    isLike = likeUser?.length > 0;
  }

  const updateDimensions = () => {
    var offsetWidth = document.getElementById(
      "imagecardd" + data?._id
    ).offsetWidth;
    var newoofsetWidth = offsetWidth - 60;
    document.getElementById("imagecardd" + data?._id).style.height =
      newoofsetWidth + "px";
  };
  useEffect(() => {
    updateDimensions();
  }, [data, data?._id]);
  useEffect(() => {
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);
  return (
    <Box className={classes.cards}>
      {userCardData && (
        <Box className={classes.contantCard}>
          <Box display="flex" justifyContent="space-between">
            <Box
              onClick={() => {
                history.push({
                  pathname: "/user-profile",
                  search: userCardData.userName,
                });
              }}
            >
              <Typography
                variant="h6"
                component="h6"
                style={{
                  color: "#792034",
                  cursor: "pointer",
                  textOverflow: "ellipsis",

                  whiteSpace: "nowrap",
                  width: "auto",
                }}
              >
                {userCardData && userCardData.name
                  ? userCardData.name
                  : userCardData.userName}
              </Typography>
            </Box>
            <Box>
              <FaHeart
                style={isLike ? { color: "red" } : {}}
                onClick={() => likeDislikeUserHandler(userCardData._id)}
                className={classes.socialbox}
              />
              &nbsp;&nbsp;
              <BsChat
                onClick={() => {
                  if (user.userData?._id) {
                    if (user.userData?._id !== data?._id) {
                      history.push({
                        pathname: "/chat",
                        search: userCardData.ethAccount
                          ? userCardData.ethAccount.address
                          : userCardData.walletAddress,
                      });
                    } else {
                      toast.error("You can not chat yourself");
                    }
                  } else {
                    toast.error("Please login");
                  }
                }}
                className={classes.socialbox}
              />
            </Box>
          </Box>
          <Box className={classes.nftimg}>
            {userCardData.profilePic ? (
              <Box
                id={`imagecardd${data?._id}`}
                className={classes.nftImg}
                style={{
                  background: "url(" + userCardData.profilePic + ")",
                }}
              ></Box>
            ) : (
              <Box
                id={`imagecardd${data?._id}`}
                className={classes.nftImg}
                style={{
                  background: "url(" + "images/noimage.png" + ")",
                }}
              ></Box>
            )}

            {/* <img
              src={
                userCardData.profilePic
                  ? userCardData.profilePic
                  : "images/user-profile.png"
              }
              alt=""
            /> */}
          </Box>

          <Typography
            variant="h6"
            component="h6"
            style={{ color: "#000", fontWeight: "400" }}
          >
            <span style={{ color: "#707070" }}>Earning: </span>
            {userCardData.totalEarning} MAS{" "}
          </Typography>

          <Typography
            variant="h6"
            component="h6"
            style={{ color: "#000", fontWeight: "400" }}
          >
            <span style={{ color: "#707070" }}>Subscriber Count: </span>{" "}
            {userCardData.profileSubscriberCount}
          </Typography>

          {isdonor && (
            <Typography
              variant="h6"
              component="h6"
              style={{ color: "#000", fontWeight: "400" }}
            >
              <span style={{ color: "#707070" }}>Donation Amount: </span>{" "}
              {data.amount}
              {data && data.coinName ? data.coinName : "MASS"}
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
}
