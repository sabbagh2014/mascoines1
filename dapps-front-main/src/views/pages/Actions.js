import React, { useState, useContext, useEffect } from "react";
import {
  Grid,
  Container,
  Box,
  Typography,
  makeStyles,
} from "@material-ui/core";
import NFTCard from "src/component/NFTCard";
import Bundlecard1 from "src/component/Bundelscard1";
import AuctionCard from "src/component/AuctionCard";
import { InputBase } from "@material-ui/core";
import { Search } from "@material-ui/icons";
import Slider from "react-slick";
import axios from "axios";
import Apiconfigs from "src/Apiconfig/Apiconfigs";
import { UserContext } from "src/context/User";
import DataLoading from "src/component/DataLoading";
import UserDeatilsCard from "src/component/UserDeatilsCard";
import { FaSearch } from "react-icons/fa";
import NoDataFound from "src/component/NoDataFound";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";

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
}));
const dummyCardData = [
  {
    mediaUrl: "images/feed1.png",
    duration: "20Days",
    title: "dummyNFT",
    subscriberCount: "5",
    userId: {
      name: "Chirag Varshney",
      profilePic: "images/icon.png",
    },
    startingBid: "0.01",
    donationAmount: "2",
  },
];
const AuctionPage = () => {
  const classes = useStyles();
  const auth = useContext(UserContext);
  const history = useHistory();
  const [auctionList, setAuctionList] = useState([]);
  const [allNFTList, setAllNFTList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userListToDisplay, setUserListToDisplay] = useState([]);
  const settings = {
    dots: false,
    slidesToShow: 4,
    slidesToScroll: 4,
    arrows: true,
    centerMode: false,
    // centerPadding: "60px",
    // className: "recomended",
    autoplay: false,
    autoplaySpeed: 3000,
    infinite: false,
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
          slidesToScroll: 2,
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

  const auctionNftListHandler = async () => {
    await axios({
      method: "GET",
      url: Apiconfigs.allorder,
      headers: {
        token: window.localStorage.getItem("token"),
      },
    })
      .then(async (res) => {
        if (res.data.statusCode === 200) {
          if (res.data.result) {
            setAuctionList(res.data.result);
          }
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

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

  const getuser = async () => {
    axios({
      method: "GET",
      url: Apiconfigs.latestUserList,
      params: {
        limit: 10,
        userType: "Creator",
      },
      headers: {
        token: window.localStorage.getItem("token"),
      },
    })
      .then(async (res) => {
        setIsLoading(false);
        if (res.data.statusCode === 200) {
          if (res.data.result.docs) {
            setUserListToDisplay(res.data.result.docs);
          }
        }
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    // if (auth.userData?._id && auth.userLoggedIn) {
    auctionNftListHandler();
    listAllNftHandler();
    // }
  }, []);

  useEffect(() => {
    getuser();
  }, []);

  return (
    <Box className={classes.LoginBox}>
      {isLoading ? (
        <DataLoading />
      ) : (
        <section>
          {auth.userLoggedIn && auth.userData?._id && (
            <>
              <div className={classes.namemas} id="home_auction">
                <Typography className={classes.mass}>Auction</Typography>
              </div>
              <Container maxWidth="lg">
                {auctionList.length === 0 ? (
                  <Box align="center" mt={4} mb={5}>
                    <NoDataFound />
                  </Box>
                ) : (
                  ""
                )}
                <Grid container spacing={2}>
                  {auctionList.map((data, i) => {
                    return (
                      <Grid item xs={12} sm={6} md={4}>
                        <NFTCard data={data} index={i} />
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

export default AuctionPage;
