import React, { useState, useRef, useContext, useEffect } from "react";
import {
  Box,
  Container,
  Button,
  TextField,
  List,
  ListItem,
  Typography,
  makeStyles,
  InputAdornment,
  DialogTitle,
  Input,
  Grid,
  IconButton,
} from "@material-ui/core";
import { useWeb3React } from "@web3-react/core";
import { UserContext } from "src/context/User";
import { FiCopy } from "react-icons/fi";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Link } from "react-router-dom";
import Earnings from "src/component/Earnings";
import { AiFillSetting } from "react-icons/ai";
import { FaTelegramPlane, FaUserFriends } from "react-icons/fa";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { FaFacebookF } from "react-icons/fa";
import { FaRedditAlien } from "react-icons/fa";
import { AiOutlineTwitter } from "react-icons/ai";
import { RiMessengerFill } from "react-icons/ri";
import { CopyToClipboard } from "react-copy-to-clipboard";
import axios from "axios";
import Apiconfigs from "src/Apiconfig/Apiconfigs";
import MuiAlert from "@material-ui/lab/Alert";
import ButtonCircularProgress from "src/component/ButtonCircularProgress";
import DataLoading from "src/component/DataLoading";
import { sortAddress } from "src/utils";
import { networkList, websiteName } from "src/constants";
import {
  FacebookShareButton,
  TelegramShareButton,
  EmailShareButton,
  TwitterShareButton,
} from "react-share";
import NoDataFound from "src/component/NoDataFound";
import { toast } from "react-toastify";
import { FaTwitter } from "react-icons/fa";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}
const walletdetails = [
  {
    tokenimg: "images/tokens/1.png",
    number: "100",
    tokenname: "MASS",
  },
  {
    tokenimg: "images/tokens/2.png",
    number: "0",
    tokenname: "BNB",
  },
  {
    tokenimg: "images/tokens/3.png",
    number: "0",
    tokenname: "USDT",
  },
  {
    tokenimg: "images/tokens/6.png",
    number: "0",
    tokenname: "BUSD",
  },
];
const useStyles = makeStyles((theme) => ({
  profilebg: {
    boxShadow: " 0 1.5px 3px 0 rgba(0, 0, 0, 0.16)",
    backgroundImage: " linear-gradient(to bottom, #c04848, #480048)",
    backgroundRepeat: "no-repeat",
    backgroundSize: "100%",
    backgroundPosition: "center center",
    height: " 143.5px",
    width: "100%",
    position: "relative",
  },
  bgimg: {
    width: "100%",
    height: "100%",
  },
  profileText: {
    "& h3": {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "25px",
      fontWeight: "500",
      color: "#000",
      [theme.breakpoints.down("xs")]: {
        justifyContent: "flex-start",
        fontSize: "18px",
      },
    },
    "& a": {
      fontSize: "16px",
      fontWeight: "700",
      color: "#707070",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      [theme.breakpoints.down("xs")]: {
        justifyContent: "flex-start",
      },
      "& svg": {
        paddingRight: "5px",
      },
    },
    "& p": {
      fontSize: "14px",
      fontWeight: "500",
      color: "#707070",
      textTransform: " uppercase",
    },
  },
  masBox: {
    backdropFilter: " blur(15px)",
    border: "solid 0.5px #c6cacf",
    backgroundColor: "#fff",
    padding: "10px",
    "& ul": {
      display: "flex",
      padding: "0",
      justifyContent: "center",
      "& li": {
        display: "flex",
        justifyContent: "center",
        // padding: "15px",
        position: "relative",
        "&::after": {
          content: " ''",
          position: "absolute",
          height: "70%",
          width: "1px",
          backgroundColor: "#e5e3dd",
          right: "0",
          top: "50%",
          transform: "translateY(-50%)",
        },
        "&:last-child::after": {
          display: "none",
        },
      },
    },
  },
  masBox1: {
    backdropFilter: " blur(15px)",
    border: "solid 0.5px #c6cacf",
    backgroundColor: "#fff",
    padding: "10px",
    marginLeft: "-10px",
    "& ul": {
      display: "flex",
      padding: "0",
      justifyContent: "center",
      "& li": {
        display: "flex",
        justifyContent: "center",
        // padding: "15px",
        position: "relative",
        "&::after": {
          content: " ''",
          position: "absolute",
          height: "70%",
          width: "1px",
          backgroundColor: "#e5e3dd",
          right: "0",
          top: "50%",
          transform: "translateY(-50%)",
        },
        "&:last-child::after": {
          display: "none",
        },
      },
    },
  },
  masBoxFlex: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "32px",
    "& button": {
      height: "30px",
      fontSize: "12px",
    },
    "@media(max-width:600px)": {
      marginTop: "0",
    },
  },
  // modal css

  dailogTitle: {
    textAlign: "Center",
    "& h2": {
      color: "#141518",
      fontSize: "23px",
    },
  },
  tokenList: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "7px",
    border: "solid 0.5px #e5e3dd;",
    "&:hover": {
      backgroundColor: "rgba(209, 91, 91, 0.39)",
    },
    "&.active": {
      backgroundColor: "rgba(209, 91, 91, 0.39)",
    },
    "& h3": {
      color: "#141518",
      fontSize: "14px",
    },
  },
  input_fild2: {
    width: "100%",
    "& input": {
      height: "45px",
    },
  },
  dilogBody: {
    paddingBottom: "30px",
    position: "relative",
    "& small": {
      position: "absolute",
      bottom: "13px",
      left: "50%",
      transform: "translateX(-50%)",
      fontSize: "13px",
      width: "100%",
      textAlign: "center",
    },
  },
  dilogBody2: {
    boxShadow: "0 1.5px 3px 0 rgb(0 0 0 / 16%)",
    backgroundImage: "linear-gradient(to bottom, #c04848, #480048)",
    borderRadius: "50px",
    overflow: "hidden",
  },
  dilogBody3: {
    backgroundColor: "#101010",
  },
  table: {
    "& th": {
      color: "#fff",
    },
    "& td": {
      color: "#fff",
    },
  },
  input_fild: {
    backgroundColor: "#ffffff6e",
    borderRadius: "5.5px",
    border: " solid 0.5px #e5e3dd",
    color: "#141518",
    // height: "48px",
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
      height: "34px",
    },
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "transparent",
      borderWidth: 0,
    },
  },
  userno: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    "& svg": {
      paddingRight: "5px",
    },
  },
  box_butn1: {
    position: "absolute",
    top: "163px",
    right: "0",
    "@media(max-width:1280px)": {
      display: "none",
    },
  },

  center: {
    textAlign: "center",
    marginTop: "-50px",
    [theme.breakpoints.down("xs")]: {
      textAlign: "left",
    },
  },
  boxsec: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    // "@media(max-width:424px)": {
    //   display: "block",
    // },
    "@media(min-width:1280px)": {
      marginTop: "31px",
    },
    // "@media(min-width:600px)": {
    //   marginTop: "20px",
    // },
    "@media(min-width: 600px) and (max-width: 1280px)": {
      marginTop: "20px",
    },
  },
  boxsec2: {
    marginBottom: "17px",
    "@media(min-width:1280px)": {
      marginBottom: "none",
    },
    "@media(max-width:600px)": {
      order: "1",
    },
  },
  box_butn: {
    display: "flex",

    marginBottom: "20px",
    "@media(min-width:1280px)": {
      display: "none",
    },
    "@media(max-width:600px)": {
      order: "0",
      width: " 100%",
      justifyContent: "center",
      marginLeft: "25px",
    },
  },
  textbox: {
    marginTop: "60px",
    "@media(max-width:600px)": {
      width: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    "& h3": {
      "@media(max-width:600px)": {
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      },
    },
    "& h5": {
      "@media(max-width:600px)": {
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      },
    },
    "& button": {
      "@media(max-width:600px)": {
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      },
    },
  },
  typobox1: {
    "@media(max-width:600px)": {
      width: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
  },
  boxmargin: {
    "@media(max-width:600px)": {
      marginTop: "-6",
      marginLeft: "10px",
    },
  },
}));

