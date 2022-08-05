import React from "react";
import {
  Grid,
  Container,
  Box,
  Typography,
  makeStyles,
  Button,
} from "@material-ui/core";
import { useHistory, useLocation } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  bannerSectionBody: {
    padding: "80px 0px",
    minHeight: "770px",
    backgroundImage: "linear-gradient(45deg, #240b36 30%, #c31432 90%)",
    // background: "#141518",
    "@media(max-width:600px)": {
      padding: "20px 0px",
    },
  },
  leftSection: {
    padding: "4px 30px",
    "& h2": {
      fontSize: "48px",
      fontWeight: "600",
      lineHeight: "60px",
      letterSpacing: "2px",
      //   color: "#fc424d",
      color: "#d0dfde",
      "@media(max-width:767px)": {
        color: "#d0dfde",
        fontSize: "28px",

        lineHeight: "43px",
        letterSpacing: "2px",
      },
    },
    "& h4": {
      margin: "26px 0px",
      fontSize: "16px",
      fontWeight: "300",
      lineHeight: "28px",
      letterSpacing: "2px",
      color: "#d0dfde",

      "@media(max-width:767px)": {
        color: "#d0dfde",
        margin: "0px 0px",
        fontSize: " 10px",

        lineHeight: "23px",
        letterSpacing: "2px",
      },
    },
    "& button": {
      borderRadius: "30px",
      background: "#fc424d",
      color: "#d0dfde",
      padding: "8px 14px",
    },
  },
  rightSection: {
    "& img": {
      width: "100%",
      minHeight: "300px",
      borderRadius: "10px",
    },
  },
}));

export default function BannerSection() {
  const history = useHistory();
  const location = useLocation();
  const classes = useStyles();

  return (
    <Box className={classes.bannerSectionBody}>
      <Container maxWidth="lg">
        <Grid container spacing={5} alignItems>
          <Grid item lg={6} sm={6} md={6} xs={12}>
            <Box className={classes.leftSection}>
              <Typography variant="h2">Change the way art is valued</Typography>
              <Typography variant="h4">
                Let your most passionate fans support your creative work via
                monthly membership
              </Typography>
            </Box>
          </Grid>
          <Grid item lg={6} sm={6} md={6} xs={12}>
            <Box className={classes.rightSection}>
              {/* <img src="images/feed1.png" alt="" /> */}
              <video
                className="videoBg"
                autoPlay
                muted
                loop
                width="100%"
                style={{ borderRadius: "20px" }}
                // width={300}
                // height={300}
              >
                <source src="/video/bannerVideo.mp4" type="video/mp4" />
              </video>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
