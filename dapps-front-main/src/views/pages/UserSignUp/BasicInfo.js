import React from "react";
import {
  Box,
  Container,
  Grid,
  Button,
  Typography,
  TextField,
  makeStyles,
} from "@material-ui/core";
import { Link } from "react-router-dom";
// import { Editor } from '@tinymce/tinymce-react'
const useStyles = makeStyles((theme) => ({
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
      height: "45px",
    },
  },
  Button: {
    display: "flex",
    justifyContent: "flex-end",
    paddingBottom: "25px",
  },
  ButtonBtn: {
    paddingTop: "30px",
    width: "200px",
  },
  name: {
    display: "flex",
    alignItems: "center",
    fontSize: "20px",
    color: "#141518",
    [theme.breakpoints.down("sm")]: {
      display: "block",
    },
    "& p": {
      fontSize: "15px",
      color: "#707070",
      paddingLeft: "5px",
    },
  },
  inputbox: {
    width: "100%",
    height: "150px",
  },
  profileimg: {
    position: "relative",
    width: "200px",
    height: "200px",
    borderRadius: "50%",
    "& img": {
      width: "100%",
      borderRadius: "50%",
      height: "100%",
    },
    "& input": {
      position: "absolute",
      top: "0",
      left: "0",
      width: "100%",
      height: "100%",
      opacity: "0",
    },
  },
  coverimg: {
    position: "relative",
    width: "100%",
    height: "200px",
    "& img": {
      width: "100%",
      height: "100%",
    },
    "& input": {
      position: "absolute",
      top: "0",
      left: "0",
      width: "100%",
      height: "100%",
      opacity: "0",
    },
  },
}));

export default function Login() {
  const classes = useStyles();
  return (
    <Box className={classes.LoginBox}>
      <Container maxWidth="xl">
        <Typography variant="h4" className={classes.basic}>
          Becoming a MAS
        </Typography>
        <Box className>
          <Box mt={5}>
            <Grid container spacing={1}>
              <Grid item xs={12} md={1}>
                <label className={classes.name}> Name :</label>
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  id="standard-basic"
                  placeholder=""
                  className={classes.input_fild2}
                />
              </Grid>
            </Grid>
          </Box>
          <Box>
            <Grid container spacing={1}>
              <Grid item xs={12} md={4}>
                <label className={classes.name}> Profile Photo :</label>
                <Box className={classes.profileimg}>
                  <img src="/images/users/profilepic.svg" alt="" />
                  <input type="file" />
                </Box>
              </Grid>
            </Grid>
          </Box>
          <Box>
            <Grid container spacing={1}>
              <Grid item xs={12} md={4}>
                <label className={classes.name}> Cover Photo :</label>
                <Box className={classes.coverimg}>
                  <img
                    src="/images/users/coverpic.svg"
                    style={{ width: "100%" }}
                    alt=""
                  />
                  <input type="file" />
                </Box>
              </Grid>
            </Grid>
          </Box>
          <Box>
            <Grid container spacing={1}>
              <Grid item xs={12} md={4}>
                <label className={classes.name}>
                  MAS Page URL :{" "}
                  <p>‎‎‎https://apps.masplatform.io/user-profile?</p>
                  <TextField id="outlined-basic" autoFocus="true" />
                </label>
              </Grid>
            </Grid>
          </Box>
          <Box>
            <Grid container spacing={1}>
              <Grid item xs={12} md={4}>
                <label className={classes.name}> BIO :</label>
                {/* <Editor
                  id="editor"
                  initialValue="<p></p>"
                  init={{
                    height: 500,
                    menubar: false,
                    plugins: [
                      'advlist autolink lists link image charmap print preview anchor',
                      'searchreplace visualblocks code fullscreen',
                      'insertdatetime media table paste code help wordcount',
                    ],
                    toolbar:
                      'undo redo | formatselect | ' +
                      'bold italic backcolor | alignleft aligncenter ' +
                      'alignright alignjustify | bullist numlist outdent indent | ' +
                      'removeformat | help',
                    content_style:
                      'body { font-family:Helvetica,Arial,sans-serif; font-size:18px }',
                  }}
                /> */}
                <TextField
                  id="outlined-multiline-static"
                  focused="true"
                  multiline
                  placeholder="Type a text"
                  rows={4}
                  variant="outlined"
                  className={classes.inputbox}
                />
              </Grid>
            </Grid>
          </Box>
        </Box>

        <Box className={classes.Button}>
          <Grid>
            <Box className={classes.ButtonBtn}>
              <Button
                // variant="h6"
                variant="contained"
                size="large"
                color="secondary"
                component={Link}
                to="/socialaccounts"
                className="btn-block btnWidth removeredius"
              >
                Next
              </Button>
            </Box>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}
