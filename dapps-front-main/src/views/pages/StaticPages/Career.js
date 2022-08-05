import React from "react";
import {
  Box,
  Container,
  Button,
  TextField,
  makeStyles,
  Grid,
  Typography,
} from "@material-ui/core";
// import { useHistory } from "react-router";
import Footer from 'src/layouts/HomeLayout/Footer';
// import { position } from "html2canvas/dist/types/css/property-descriptors/position";
const useStyles = makeStyles((theme) => ({
  LoginBox: {
    display: "flex",
    padding: "10px 0px",
    hight:"100vh"
  },

  modaltitel: {
    fontSize: "30px",
    fontWeight: "600",
    marginBottom: "10px",
    textAlign: "center",
    borderBottom: "solid 1px #e5e3dd",
    paddingBottom: "10px",
    color: "#141518",
    [theme.breakpoints.down("sm")]: {
      fontSize: "20px",
    },
  },
  footer:{
      position:"absolute",
      top:"770px",
      width:"100%",
      "@media(max-width:425px)": {
        position:"absolute",
      top:"1350px",
      width:"100%",
      },   
  },
}));
export default function Career() {
  const classes = useStyles();
//   const history = useHistory();
  return (
      <>
    <Box className={classes.LoginBox}>
      {/* <img
        onClick={() => history.push("/")}
        src="images/centerimg.png"
        className="centerimg"
      /> */}
      <Container maxWidth="lg">
        <Typography variant="h3" className={classes.modaltitel}>
          Careers
        </Typography>

        <Box mt={5}>
          <Typography paragraph>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book. It has survived not
            only five centuries, but also the leap into electronic typesetting,
            remaining essentially unchanged. It was popularised in the 1960s
            with the release of Letraset sheets containing Lorem Ipsum passages,
            and more recently with desktop publishing software like Aldus
            PageMaker including versions of Lorem Ipsum.
          </Typography>{" "}
          <Typography paragraph>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book. It has survived not
            only five centuries, but also the leap into electronic typesetting,
            remaining essentially unchanged. It was popularised in the 1960s
            with the release of Letraset sheets containing Lorem Ipsum passages,
            and more recently with desktop publishing software like Aldus
            PageMaker including versions of Lorem Ipsum.
          </Typography>{" "}
          <Typography paragraph>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book. It has survived not
            only five centuries, but also the leap into electronic typesetting,
            remaining essentially unchanged. It was popularised in the 1960s
            with the release of Letraset sheets containing Lorem Ipsum passages,
            and more recently with desktop publishing software like Aldus
            PageMaker including versions of Lorem Ipsum.
          </Typography>
        </Box>
      </Container>
    </Box>
    <div className={classes.footer}> 
    <Footer></Footer>
    </div>
    </>
  );
}

