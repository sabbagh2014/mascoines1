import React from 'react'
import {
  Box,
  Container,
  Grid,
  Button,
  Typography,
  TextField,
  makeStyles,
} from '@material-ui/core'
import { Link } from 'react-router-dom'
import BundleCards from './BundleCard'
// import { Editor } from '@tinymce/tinymce-react'
const useStyles = makeStyles((theme) => ({
  LoginBox: {
    paddingBottom: "50px",
  },
  basic: {
    textAlign: 'center',
    fontFamily: 'Poppins',
    fontSize: '30px',
    paddingTop: '20px',
    color: '#141518',
  },
  input_fild2: {
    width: '100%',
    '& input': {
      height: '45px',
    },
  },
  Button: {
    display: 'flex',
    justifyContent: 'flex-end',
    paddingBottom: '25px',
  },
  ButtonBtn: {
    paddingTop: '30px',
    paddingRight: '10px',
    width: '200px',
  },
  name: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '20px',
    color: '#141518',
    '& p': {
      fontSize: '15px',
      color: '#707070',
      paddingLeft: '5px',
    },
  },
  inputbox: {
    width: '100%',
    height: '150px',
  },
  profile: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: '-75px',
  },
  coverpic: {
    width: '100%',
  },
  profilepic: {
    width: '127.7px',
    height: '127.7px',
  },
  CoverBox: {
    display: 'flex',
    alignItems: 'flex-end',
    flexDirection: 'column',
  },
  coverEdit: {
    color: '#ffffff',
    marginTop: '-40px',
    padding: '10px',
  },
  Box: {
    width: '100%',
    height: '125px',
    backgroundImage: 'linear-gradient(to bottom, #c04848, #480048)',
  },
  abortText: {
    width: "262px",
    height: "28px",
    margin: "6.8px 103.5px 13.5px 257.8px",
    fontFamily: "Poppins",
    fontSize: "20px",
    fontWeight: "bold",
    fontStretch: "normal",
    fontStyle: "normal",
    lineHeight: "1.5",
    letterSpacing: "normal",
    textAlign: "left",
    color: "#000",

  },
  inputbox1: {
    // width: '291.5px',
    width:"33%",
    height: '79.5px',
    margin: '7px 50px 27.5px 0',
    padding: '32.5px 220px 33px 220px',
    border: 'solid 0.5px #707070',
    backgroundColor: 'var(--white)',
  },
  grid:{
    display:"flex",
    justifyContent:"center"
  },
  btn:{
    backgroundColor:"red",
    color:"white"
  }
}))

export default function ShareAudience() {
  const classes = useStyles()
  return (
    <Box className={classes.LoginBox}>
      <Container maxWidth="xl">
        <Grid>
          <Box >
            <Typography className={classes.abortText}>Share With Your Audience</Typography>
          </Box>
          <Box className={classes.coverEdit}>Edit cover Photo</Box>
        </Grid>


        <Box>
          <Grid container spacing={1}>
            <Grid item xs={12} md={1}>
              <label className={classes.name}> Title :</label>
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                id="standard-basic"
                defaultValue="adamsberg@mas.com"
                className={classes.input_fild2}
              />
            </Grid>
          </Grid>
        </Box>

        {/* <Box>
          <Grid container spacing={1}>
            <Grid item xs={12} md={1}>
              <label className={classes.name}>
                MAS Page URL : <p>‎‎‎https://apps.mas.io</p>
                <TextField id="outlined-basic" autoFocus="true" />
              </label>
            </Grid>
          </Grid>
        </Box> */}
        <Box>
          <Grid container spacing={1}>
            <Grid item xs={12} md={4}>
              <label className={classes.name}> Details :</label>
              <TextField
                id="outlined-multiline-static"
                focused="true"
                multiline
                rows={4}
                defaultValue="Default Value"
                variant="outlined"
                className={classes.inputbox}
              />
            </Grid>
          </Grid>
        </Box>
        <Box>
          <Grid container spacing={1}>
            <Grid item xs={12} md={4}>
              <label className={classes.name}>Upload a photo/video :</label>
              <Box
                className={classes.inputbox1}
              >
                <Typography variant="body2">
                  Upload <img src="images/IconUpload.png" alt="" />
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
        <Box>
          <Grid container spacing={1}>
            <Grid item xs={12} md={1}>
              <label className={classes.name}>SOCIAL LINKS</label>
            </Grid>
          </Grid>

          
        <Box>
          <Grid >
            <Grid 
            >
              <label className={classes.name}>Upload a photo/video :</label>
              <Grid className={classes.grid}>
                <BundleCards className={classes.nbttn} />
                <BundleCards className={classes.nbttn} />
                <BundleCards className={classes.bttn} />
                <BundleCards className={classes.bttn} />
              </Grid>
              
              {/* <Box
                className={classes.bundlebox}
              >
                <Typography>
                  Bundle II
                </Typography>
              </Box> */}
            </Grid>
          </Grid>
        </Box>
        <Box></Box>

          <Box className={classes.Button}>
            <Box className={classes.ButtonBtn}>
              <Button
                variant="contained"
                size="large"
                color="primery"
                className="btn-block btnWidth removeredius"
                component={Link}
                to="/home"
              >
                Cancel
              </Button>
            </Box>

            <Box className={classes.ButtonBtn}>
              <Button
                variant="h6"
                variant="contained"
                size="large"
                color="secondary"
                className="btn-block btnWidth removeredius"
                component={Link}
                to="/refferal"
              >
                Apply
              </Button>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}
