import React, { useState, useEffect, useContext } from "react";
import {
  Typography,
  Box,
  makeStyles,
  Grid,
  List,
  ListItem,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { UserContext } from "src/context/User";
import { toast } from "react-toastify";

import moment from "moment";
import { calculateTimeLeft, sortAddress } from "src/utils";

const useStyles = makeStyles((theme) => ({
  cards: {
    border: "solid 0.5px #e5e3dd",
    backgroundColor: "#fff",
    // paddingTop: "20px",
    borderRadius: "10px",
    "& span": {
      fontSize: "12px",
      color: "#141518",
    },
    "& h2": {
      marginTop: "25px",
      fontSize: "25px",
      color: "#141518",
      fontWeight: "bold",
      lineHeight: "1.52",
      wordBreak: "break-word",
    },
  },
  NFTbg: {
    width: "100%",
    height: "150px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "40px",
    fontWeight: "500",
    color: "#fff",
    marginBottom: "20px",
    backgroundImage: "linear-gradient(to bottom, #4fc5c5, #286363)",
  },
  contantCard: {
    padding: "15px",
    borderTop: "solid 0.5px #e5e3dd",
    position: "relative",
    "& h5": {
      display: "flex",
      alignItems: "center",
      fontSize: "13px",
    },
  },
  feedpost: {
    width: "100%",
    // height: "200px",
    // border: "solid 0.5px #e5e3dd",
    // marginTop: "15px",
    textAlign: "center",
    "& img": {
      maxWidth: "100%",
      maxHeight: "100%",
      // objectFit: "cover",
      // borderRadius: "8px 8px 0 0",
    },
  },
  timeing: {
    display: "flex",
    position: "absolute",
    top: " -22px",
    right: "0",
    "& li": {
      backgroundColor: "#fff",
      border: "solid 0.5px #e5e3dd",
      fontSize: "10px",
      textAlign: "center",
      width: "auto",
      padding: "5px",
      marginLeft: "3px",
      color: "#141518",
    },
  },
  center_text: {
    display: "flex",
    textAlign: "end",
    [theme.breakpoints.down("md")]: {
      textAlign: "left",
    },
    "& h5": {
      justifyContent: "center",
      [theme.breakpoints.down("md")]: {
        justifyContent: "flex-start",
      },
    },
  },
  nftImg: {
    width: "100%",
    // height: "165px",
    overflow: "hidden",
    backgroundPosition: "center !important",
    backgroundSize: "cover !important",
    backgroundRepeat: " no-repeat !important",
    // borderRadius: "40px 40px 10px 10px",
    // borderRadius: "18px",
    backgroundColor: "#ccc !important",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
}));

export default function UsersCard({ data, index, disableTimer }) {
  const classes = useStyles();
  const history = useHistory();
  const auth = useContext(UserContext);

  const [closeTimeLeft, setCloseTimeLeft] = useState();
  useEffect(() => {
    const timer = setTimeout(() => {
      setCloseTimeLeft(
        calculateTimeLeft(
          new Date(
            data?.nftId?.time ? data?.nftId?.time : data?.time ? data?.time : ""
          )
        )
      );
    }, 1000);
    return () => clearTimeout(timer);
  });

  const isVideo =
    (data?.nftId?.mediaType && data?.nftId?.mediaType === "mp4") ||
    data?.mediaType === "mp4"
      ? true
      : false;
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
  useEffect(() => {
    updateDimensions();
  }, [data, index]);
  useEffect(() => {
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);
  return (
    <Box className={classes.cards} style={{ cursor: "pointer" }}>
      <Box
        className={classes.feedpost}
        onClick={() => {
          if (data._id && auth.userLoggedIn) {
            history.push({
              pathname: "/NFT-detail",
              search: data?._id,
            });
          } else {
            toast.error("Please Login");
          }
        }}
      >
        {/* {!auth.userLoggedIn && (
            <Button
              className={classes.LoginButton}
              onClick={() => {
                history.push("/login");
              }}
            >
              Login 
            </Button>
          )} */}
        {isVideo ? (
          <Box id={`imagecard${data?._id}`} className={classes.nftImg}>
            <video width="100%" controls>
              <source
                src={
                  data?.nftId?.mediaUrl
                    ? data?.nftId?.mediaUrl
                    : data?.mediaUrl
                    ? data?.mediaUrl
                    : ""
                }
                type="video/mp4"
              />
            </video>
          </Box>
        ) : (
          // <img
          //   src={
          //     data.nftId?.mediaUrl ? data.nftId.mediaUrl : "images/feed1.png"
          //   }
          // />
          <Box
            id={`imagecard${data?._id}`}
            className={classes.nftImg}
            style={{
              background: "url(" + data?.nftId?.mediaUrl + ")",
            }}
            // onClick={() => {
            //   history.push("/nft");
            // }}
          ></Box>
        )}
      </Box>
      {/* </Link> */}
      <Box className={classes.contantCard}>
        {data?.isExport ? (
          <List className={classes.timeing}>
            <ListItem>Exported</ListItem>
          </List>
        ) : (
          <>
            {!disableTimer && (
              <>
                {moment(data?.nftId?.time).unix() < moment().unix() ? (
                  <List className={classes.timeing}>
                    <ListItem>Expired</ListItem>
                  </List>
                ) : (
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
                )}
              </>
            )}
          </>
        )}

        <Typography
          variant="h5"
          component="h5"
          style={{
            color: "#141518",
            marginBottom: "10px",
            textOverflow: "ellipsis",
            overflow: "hidden",
            whiteSpace: "nowrap",
            maxWidth: "200px",
            textTransform: "capitalize",
          }}
          className="seats"
        >
          {data?.nftId?.title
            ? data?.nftId?.title
            : data?.title
            ? data?.title
            : ""}
        </Typography>
        <Grid
          container
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Grid
            style={{ display: "flex" }}
            item
            xs={8}
            md={8}
            onClick={() => {
              history.push({
                pathname: "/user-profile",
                search: data?.userId?._id,
              });
            }}
          >
            {data?.userId?.planType === "Gold" && (
              <img
                src="images/gold-check.svg"
                alt="Gold"
                style={{ width: "30px", marginLeft: "5px" }}
              />
            )}
            {data?.userId?.planType === "Diamond" && (
              <img
                src="images/blue-check.svg"
                alt="Diamond"
                style={{ width: "30px", marginLeft: "5px" }}
              />
            )}
            {data?.userId?.planType === "Silver" && (
              <img
                src="images/white_check.svg"
                alt="Silver"
                style={{ width: "30px", marginLeft: "5px" }}
              />
            )}
            {data?.userId?.planType === "Mass Plus" && (
              <img
                src="images/icon.png"
                alt="Mass Plus"
                style={{ width: "30px", marginLeft: "5px" }}
              />
            )}
            {/* <img
              src={
                data?.userId?.profilePic
                  ? data?.userId?.profilePic
                  : 'images/icon.png'
              }
              alt=""
              width="30px"
              style={{ height: '30px', borderRadius: '100%' }}
            /> */}
            {/* &nbsp; */}
            <Typography
              className="textOverflow seats"
              variant="h5"
              component="h5"
              style={{
                color: "#707070",
                textOverflow: "ellipsis",
                overflow: "hidden",
                whiteSpace: "nowrap",
                width: "auto",
                textTransform: "capitalize",
              }}
            >
              {data?.userId?.name
                ? data?.userId?.name
                : data?.userId?.ethAccount?.address
                ? sortAddress(data?.userId?.ethAccount.address)
                : sortAddress(data?.userId?.walletAddress)}{" "}
            </Typography>
          </Grid>
          {data?.nftId?.startingBid ||
            (data?.startingBid && (
              <Grid item xs={4} md={4} className={classes.center_text}>
                <Typography
                  variant="body2"
                  component="span"
                  style={{ color: "#000" }}
                >
                  Starting price
                </Typography>
                <Typography
                  variant="h5"
                  // component="h5"
                  style={{ color: "#d15b5b" }}
                >
                  {data?.nftId?.startingBid
                    ? data?.nftId?.startingBid
                    : data?.startingBid
                    ? data?.startingBid
                    : ""}{" "}
                  MAS
                </Typography>
              </Grid>
            ))}
        </Grid>
      </Box>
    </Box>
  );
}
