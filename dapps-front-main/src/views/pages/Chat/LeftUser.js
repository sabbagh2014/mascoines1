import React, { useEffect, useState } from "react";
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
} from "@material-ui/core";
import { Link } from "react-router-dom";
import Slide from "@material-ui/core/Slide";
import axios from "axios";
import Apiconfigs from "src/Apiconfig/Apiconfigs.js";
import Avatar from "@material-ui/core/Avatar";
import { sortAddress } from "src/utils";
const useStyles = makeStyles((theme) => ({
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
  input_fild2: {
    width: "100%",
    "& input": {
      height: "45px",
    },
  },
}));

export default function Login({
  showChatHistory,
  senderId,
  checkIsOnline,
  changeChat,
}) {
  const classes = useStyles();

  return (
    <Box className={classes.LoginBox}>
      <List className="userList">
        {showChatHistory.map((chat, i) => {
          return (
            <React.Fragment key={`chatGroup${i}`}>
              {chat.receiverId && chat.receiverId._id !== senderId ? (
                <ListItem
                  className={checkIsOnline(chat.receiverId._id) ? "active" : ""}
                  onClick={() => {
                    changeChat(chat);
                  }}
                >
                  <figure className="chatuser chatuser5">
                    <img
                      src={
                        chat.receiverId && chat.receiverId.profilePic
                          ? chat.receiverId.profilePic
                          : "/images/user-profile.png"
                      }
                    />
                  </figure>
                  <Typography variant="h6">
                    {chat.receiverId && chat.receiverId.name
                      ? chat.receiverId.name
                      : chat.receiverId.ethAccount
                      ? sortAddress(chat.receiverId.ethAccount.address)
                      : sortAddress(chat.receiverId.walletAddress)}
                  </Typography>
                  {parseFloat(chat.unReadCount) > 0 && (
                    <Box className="chat-number">{chat.unReadCount}</Box>
                  )}
                </ListItem>
              ) : (
                <ListItem
                  className={checkIsOnline(chat.senderId._id) ? "active" : ""}
                  onClick={() => {
                    changeChat(chat);
                  }}
                >
                  <figure className="chatuser chatuser5">
                    <img
                      src={
                        chat.senderId && chat.senderId.profilePic
                          ? chat.senderId.profilePic
                          : "/images/user-profile.png"
                      }
                    />
                  </figure>
                  <Typography variant="h6">
                    {chat.senderId && chat.senderId.name
                      ? chat.senderId.name
                      : chat.senderId.ethAccount
                      ? sortAddress(chat.senderId.ethAccount.address)
                      : sortAddress(chat.senderId.walletAddress)}
                  </Typography>
                  {parseFloat(chat.unReadCount) > 0 && (
                    <Box className="chat-number">{chat.unReadCount}</Box>
                  )}
                </ListItem>
              )}
            </React.Fragment>
          );
        })}
      </List>
    </Box>
  );
}
