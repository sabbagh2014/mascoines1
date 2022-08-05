import React, { useState, useEffect } from "react";
import { Box, Button, Typography, makeStyles } from "@material-ui/core";
import moment from "moment";
import { FaRegGrin } from "react-icons/fa";
import { ImAttachment } from "react-icons/im";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { FiMoreHorizontal } from "react-icons/fi";
import Picker from "emoji-picker-react";
import axios from "axios";
import Apiconfigs, { socketURL } from "src/Apiconfig/Apiconfigs";
import MuiAlert from "@material-ui/lab/Alert";
import { toast } from "react-toastify";
import { sortAddress } from "src/utils";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";

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
  emojiBox: {
    position: "absolute",
    top: "-330px",
    left: "2px",
  },
}));
var socket = window.io(socketURL);
export default function Login({
  receiverid,
  senderid,
  data,
  histchat,
  chathistoryId,
  showChat1,
  senderId,
  receiverId,
  userChatSend,
  history,
}) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const [inputStr, setInputStr] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [chatdetaisl, setchatdetails] = useState([]);
  useEffect(() => {
    document.getElementById("in").addEventListener("keyup", function (event) {
      if (event.keyCode === 13) {
        event.preventDefault();
        document.getElementById("send").click();
      }
    });
    setchatdetails(histchat);
  }, [histchat]);
  const [imageurl, setimageurl] = useState("");
  const [image, setimage] = useState();
  const [open, setOpen] = React.useState(false);

  const onEmojiClick = (event, emojiObject) => {
    setInputStr((data) => data + emojiObject.emoji);
    setShowPicker(false);
  };

  const getBase64 = (file, cb) => {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      cb(reader.result);
    };
    reader.onerror = function (err) {
      console.log("Error: ", err);
    };
  };

  const scrolling = () => {
    var element = document.getElementById("chatu");
    element.scrollTop = element.scrollHeight;
  };

  useEffect(() => {
    scrolling();
  }, [showChat1?.receiverId?._id]);
  const report = async () => {
    if (showChat1) {
      console.log(chathistoryId);
      axios({
        method: "GET",
        url: Apiconfigs.report + showChat1._id,
        headers: {
          token: window.localStorage.getItem("token"),
        },
      })
        .then(async (res) => {
          if (res.data.statusCode === 200) {
            toast.success(res.data.responseMessage);
          } else {
            toast.error(res.data.responseMessage);
          }
        })
        .catch((err) => {
          console.log(err.message);

          if (err.response) {
            toast.error(err.response.data.responseMessage);
          } else {
            toast.error(err.message);
          }
        });
      handleClose();
    } else {
      toast.error("ID Not found");
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleImageClose = () => {
    setOpen(false);
  };
  return (
    <Box className={classes.LoginBox}>
      <Box className="footer-chat">
        <Box
          style={{ cursor: "pointer" }}
          display="flex"
          alignItems="center"
          onClick={() => {
            history.push({
              pathname: "/user-profile",
              search:
                showChat1.receiverId._id !== senderId
                  ? showChat1.receiverId._id
                  : showChat1.senderId._id,
            });
          }}
        >
          <figure className="chatuser ">
            {showChat1.receiverId._id !== senderId ? (
              <img
                src={
                  showChat1.receiverId.profilePic
                    ? showChat1.receiverId.profilePic
                    : "/images/user-profile.png"
                }
                alt=""
              />
            ) : (
              <img
                src={
                  showChat1.senderId.profilePic
                    ? showChat1.senderId.profilePic
                    : "/images/user-profile.png"
                }
                alt=""
              />
            )}
          </figure>
          {showChat1.receiverId._id !== senderId ? (
            <Typography variant="h6">
              {showChat1.receiverId && showChat1.receiverId.name
                ? showChat1.receiverId.name
                : showChat1.receiverId.ethAccount
                ? sortAddress(showChat1.receiverId.ethAccount.address)
                : sortAddress(showChat1.receiverId.walletAddress)}
            </Typography>
          ) : (
            <Typography variant="h6">
              {showChat1.senderId && showChat1.senderId.name
                ? showChat1.senderId.name
                : showChat1.senderId.ethAccount
                ? sortAddress(showChat1.senderId.ethAccount.address)
                : sortAddress(showChat1.senderId.walletAddress)}
            </Typography>
          )}
        </Box>
        <Button
          aria-controls="simple-menu"
          aria-haspopup="true"
          onClick={handleClick}
        >
          <FiMoreHorizontal />
        </Button>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={report}>Report Chat</MenuItem>
        </Menu>
      </Box>
      <Box className="chat-Box" id="chatu">
        {showChat1 &&
          showChat1.messages &&
          showChat1.messages.map((chat, i) => {
            // console.log(chat, "chat>>>>>>>");
            if (chat.receiverId === senderId) {
              return (
                <Box className="left-Box">
                  {chat.mediaType === "image" ? (
                    <Box>
                      <img src={chat.message} width="100%" />
                    </Box>
                  ) : (
                    <Box style={{ wordBreak: "break-word" }}>
                      {chat.message}
                      <span>
                        {moment(chat.createdAt).format("DD-MM-YYYY hh:mm")}
                      </span>
                    </Box>
                  )}
                </Box>
              );
            } else {
              return (
                <Box className="right-Box">
                  {chat.mediaType === "image" ? (
                    <Box>
                      <img src={chat.message} width="100%" />
                    </Box>
                  ) : (
                    <Box style={{ wordBreak: "break-word" }}>
                      {chat.message}
                      <span>
                        {moment(chat.createdAt).format("DD-MM-YYYY hh:mm")}
                      </span>
                    </Box>
                  )}
                </Box>
              );
            }
          })}
      </Box>

      <Box className="footer-chat">
        {showPicker && (
          <Box className={classes.emojiBox}>
            <Picker onEmojiClick={onEmojiClick} />
          </Box>
        )}
        <FaRegGrin onClick={() => setShowPicker((val) => !val)} />
        <Box className="uplodfile">
          <input
            type="file"
            id="inn"
            accept="image/*"
            onChange={(e) => {
              setimageurl(URL.createObjectURL(e.target.files[0]));
              getBase64(e.target.files[0], (result) => {
                setimage(result);
                setOpen(true);
              });
            }}
          />
          <ImAttachment />
        </Box>
        <Dialog
          onClose={handleImageClose}
          aria-labelledby="customized-dialog-title"
          open={open}
        >
          <DialogTitle id="customized-dialog-title" onClose={handleImageClose}>
            Send Image
          </DialogTitle>
          <DialogContent dividers>
            <Typography gutterBottom>
              {image ? (
                <Box className="right-Box">
                  <Box>
                    <img src={image} width="100%" />
                  </Box>
                </Box>
              ) : (
                ""
              )}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={handleImageClose} color="primary">
              Cancel
            </Button>
            <Button
              autoFocus
              onClick={() => {
                if (image) {
                  userChatSend(image, true);
                  setTimeout(() => {
                    setimage();
                  }, 100);
                  setOpen(false);
                }
                setInputStr("");
              }}
              color="primary"
            >
              Send{image ? " it" : ""}
            </Button>
          </DialogActions>
        </Dialog>
        <input
          accept="image/png, image/gif, image/jpeg"
          type="text"
          className="form-control"
          placeholder="Type a message"
          value={inputStr}
          id="in"
          onChange={(e) => setInputStr(e.target.value)}
          disabled={image ? true : false}
        />
        <Button
          className="send-btn"
          id="send"
          onClick={() => {
            if (image) {
              userChatSend(image, true);
              setTimeout(() => {
                setimage();
              }, 100);
            } else {
              userChatSend(inputStr, false);
            }
            setInputStr("");
          }}
        >
          Send
        </Button>
      </Box>
    </Box>
  );
}
