import React, { useContext } from "react";
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
import Tabs from "./Tabs";
import { UserContext } from "src/context/User";
import BundlesCard from "src/component/BundlesCard";
import { sortAddress } from "src/utils";
const useStyles = makeStyles((theme) => ({
  LoginBox: {
    paddingBottom: "50px",
  },
  websiteButton: {
    border: "solid 0.5px #707070",
    backgroundColor: "#fff",
    textAlign: "center",
    fontSize: "17.5px",
    color: "#141518",
    width: "100%",
    borderRadius: "0",
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
}));

export default function Login() {
  const classes = useStyles();
  const user = useContext(UserContext);
  return (
    <Box className={classes.LoginBox}>
      <Container maxWidth="lg">
        <Box mt={5} mb={5}>
          <Box className={classes.profileText}>
            <Grid container spacing={3}>
              <Grid item xl={12} md={12} align="center">
                <figure className="chatuser chatuser2 chatuser4">
                  <img
                    src={
                      user.userData && user.userData.profilePic
                        ? user.userData.profilePic
                        : "images/user-profile.png"
                    }
                  />
                  <Box></Box>
                </figure>
                <Typography variant="h3">
                  {user.userData?.name
                    ? user.userData.name
                    : user.userData?.ethAccount?.address
                    ? sortAddress(user.userData?.ethAccount.address)
                    : sortAddress(user.userData?.walletAddress)}
                </Typography>
                <Typography variant="h5" style={{ color: "#792034" }}>
                  Bio{" "}
                </Typography>
                <Typography
                  variant="body2"
                  style={{
                    color: "#000",
                    marginTop: "10px",
                    textAlign: "center",
                  }}
                  align="left"
                >
                  {user.userData ? user.userData.bio : "User"}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
      <Container maxWidth="xl">
        <Grid container spacing={3}>
          {/* <Grid item xs={12} md={3}> <BundlesCard/></Grid>
                   <Grid item xs={12} md={3}> <BundlesCard/></Grid>
                   <Grid item xs={12} md={3}> <BundlesCard/></Grid>
                   <Grid item xs={12} md={3}> <BundlesCard/></Grid> */}
        </Grid>
        <Tabs />
      </Container>
    </Box>
  );
}
