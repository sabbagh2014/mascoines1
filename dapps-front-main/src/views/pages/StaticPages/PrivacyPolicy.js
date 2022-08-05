import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Button,
  TextField,
  makeStyles,
  Grid,
  Typography,
} from "@material-ui/core";
import { useHistory } from "react-router";

import axios from "axios";
import Apiconfigs from "src/Apiconfig/Apiconfigs";

import Page from "src/component/Page";
import { Link, useLocation } from "react-router-dom";

import Loader from "src/component/Loader";
const useStyles = makeStyles((theme) => ({
  LoginBox: {
    display: "flex",
    padding: "10px 0px",
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
}));
export default function PrivacyPolicy() {
  const classes = useStyles();
  const history = useHistory();

  const location = useLocation();
  const accessToken = window.localStorage.getItem("creatturAccessToken");
  const [users, setUsers] = useState("");
  console.log("users", users);
  const [isLoading, setIsLoading] = useState(false);

  const ViewStatics = async () => {
    setIsLoading(true);

    axios
      .get(
        Apiconfigs.viewStaticPage,

        {
          headers: {
            token: accessToken,
          },
          params: { type: location.state.id },
        }
      )
      .then((response) => {
        if (response.data.statusCode !== 200) {
          setIsLoading(false);
          setUsers();
        } else {
          // setDisplayname
          // console.log(result)
          setUsers(response.data.result);
          console.log(response);
          setIsLoading(false);
        }
      })
      .catch((response) => {
        console.log("response", response);
        setIsLoading(false);
      });
  };
  useEffect(() => {
    ViewStatics();
  }, [1]);
  return (
    <Box className={classes.LoginBox}>
      <img
        onClick={() => history.push("/")}
        src="images/centerimg.png"
        className="centerimg"
      />
      <Container maxWidth="lg">
        <Typography variant="h3" className={classes.modaltitel}>
          {users?.title}
        </Typography>

        <Box mt={5}>
          {isLoading && <Loader />}
          <Typography paragraph>
            {users?.description && (
              <div
                dangerouslySetInnerHTML={{ __html: users?.description }}
              ></div>
            )}
            {/* {users?.description} */}
          </Typography>{" "}
        </Box>
      </Container>
    </Box>
  );
}
