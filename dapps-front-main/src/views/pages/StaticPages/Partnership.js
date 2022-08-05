import React from 'react';
import { makeStyles,Box,Typography,Grid} from '@material-ui/core';
import { Link } from 'react-router-dom';


const useStyles = makeStyles((theme) => ({
    root:{
        display:"flex",
        width:"100%",
        height:"98vh",
        // border:"2px solid black",
        alignItems:"center",
        // justifyContent:"center"
        flexDirection:"column"
        
    },
    con:{
        // border:"2px solid black",
        position:"absolute",
        top:"400px",
        "@media (max-width:425px)": {
        position:"absolute",
        top:"300px",
    },
  },
    box1:{
        position:"absolute",
        // display:"flex",
        width:"200px",
        height:"50px",
        // border:"2px solid black",
        alignItems:"center",
        top:"200px",
        // marginTop:"-200px"
        "@media (max-width:425px)": {
          position:"absolute",
          top:"200px"
      },
        
    },
    h1:{
        textAlign:"center",
        color:"black"
    },

    items:{
      height:"100%",
      // border:"2px solid black",
      // padding:theme.spacing(5)
      // backgroundColor:"red"
    },
    img:{
      hight:"100%",
      width:"100%",
      // padding:theme.spacing(2)
    }

  }));

function Partnership() {
    const classes = useStyles();
  return (
    <div className={classes.root}>
     <Box className={classes.box1}>
    <Typography variant='h2' className={classes.h1}>Our Partners</Typography>
    </Box>
    <Grid container spacing={2} className={classes.con}> 
    <Grid item lg={2} sm={3} xs={6} className={classes.items}></Grid>
    <Grid item lg={2} sm={3} xs={6} className={classes.items}><a href='https://www.google.com/' target="_blank" rel="noreferrer"><img src='./images/googleLogo.png' alt="logo" className={classes.img}></img></a></Grid>
    <Grid item lg={2} sm={3} xs={6} className={classes.items}><a href='https://www.netflix.com/in/' target="_blank" rel="noreferrer"><img src='./images/netflixLogo.png' alt="logo" className={classes.img}></img></a></Grid>
    <Grid item lg={2} sm={3} xs={6} className={classes.items}><a href='https://www.amazon.com/' target="_blank" rel="noreferrer"><img src='./images/amazonLogo.png' alt="logo" className={classes.img}></img></a></Grid>
    <Grid item lg={2} sm={3} xs={6} className={classes.items}><a href='https://www.microsoft.com/en-in/' target="_blank" rel="noreferrer"><img src='./images/microsoftLogo.png' alt="logo" className={classes.img}></img></a></Grid>
    <Grid item lg={2} sm={3} xs={6} className={classes.items}></Grid>
    </Grid>
    </div>
  );
}

export default Partnership;
