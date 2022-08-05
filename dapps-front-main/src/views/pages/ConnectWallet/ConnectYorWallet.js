import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Button,
  makeStyles,
  Grid,
  Typography,
} from "@material-ui/core";
import { UserContext } from "../../../context/User";
import { Link, useHistory } from "react-router-dom";
import { useWeb3React } from "@web3-react/core";
import ButtonCircularProgress from "src/component/ButtonCircularProgress";
import { toast } from "react-toastify";

const useStyles = makeStyles((theme) => ({
  LoginBox: {
    display: "flex",
    padding: "10px 0px",
  },
  connectBox: {
    display: "flex",
    justifyContent: " center",
    alignItems: "center",
    height: "50vh",
    "& h5": {
      fontSize: "30px",
      fontWeight: "500",
      color: "#000",
    },
  },
  modaltitel: {
    fontSize: "30px",
    fontWeight: "600",
    marginBottom: "10px",
    textAlign: "center",
    borderBottom: "solid 1px #e5e3dd",
    paddingBottom: "10px",
    color: "#141518",
    [theme.breakpoints.down("sm")]: {
      fontSize: "20px",
    },
  },
  btnBig: {
    height: "54.5px ",
    width: "237.5px ",
    maxWidth: "100% ",
  },
}));

export default function Login() {
  const classes = useStyles();
  const history = useHistory();
  const { activate, account, deactivate } = useWeb3React();
  const [isLoading, setIsLoading] = useState(false);
  const user = React.useContext(UserContext);
  const handleClickOpen2 = async (e) => {
    user.setOnlyConnectWallet(true);
    user.connectWallet();
    setIsLoading(true);
  };

  useEffect(() => {
    if (account && user.userLoggedIn && user.userData) {
      history.push("/");
      setIsLoading(false);
    }
    if (user.isErrorInWalletConnect) {
      toast.error(user.connectWalletError);
      setIsLoading(false);
    }
  }, [account, user]);
  return (
    <Box className={classes.LoginBox}>
      <Box className="leftimg">
        <div className="span1"></div>
        <div className="span2"></div>
        <div className="span3"></div>
      </Box>
      <Box className="rightimg">
        <div className="span1"></div>
        <div className="span2"></div>
        <div className="span3"></div>
      </Box>
      <img
        onClick={() => history.push("/")}
        src="images/centerimg.png"
        className="centerimg"
      />
      <Container maxWidth="lg">
        <Typography variant="h3" className={classes.modaltitel}>
          Connect your wallet
        </Typography>

        <Box className={classes.connectBox}>
          <Box textAlign="center">
            <Typography variant="h5"></Typography>
            <Typography
              variant="h5"
              style={{ color: "#707070", margin: "8px 0" }}
            >
              Connect to continue
            </Typography>
            <Grid container spacing={2}>
              <Grid item lg={6} md={6} sm={12} xm={12}>
                <Button
                  variant="contained"
                  size="large"
                  color="primary"
                  className={classes.btnBig}
                  onClick={() => history.goBack()}
                >
                  Back
                </Button>
              </Grid>
              <Grid item lg={6} md={6} sm={12} xm={12}>
                {" "}
                <Button
                  variant="contained"
                  size="large"
                  color="secondary"
                  className={classes.btnBig}
                  onClick={() => handleClickOpen2()}
                  disabled={isLoading}
                >
                  Connect wallet {isLoading && <ButtonCircularProgress />}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
