import React, { useState, useContext, useEffect } from "react";
import {
  Typography,
  Box,
  makeStyles,
  Grid,
  Button,
  TextField,
  InputAdornment,
  Input,
  Select,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import MenuItem from "@material-ui/core/MenuItem";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import { FiDownload } from "react-icons/fi";
import axios from "axios";
import Apiconfigs from "src/Apiconfig/Apiconfigs";
import { UserContext } from "src/context/User";
import { sortAddress } from "src/utils";
import { useWeb3React } from "@web3-react/core";
import { FaHeart } from "react-icons/fa";
import {
  BNB_NETWORK,
  ACTIVE_NETWORK,
  CEO_NAME,
  networkList,
  getCoinkDetails,
} from "src/constants";
import { useHistory } from "react-router-dom";
import ButtonCircularProgress from "./ButtonCircularProgress";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { toast } from "react-toastify";
import { saveAs } from "file-saver";
const useStyles = makeStyles((theme) => ({
  cards: {
    border: "solid 0.5px #c9c7c3",
    // backgroundColor: "#fff",
    padding: "10px",
    borderRadius: "10px",
    position: "relative",
    backgroundImage:
      "linear-gradient(45deg, #eef2f3 90%,#8e9eab 30%, #eef2f3 90%)",
    margin: "8px",
    width: "90%",
    "&:hover": {
      transform: "scale(1.03)",
      transition: "all 0.4s ease-in-out 0s",
    },
  },
  NFTbg: {
    width: "100%",
    height: "100px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "12px",
    fontWeight: "500",
    color: "#fff",
    marginBottom: "20px",
    backgroundImage: "linear-gradient(to bottom, #c04848, #480048)",
  },
  contantCard: {
    textAlign: "left",
    position: "relative",
    "& h6": {
      marginBottom: "2px !important",
      fontSize: "16px !important",
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

  contantCard2: {
    textAlign: "left",
    position: "relative",
    paddingTop: "10px",
    borderTop: "solid 0.5px #707070",
    "&::after": {
      position: "absolute",
      border: " solid 0.5px #707070",
      content: "''",
      left: "50%",
      top: "0",
      transform: "translatex(-50%)",
    },
  },
  btnBox: {
    display: "flex",
    alignItems: "center",
    "& button": {
      fontSize: "8px !important",
    },
  },
  sublink: {
    display: "flex",
    justifyContent: "space-between",
    color: "#000",
    alignItems: "center",
    paddingBottom: "10px",
    position: "relative",
    "&::after": {
      content: "''",
      height: " 1px",
      width: "70%",
      position: "absolute",
      backgroundColor: "#f2f1ee",
      bottom: "6px",
      maxWidth: "100%",
      left: "50%",
      transform: " translateX(-50%)",
    },
  },

  feedmenu: {
    fontSize: "20px",
    color: "#707070",
    position: "absolute",
    right: "0px",
    top: "0px",
    zIndex: "9",
  },
  donation: {
    "& span": {
      fontSize: "12px",
      padding: "2px 5px",
      border: "1px solid #ccc",
    },
  },
  input_fild2: {
    width: "100%",
    "& input": {
      height: "45px",
    },
  },
  changepic: {
    textAlign: "center",
    "& img": {
      width: "80%",
    },
    "& small": {
      position: "relative",
      fontSize: "12px !important",
      "& input": {
        position: "absolute",
        width: "300px",
        left: "50%",
        transform: "translateX(-50%)",
        opacity: "0",
      },
    },
  },

  // cs
  PhotoBox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    "& img": {
      width: "100%",
      // maxWidth: "280px",
      height: "368px",
      // marginLeft: "122px",
      paddingLeft: "149",
      display: "flex",
      alignItems: "center",
      borderRadius: "15px",
    },
    "@media(max-width:768px)": {
      "& img": {
        height: "auto",
      },
    },
  },
  bundleText: {
    "& .red": {
      color: "#792034",
    },
    "& h4": {
      color: "#141518",
      fontSize: "20px",
    },
  },
  deskiText: {
    "& h4": {
      marginBottom: "10px",
      color: "#707070",
      fontSize: "20px",
      "& span": {
        color: "#141518",
      },
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
  dilogBody: {
    paddingBottom: "30px",
    position: "relative",
    "& small": {
      position: "absolute",
      bottom: " 3px",
      left: "50%",
      transform: "translateX(-50%)",
      fontSize: "13px",
      width: "100%",
      textAlign: "center",
    },
  },
  certificateimg: {
    margiBottom: "30px",
    width: "100%",
    height: "auto",
  },

  heding: {
    backgroundImage: "linear-gradient(to bottom, #792034, #3d101a)",
    display: "flex",
    justifyContent: "center",
    padding: "20px",
    alignItems: "center",
    color: "#fff",
    [theme.breakpoints.down("xs")]: {
      padding: "10px",
    },
    "& img": {
      width: "60px",
      [theme.breakpoints.down("xs")]: {
        width: "20px",
      },
    },
    "& h6": {
      fontSize: "15px",
      fontWeight: "400",
      padding: "0 20px",
      [theme.breakpoints.down("xs")]: {
        padding: "0 5px",
        fontSize: "10px",
      },
    },
  },
  body: {
    position: "relative",
    zIndex: 2,
    padding: "50px 20px 150px 20px",
    [theme.breakpoints.down("xs")]: {
      padding: "50px 20px 60px 20px",
    },
    "& h5": {
      fontSize: "15px",
      fontWeight: "400",
      lineHeight: "1.53",
      color: "#141518",
    },
    "& h2": {
      fontSize: "23px",
      fontWeight: "600",
      lineHeight: "1.51",
      paddingLeft: "5px",
      color: "#141518",
      [theme.breakpoints.down("xs")]: {
        fontSize: "18px",
      },
    },
    "& img": {
      width: "30px",
      margin: "0 5px",
    },
  },
  footer: {
    "& h5": {
      fontSize: "15px",
      fontWeight: "500",
      lineHeight: "1.53",
      color: "#141518",
    },
    "& p": {
      fontSize: "10px",
      fontWeight: "500",
      lineHeight: "1.5",
      color: "#141518",
    },
    "& span": {
      fontSize: "9px",
      fontWeight: "500",
      lineHeight: "1.5",
      color: "rgba(112, 112, 112, 0.64)",
    },
    "& label": {
      fontSize: "10px",
      fontWeight: "400",
      lineHeight: "1.35",
      margin: "0",
      padding: "0",
      color: "#707070",
      whiteSpace: "initial !important",
      wordBreak: "break-all",
    },
  },
  certificateBox: {
    position: "relative",
  },
  centerImg: {
    position: "absolute",
    left: "50%",
    bottom: "30px",
    width: "45%",
    transform: "translateX(-50%)",
    zIndex: 1,
  },
  certificate: {
    [theme.breakpoints.down("xs")]: {
      padding: "10px",
    },
  },
  buttonGroup: {
    display: "flex",

    justifyContent: "center",
    width: "100%",
    marginTop: "14px",
    "& button": {
      border: "0.5px solid #ccc",
      marginRight: "10px",
      backgroundImage: "linear-gradient(45deg, #240b36 30%, #c31432 90%)",
      color: "#fff",
      width: "127px",
      fontSize: "12px",
    },
  },
  LoginButton: {
    marginTop: "10px",
    backgroundImage: "linear-gradient(45deg, #240b36 30%, #c31432 90%)",
    color: "#fff",
  },
  downloadButton: {
    maxWidth: "100px",
    backgroundColor: "#a33748",
    borderRadius: "33px",
    color: "white",
    "&:hover": {
      backgroundColor: "red",
    },
  },
  // nftimg: {
  //   // border: " solid 0.5px #e5e3dd",
  //   // height: "152px",
  //   width: "100%",
  //   margin: "10px 0",
  //   textAlign: "center",
  //   overflow: "hidden",
  //   "& img": {
  //     maxWidth: "100%",
  //     maxHeight: "100%",
  //     borderRadius: "18px",

  //     minWidth: "150px",
  //   },
  // },
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
    border: " solid 0.5px #e5e3dd",
  },
}));

function Bundelscard1({ data, index, callbackFn }) {
  const { account, chainId, library } = useWeb3React();
  const history = useHistory();
  const classes = useStyles();
  const auth = useContext(UserContext);
  const [openSubscribe, setOpenSubscribe] = useState(false);
  const [isDonate, setIsDonate] = useState(false);
  const [isLoading, setIsloading] = useState(false);
  const [selectedBundalDetails, setSelectedBundalDetails] = useState();
  const [open3, setOpen3] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);
  const [open1, setOpen1] = React.useState(false);

  const { subscribers } = data;
  let isLike = false;
  const handleClose = () => {
    setOpen(false);
  };

  const handleClose1 = () => {
    setOpen1(false);
  };

  const handleClickOpen2 = () => {
    setOpenSubscribe(false);
    setOpen2(true);
  };
  const handleClose2 = () => {
    setOpen2(false);
  };
  const subscribeNowHandler = async (isCheck) => {
    // const coinDetails = getCoinkDetails(data.coinName);
    // const isValid = isCheck
    //   ? parseFloat(data.donationAmount) <
    //       auth.userData[coinDetails.databaseKey] &&
    //     parseFloat(auth.userData.ethBalance) > 0.03
    //   : true;
    // if (isValid) {
    // if (parseFloat(auth?.userData?.massBalance) > 0) {
    setIsloading(true);
    await axios({
      method: "GET",
      url: Apiconfigs.subscribeNow + data._id,
      headers: {
        token: window.localStorage.getItem("token"),
      },
    })
      .then(async (res) => {
        setIsloading(false);
        if (res.data.statusCode === 200) {
          auth.updateUserData();

          toast.success("You have subscribed successfully");

          if (callbackFn) {
            callbackFn();
          }

          setOpen2(false);
        } else {
          toast.error(res.data.result);
        }
      })
      .catch((err) => {
        setIsloading(false);
        console.log(err.message);
        toast.error(err?.response?.data?.responseMessage);
      });
    // } else {
    //   toast.error('Your wallet balance is insufficient')
    // }

    // } else {
    //   toast.error("Balance is low");
    //   setIsloading(false);
    // }
  };

  const handleClose3 = () => {
    setOpen3(false);
  };

  const isVideo = data.mediaUrl.includes(".mp4");

  const userId =
    typeof data.userId === "object" &&
    !Array.isArray(data.userId) &&
    data.userId !== null
      ? data.userId._id
      : data.userId;
  const likeDislikeNfthandler = async (id) => {
    if (auth.userData?._id) {
      // if (auth.userData?._id !== userId) {
      try {
        const res = await axios.get(Apiconfigs.likeDislikeNft + id, {
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
      } catch (error) {
        console.log("ERROR", error);
      }
      // } else {
      //   toast.error("You can not like your bundle");
      // }
    } else {
      toast.error("Please login");
    }
  };

  if (auth.userData?._id) {
    const likeUser = data.likesUsers.filter(
      (data) => data === auth.userData._id
    );
    isLike = likeUser.length > 0;
  }

  let isUserSubscribed = false;
  if (auth.userData?._id) {
    const UserSubscribed = data.subscribers.filter(
      (data) => data === auth.userData._id
    );
    isUserSubscribed = UserSubscribed.length > 0;
  }
  const downLoadFile = () => {
    saveAs(data?.mediaUrl);
  };
  const updateDimensions = () => {
    if (data?._id) {
      let offsetWidth = document.getElementById(
        "imagecard" + data?._id
      ).offsetWidth;
      let newoofsetWidth = offsetWidth - 60;

      const videoCard = document.getElementById("imagecard" + data?._id + "1");
      if (videoCard) {
        document.getElementById("imagecard" + data?._id + "1").style.maxHeight =
          newoofsetWidth + 2 + "px";
        document.getElementById("imagecard" + data?._id).style.height =
          newoofsetWidth + 2 + "px";
      } else {
        document.getElementById("imagecard" + data?._id).style.height =
          newoofsetWidth + "px";
      }
    }
  };
  useEffect(() => {
    updateDimensions();
  }, [data, index]);
  useEffect(() => {
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const unSubscribeNowHandler = async (isCheck) => {
    const coinDetails = getCoinkDetails(data.coinName);
    setIsloading(true);
    await axios({
      method: "DELETE",
      url: Apiconfigs.unSubscription + data?._id,
      headers: {
        token: window.localStorage.getItem("token"),
      },
    })
      .then(async (res) => {
        setIsloading(false);
        if (res.data.statusCode === 200) {
          setIsloading(false);
          auth.updateUserData();
          toast.success("You have unsubscribed successfully.");

          if (callbackFn) {
            callbackFn();
          }

          setOpen2(false);
        } else {
          toast.error("Something went wrong");
        }
      })
      .catch((err) => {
        toast.error("Something went wrong");
      });
  };

  return (
    <Box className={classes.cards}>
      <Box className={classes.contantCard}>
        <Box display="flex" justifyContent="space-between">
          <Box>
            <Typography
              variant="h6"
              component="h6"
              className="textOverflow seats"
              style={{
                color: "#792034",
                width: "150px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                textTransform: "capitalize",
              }}
            >
              {data?.bundleName ? data?.bundleName : ""}
            </Typography>
          </Box>
          <Box>
            <FaHeart
              style={
                isLike
                  ? { color: "red", cursor: "pointer" }
                  : { cursor: "pointer" }
              }
              onClick={() => likeDislikeNfthandler(data?._id)}
            />
          </Box>
        </Box>
        <Box
          className={classes.nftimg}
          onClick={() =>
            history.push({
              pathname: "/bundles-details",
              search: data?._id,
            })
          }
          style={{ cursor: "pointer" }}
        >
          {isVideo ? (
            <Box
              id={`imagecard${data?._id}`}
              className={classes.nftimg}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <video
                width="100%"
                style={{
                  cursor: "pointer",
                  background: "#000",
                  // maxHeight: "217px",
                }}
                controls
                onClick={handleClickOpen2}
                id={`imagecard${data?._id}1`}
              >
                <source
                  src={data?.mediaUrl ? data?.mediaUrl : ""}
                  type="video/mp4"
                />
              </video>
            </Box>
          ) : (
            <Box
              id={`imagecard${data?._id}`}
              className={classes.nftImg}
              style={{
                background: "url(" + data.mediaUrl + ")",
              }}
            ></Box>
          )}
        </Box>
        <Typography
          variant="h6"
          component="h6"
          style={{ color: "#000", fontWeight: "400" }}
        >
          <span style={{ color: "#707070" }}>Donation amount: </span>
          {data?.donationAmount ? data?.donationAmount : "0"}{" "}
          {data && data.coinName ? data.coinName : "MASS"}
        </Typography>
        <Typography
          variant="h6"
          component="h6"
          style={{ color: "#000", fontWeight: "400" }}
        >
          <span style={{ color: "#707070" }}>Duration: </span>{" "}
          {data?.duration ? data?.duration : "0"}
        </Typography>
        <Typography
          variant="h6"
          component="h6"
          style={{ color: "#000", fontWeight: "400" }}
        >
          <span style={{ color: "#707070" }}>Number of subscribers:</span>{" "}
          {data.subscriberCount ? data.subscriberCount : "0"}
        </Typography>
        <Typography
          variant="h6"
          component="h6"
          style={{ color: "#000", fontWeight: "400" }}
          onClick={() => {
            history.push({
              pathname: "/user-profile",
              search: data.userId._id,
            });
          }}
          className="seats"
        >
          <span style={{ color: "#707070" }}>Creator: </span>
          {data && data.userDetail && data.userDetail.name
            ? data.userDetail.name
            : data.userId.name}
          &nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp;
        </Typography>
        <Box className={classes.buttonGroup}>
          <Box style={{ display: "flex" }}>
            {auth.userData &&
              auth.userLoggedIn &&
              auth.userData._id !== userId &&
              isUserSubscribed && (
                <Button
                  fullWidth
                  onClick={handleClickOpen2}
                  style={{ display: "flex" }}
                >
                  Renew
                </Button>
              )}

            {auth.userData &&
              auth.userLoggedIn &&
              auth.userData._id !== userId &&
              isUserSubscribed && (
                <Button fullWidth onClick={unSubscribeNowHandler}>
                  Unsubscribe Now
                </Button>
              )}
          </Box>

          <Box>
            {
              // auth.userData &&
              //   auth.userLoggedIn &&
              auth?.userData?._id !== userId && !isUserSubscribed && (
                <Button fullWidth onClick={handleClickOpen2}>
                  Subscribe now
                </Button>
              )
            }
          </Box>
          <Box>
            {auth.userData &&
              auth.userLoggedIn &&
              auth.userData._id === userId && (
                <Button
                  fullWidth
                  onClick={() =>
                    history.push({
                      pathname: "/bundles-details",
                      search: data?._id,
                    })
                  }
                  // onClick={handleClickOpen2}
                >
                  View
                </Button>
              )}
          </Box>
        </Box>
      </Box>

      {/* edit */}
      {isDonate && selectedBundalDetails && (
        <DonationPopUp
          open={isDonate}
          handleClose={() => {
            setIsDonate(false);
            setSelectedBundalDetails();
          }}
          userData={selectedBundalDetails.userId}
        />
      )}

      {/* edit */}
      {open && (
        <Dialog
          open={open}
          fullWidth="sm"
          maxWidth="sm"
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <Typography
                variant="h4"
                align="center"
                style={{ color: "#792034", margiBottom: "10px" }}
              >
                {data.bundleTitle}
              </Typography>

              <Box>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <label> Donation Amount</label>
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <TextField
                      id="standard-basic"
                      placeholder="30"
                      className={classes.input_fild2}
                    />
                  </Grid>
                </Grid>
              </Box>
              <Box
                style={{
                  paddingBotton: "10px",
                  borderBottom: "solid 0.5px #e5e3dd",
                }}
              >
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} md={4}>
                    <label> Duration</label>
                  </Grid>
                  <Grid item xs={12} md={8} className={classes.donation}>
                    <span>7 Days</span>
                    <span>14 Days</span>
                    <span>30 Days</span>
                    <span>60 Days</span>
                    <span>1 Year</span>
                    <span>Forever</span>
                  </Grid>
                </Grid>
              </Box>

              <Box align="center">
                <label> Services:</label>
                <Typography
                  variant="body2"
                  componant="p"
                  style={{ color: "#000", fontSize: "20px" }}
                >
                  I will send you a special video every <br />
                  month specially for you! (edit)
                </Typography>
              </Box>
              <Box mt={2} className={classes.changepic}>
                <small>
                  Change/upload a photo or video
                  <input type="file" />
                </small>
                <img src="images/Rectangle.png" />
              </Box>
              <Box mt={4}>
                <Grid container alignItems="center" spacing={2}>
                  <Grid item md={4}>
                    <Link style={{ color: "#000" }} onClick={handleClose}>
                      Delete this bundle
                    </Link>
                  </Grid>
                  <Grid item md={4}>
                    <Button
                      variant="contained"
                      size="large"
                      color="primery"
                      className="btn-block removeredius"
                      onClick={handleClose}
                    >
                      Cancel
                    </Button>
                  </Grid>
                  <Grid item md={4}>
                    <Button
                      variant="contained"
                      size="large"
                      color="secondary"
                      className="btn-block removeredius ml-10"
                      onClick={handleClose}
                    >
                      Save Changes
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </DialogContentText>
          </DialogContent>
        </Dialog>
      )}
      {/* view */}
      {open1 && (
        <Dialog
          open={open1}
          fullWidth="sm"
          maxWidth="sm"
          onClose={handleClose1}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <Typography
                variant="h4"
                align="center"
                style={{ color: "#792034", margiBottom: "10px" }}
              >
                Bundle I
              </Typography>
              <Typography
                variant="h6"
                align="center"
                style={{ color: "#000", borderBottom: "solid 0.5px #e5e3dd" }}
              >
                {" "}
                My basic supporter
              </Typography>

              <Box align="center" mt={3}>
                <Typography
                  variant="h6"
                  component="h6"
                  style={{ color: "#000", fontWeight: "400" }}
                >
                  <span style={{ color: "#707070" }}>Donation amount: </span>10
                  MAS{" "}
                </Typography>
                <Typography
                  variant="h6"
                  component="h6"
                  style={{ color: "#000", fontWeight: "400" }}
                >
                  <span style={{ color: "#707070" }}>Duration: </span>One month
                </Typography>
                <Typography
                  variant="h6"
                  component="h6"
                  style={{ color: "#000", fontWeight: "400" }}
                >
                  <span style={{ color: "#707070" }}>
                    Number of subscribers:{" "}
                  </span>
                  100
                </Typography>
              </Box>

              <Box align="center">
                <label> Services:</label>
                <Typography
                  variant="body2"
                  componant="p"
                  style={{ color: "#000", fontSize: "20px" }}
                >
                  I will send you a special video every <br />
                  month specially for you!
                </Typography>
              </Box>
              <Box mt={2} className={classes.changepic}>
                <img src="images/Rectangle.png" />
              </Box>
            </DialogContentText>
          </DialogContent>
        </Dialog>
      )}
      {/* Subscribe now */}
      {open2 && (
        <Dialog
          fullWidth="sm"
          maxWidth="sm"
          open={open2}
          onClose={handleClose2}
          aria-labelledby="max-width-dialog-title"
          disableBackdropClick={isLoading}
          disableEscapeKeyDown={isLoading}
        >
          <DialogContent>
            <Box className={classes.PhotoBox}>
              {isVideo ? (
                <div>
                  <video width="100%" controls>
                    <source src={data.mediaUrl} type="video/mp4" />
                  </video>
                  {auth.userData &&
                    auth.userLoggedIn &&
                    auth.userData._id !== userId &&
                    isUserSubscribed && (
                      <Box>
                        <Grid
                          lg={12}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Button
                            className={classes.downloadButton}
                            fullWidth
                            onClick={downLoadFile}
                          >
                            Download
                          </Button>
                        </Grid>
                      </Box>
                    )}
                </div>
              ) : (
                <img
                  src={data.mediaUrl}
                  alt=""
                  // style={{ height: '368px', width: '553px' }}
                />
              )}
              {/* <img src={data.mediaUrl} alt="" /> */}
            </Box>
            <Box mt={3} className={classes.bundleText} textAlign="center">
              <Typography variant="h4" className="red seats">
                {data.bundleTitle}
              </Typography>
            </Box>

            <Box mt={2} className={classes.deskiText}>
              <Typography variant="h4" align="left" color="textSecondary">
                Donation amount:{" "}
                <span>
                  {data.donationAmount} {data.coinName}
                </span>
              </Typography>
              <Typography variant="h4" align="left" color="textSecondary">
                Duration: <span> {data.duration}</span>
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={3} lg={2}>
                  <Typography variant="h4" align="left" color="textSecondary">
                    Details:{" "}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={9} lg={10}>
                  <Typography
                    variant="body2"
                    align="left"
                    color="textSecondary"
                    className="seats"
                  >
                    {data?.details}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
            {!auth.userLoggedIn && (
              <Box mt={3} mb={3} textAlign="center">
                {" "}
                <Button className={classes.LoginButton} onClick={handleClose2}>
                  Cancel
                </Button>
                &nbsp;&nbsp;{" "}
                <Button
                  className={classes.LoginButton}
                  onClick={() => {
                    history.push("/login");
                  }}
                >
                  Login
                </Button>
              </Box>
            )}
            {auth.userData &&
              auth.userLoggedIn &&
              auth.userData._id !== data.userId && (
                <Box mt={3} mb={3} textAlign="center">
                  <Button
                    variant="contained"
                    color="secondary"
                    size="large"
                    onClick={() => {
                      handleClose2();
                    }}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  &nbsp;&nbsp;&nbsp;
                  {auth.userData &&
                    auth.userLoggedIn &&
                    auth.userData._id !== userId && (
                      <Button
                        variant="contained"
                        color="secondary"
                        size="large"
                        onClick={subscribeNowHandler}
                        // onClick={() => {
                        //   if (auth?.userData.userType === "User") {
                        //     subscribeNowBlockchainHandler(data);
                        //   } else {
                        //     subscribeNowHandler(true);
                        //   }
                        // }}
                        disabled={isLoading}
                      >
                        {isLoading ? "pending..." : "Subscribe now"}{" "}
                        {isLoading && <ButtonCircularProgress />}
                      </Button>
                    )}
                </Box>

                // <Box>
                // {!auth.userLoggedIn && (
                //   <Button
                //     className={classes.LoginButton}
                //     onClick={() => {
                //       history.push("/login");
                //     }}
                //   >
                //     Login
                //   </Button>
                // )}
                // </Box>
              )}
          </DialogContent>
        </Dialog>
      )}

      {/* enter amount */}
      {open3 && (
        <Dialog
          open={open3}
          fullWidth="sm"
          maxWidth="sm"
          onClose={handleClose3}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent className={classes.dilogBody}>
            <DialogContentText id="alert-dialog-description">
              <Typography variant="h4" align="center" style={{ color: "#000" }}>
                Enter an amount
              </Typography>
              <Box mt={4}>
                <Input
                  placeholder="300"
                  className={classes.input_fild2}
                  endAdornment={
                    <InputAdornment position="end">
                      Select a token
                    </InputAdornment>
                  }
                />
              </Box>

              <Box mt={4}>
                <Typography
                  variant="h4"
                  align="center"
                  style={{ color: "#000" }}
                >
                  Send a message
                </Typography>
                <TextField
                  id="outlined-multiline-static"
                  multiline
                  rows={4}
                  className={classes.input_fild}
                  defaultValue="Default Value"
                  variant="outlined"
                />
              </Box>
              <Box mt={2} mb={4}>
                <Button
                  variant="contained"
                  size="large"
                  color="secondary"
                  className="btnWidth btn-block btnHight"
                  // onClick={handleClickOpen5}
                >
                  Donate now
                </Button>
              </Box>
              <small>ETH fees and ETH fees and apply. apply.</small>
            </DialogContentText>
          </DialogContent>
        </Dialog>
      )}
    </Box>
  );
}

export default React.memo(Bundelscard1);

export const DonationPopUp = ({ open, handleClose, userData }) => {
  const { account, chainId, library } = useWeb3React();
  const classes = useStyles();
  const auth = useContext(UserContext);
  const [isLoading, setIsloading] = useState(false);
  const [donationAmount, setDonationAmount] = useState("");
  const [selectedBlockChain, setSelectedBlockChain] = useState("select");
  const [donationMessage, setDonationMessage] = useState("");
  const [serialNumber, setSerialNumber] = useState("f");
  const [download, setDownload] = useState(false);
  const [openCertificate, setOpenCertificate] = useState(false);

  const [isopenDonate, setIsopenDonate] = useState(false);

  useEffect(() => {
    setIsopenDonate(open);
  }, [open]);

  useEffect(() => {
    if (selectedBlockChain !== "select" && chainId) {
      if (selectedBlockChain.chainId !== chainId) {
        swichNetworkHandler(selectedBlockChain.chainId);
      }
    }
  }, [selectedBlockChain, chainId]);

  const swichNetworkHandler = async (chainId) => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [
            {
              chainId: "0x" + parseFloat(chainId).toString(16),
            },
          ],
        });
      } catch (error) {
        console.log("ERROR", error);
        // toast.warn(error.message);
        if (error.code === 4902) {
        }
      }
    }
  };

  // const donationHandler = async (isCheck) => {
  //   if (selectedBlockChain !== "select") {
  //     const checkMassBalanceCondition = isCheck
  //       ? parseFloat(donationAmount) <
  //         parseFloat(auth.userData[selectedBlockChain.databaseKey])
  //       : true;

  //     const checkEthBalanceCondition = isCheck
  //       ? Number(auth.userData.ethBalance) > 0.03
  //       : true;
  //     if (checkMassBalanceCondition) {
  //       if (checkEthBalanceCondition) {
  //         try {
  //           setIsloading(true);

  //           const res = await axios.post(
  //             Apiconfigs.donation,
  //             {
  //               amount: donationAmount,
  //               userId: userData._id,
  //               coinName: selectedBlockChain.name,
  //               message: donationMessage,
  //             },
  //             {
  //               headers: {
  //                 token: window.localStorage.getItem("token"),
  //               },
  //             }
  //           );

  //           toast.success(res.data.responseMessage);
  //           setIsloading(false);
  //           console.log("Cerificate", res.data);
  //           if (res.data.statusCode === 200) {
  //             setSerialNumber(res.data.result);
  //             setOpenCertificate(true);
  //           }
  //           setTimeout(() => {}, 100);
  //           auth.updateUserData();
  //         } catch (error) {
  //           setIsloading(false);
  //           if (error.response) {
  //             toast.error(error.response.data.responseMessage);
  //           } else {
  //             toast.error(error.message);
  //           }
  //           console.log("Error", error);
  //         }
  //       } else {
  //         toast.error("Your ETH balance is too low");
  //         setIsloading(false);
  //       }
  //     } else {
  //       toast.error(`Your ${selectedBlockChain.name} balance is too low`);
  //       setIsloading(false);
  //     }
  //   }
  // };

  // const makeDonationBlockChain = async () => {
  //   if (donationAmount !== "" && selectedBlockChain !== "select") {
  //     try {
  //       console.log("selectedBlockChain", selectedBlockChain);

  //       console.log("library", library);
  //       const cnotractObj = await getContract(
  //         selectedBlockChain.tokenAddress,
  //         IERC20ABI,
  //         library,
  //         account
  //       );
  //       console.log("cnotractObj", cnotractObj);
  //       var balance = 0;
  //       if (
  //         selectedBlockChain.name === "BNB" ||
  //         selectedBlockChain.name === "ETH"
  //       ) {
  //         balance = await cnotractObj.provider.getBalance(account);
  //         console.log("--", ethers.utils.formatEther(balance));
  //       } else {
  //         balance = await cnotractObj.balanceOf(account);
  //         console.log("balance", balance);
  //       }
  //       if (
  //         parseFloat(donationAmount) <
  //         parseFloat(ethers.utils.formatEther(balance.toString()))
  //       ) {
  //         setIsloading(true);

  //         if (
  //           selectedBlockChain.name === "BNB" ||
  //           selectedBlockChain.name === "ETH"
  //         ) {
  //           const tx = await cnotractObj.signer.sendTransaction({
  //             to: userData.ethAccount.address,
  //             value: ethers.utils.parseEther(donationAmount),
  //           });
  //           console.log("tx", tx);
  //           await tx.wait();

  //           donationHandler(false);
  //         } else {
  //           const tranObj = await cnotractObj.transfer(
  //             userData.ethAccount.address,
  //             ethers.utils.parseEther(donationAmount)
  //           );
  //           await tranObj.wait();
  //           donationHandler(false);
  //         }
  //       } else {
  //         toast.error("Your balance is too low");
  //         setIsloading(false);
  //       }
  //     } catch (error) {
  //       setIsloading(false);

  //       if (error.response) {
  //         toast.error(error.response.data.responseMessage);
  //       } else {
  //         toast.error(error.message);
  //       }
  //       console.log("ERROR", error);
  //     }
  //   } else {
  //     toast.error("Please enter amount");
  //     setIsloading(false);
  //   }
  // };

  const donloadBadge = () => {
    setDownload(true);
    const certificate = document.getElementById(`certificate_UI`);

    html2canvas(certificate, { useCORS: true, allowTaint: true }).then(
      (canvas) => {
        canvas.toBlob(
          function (blob) {
            const imgData = URL.createObjectURL(blob);

            var pdf = new jsPDF({
              orientation: "landscape",
            });
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
            pdf.addImage(
              imgData,
              "JPEG",
              0,
              0,
              pdfWidth,
              pdfHeight,
              "",
              "FAST"
            );
            pdf.save(`${serialNumber}.pdf`);
            setDownload(false);
          },
          "image/jpeg",
          1.0
        );
      }
    );
  };

  const donationWithoutBlockchainHandler = async () => {
    if (
      parseFloat(donationAmount) <=
      parseFloat(auth?.userData[selectedBlockChain.databaseKey])
    ) {
      setIsloading(true);
      try {
        const res = await axios.post(
          Apiconfigs.donation,
          {
            amount: donationAmount,
            userId: userData._id,
            coinName: selectedBlockChain.name,
            message: donationMessage,
          },
          {
            headers: {
              token: window.localStorage.getItem("token"),
            },
          }
        );

        toast.success(res.data.responseMessage);
        setIsloading(false);
        if (res.data.statusCode === 200) {
          setSerialNumber(res.data.result);
          setOpenCertificate(true);
        }
        setTimeout(() => {}, 100);
        auth.updateUserData();
      } catch (error) {
        setIsloading(false);
        if (error.response) {
          toast.error(error.response.data.responseMessage);
        } else {
          toast.error(error.message);
        }
        console.log("Error", error);
      }
    } else {
      toast.error(`Your ${selectedBlockChain.name} balance is insufficient.`);
    }
  };
  return (
    <Box>
      <Dialog
        open={isopenDonate}
        fullWidth="sm"
        maxWidth="sm"
        onClose={() => setIsopenDonate(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        disableBackdropClick={isLoading}
        disableEscapeKeyDown={isLoading}
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Typography
              variant="h4"
              align="center"
              style={{ color: "#792034", margiBottom: "10px" }}
            >
              {userData.name}
            </Typography>

            <Box>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <label> Donation Amount</label>
                </Grid>
                <Grid item xs={12} md={8}>
                  <TextField
                    id="standard-basic"
                    placeholder="30"
                    className={classes.input_fild2}
                    type="number"
                    onChange={(e) => setDonationAmount(e.target.value)}
                  />
                </Grid>
              </Grid>
            </Box>
            <Box>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <label>Select Blockchain</label>
                </Grid>
                <Grid item xs={12} md={8}>
                  <Select
                    fullWidth
                    // value={selectedBlockChain}
                    defaultValue="select"
                    onChange={(e) => {
                      if (e.target.value === "BNB") {
                        auth.updateSupportedNetwork(BNB_NETWORK);
                      } else {
                        auth.updateSupportedNetwork(ACTIVE_NETWORK);
                      }
                      setSelectedBlockChain(e.target.value);
                    }}
                  >
                    <MenuItem value={"select"}>Select</MenuItem>
                    {networkList.map((data, i) => {
                      return <MenuItem value={data}>{data.name}</MenuItem>;
                    })}
                  </Select>
                </Grid>
              </Grid>
            </Box>
            <Box>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <label> Donation Message</label>
                </Grid>
                <Grid item xs={12} md={8}>
                  <TextField
                    multiline
                    maxRows={3}
                    className={classes.input_fild2}
                    type="text"
                    onChange={(e) => setDonationMessage(e.target.value)}
                  />
                </Grid>
              </Grid>
            </Box>
            {auth?.userData.userType === "User" && (
              <Box>
                {selectedBlockChain !== "select" &&
                  selectedBlockChain.chainId != chainId && (
                    <Typography style={{ color: "red" }}>
                      Please switch to {selectedBlockChain.networkName}
                    </Typography>
                  )}
              </Box>
            )}
            <Box mt={4}>
              <Grid container alignItems="center" spacing={2}>
                <Grid item md={6}>
                  <Button
                    variant="contained"
                    size="large"
                    color="primery"
                    className="btn-block removeredius"
                    onClick={() => handleClose()}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                </Grid>
                <Grid item md={6}>
                  <Button
                    variant="contained"
                    size="large"
                    color="secondary"
                    className="btn-block removeredius ml-10"
                    disabled={
                      isLoading ||
                      selectedBlockChain === "select" ||
                      (auth?.userData.userType === "User" &&
                        selectedBlockChain.chainId != chainId)
                    }
                    onClick={donationWithoutBlockchainHandler}
                  >
                    Donate {isLoading && <ButtonCircularProgress />}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </DialogContentText>
        </DialogContent>
      </Dialog>
      {openCertificate && serialNumber && (
        <Dialog
          open={openCertificate}
          fullWidth="md"
          maxWidth="md"
          onClose={() => {
            setOpenCertificate(false);
            handleClose();
          }}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <Box id="certificate_UI">
            <DialogContent className={classes.certificate}>
              {/* <img src='images/img.png' className={classes.certificateimg} /> */}
              <Box className={classes.certificateBox}>
                <img src="images/Component.png" className={classes.centerImg} />
                <Box className={classes.heding}>
                  <img src="images/icon.png" />
                  <Typography variant="h6">
                    {" "}
                    C E R T I F I C A T E O F D O N A T I O N
                  </Typography>
                  <img src="images/icon.png" />
                </Box>
                <Box className={classes.body} align="center" mt={3}>
                  <Typography variant="h5">This is to certify that</Typography>
                  <Typography variant="h2">
                    {auth?.userData?.name
                      ? auth?.userData?.name
                      : sortAddress(
                          auth?.userData?.walletAddress
                            ? auth?.userData?.walletAddress
                            : auth?.userData?.ethAccount?.address
                        )}
                  </Typography>
                  <Typography variant="h5">
                    {` (${
                      auth?.userData?.walletAddress
                        ? auth?.userData?.walletAddress
                        : auth?.userData?.ethAccount?.address
                    })`}
                  </Typography>
                  <Typography
                    variant="h5"
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    Has donated{" "}
                    <Typography variant="h2">
                      {donationAmount + ` `}&nbsp;
                    </Typography>{" "}
                    {" " + selectedBlockChain.name}{" "}
                    {/* <img src='images/centerimg.png' />  */} to{" "}
                  </Typography>
                  <Typography variant="h2">
                    {userData?.name
                      ? userData.name
                      : userData?.ethAccount?.address
                      ? sortAddress(userData?.ethAccount.address)
                      : sortAddress(userData?.walletAddress)}
                  </Typography>
                  <Typography variant="h5">
                    {`(${
                      userData?.ethAccount?.address
                        ? userData?.ethAccount?.address
                        : userData?.walletAddress
                    })`}
                  </Typography>
                  <Typography variant="h5">
                    {donationMessage ? donationMessage : ""}
                  </Typography>
                </Box>
                <Box className={classes.footer}>
                  <Grid
                    container
                    spacing={2}
                    style={{ alignItems: "flex-end" }}
                  >
                    <Grid item xs={3} align="left">
                      <Typography variant="h5" style={{ color: "#d15b5b" }}>
                        {CEO_NAME}
                      </Typography>
                      <Typography variant="body2">MAS founder & CEO</Typography>
                    </Grid>
                    <Grid item xs={6} align="center">
                      {" "}
                      <span>
                        {" "}
                        This certificate is published one time and can't be
                        accessed again
                      </span>
                    </Grid>
                    <Grid item xs={3} align="right">
                      <Typography variant="h5">Donation Id:</Typography>
                      <Typography variant="body2" component="label">
                        {serialNumber}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            </DialogContent>
          </Box>
          <Box
            mt={2}
            pb={4}
            style={{ width: "100%", maxWidth: "200px", margin: "0 auto" }}
          >
            <Button
              variant="contained"
              size="large"
              color="secondary"
              className="btnWidth btn-block btnHight"
              onClick={donloadBadge}
              disabled={download}
            >
              download <FiDownload /> {download && <ButtonCircularProgress />}
            </Button>
          </Box>
        </Dialog>
      )}
    </Box>
  );
};
