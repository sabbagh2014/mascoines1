import React, { useState } from "react";
import { Box, Container, Typography, makeStyles, Button, Grid } from "@material-ui/core";
import Page from "src/component/Page";
import { mergeClasses } from "@material-ui/styles";
import Auction from "./Auction";
import Feed from "./Feed";

const useStyles = makeStyles((theme) => ({
    Padding_Top: {
        paddingTop: "50px",
        backgroundColor: "#fff",
    },
    PageHeading: {
        fontWeight: "500",
        fontSize: "32px",
        lineHeight: "39px",
        color: "#000",
        paddingBottom: "10px",
    },
}));
function Activity(props) {
    const classes = useStyles();
    const [tabview, setTabView] = useState("feed");
    return (
        <Page title="Marketplace for NFTs">
            <Box className={classes.Padding_Top}>
                <Container maxWidth="xl">
                    <Box className="TabButtonsBox">
                        <Button  className={tabview === "feed" ? "active" : " "} onClick={() => setTabView("feed")}>My feed</Button>
                        <Button  className={tabview === "auctions" ? "active" : " "} onClick={() => setTabView("auctions")}>My auctions</Button>
                    </Box>
                <Box className="TabButtonsContant">
                    {tabview === "feed" ? (  <Feed/>):('')}
                    {tabview === "auctions" ? (  <Auction/>):('')}
                    </Box>
                </Container>
            </Box>
        </Page>
    );
}

export default Activity;
