import React from "react";
import {
    Typography,
    Box,
    makeStyles,
    Avatar,
    Grid,
    Button,
    Link,
} from "@material-ui/core";
import { FaEllipsisV } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { BsClockHistory } from "react-icons/bs";

const useStyles = makeStyles((theme) => ({
   cards:{
    border: "solid 0.5px #e5e3dd",
    backgroundColor: "#fff",
    padding:"25px",
    // height:"100%",
    textAlign:"center",
    '& h2':{
        fontSize: "25px",
        color: "#141518",
        fontWeight: "bold",
        lineHeight: "1.52",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        wordBreak: "break-word",
    },
   },
}));

export default function UsersCard(props) {
    const classes = useStyles();

    return (
        <Box className={classes.cards}>
            <Typography variant="h2" component="h2">254 &nbsp;<img src="images/tokens/1.png"/></Typography>
        </Box>
    );
}
