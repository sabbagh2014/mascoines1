import React, { useState, useContext } from "react";
import {
  Box,
  Container,
  Grid,
  Button,
  Typography,
  TextField,
  makeStyles,
} from "@material-ui/core";
import { Link, useHistory } from "react-router-dom";
import { UserContext } from "src/context/User";
import {
  isUrlValid,
  isUrlValidTelegram,
} from "src/CommanFunction/Validation.js";
import FacebookIcon from "@material-ui/icons/Facebook";
import TelegramIcon from "@material-ui/icons/Telegram";
import TwitterIcon from "@material-ui/icons/Twitter";
import YouTubeIcon from "@material-ui/icons/YouTube";
import axios from "axios";
const useStyles = makeStyles((theme) => ({
  LoginBox: {
    paddingBottom: "50px",
  },
  basic: {
    textAlign: "center",
    fontFamily: "Poppins",
    fontSize: "30px",
    paddingTop: "20px",
    color: "#141518",
  },
  input_fild2: {
    width: "100%",
    "& input": {
      height: "5px",
    },
  },
  name: {
    alignContent: "end",
  },
  Button: {
    display: "flex",
    justifyContent: "flex-end",
  },
  ButtonBtn: {
    paddingTop: "100px",
    paddingRight: "10px",
    width: "200px",
    alignItems: "right",
  },
  inputsocial: {
    display: "flex",
    alignItems: "center",
  },
  iconalign: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: "50px",
  },
  icon: {
    padding: "10px",
    color: "#000",
  },
}));

export default function Login() {
  const classes = useStyles();
  const user = useContext(UserContext);
  const history = useHistory();
  const [youtube, setyoutube] = useState(user.link.useryoutube);
  const [twitter, settwitter] = useState(user.link.usertwitter);
  const [facebook, setfacebook] = useState(user.link.userfacebook);
  const [telegram, settelegram] = useState(user.link.usertelegram);
  const [validyoutube, setvalidyoutube] = useState(false);
  const [validtwitter, setvalidtwitter] = useState(false);
  const [validfacebook, setvalidfacebook] = useState(false);
  const [validtelegram, setvalidtelegram] = useState(false);

  const save = () => {
    console.log("tele", telegram);
    const isValdidtelegram =
      telegram && telegram !== "" ? isUrlValidTelegram(telegram) : true;
    const isValdidtyoutube =
      youtube && youtube !== "" ? isUrlValid(youtube) : true;
    const isValdidttwitter =
      twitter && twitter !== "" ? isUrlValid(twitter) : true;
    const isValdidtfacebook =
      facebook && facebook !== "" ? isUrlValid(facebook) : true;

    if (
      isValdidtelegram &&
      isValdidtyoutube &&
      isValdidttwitter &&
      isValdidtfacebook
    ) {
      user.userlink({
        youtube: youtube,
        twitter: twitter,
        facebook: facebook,
        telegram: telegram,
      });

      history.push("/profilesettings");
    } else {
      console.log(telegram);
      if (telegram !== "" && !isUrlValidTelegram(telegram)) {
        setvalidtelegram(true);
      }
      if (youtube !== "" && !isUrlValid(youtube)) {
        setvalidyoutube(true);
      }
      if (twitter !== "" && !isUrlValid(twitter)) {
        setvalidtwitter(true);
      }
      if (facebook !== "" && !isUrlValid(facebook)) {
        setvalidfacebook(true);
      }
    }
  };

  return (
    <Box className={classes.LoginBox}>
      <Container maxWidth="xl">
        <Typography variant="h4" className={classes.basic}>
          Social Accounts
        </Typography>
        <Box className={classes.inputsocial}>
          <Grid container>
            <Grid className={classes.iconalign} item xs={12} sm={4}>
              <FacebookIcon className={classes.icon} />
              <TextField
                id="standard-basic"
                value={facebook}
                // onFocus={(e) => (e.target.value = "")}
                // onBlur={(e) => (e.target.value = "youtube channel link")}
                placeholder="Plase enter your facebook page url"
                error={validfacebook && !isUrlValid(facebook)}
                helperText={
                  validfacebook && !isUrlValid(facebook) ? "Invalid URL" : ""
                }
                onChange={(e) => setfacebook(e.target.value)}
                className={classes.input_fild2}
              />
            </Grid>
          </Grid>
        </Box>
        <Box className={classes.inputsocial}>
          <Grid container>
            <Grid className={classes.iconalign} item xs={12} sm={4}>
              <TwitterIcon className={classes.icon} />
              <TextField
                id="standard-basic"
                value={twitter}
                placeholder="Plase enter your twitter url"
                // onFocus={(e) => (e.target.value = "")}
                // onBlur={(e) => (e.target.value = "youtube channel link")}
                error={validtwitter && !isUrlValid(twitter)}
                helperText={
                  validtwitter && !isUrlValid(twitter) ? "Invalid URL" : ""
                }
                onChange={(e) => settwitter(e.target.value)}
                className={classes.input_fild2}
              />
            </Grid>
          </Grid>
        </Box>
        <Box className={classes.inputsocial}>
          <Grid container>
            <Grid className={classes.iconalign} item xs={12} sm={4}>
              <TelegramIcon className={classes.icon} />
              <TextField
                id="standard-basic"
                value={telegram}
                placeholder="Plase enter your telegram url"
                // onFocus={(e) => (e.target.value = "")}
                // onBlur={(e) => (e.target.value = "youtube channel link")}
                error={validtelegram && !isUrlValidTelegram(telegram)}
                helperText={
                  validtelegram && !isUrlValidTelegram(telegram)
                    ? "Invalid URL"
                    : ""
                }
                onChange={(e) => settelegram(e.target.value)}
                className={classes.input_fild2}
              />
            </Grid>
          </Grid>
        </Box>
        <Box className={classes.inputsocial}>
          <Grid container>
            <Grid className={classes.iconalign} item xs={12} sm={4}>
              <YouTubeIcon className={classes.icon} />
              <TextField
                id="standard-basic"
                value={youtube}
                placeholder="Plase enter your youtube url"
                // onFocus={(e) => (e.target.value = "")}
                // onBlur={(e) => (e.target.value = "youtube channel link")}
                error={validyoutube && !isUrlValid(youtube)}
                helperText={
                  validyoutube && !isUrlValid(youtube) ? "Invalid URL" : ""
                }
                onChange={(e) => setyoutube(e.target.value)}
                className={classes.input_fild2}
              />
            </Grid>
          </Grid>
        </Box>

        <Box>
          <Grid className={classes.Button}>
            <Box className={classes.ButtonBtn}>
              <Button
                variant="contained"
                size="large"
                color="primery"
                className="btn-block btnWidth removeredius"
                component={Link}
                to="/profilesettings"
              >
                Back
              </Button>
            </Box>
            <Box className={classes.ButtonBtn}>
              <Button
                // variant="h6"
                variant="contained"
                size="large"
                color="secondary"
                className="btn-block btnWidth removeredius"
                // component={Link}
                // to="/profilesettings"
                onClick={save}
              >
                Save
              </Button>
            </Box>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}
