import React, { useEffect } from "react";
import {
  Grid,
  Box,
  makeStyles,
  Avatar,
  Typography,
  Button,
} from "@material-ui/core";
import Slide from "@material-ui/core/Slide";
import { sortAddress } from "src/utils";

const useStyles = makeStyles((theme) => ({
  pLeft20: {
    paddingLeft: "30px",
  },
  borderBotm: {
    borderBottom: "1px solid #ccc",
    // paddingBottom: '10px',
    // marginBottom: 10,
    display: "flex",
    background: "#fff",
    width: "275px",
  },
  count: {
    color: "black",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    // width:"110px",
    background: "#fff",
    marginLeft: "-40px",
  },
  main: {
    background: "#fff",
    cursor: "pointer",
  },
}));

export default function UsersCard({
  users,
  history,
  setUserList,
  userList,
  setsearch,
  setIsLoading1,
  isLoading1,
  search,
}) {
  console.log("users._id", search);
  const classes = useStyles();
  // useEffect(() => {
  //   if (users._id) {
  //     setsearch("");
  //   }
  // }, [users._id]);
  const handleCloseFunction = () => {
    history.push({
      pathname: "/user-profile",
      search: users._id,
    });
    setIsLoading1(false);
    setsearch("");
  };

  return (
    <Box className={classes.main} onClick={handleCloseFunction}>
      <Grid container alignItems="center" className={classes.borderBotm}>
        <Grid item xs={9} md={9} lg={9}>
          <Box
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <figure
              className="chatuser chatuser3 "
              style={{ cursor: "pointer", marginLeft: "10px" }}
            >
              <img
                src={
                  users && users.profilePic
                    ? users.profilePic
                    : "images/user-profile.png"
                }
                style={{ height: "45px", width: "45px" }}
              />
            </figure>
            &nbsp;&nbsp;
            <Typography
              variant="h5"
              component="h4"
              className="textOverflow"
              style={{ color: "black" }}
            >
              {users.name
                ? users.name
                : users.userType === "User"
                ? sortAddress(users.walletAddress)
                : sortAddress(users.ethAccount.address)}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={3} md={3} lg={3}>
          <Box padding="2px" className={classes.count}>
            <Box>
              <Typography variant="h6" component="h6">
                {users.subscriberCount}
              </Typography>
            </Box>
            <Box>
              <Typography variant="span" component="span">
                subscribers
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