export default function Login() {
  const { account } = useWeb3React();
  const classes = useStyles();
  const user = useContext(UserContext);
  const auth = useContext(UserContext);
  const data = user?.userData;
  const [open, setOpen] = React.useState(false);
  const [open1, setOpen1] = React.useState(false);
  const [openBuy, setOpenBuy] = useState(false);
  const [open2, setOpen2] = React.useState(false);
  const [tokenImage, setTokenImage] = React.useState("/images/tokens/1.png");
  const [tokensname, settokensname] = React.useState("");
  const [selectedToken, setSelectedToken] = useState(networkList[0]);
  const [wallet, setwallet] = React.useState("");
  const [amount, setamount] = React.useState("");
  const [address, setaddress] = React.useState("");
  const [loader, setloader] = React.useState(false);
  React.useEffect(() => {
    if (user?.userData) {
      setwallet(user?.userData?.ethAccount?.address);
    }
  }, [user.userData]);
  // console.log(
  //   "databaseKey",
  //   parseFloat(user?.userData[selectedToken.databaseKey])
  // );

  const deposit = async () => {
    // console.log("user.userData////", user?.userData[selectedToken.databaseKey]);
    // console.log("userData____****", user.userData);
    if (amount === "") {
      toast.error("Please enter Amount");
    } else if (amount <= 0) {
      toast.error("Please enter valid amount");
    } else if (
      parseFloat(amount) >= parseFloat(user.userData[selectedToken.databaseKey])
    ) {
      toast.error(`${selectedToken.name} balance is low`);
      // } else if (user.userData[selectedToken.databaseKey] === undefined) {
      //   toast.error(`${selectedToken.name} balance is low`);
    } else if (wallet === "") {
      toast.error("Please enter Wallet Address");
      // } else if (Number(user.userData.ethBalance) < parseFloat(amount)) {
      //   toast.error("Low ETH Balance!");
    } else {
      setloader(true);
      axios({
        method: "POST",
        url: Apiconfigs.withdraw,
        headers: {
          token: window.localStorage.getItem("token"),
        },
        data: {
          senderAddress: address,
          amountToSend: amount,
          coin: selectedToken?.name,
        },
      })
        .then(async (res) => {
          user.updateUserData();
          if (res.data.statusCode === 200) {
            toast.success("Withdrawal successful!");
            setloader(false);
            setOpen1(false);
          } else {
            toast.error("Something went wrong!");
            setloader(false);
          }
        })
        .catch((err) => {
          toast.error("Something went wrong!");
          setloader(false);
        });
    }
  };

  const [apiPath, setApiPath] = useState("");

  useEffect(() => {
    if (selectedToken?.name === "BNB") {
      setApiPath(Apiconfigs.bnbTransfer);
    } else {
      setApiPath(Apiconfigs.transfer);
    }
  }, [selectedToken?.name]);
  const getDpositHandler = async () => {
    if (amount === "") {
      toast.error("Please enter Amount");
    } else if (amount <= 0) {
      toast.error("Please enter valid amount");
    }
    // else if (
    //   parseFloat(amount) <= parseFloat(user.userData[selectedToken.databaseKey])
    // ) {
    //   toast.error(`${selectedToken.name} balance is low`)
    //   // } else if (user.userData[selectedToken.databaseKey] === undefined) {
    //   //   toast.error(`${selectedToken.name} balance is low`);
    // }
    else if (wallet === "") {
      toast.error("Please enter Wallet Address");
    } else {
      setloader(true);
      axios({
        method: "POST",
        url: apiPath,
        headers: {
          token: window.localStorage.getItem("token"),
        },
        data: {
          senderAddress: wallet,
          amountToSend: amount,
          coin: selectedToken?.name,
        },
      })
        .then(async (res) => {
          console.log("res", res);

          user.updateUserData();
          if (res.data.responseCode === 500 || res.data.statusCode === 500) {
            toast.info("Insufficient balance");
            setloader(false);
            setOpen(false);
          } else if (res.data.statusCode === 200) {
            toast.success("You amount has been deposited successfully!");
            setloader(false);
            setOpen(false);
          } else {
            toast.error("Something went wrong!");
            setloader(false);
            setOpen(false);
          }
        })
        .catch((err) => {
          toast.error("Something went wrong. Please try again later.");
          setloader(false);
          setOpen(false);
        });
    }
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleClose1 = () => {
    setOpen1(false);
  };
  const handleClose2 = () => {
    setOpen2(false);
  };

  const [open10, setOpen10] = React.useState(false);

  const handleClickOpen10 = () => {
    setOpen10(true);
  };

  const handleClose10 = () => {
    setOpen10(false);
  };

  const profilePageURL = websiteName + "/user-profile?" + user?.userData?._id;

  return (
    <Box>
      <Box
        className={classes.profilebg}
        style={
          user.userData && user.userData.coverPic
            ? {
                backgroundImage: `url(${user.userData.coverPic})`,
              }
            : null
        }
      >
        <Box className={classes.box_butn1}>
          {/* {auth?.userData?.userType !== 'User' && ( */}
          <>
            <Button
              variant="contained"
              size="large"
              color="primery"
              onClick={() => setOpen(true)}
              className=""
            >
              Deposit
            </Button>

            <Button
              variant="contained"
              size="large"
              color="secondary"
              onClick={() => setOpen1(true)}
              className="ml-10"
            >
              Withdraw
            </Button>
          </>
          {/* )} */}
          <Button className="setting" component={Link} to="/profilesettings">
            <AiFillSetting />
          </Button>
        </Box>
      </Box>

      <Box className={classes.profileText}>
        <Container maxWidth="xl">
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4} md={4} lg={2} className={classes.center}>
              <figure
                className="chatuser chatuser2"
                style={{
                  width: " 130px",
                  height: " 130px",

                  top: "49px",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <img
                  src={
                    user.userData && user.userData.profilePic
                      ? user.userData.profilePic
                      : `https://avatars.dicebear.com/api/miniavs/${user?.userData?._id}.svg`
                  }
                  style={{
                    width: "81%",
                    height: "81%",
                  }}
                />
              </figure>
              <Box className={classes.textbox}>
                <Box>
                  <Typography
                    variant="h3"
                    style={{ textTransform: "capitalize" }}
                  >
                    {user.userData?.name
                      ? user.userData.name
                      : user.userData?.ethAccount?.address
                      ? sortAddress(user.userData?.ethAccount.address)
                      : sortAddress(user.userData?.walletAddress)}
                  </Typography>
                  <Typography variant="h5">
                    {sortAddress(user?.userData?.ethAccount?.address)} &nbsp;
                    {user?.userData?.ethAccount?.address && (
                      <CopyToClipboard
                        style={{ curser: "pointer" }}
                        text={user?.userData?.ethAccount?.address}
                      >
                        <FiCopy onClick={() => toast.info("Copied")} />
                      </CopyToClipboard>
                    )}
                  </Typography>

                  {auth?.userData?.userType !== "User" && (
                    <Typography variant="h5">
                      Total Subscriber &nbsp;&nbsp;
                      {user &&
                      user.userData &&
                      user.userData.profileSubscriberCount
                        ? user.userData.profileSubscriberCount
                        : "0"}
                    </Typography>
                  )}
                  <Box className={classes.typobox1}>
                    <Typography variant="h5" component={Link} to="/mas-profile">
                      is a {user?.userData?.planType}
                      {user?.userData?.planType === "Gold" && (
                        <img
                          src="images/gold-check.svg"
                          style={{ width: "30px", marginLeft: "5px" }}
                        />
                      )}
                      {user?.userData?.planType === "Diamond" && (
                        <img
                          src="images/blue-check.svg"
                          style={{ width: "30px", marginLeft: "5px" }}
                        />
                      )}
                      {user?.userData?.planType === "Silver" && (
                        <img
                          src="images/white_check.svg"
                          style={{ width: "30px", marginLeft: "5px" }}
                        />
                      )}
                      {user?.userData?.planType === "Mass Plus" && (
                        <img
                          src="images/icon.png"
                          style={{ width: "30px", marginLeft: "5px" }}
                        />
                      )}
                    </Typography>
                  </Box>

                  <Button className="share-btn" onClick={handleClickOpen10}>
                    Share
                  </Button>
                </Box>
              </Box>
            </Grid>

            {/* {auth?.userData?.userType !== "User" ? ( */}
            <>
              <Grid item xs={12} sm={8} md={8} lg={5}>
                <Box className={classes.boxmargin}>
                  <Box className={classes.boxsec}>
                    <Box className={classes.boxsec2}>
                      <Typography
                        variant="body2"
                        component="p"
                        className="mb-10"
                      >
                        Your balance on mas
                      </Typography>
                    </Box>
                    <Box className={classes.box_butn}>
                      {/* {auth?.userData?.userType !== 'User' ? ( */}
                      <>
                        <Button
                          variant="contained"
                          size="large"
                          color="primery"
                          onClick={() => setOpen(true)}
                          className=""
                        >
                          Deposit
                        </Button>
                        <Button
                          variant="contained"
                          size="large"
                          color="secondary"
                          onClick={() => setOpen1(true)}
                          className="ml-10"
                        >
                          Withdraw
                        </Button>
                      </>
                      {/* ) : (
                        ''
                      )} */}
                      <Button
                        className="setting"
                        component={Link}
                        to="/profilesettings"
                      >
                        <AiFillSetting />
                      </Button>
                    </Box>
                  </Box>
                  <Box className={classes.masBox1}>
                    <List>
                      {walletdetails.map((data, i) => {
                        return (
                          <ListItem>
                            <Earnings
                              balance={true}
                              data={data}
                              type="card"
                              index={i}
                            />
                          </ListItem>
                        );
                      })}
                    </List>
                  </Box>
                </Box>
              </Grid>
              {auth?.userData?.userType !== "User" ? (
                <Grid item xs={12} sm={12} md={12} lg={5}>
                  <Box className={classes.masBoxFlex}>
                    {" "}
                    <Typography variant="body2" component="p" className="mb-30">
                      OVERVIEW
                    </Typography>
                  </Box>
                  <Box className={classes.masBox}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={4} md={3}>
                        <Box
                          className={`${classes.masBox} total`}
                          align="center"
                        >
                          <Typography variant="h5" className={classes.userno}>
                            <FaUserFriends />
                            {user.userData && user.userData.supporters}
                          </Typography>
                          <Typography variant="span">
                            Total Supporters
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={8} md={9}>
                        <Typography
                          variant="body2"
                          component="p"
                          className="earning-font"
                        >
                          TOTAL Earnings
                        </Typography>
                        <Box className={classes.masBox}>
                          <List>
                            {walletdetails.map((data, i) => {
                              return (
                                <ListItem className="lessFont">
                                  <Earnings
                                    data={data}
                                    type="card"
                                    index={i}
                                    balance={false}
                                  />
                                </ListItem>
                              );
                            })}
                          </List>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
              ) : (
                ""
              )}
            </>
          </Grid>
        </Container>
      </Box>

      {/* Deposit modal */}

      <Dialog
        open={open}
        fullWidth="sm"
        maxWidth="sm"
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent className={classes.dilogBody}>
          <DialogContentText id="alert-dialog-description">
            <Typography
              variant="h5"
              align="center"
              style={{ color: "#792034", margiBottom: "10px" }}
            >
              Deposit
            </Typography>
            <Typography
              variant="body2"
              align="center"
              style={{ color: "#000" }}
            ></Typography>
            <Container maxWidth="md">
              {/* <Box mt={4}>
                <Input
                  disabled={auth?.userData?.userType === 'User'}
                  placeholder="300"
                  className={classes.input_fild2}
                  type="number"
                  onChange={(e) => setamount(e.target.value)}
                  endAdornment={
                    <InputAdornment
                      position="end"
                      onClick={() => setOpenBuy(true)}
                    >
                      {tokenImage === '' ? (
                        'Select Token'
                      ) : (
                        <Box style={{ cursor: 'pointer' }}>
                          <img src={selectedToken?.img} alt="" />
                          <ArrowDropDownIcon style={{ cursor: 'pointer' }} />
                        </Box>
                      )}
                    </InputAdornment>
                  }
                />
              </Box> */}
              <Box mt={4}>
                <Input
                  value={wallet ? wallet : account}
                  placeholder="Wallet Address"
                  className={classes.input_fild2}
                  startAdornment={
                    <InputAdornment position="end">
                      <CopyToClipboard text={wallet ? wallet : account}>
                        <Button onClick={() => toast.info("Copied")}>
                          COPY
                        </Button>
                      </CopyToClipboard>
                    </InputAdornment>
                  }
                />
              </Box>
              <Box mt={2} mb={4}>
                {/* <Button
                  variant="contained"
                  size="large"
                  color="secondary"
                  className="btnWidth btn-block btnHight"
                  onClick={getDpositHandler}
                  disabled={loader || auth?.userData?.userType === 'User'}
                >
                  {loader ? 'Pending...' : 'Deposit'}
                  {loader && <ButtonCircularProgress />}
                </Button> */}
                <Button
                  variant="contained"
                  size="large"
                  color="secondary"
                  className="btnWidth btn-block btnHight"
                  onClick={() => setOpen(false)}
                >
                  Close
                </Button>
              </Box>
              <Box>
                <small>
                  MAS fees
                  <Link
                    style={{
                      color: "#063d6d",
                      textDecoration: "underline",
                      fontWeight: "500",
                    }}
                    onClick={() => setOpen2(true)}
                  >
                    {" "}
                    apply.
                  </Link>{" "}
                </small>
              </Box>
            </Container>
          </DialogContentText>
        </DialogContent>
      </Dialog>

      {/* Withdraw modal */}
      <Dialog
        open={open1}
        fullWidth="sm"
        maxWidth="sm"
        onClose={handleClose1}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        disableBackdropClick={loader}
        disableEscapeKeyDown={loader}
      >
        <DialogContent className={classes.dilogBody}>
          <DialogContentText id="alert-dialog-description">
            <Typography
              variant="h5"
              align="center"
              style={{ color: "#792034", margiBottom: "10px" }}
            >
              Withdraw
            </Typography>
            <Typography
              variant="body2"
              align="center"
              style={{ color: "#000" }}
            >
              Choose amount to deposit:
            </Typography>
            <Container maxWidth="md">
              <Box mt={4}>
                <Input
                  placeholder="300"
                  className={classes.input_fild2}
                  type="number"
                  onChange={(e) => setamount(e.target.value)}
                  endAdornment={
                    <InputAdornment
                      position="end"
                      onClick={() => setOpenBuy(true)}
                    >
                      {tokenImage === "" ? (
                        "Select Token"
                      ) : (
                        <Box style={{ cursor: "pointer" }}>
                          <img src={selectedToken?.img} alt="" />
                          <ArrowDropDownIcon style={{ cursor: "pointer" }} />
                        </Box>
                      )}
                    </InputAdornment>
                  }
                />
              </Box>
              <Box mt={4}>
                <Input
                  placeholder="Wallet Address"
                  value={address}
                  className={classes.input_fild2}
                  onChange={(e) => setaddress(e.target.value)}
                  // startAdornment={
                  //   <InputAdornment position="end">
                  //     Wallet Address&nbsp;
                  //   </InputAdornment>
                  // }
                />
              </Box>
              <Box mt={2} mb={4}>
                <Button
                  variant="contained"
                  size="large"
                  color="secondary"
                  className="btnWidth btn-block btnHight"
                  onClick={deposit}
                  disabled={loader}
                >
                  {loader ? "Pending..." : "Withdraw"}
                  {loader && <ButtonCircularProgress />}
                </Button>
              </Box>
            </Container>
            <small>
              MAS fees{" "}
              <Link
                style={{
                  color: "#063d6d",
                  textDecoration: "underline",
                  fontWeight: "500",
                }}
                onClick={() => setOpen2(true)}
              >
                {" "}
                apply.
              </Link>{" "}
            </small>
          </DialogContentText>
        </DialogContent>
      </Dialog>

      {/* select Token */}

      {openBuy && (
        <Dialog
          fullWidth="sm"
          maxWidth="sm"
          open={openBuy}
          onClose={() => setOpenBuy(false)}
          aria-labelledby="max-width-dialog-title"
        >
          <DialogContent>
            <DialogTitle className={classes.dailogTitle}>
              Select a token
            </DialogTitle>
            {networkList.map((data, i) => {
              return (
                <Box
                  mt={3}
                  onClick={() => {
                    {
                      setSelectedToken(data);
                      setOpenBuy(false);
                    }
                  }}
                  className={classes.tokenList}
                >
                  <Typography variant="h3" className="red">
                    {data.name}
                  </Typography>
                  <img
                    src={data.img}
                    style={{ height: 20, width: 20 }}
                    alt="coin"
                  />
                </Box>
              );
            })}

            {/* <Box
              mt={2}
              onClick={() => {
                setTokenImage("/images/tokens/4.png");
                settokensname("ETH");
                setOpenBuy(false);
              }}
              className={classes.tokenList}
            >
              <Typography variant="h3" className="red">
                ETH
              </Typography>
              <img src="/images/tokens/4.png" alt="coin" />
            </Box> */}
          </DialogContent>
        </Dialog>
      )}

      {/* mas table */}
      {open2 && <PlaneListPopup open={open2} handleClose={handleClose2} />}
      {/* share */}

      <Dialog
        open={open10}
        onClose={handleClose10}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Typography
              variant="h5"
              align="center"
              style={{ color: "#000", margiBottom: "10px" }}
            >
              Hooray!
            </Typography>
            <Typography
              variant="body2"
              align="center"
              style={{ color: "#000" }}
            >
              {" "}
              You can share your link now anywhere!
            </Typography>

            <Box mt={3}>
              <TextField
                // placeholder="mas.com/affilate/a68dflfvd"
                defaultValue={profilePageURL}
                // value={copytext}
                disabled
                variant="outlined"
                className={classes.input_fild}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end" style={{ fontSize: "12px" }}>
                      <CopyToClipboard text={profilePageURL}>
                        <Button onClick={() => toast.info("Copied")}>
                          COPY
                        </Button>
                      </CopyToClipboard>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            <Box mt={2} mb={4}>
              <Box mt={2} align="center">
                <FacebookShareButton
                  url={profilePageURL}
                  quote={"MASS"}
                  hashtag="#MASS"
                >
                  <FaFacebookF style={{ color: "#000" }} />{" "}
                </FacebookShareButton>
                <EmailShareButton
                  url={profilePageURL}
                  subject="MASS"
                  body="MASS"
                >
                  <RiMessengerFill style={{ color: "#000" }} />{" "}
                </EmailShareButton>
                <TwitterShareButton
                  url={profilePageURL}
                  quote={"CampersTribe - World is yours to explore"}
                  hashtag="#camperstribe"
                >
                  {/* <FacebookIcon size={36} round={true} /> */}
                  <FaTwitter style={{ color: "#000" }} />
                </TwitterShareButton>
                <TelegramShareButton
                  url={profilePageURL}
                  title={"MASS"}
                  // hashtag="#camperstribe"
                >
                  <FaTelegramPlane style={{ color: "#000" }} />
                </TelegramShareButton>
              </Box>
              <Button
                variant="contained"
                size="large"
                color="secondary"
                className="btnWidth btn-block btnHight"
                onClick={handleClose10}
              >
                Close
              </Button>
            </Box>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </Box>
  );
}

export const PlaneListPopup = ({ open, handleClose }) => {
  const classes = useStyles();
  const [planDetails, setPlanDetails] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const listFeeHandler = async () => {
    try {
      const res = await axios.get(Apiconfigs.listFee, {
        headers: {
          token: window.localStorage.getItem("token"),
        },
      });
      if (res.data.statusCode === 200) {
        setPlanDetails(res.data.result);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    listFeeHandler();
  }, []);
  return (
    <Dialog
      open={open}
      fullWidth="md"
      maxWidth="md"
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogContent className={classes.dilogBody3}>
        <DialogContentText id="alert-dialog-description">
          <Box className={classes.dilogBody2}>
            {isLoading ? (
              <DataLoading />
            ) : (
              <>
                {planDetails ? (
                  <TableContainer>
                    <Table className={classes.table} aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <TableCell></TableCell>
                          <TableCell align="center">$MAS HELD</TableCell>
                          <TableCell align="center">PROFILE BADGE</TableCell>
                          <TableCell align="center">
                            CLIENT CREATOR FEES
                          </TableCell>
                          <TableCell align="center">
                            CONTENT CREATOR FEES
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {planDetails &&
                          planDetails.map((data, i) => {
                            return (
                              <TableRow key={i}>
                                <TableCell>
                                  {data.planType.toUpperCase()}
                                </TableCell>
                                <TableCell align="center">
                                  {data.massHeld}
                                </TableCell>
                                <TableCell align="center">
                                  {data.planType}
                                </TableCell>
                                <TableCell align="center">
                                  {data.clientFee}
                                </TableCell>
                                <TableCell align="center">
                                  {data.contentCreatorFee}
                                </TableCell>
                              </TableRow>
                            );
                          })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Box align="center" mt={4} mb={5}>
                    <NoDataFound />
                  </Box>
                )}{" "}
              </>
            )}
          </Box>
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
};
