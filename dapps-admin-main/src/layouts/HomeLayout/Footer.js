import React from "react";
import {
  Grid,
  Box,
  Container,
  Typography,
  List,
  ListItem,
  makeStyles,
  TextField,
  Button,
} from "@material-ui/core";
import {Link } from "react-router-dom";
import TelegramIcon from "@material-ui/icons/Telegram";
import { FaFacebookF } from "react-icons/fa";
import { GrMedium } from "react-icons/gr";
import { AiOutlineTwitter } from "react-icons/ai";
import { AiFillYoutube } from "react-icons/ai";

import {} from "react-feather";
import Logo from "./../../component/Logo";

const useStyles = makeStyles((theme) => ({
  footerSection: {
    backgroundColor: "#501522",
    color:"white",
    position: "relative",
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    textAlign:"center"
  },
  
}));

export default function Liquidity() {
  const classes = useStyles();
  return (
    <>
      <Box className={classes.footerSection}>
        Powered by <strong>Mobiloitte Technologies</strong>
        {/* <Box>
          <Container maxWidth="xl">
            <Grid
              container
              justify="space-around"
              alignItems="center"
              spacing={1}
            >
              <Grid item xs={12} md={12} lg={12}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={2} md={2}>
                    <Link style={{ marginLeft: "-30px"}} to="/">
                      <img
                        src="images/footer-logo.svg"
                        alt=""
                        className={classes.footerBg}
                      />
                    </Link>
                    <Typography variant="h6" className={classes.join}>Lorem ipsum dolor sit amet </Typography>
                  </Grid>
                  <Grid item xs={5} sm={3} md={2}>
                    <List className="listingFooter">
                      <ListItem>
                      
                        <Link target="_blank" to="/company" className={classes.color}>Company</Link>
                        
                      </ListItem>
                      <ListItem>
                        <Link to={false} className={classes.color}>Careers</Link>
                      </ListItem>
                      <ListItem>
                        <Link
                          // to="/refferal"
                          to={false} className={classes.color}
                        >
                          Affiliate program
                        </Link>
                      </ListItem>
                      <ListItem>
                        <Link to={false} className={classes.color}>Press</Link>
                      </ListItem>
                      <ListItem>
                        <Link target="_blank" to="/partnership" className={classes.color}>Partnerships</Link>
                      </ListItem>
                      <ListItem>
                        <Link to={false} className={classes.color}>Docs</Link>
                      </ListItem>
                    </List>
                  </Grid>
                  <Grid item xs={7} sm={4} md={3}>
                    <List className="listingFooter">
                      <ListItem>
                        <Link target="_blank" to="/terms-conditions" className={classes.color}>
                          Terms and conditions
                        </Link>
                      </ListItem>
                      <ListItem>
                        <Link target="_blank" to="/privacy-policy" className={classes.color}>
                          Privacy policy
                        </Link>
                      </ListItem>
                      <ListItem>
                        <Link target="_blank" to="/risk-statment" className={classes.color}>
                          Risk disclosure statement
                        </Link>
                      </ListItem>
                      <ListItem>
                        <Link target="_blank" to="/kyc-program" className={classes.color}>
                          KYC program
                        </Link>
                      </ListItem>
                      <ListItem>
                        <Button variant="contained"><Link
                          to={false}
                          className="footer_btn"
                          style={{ color: "white" }}
                        >
                          become a MAS
                        </Link></Button>
                      </ListItem>
                    </List>
                  </Grid>
                  {/* <Grid item xs={6} md={3} align="center">
                    <Typography variant="body">Stay tuned for our applications on:</Typography> <br/>
                    <img src="images/app.png"/> <br/>
                    <img src="images/google.png"/> <br/>
                  </Grid> 
                  <Grid item xs={12} sm={3} md={5} className={classes.media}>
                    <Typography variant="" style={{display:"block",paddingBottom:"20px"}}>Lorem ipsum dolor sit amet.</Typography>
                    <FaFacebookF /> <AiOutlineTwitter /> <AiFillYoutube />{" "}
                    <TelegramIcon /> <GrMedium />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Container>
        </Box> */}
      </Box>
    </>
  );
}
