import { Box, Typography, Button } from "@material-ui/core";
import React from "react";
import { useHistory } from "react-router-dom";
import Page from "src/component/Page";
import { Link } from "react-router-dom";
export default function NotFound(props) {
  const history = useHistory();
  return (
    <Page title="page not found!">
      <Box pt={20} textAlign="center">
      <Link to="/home">
      <img src="images/404.png"/> <br/>
     
      <Typography variant="h3" style={{color:"#000", marginTop:"10px",}}>Page requested not found</Typography>
        </Link>
      </Box>
    </Page>
  );
}
