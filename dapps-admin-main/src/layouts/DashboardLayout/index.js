import React, { useState } from "react";
import PropTypes from "prop-types";
import { makeStyles, Box, IconButton, Hidden } from "@material-ui/core";
import NavBar from "./NavBar";
import TopBar from "../HomeLayout/TopBar";
import Footer from "../HomeLayout/Footer";
import MenuIcon from "@material-ui/icons/Menu";
const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    // display: 'flex',
    // height: '100%',
    // overflow: 'hidden',
    width: "100%",
  },
  wrapper: {
    paddingTop: 80,
    paddingLeft: 0,
    [theme.breakpoints.up("lg")]: {
      paddingLeft: 256,
    },
  },
}));

const DashboardLayout = ({ children }) => {
  const classes = useStyles();
  const [isMobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className={classes.root}>
      <TopBar />
      <Box className="textright">
        <Box className="YourWrappingContainerClass">
          <NavBar
            onMobileClose={() => setMobileNavOpen(false)}
            openMobile={isMobileNavOpen}
          />

          <div className={classes.wrapper}>
            <Hidden lgUp>
              <IconButton
              className="filterIcon"
                onClick={() => setMobileNavOpen(true)}
              >
                <MenuIcon
                  width="60px"
                  height="60px"
                  style={{ color: "#197ab3", fontSize:"30px" }}
                />
               <span> Filter</span>
              </IconButton>
            </Hidden>

            <div className={classes.contentContainer}>
              <div className={classes.content} id="main-scroll">
                {children}
              </div>
            </div>
          </div>
        </Box>
      </Box>
      {/* <Footer /> */}
    </div>
  );
};

DashboardLayout.propTypes = {
  children: PropTypes.node,
};

export default DashboardLayout;
