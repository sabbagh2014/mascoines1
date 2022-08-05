import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  makeStyles,
  Grid,
  List,
  ListItem,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";
import moment from "moment";
import { calculateTimeLeft } from "src/utils";

const useStyles = makeStyles((theme) => ({
  cards: {
    border: "solid 0.5px #e5e3dd",
    backgroundColor: "#fff",
    paddingTop: "20px",
    borderRadius: "10px",
    "& span": {
      fontSize: "14px",
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
      
    },
  },
  feedpost: {
    width: "100%",
    height: "200px",
    border: "solid 0.5px #e5e3dd",
    marginTop: "15px",
    "& img": {
      width: "100%",
      height: "100%",
      objectFit: "cover",
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
    textAlign: "center",
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
}));

export default function BidNFTCard({ data, index }) {
  const classes = useStyles();
  const history = useHistory();
  const [closeTimeLeft, setCloseTimeLeft] = useState();

  useEffect(() => {
    const timer = setTimeout(() => {
      setCloseTimeLeft(calculateTimeLeft(new Date(data?.orderId?.nftId?.time)));
    }, 1000);
    return () => clearTimeout(timer);
  });

  const isVideo =
    data.orderId?.nftId?.mediaType && data.orderId?.nftId?.mediaType === "mp4"
      ? true
      : false;
  console.log("isVideo", isVideo);

  return (
    <Box className={classes.cards} style={{ cursor: "pointer" }}>
      {/* <Typography variant="body2" component="span">{data.title}</Typography>
            <Typography variant="h2" component="h2">{data.data}</Typography> */}
      {/* <Link 
            to="/NFT-detail"
            
            >  */}
      <Box
        className={classes.feedpost}
        onClick={() => {
          history.push({
            pathname: "/NFT-detail",
            search: data.orderId._id,
          });
        }}
      >
        {isVideo ? (
          <video width="100%" controls>
            <source src={data.orderId?.nftId?.mediaUrl} type="video/mp4" />
          </video>
        ) : (
          <img
            src={data ? data.orderId?.nftId?.mediaUrl : "images/feed1.png"}
            alt=""
          />
        )}
      </Box>
      {/* </Link> */}
      <Box className={classes.contantCard}>
        {moment(data.orderId?.nftId?.time).unix() < moment().unix() ? (
          <List className={classes.timeing}>
            <ListItem>Expired</ListItem>
          </List>
        ) : (
          <List className={classes.timeing}>
            <ListItem>{closeTimeLeft?.days} days</ListItem>
            <ListItem>{closeTimeLeft?.hours}</ListItem>
            <ListItem>{closeTimeLeft?.minutes}</ListItem>
            <ListItem>{closeTimeLeft?.seconds}</ListItem>
          </List>
        )}
        <Typography
          variant="h5"
          component="h5"
          style={{ color: "#141518", marginBottom: "10px" }}
        >
          {data.orderId?.nftId?.title}
        </Typography>
        <Grid container alignItems="center">
          <Grid item xs={12} md={6} className={classes.center_text}>
            <Typography
              variant="body2"
              component="span"
              style={{ color: "#000" }}
            >
              Starting Price
            </Typography>
            <Typography
              variant="h5"
              component="h5"
              style={{ color: "#d15b5b" }}
            >
              {data.orderId?.nftId?.startingBid} MAS
            </Typography>
          </Grid>
          {data?.bid && (
            <Grid item xs={12} md={6} className={classes.center_text}>
              <Typography
                variant="body2"
                component="span"
                style={{ color: "#000" }}
              >
                Your Bid Price
              </Typography>
              <Typography
                variant="h5"
                component="h5"
                style={{ color: "#d15b5b" }}
              >
                {data?.bid} MAS
              </Typography>
            </Grid>
          )}
        </Grid>
      </Box>
    </Box>
  );
}
