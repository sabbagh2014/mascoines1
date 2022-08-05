import React, { useState, useContext, useEffect } from "react";
import {
  Grid,
  Container,
  Box,
  Typography,
  makeStyles,
} from "@material-ui/core";
import Bundlecard1 from "src/component/Bundelscard1";
import axios from "axios";
import Apiconfigs from "src/Apiconfig/Apiconfigs";
import { UserContext } from "src/context/User";
import DataLoading from "src/component/DataLoading";
import NoDataFound from "src/component/NoDataFound";
import { useHistory } from "react-router";

const useStyles = makeStyles((theme) => ({
  mass: {
    // width: "114px",
    height: "24.5px",
    textAlign: "center",
    padding: "20px 0px",
    fontFamily: "Poppins",
    fontSize: "21.5px",
    fontWeight: "700",
    fontStretch: "normal",
    fontStyle: "normal",
    lineHeight: "1.51",
    letterSpacing: "normal",
    texAlign: "left",
    color: "#141518",
  },
  LoginBox: {
    // paddingBottom: "50px",
    padding: "50px 0px",
  },
  namemas: {
    // width: "960px",
    // height: "1805.5px",
    padding: "1.5px 0 0",
    backgroundColor: "var(--white)",
    display: "flex",
    justifyContent: "center",
  },
  search: {
    border: "0.5px solid #e5e3dd",
    display: "flex",
    alignItems: "center",
    borderRadius: "6.5px",
  },
  box: {
    paddingleft: "0",
    flexWrap: "inherit",
  },
  gridbox: {
    "@media(max-width:1280px)": {
      display: "flex",
      justifyContent: "center",
    },
  },
}));

const AllBundlesPage = () => {
  const classes = useStyles();
  const auth = useContext(UserContext);
  const [allNFTList, setAllNFTList] = useState([]);
  console.log("allNFTList", allNFTList);
  const [isLoading, setIsLoading] = useState(true);

  const listAllNftHandler = async () => {
    await axios({
      method: "GET",
      url: Apiconfigs.listAllNft,
      headers: {
        // token: window.localStorage.getItem('token'),
      },
    })
      .then(async (res) => {
        if (res.data.statusCode === 200) {
          console.log(res.data.result);
          setAllNFTList(res.data.result);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);

        console.log(err.message);
      });
  };

  useEffect(() => {
    if (auth.userData?._id && auth.userLoggedIn) {
      listAllNftHandler();
    }
  }, [auth.userLoggedIn, auth.userData]);

  return (
    <Box className={classes.LoginBox}>
      {isLoading ? (
        <DataLoading />
      ) : (
        <section>
          {auth.userLoggedIn && auth.userData?._id && (
            <>
              <div className={classes.namemas}>
                <Typography className={classes.mass}>ALL BUNDLES</Typography>
              </div>
              <Container maxWidth="lg">
                {allNFTList.length === 0 ? (
                  <Box align="center" mt={4} mb={5}>
                    <NoDataFound />
                  </Box>
                ) : (
                  ""
                )}
                <Grid container spacing={2}>
                  {allNFTList.map((data, i) => {
                    console.log("i????????????/", i);
                    console.log("data", data);

                    return (
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                        lg={3}
                        className={classes.gridbox}
                      >
                        <Bundlecard1
                          data={data}
                          index={i}
                          callbackFn={listAllNftHandler}
                        />
                      </Grid>
                    );
                  })}
                </Grid>
              </Container>
            </>
          )}
        </section>
      )}
    </Box>
  );
};

export default AllBundlesPage;
