import React from 'react';
import { Box, makeStyles } from '@material-ui/core';
import Profile from './Profile';
import Tabs from './Tabs';
const useStyles = makeStyles((theme) => ({
  LoginBox: {
    paddingBottom: '50px',
  },
  websiteButton: {
    border: 'solid 0.5px #707070',
    backgroundColor: '#fff',
    textAlign: 'center',
    fontSize: '17.5px',
    color: '#141518',
    width: '100%',
    borderRadius: '0',
  },
}));

export default function Login() {
  const classes = useStyles();
  return (
    <Box className={classes.LoginBox}>
      <Profile />
      <Tabs />
      {/* <Moderators />
            <Reports />
            <Auction /> */}
    </Box>
  );
}
