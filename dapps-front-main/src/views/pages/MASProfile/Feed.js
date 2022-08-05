import React, { useContext, useEffect, useState } from "react";
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
import FeedCard from "src/component/FeedCard";
import axios from "axios";
import Apiconfigs from "src/Apiconfig/Apiconfigs";
import NoDataFound from "src/component/NoDataFound";

const useStyles = makeStyles((theme) => ({
  input_fild: {
    backgroundColor: "#ffffff6e",
    borderRadius: "5.5px",
    border: " solid 0.5px #e5e3dd",
    color: "#141518",
    height: "48px",
    width: "100%",
    maxWidth: "500px",
    margin: "0 auto",
    borderRadius: "20px",
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
  LoginBox: {
    paddingTop: "20px",
    "& h6": {
      fontWeight: "bold",
      marginBottom: "10px",
      fontSize: "20px",
      color: "#000",
      "& span": {
        fontWeight: "300",
      },
    },
  },
  TokenBox: {
    border: "solid 0.5px #e5e3dd",
    padding: "5px",
  },
  masBoxFlex: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
  },
}));

export default function Login() {
  const classes = useStyles();

  const [feeds, setfeeds] = useState([]);
  const feed = async () => {
    await axios({
      method: "GET",
      url: Apiconfigs.myfeed,
      headers: {
        token: window.localStorage.getItem("token"),
      },
    })
      .then(async (res) => {
        if (res.data.statusCode === 200) {
          console.log(res.data.result);
          setfeeds(res.data.result);
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  useEffect(() => {
    feed();
  }, []);
  return (
    <Box className={classes.LoginBox} mb={5}>
      <Box className={classes.masBoxFlex}>
        <Typography variant="h6">My feed</Typography>
      </Box>
      <Box>
        {/* <FeedCard/>
               <FeedCard/>
               <FeedCard/> */}
        {!feeds[0] ? (
          <Box align="center" mt={4} mb={5}>
            <NoDataFound />
          </Box>
        ) : (
          ""
        )}
        {feeds.map((data, i) => {
          return;
        })}
      </Box>
    </Box>
  );
}
