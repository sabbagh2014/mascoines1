import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Container,
  Button,
  TextField,
  Typography,
  makeStyles,
  Grid,
  Input,
  Dialog,
  DialogContent,
  DialogTitle,
  InputAdornment,
  DialogActions,
  Link,
} from "@material-ui/core";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import NFTCard from "src/component/NFTCard";
import axios from "axios";
import Apiconfigs from "src/Apiconfig/Apiconfigs";
import NoDataFound from "src/component/NoDataFound";
const useStyles = makeStyles((theme) => ({
  input_fild: {
    backgroundColor: "#ffffff6e",
    borderRadius: "5.5px",
    border: " solid 0.5px #e5e3dd",
    color: "#141518",
    height: "48px",
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
    },
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "transparent",
      borderWidth: 0,
    },
  },
  LoginBox: {
    paddingTop: "20px",
    "& h6": {
      fontWeight: "bold",
      marginBottom: "10px",
      fontSize: "20px",
      color: "#000",
      "& span": {
        fontWeight: "300",
      },
    },
  },
  TokenBox: {
    border: "solid 0.5px #e5e3dd",
    padding: "5px",
  },
  masBoxFlex: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
  },
  dailogTitle: {
    textAlign: "Center",
    "& h2": {
      color: "#141518",
      fontSize: "23px",
    },
  },
  input_fild2: {
    width: "100%",
    "& input": {
      height: "45px",
    },
  },
  UploadBox: {
    border: "solid 0.5px #707070",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "110px",
  },
  input_fild22: {
    width: "100%",
    "& input": {
      height: "45px",
      border: 0,
    },
    "& .MuiInput-underline:before": {
      border: 0,
    },
  },
  dlflex: {
    "& div": {
      marginTop: "2rem",
      "& span": {
        border: "1px solid #e8e7e7",
        fontSize: "20px",
        padding: "7px",
        marginRight: "6px",
      },
    },
  },
}));

export default function Login() {
  const classes = useStyles();
  const [OpenAuction, setOpenAuction] = useState(false);
  const [auction, setauction] = useState([]);

  const myauction = async () => {
    await axios({
      method: "GET",
      url: Apiconfigs.listorder,
      headers: {
        token: window.localStorage.getItem("token"),
      },
    })
      .then(async (res) => {
        if (res.data.statusCode === 200) {
          console.log(res.data.result);
          setauction(res.data.result);
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  useEffect(() => {
    myauction();
  }, []);

  return (
    <Box className={classes.LoginBox} mb={5}>
      <Box className={classes.masBoxFlex}>
        <Typography variant="h6">My auctions</Typography>
        {/* <Button
          variant="contained"
          size="large"
          color="secondary"
          className="ml-10"
          onClick={() => setOpenAuction(true)}
        >
          make a new auction
        </Button> */}
      </Box>
      <Box maxWidth="lg">
        {!auction[0] ? (
          <Box align="center" mt={4} mb={5}>
            <NoDataFound />
          </Box>
        ) : (
          ""
        )}
        <Grid container spacing={4}>
          {auction.map((data, i) => {
            return (
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <NFTCard data={data} index={i} />
              </Grid>
            );
          })}
        </Grid>
      </Box>
      {OpenAuction && (
        <Dialog
          fullWidth="sm"
          maxWidth="sm"
          open={OpenAuction}
          onClose={() => setOpenAuction(false)}
          aria-labelledby="max-width-dialog-title"
        >
          <DialogTitle className={classes.dailogTitle}>
            Make a new auction
          </DialogTitle>
          <DialogContent>
            <Box>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <label> $MAS held:</label>
                </Grid>
                <Grid item xs={12} md={8}>
                  <TextField
                    id="standard-basic"
                    placeholder=""
                    className={classes.input_fild2}
                  />
                </Grid>
              </Grid>
            </Box>
            <Box mb={2}>
              <Grid container spacing={0}>
                <Grid item xs={12} md={12}>
                  <label>Upload a video/photo:</label>
                </Grid>
                <Grid item xs={12} md={12}>
                  <Box className={classes.UploadBox}>
                    <input
                      accept="image/*"
                      style={{ display: "none" }}
                      id="raised-button-file"
                      multiple
                      type="file"
                    />
                    {/* {image ? (
                    <>
                      <img src={image} alt="" width="200px" />
                      <Box>
                      <Button variant="outined" color="primary" component="span">
                          Uploaded Successfully
                        </Button>
                      </Box>
                       
                    </>
                  ) : (
                    <label htmlFor="contained-button-file">
                    <Button
                      variant="outined"
                      color="primary"
                      component="span"
                    >
                      Upload photo/video&nbsp;
                      <CloudUploadIcon />
                    </Button>
                  </label>
                  )} */}
                    <label htmlFor="raised-button-file">
                      <Button
                        variant="text"
                        color="primary"
                        endIcon={<CloudUploadIcon />}
                      >
                        Upload
                      </Button>
                    </label>
                  </Box>
                </Grid>
              </Grid>
            </Box>
            <Box mb={2}>
              <Grid container spacing={0}>
                <Grid item xs={12} md={12}>
                  <label>Details:</label>
                </Grid>
                <Grid item xs={12} md={12}>
                  <Box className={classes.UploadBox}>
                    <TextField
                      id="standard-basic"
                      placeholder=""
                      className={classes.input_fild22}
                      multiline
                      maxRows={4}
                    />
                  </Box>
                </Grid>
              </Grid>
            </Box>
            <Box mb={2}>
              <Grid container spacing={0}>
                <Grid item xs={12} md={4}>
                  <label>Time:</label>
                </Grid>
                <Grid item xs={12} md={8} className={classes.dlflex}>
                  <Box className={classes.timings}>
                    <span>10 Days</span>
                    <span>23</span>
                    <span>00</span>
                    <span>40</span>
                  </Box>
                </Grid>
              </Grid>
            </Box>
            <Box mb={2}>
              <Grid container spacing={0}>
                <Grid item xs={12} md={4}>
                  <label>starting bid:</label>
                </Grid>
                <Grid item xs={12} md={8}>
                  <Input
                    placeholder=""
                    className={classes.input_fild2}
                    onKeyPress={(event) => {
                      if (event?.key === "-" || event?.key === "+") {
                        event.preventDefault();
                      }
                    }}
                    endAdornment={
                      <InputAdornment position="end">
                        Select a token
                      </InputAdornment>
                    }
                  />
                </Grid>
              </Grid>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              onClick={() => setOpenAuction(false)}
              color="primary"
              size="large"
            >
              cancel
            </Button>
            <Button
              variant="contained"
              onClick={() => setOpenAuction(false)}
              color="secondary"
              size="large"
            >
              Place Auction
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
}
