import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  makeStyles,
  Typography,
  Grid,
} from "@material-ui/core";
import Profile from "src/views/pages/Profile/Profile";
import SubscribtionsCard from "src/component/SubscribtionsCard";
import BundlesCard from "src/component/BundlesCard";
import Slider from "react-slick";
import { useContext } from "react";
import { UserContext } from "src/context/User";
import Apiconfigs from "src/Apiconfig/Apiconfigs";
import axios from "axios";
import DataLoading from "src/component/DataLoading";
import NoDataFound from "src/component/NoDataFound";
import { toast } from "react-toastify";
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

function Bids(props) {
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

  const auth = useContext(UserContext);
  useEffect(() => {
    auth.updatetoken(window.localStorage.getItem("token"));
  }, []);

  const subscription = async () => {
    setIsLoadingSubcription(true);
    await axios({
      method: "GET",
      url: Apiconfigs.mysubscription,
      headers: {
        token: window.localStorage.getItem("token"),
      },
    })
      .then(async (res) => {
        if (res.data.statusCode === 200) {
          setIsLoadingSubcription(false);
          setSubscription(res.data.result);
        }
      })
      .catch((err) => {
        setIsLoadingSubcription(false);

        console.log(err.message);
      });
  };
  useEffect(() => {
    subscription();
  }, []);

  const [bundles, setBundles] = useState([]);

  const bundle = async () => {
    setIsLoadingBundles(true);
    await axios({
      method: "GET",
      url: Apiconfigs.myauction,
      headers: {
        token: window.localStorage.getItem("token"),
      },
    })
      .then(async (res) => {
        setIsLoadingBundles(false);

        if (res.data.statusCode === 200) {
          setBundles(res.data.result);
        }
      })
      .catch((err) => {
        setIsLoadingBundles(false);

        console.log(err.message);
      });
  };
  useEffect(() => {
    bundle();
  }, []);

  const likeDislikeNfthandler = async (id) => {
    try {
      const res = await axios.get(Apiconfigs.likeDislikeNft + id, {
        headers: {
          token: window.localStorage.getItem("token"),
        },
      });
      if (res.data.statusCode === 200) {
        toast.success(res.data.responseMessage);

        bundle();
      } else {
        toast.error(res.data.responseMessage);
      }
      subscription();
    } catch (error) {
      console.log("ERROR", error);
    }
  };

  return (
    <Box className={classes.LoginBox}>
      {/* {auth?.userData?.userType === "User" ? <Profile /> : ""} */}
      <Profile />
      <Container maxWidth="xl">
        <Box>
          <div className={classes.center}>
            <Typography variant="h2" alignself="center">
              Your Subscription
            </Typography>
          </div>
          {isLoadingSubcription && <DataLoading />}
          {!isLoadingSubcription && subscriptions.length === 0 ? (
            <NoDataFound />
          ) : (
            ""
          )}
          {subscriptions.length >= 4 ? (
            <Slider {...settings} className="width100">
              {subscriptions.map((data, i) => {
                return (
                  <SubscribtionsCard
                    data={data}
                    index={i}
                    likeDislikeNfthandler={(id) => likeDislikeNfthandler(id)}
                  />
                );
              })}
            </Slider>
          ) : (
            <Grid container spacing={3}>
              {subscriptions.map((data, i) => {
                return (
                  <Grid item lg={3} sm={4} md={3} xs={12}>
                    <SubscribtionsCard
                      data={data}
                      index={i}
                      likeDislikeNfthandler={(id) => likeDislikeNfthandler(id)}
                    />
                  </Grid>
                );
              })}
            </Grid>
          )}
        </Box>

        {auth?.userData?.userType !== "User" ? (
          <Box>
            <div className={classes.center}>
              <Typography variant="h2" alignItems="center">
                Your Bundles
              </Typography>
            </div>
            {isLoadingBundles && <DataLoading />}
            {!isLoadingBundles && bundles.length === 0 ? <NoDataFound /> : ""}
            {bundles.length >= 4 ? (
              <Slider {...settings} className="width100">
                {bundles.map((data, i) => {
                  return <BundlesCard data={data} index={i} />;
                })}
              </Slider>
            ) : (
              <Grid container spacing={3}>
                {bundles.map((data, i) => {
                  return (
                    <Grid item lg={3} sm={4} md={3} xs={12}>
                      <BundlesCard data={data} index={i} isDays={true} />
                    </Grid>
                  );
                })}
              </Grid>
            )}
          </Box>
        ) : (
          ""
        )}
      </Container>
    </Box>
  );
}

export default Bids;
