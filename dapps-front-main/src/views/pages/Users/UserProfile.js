import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  makeStyles,
  Typography,
  Grid,
} from "@material-ui/core";
import Profile from "src/views/pages/NFTDetail/Profile";
import SubscribtionsCard from "src/component/SubscribtionsCard";
import BundlesCard from "src/component/Bundelscard1.js";
import Slider from "react-slick";
import { useContext } from "react";
import { UserContext } from "src/context/User";
import Apiconfigs from "src/Apiconfig/Apiconfigs";
import axios from "axios";
import DataLoading from "src/component/DataLoading";
import { useLocation } from "react-router";
import NoDataFound from "src/component/NoDataFound";
const useStyles = makeStyles((theme) => ({
  welcomeback: {
    width: "194.5px",
    height: "18px",
    margin: "13.8px 1px 24.5px 10px",
    fontFamily: "Poppins",
    fontSize: "20px",
    fontWeight: "600",
    fontStretch: "normal",
    fontStyle: "normal",
    lineHeight: "1.5",
    letterSpacing: "normal",
    textAlign: "left",
    color: "#000",
  },
  border: {
    border: "2px solid black",
    width: "fit-content",
  },
  Bids: {
    display: "flex",
    flexDirection: "column",
  },
  center: {
    display: "flex",
    justifyContent: "center",
    marginTop: "30px",
    marginBottom: "20px",
    color: "#000000",
  },
  LoginBox: {
    paddingBottom: "50px",
  },
  displayCard: {
    width: "fit-content",
  },
}));

function UserProfile(props) {
  const classes = useStyles();

  const settings = {
    dots: false,
    slidesToShow: 4,
    slidesToScroll: 3,
    arrows: true,
    centerMode: true,
    centerPadding: "60px",
    className: "recomended",
    autoplay: false,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          centerMode: false,
          centerPadding: "0",
          autoplay: false,
        },
      },

      {
        breakpoint: 800,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          centerMode: false,
          centerPadding: "0",
          autoplay: false,
        },
      },
      {
        breakpoint: 450,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerMode: false,
          centerPadding: "0",
          autoplay: false,
        },
      },
    ],
  };
  const [subscriptions, setSubscription] = useState([]);
  const [isLoadingSubcription, setIsLoadingSubcription] = useState(false);
  const [isLoadingBundles, setIsLoadingBundles] = useState(false);
  const [userDetails, setUserDetails] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const auth = useContext(UserContext);

  const search = auth?.search;
  const setsearch = auth?.setsearch;
  const [bundles, setBundles] = useState([]);
  const location = useLocation();

  const getDetails = async (selectedUserID) => {
    let header = {};
    if (window.localStorage.getItem("token")) {
      header = {
        token: window.localStorage.getItem("token"),
      };
    }
    setIsLoading(true);
    await axios({
      method: "GET",
      url:
        Apiconfigs.getUser +
        props.location.search.substring(1, location.search.length),
      headers: header,
    })
      .then(async (res) => {
        if (res.data.statusCode === 200) {
          console.log("getDetails", res.data.result);
          setUserDetails(res.data.result[0]);
          setsearch("");
        }
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);

        console.log(err.message);
      });
  };

  useEffect(() => {
    const id = location.search.substring(1, location.search.length);
    if (props.location.search.substring(1, location.search.length)) {
      getDetails(id);
    }
  }, [props.location.search.substring(1, location.search.length)]);

  const likeDislikeNfthandler = async (id) => {
    try {
      const res = await axios.get(Apiconfigs.likeDislikeNft + id, {
        headers: {
          token: window.localStorage.getItem("token"),
        },
      });
    } catch (error) {
      console.log("ERROR", error);
    }
  };

  useEffect(() => {
    getDetails();
  }, []);

  return (
    <Box className={classes.LoginBox}>
      {isLoading && !userDetails ? (
        <DataLoading />
      ) : (
        <>
          <Profile data={userDetails} isabout={true} />
          <Container maxWidth="xl">
            <Box>
              <div className={classes.center}>
                <Typography variant="h2" alignItems="center">
                  Bundles
                </Typography>
              </div>
              {isLoadingBundles && <DataLoading />}
              {!isLoadingBundles && userDetails?.bundleDetails?.length === 0 ? (
                <Box align="center" mt={4} mb={5}>
                  <NoDataFound />
                </Box>
              ) : (
                ""
              )}
              {userDetails?.bundleDetails?.length >= 4 ? (
                <Slider {...settings} className="width100">
                  {userDetails?.bundleDetails?.map((data, i) => {
                    return <BundlesCard data={data} index={i} />;
                  })}
                </Slider>
              ) : (
                <Grid container spacing={3}>
                  {userDetails?.bundleDetails?.map((data, i) => {
                    return (
                      <Grid item lg={3} sm={4} md={3} xs={12}>
                        <BundlesCard data={data} index={i} isDays={true} />
                      </Grid>
                    );
                  })}
                </Grid>
              )}
            </Box>
          </Container>
        </>
      )}
    </Box>
  );
}

export default UserProfile;
