import React, { useEffect, useContext } from "react";
import {
  Typography,
  Box,
  makeStyles,
  Avatar,
  Grid,
  Button,
  Link,
} from "@material-ui/core";
import { useWeb3React } from "@web3-react/core";
import { FaEllipsisV } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { BsClockHistory } from "react-icons/bs";
import { UserContext } from "src/context/User";
import { baseURL } from "src/Apiconfig/Apiconfigs";
import moment from "moment";
const useStyles = makeStyles((theme) => ({
  NotificationBox: {
    display: "flex",
    padding: 5,
    marginTop: 2,
    borderRadius: 5,
    border: "1px solid #52565c",
    alignContent: "center",
    "& div": {
      "& h5": {
        fontWeight: "500",
        fontSize: "14px",
        lineHeight: "21px",
        color: "#039BE3",
      },
      "& p": {
        fontWeight: "500",
        fontSize: "12px",
        lineHeight: "18px",
        color: "#3D3D3D",
      },
      "& small": {
        fontWeight: "500",
        fontSize: "12px",
        lineHeight: "18px",
        color: "#979797",
      },
    },
  },
  Notificationimg: {
    width: "47px",
    marginRight: "30px",
    borderRadius: "10px",
    "@media(maxWidth:767px)": {
      Notificationimg: {
        marginRight: "10px",
      },
    },
    "& img": {
      width: "100%",
    },
  },
}));
export default function UsersCard(props) {
  const { data } = props;
  const classes = useStyles();
  return (
    <Box className={classes.NotificationBox}>
      {data.image && (
        <figure className={classes.Notificationimg}>
          <img
            src={data.image}
            // src="images/nft.jpeg"
            alt=""
          />
        </figure>
      )}

      <Box>
        <Typography variant="h5">{data.title}</Typography>
        <Typography variant="body2" component="p">
          {data.description}
        </Typography>
        <Typography variant="body2" style={{ marginTop: 5 }}>
          {moment(data.createdAt).format("dddd, MMMM Do YYYY, h:mm:ss a")}
        </Typography>
        {/* <Box mt={2} mb={3}>
          <Button variant="contained" size="large" color="secondary">
            ACCEPT
          </Button>
          <Button variant="contained" size="large" color="primery">
            REJECT
          </Button>
        </Box> */}
      </Box>
    </Box>
  );
}
