import React, { useState, useContext, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  makeStyles,
  Grid,
  Button,
} from "@material-ui/core";
import { useHistory } from "react-router";
import MuiAlert from "@material-ui/lab/Alert";
import axios from "axios";
import Apiconfigs from "src/Apiconfig/Apiconfigs";
import { UserContext } from "src/context/User";
import ButtonCircularProgress from "src/component/ButtonCircularProgress";
import { sortAddress } from "src/utils";
import { DonationPopUp } from "src/component/Bundelscard1";
import { toast } from "react-toastify";
import CopyToClipboard from "react-copy-to-clipboard";
import { FiCopy } from "react-icons/fi";

const useStyles = makeStyles((theme) => ({
  profilebg: {
    boxShadow: " 0 1.5px 3px 0 rgba(0, 0, 0, 0.16)",
    backgroundImage: " linear-gradient(to bottom, #c04848, #480048)",
    height: " 143.5px",
    width: "100%",
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
    },
    "& h5": {
      fontSize: "16px",
      fontWeight: "700",
      color: "#707070",
    },
    "& p": {
      fontSize: "14px",
      fontWeight: "300",
      color: "#707070",
    },
  },
  masBox: {
    backdropFilter: " blur(15px)",
    border: "solid 0.5px #e5e3dd",
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
  masBoxFlex: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    "& button": {
      height: "30px",
      fontSize: "12px",
    },
  },
  avatar: {
    width: " 130px !important",
    height: " 130px  !important",
    cursor: "pointer",
    "@media(max-width:1025px)": {
      width: " 100% !important",
      height: " 100%  !important",
    },
  },
  textname: {
    "@media(max-width:1025px)": {
      paddingTop: "15px !important",
    },
  },
}));
function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function Login({ data, isabout }) {
  const classes = useStyles();
  const history = useHistory();
  const auth = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribe, setIsSubscribe] = useState(false);
  const [openDonation, setOpenDonation] = useState(false);

  useEffect(() => {
    if (data?.isSubscribe) {
      setIsSubscribe(true);
    } else {
      setIsSubscribe(false);
    }
  }, [data]);

  const subscribeUser = async () => {
    if (auth.userLoggedIn && auth.userData?._id && data?._id) {
      try {
        setIsLoading(true);
        const res = await axios.get(Apiconfigs.subscribeProfile + data?._id, {
          headers: {
            token: window.localStorage.getItem("token"),
          },
        });
        if (res.data.statusCode === 200) {
          setIsSubscribe(!isSubscribe);
          toast.success(res.data.responseMessage);
        } else {
          toast.error(res.data.responseMessage);
        }
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.log("ERROR", error.message);

        if (error.response) {
          toast.error(error.response.data.responseMessage);
        } else {
          toast.error(error.message);
        }
      }
    } else {
      toast.error("Please login");

      setTimeout(() => {
        history.push("/login");
      }, 1000);
    }
  };
  let userType = localStorage.getItem("userType");
  return (
    <Box>
      {!isabout && (
        <Typography variant="h3" align="center">
          About the creator:
        </Typography>
      )}
      <Box className={classes.profilebg} mt={3}>
        {data?.coverPic && (
          <img
            src={data?.coverPic ? data?.coverPic : "images/bg.png"}
            className={classes.bgimg}
          />
        )}
      </Box>
      <Container
        maxWidth="lg"
        style={{ display: "flex", justifyContent: "center" }}
      >
        <Box className={classes.profileText}>
          <Grid container spacing={3}>
            <Grid item xl={12} md={12} align="center">
              <figure className="chatuser chatuser2 chatuser10">
                <img
                  onClick={() =>
                    history.push({
                      pathname: "/user-profile",
                      search: data?._id,
                    })
                  }
                  src={
                    data
                      ? data.profilePic
                        ? data.profilePic
                        : `https://avatars.dicebear.com/api/miniavs/${
                            data?._id ? data?._id : auth?.userData?._id
                          }.svg`
                      : `https://avatars.dicebear.com/api/miniavs/${
                          data?._id ? data?._id : auth?.userData?._id
                        }.svg`
                  }
                  className={classes.avatar}
                />
                <Box></Box>
              </figure>
              <Box mt={2} mb={1} className={classes.textname}>
                {data?.referralCode && (
                  <Typography variant="h6">
                    Referral: {data?.referralCode} &nbsp;
                    <CopyToClipboard
                      text={data?.referralCode}
                      style={{ cursor: "pointer" }}
                    >
                      <FiCopy onClick={() => toast.info("Copied")} />
                    </CopyToClipboard>
                  </Typography>
                )}
              </Box>
              <Box mt={2} mb={1}>
                {data?.ethAccount?.address && (
                  <Typography variant="h6">
                    {sortAddress(data?.ethAccount?.address)}&nbsp;
                    <CopyToClipboard
                      text={data?.ethAccount?.address}
                      style={{ cursor: "pointer" }}
                    >
                      <FiCopy onClick={() => toast.info("Copied")} />
                    </CopyToClipboard>
                  </Typography>
                )}
              </Box>
              <Typography variant="h3">
                {data?.planType === "Gold" && (
                  <img
                    src="images/gold-check.svg"
                    style={{ width: "30px", marginLeft: "5px" }}
                  />
                )}
                {data?.planType === "Diamond" && (
                  <img
                    src="images/blue-check.svg"
                    style={{ width: "30px", marginLeft: "5px" }}
                  />
                )}
                {data?.planType === "Silver" && (
                  <img
                    src="images/white_check.svg"
                    style={{ width: "30px", marginLeft: "5px" }}
                  />
                )}
                {data?.planType === "Mass Plus" && (
                  <img
                    src="images/icon.png"
                    style={{ width: "30px", marginLeft: "5px" }}
                  />
                )}
                &nbsp;
                {/* <img
                  src="images/icon.png"
                  style={{ width: "30px", marginLeft: "5px" }}
                /> */}
                {data?.name
                  ? data.name
                  : data?.ethAccount?.address
                  ? sortAddress(data?.ethAccount.address)
                  : sortAddress(data?.walletAddress)}
              </Typography>
              {/* {auth?.userData?.userType !== "User" && (
                    )} */}
              {auth?.userData?._id !== data?._id && (
                <Box mt={2} mb={2}>
                  {data?.userType === "Creator" && userType === "User" && (
                    <Button
                      variant="contained"
                      size="large"
                      color="secondary"
                      className="ml-10"
                      onClick={() => {
                        if (auth?.userData?._id !== data?._id) {
                          subscribeUser();
                        } else {
                          toast.error("You can not subscribe yourself");
                        }
                      }}
                      disabled={isLoading}
                      // size="large"
                    >
                      {isSubscribe ? "unsubscribe" : "subscribe"}{" "}
                      {isLoading && <ButtonCircularProgress />}
                    </Button>
                  )}
                  {data?.userType === "Creator" && userType === "Creator" && (
                    <Button
                      variant="contained"
                      size="large"
                      color="secondary"
                      className="ml-10"
                      onClick={() => {
                        if (auth?.userData?._id !== data?._id) {
                          subscribeUser();
                        } else {
                          toast.error("You can not subscribe yourself");
                        }
                      }}
                      disabled={isLoading}
                      // size="large"
                    >
                      {isSubscribe ? "unsubscribe" : "subscribe"}{" "}
                      {isLoading && <ButtonCircularProgress />}
                    </Button>
                  )}

                  {/* {userType && userType !== "Creator" && ( */}

                  <Button
                    variant="contained"
                    size="large"
                    color="secondary"
                    className="ml-10"
                    onClick={() => {
                      if (auth?.userData?._id) {
                        if (auth?.userData?._id !== data?._id) {
                          setOpenDonation(true);
                        } else {
                          toast.error("You can not donate yourself");
                        }
                      } else {
                        toast.error("Please Login");
                        setTimeout(() => {
                          history.push("/login");
                        }, 1000);
                      }
                    }}
                  >
                    Donate
                  </Button>
                  {/* )} */}

                  <Button
                    variant="contained"
                    size="large"
                    color="secondary"
                    className="ml-10"
                    onClick={() => {
                      if (auth?.userData?._id) {
                        if (auth?.userData?._id !== data?._id) {
                          const walletAddress = data?.ethAccount?.address
                            ? data?.ethAccount.address
                            : data?.walletAddress;
                          if (walletAddress) {
                            history.push({
                              pathname: "/chat",
                              search: walletAddress,
                            });
                          }
                        } else {
                          toast.error("You can not chat yourself");
                        }
                      } else {
                        toast.error("Please Login");
                        setTimeout(() => {
                          history.push("/login");
                        }, 1000);
                      }
                    }}
                  >
                    Chat
                  </Button>
                </Box>
              )}
              <Typography variant="h5" style={{ color: "#000" }}>
                Bio{" "}
              </Typography>

              <Typography
                variant="body2"
                style={{ color: "#000", marginTop: "10px" }}
                align="left"
              >
                {data ? data.bio : ""}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Container>
      {openDonation && (
        <DonationPopUp
          open={openDonation}
          handleClose={() => setOpenDonation(false)}
          userData={data}
        />
      )}
    </Box>
  );
}
