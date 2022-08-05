import React from "react";
import {
    Typography,
    Box,
    makeStyles,
    Avatar,
    Grid,
    Button,
    List,
    ListItem,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import { FaEllipsisV } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { BsClockHistory } from "react-icons/bs";

const useStyles = makeStyles((theme) => ({
    cards: {
        border: "solid 0.5px #e5e3dd",
        backgroundColor: "#fff",
        paddingTop: "20px",
        borderRadius: "10px",
        '& span': {
            fontSize: "14px",
            color: "#141518",
        },
        '& h2': {
            marginTop: "25px",
            fontSize: "25px",
            color: "#141518",
            fontWeight: "bold",
            lineHeight: "1.52",
            wordBreak: "break-word",
        },
    },

    bundlebox: {
        width: "11.5%",
        height: '69.5px',
        // margin: '7px 50px 27.5px 0',
        padding: '32.5px 79px 33px 80px',
        border: 'solid 2.5px #792034',
        backgroundColor: 'var(--white)',
    }

}));
export default function BundleCards(props) {
    const classes = useStyles();

    return (
        <div>
            <Box>

                <Box className={classes.bundlebox} >
                    <Typography>
                        Bundle II
                    </Typography>
                </Box>


            </Box>
        </div>
    )
}