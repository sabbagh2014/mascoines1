import React, { useState, useEffect, useRef, useContext } from "react";
import {
  Box,
  Container,
  Button,
  TextField,
  Typography,
  makeStyles,
  Grid,
  Input,
  Dialog,
  DialogContent,
  DialogTitle,
  InputAdornment,
  DialogActions,
  FormHelperText,
} from "@material-ui/core";
import { getContract, getWallet, getContractWallet } from "src/utils";
import moment from "moment";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import NFTCard from "src/component/NFTCard";
import axios from "axios";
import Apiconfigs from "src/Apiconfig/Apiconfigs";
import { UserContext } from "src/context/User";
import ButtonCircularProgress from "src/component/ButtonCircularProgress";
import NoDataFound from "src/component/NoDataFound";
import { toast } from "react-toastify";
import {
  OpenMarketplace,
  massToken,
  WBTCToken,
  USDTToken,
  NFTTokenContract,
  ACTIVE_NETWORK,
  NetworkContextName,
} from "src/constants/index";
import { useWeb3React } from "@web3-react/core";
import OpenMarketplaceABI from "src/abis/OpenMarketplaceABI.json";
import NFTokenABI from "src/abis/NFTokenABI.json";
import { ethers } from "ethers";

const useStyles = makeStyles((theme) => ({
  input_fild: {
    backgroundColor: "#ffffff6e",
    borderRadius: "5.5px",
    border: " solid 0.5px #e5e3dd",
    color: "#141518",
    height: "48px",
    width: "100%",
    maxWidth: "500px",
    margin: "0 auto",
    borderRadius: "20px",
    "&:hover": {
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "transparent",
      },
    },
    "& .MuiInputBase-input": {
      color: "#141518",
    },
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "transparent",
      borderWidth: 0,
    },
  },
  LoginBox: {
    paddingTop: "20px",
    "& h6": {
      fontWeight: "bold",
      marginBottom: "10px",
      fontSize: "20px",
      color: "#000",
      "& span": {
        fontWeight: "300",
      },
    },
  },
  TokenBox: {
    border: "solid 0.5px #e5e3dd",
    padding: "5px",
  },
  masBoxFlex: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
  },
  dailogTitle: {
    textAlign: "Center",
    "& h2": {
      color: "#141518",
      fontSize: "23px",
    },
  },
  input_fild2: {
    width: "100%",
    "& input": {
      // height: '45px',
    },
  },
  UploadBox: {
    border: "solid 0.5px #707070",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "110px",
  },
  input_fild22: {
    width: "100%",
    "& input": {
      // height: '45px',
      border: 0,
    },
    "& .MuiInput-underline:before": {
      border: 0,
    },
  },
  dlflex: {
    "& div": {
      // marginTop: '2rem',
      margin: "0px",
      width: "100%",
      "& span": {
        border: "1px solid #e8e7e7",
        fontSize: "20px",
        padding: "7px",
        marginRight: "6px",
      },
    },
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
}));

export default function Login({ auction, updateList }) {
  const classes = useStyles();
  const { account, library, chainId } = useWeb3React();
  const auth = useContext(UserContext);
  const [OpenAuction, setOpenAuction] = useState(false);
  const [name, setname] = useState("");
  const [date, setdate] = useState(moment().format("YYYY-MM-DDThh:mm"));
  const [image, setimage] = useState();
  const [imageurl, setimageurl] = useState("");
  const [detail, setdetail] = useState("");
  const [bid, setbid] = useState("");
  const [process, setprocess] = useState(false);
  const [message, setmessage] = useState("");
  const privateKey = auth?.userData?.ethAccount?.privateKey;
  const [fire, setfire] = useState(false);
  const [importNFtPop, setImportNFTPop] = useState(false);
  // console.log('userData****', auth?.userData)
  const placeOrder = async () => {
    // if (chainId == ACTIVE_NETWORK) {
    if (name === "") {
      toast.error("Empty Name");
      return;
    }
    if (date === "") {
      toast.error("Empty Date");
      return;
    }
    if (!image) {
      toast.error("Empty Image");
      return;
    }
    if (detail === "") {
      toast.error("Empty Details");
      return;
    }
    if (bid === "") {
      toast.error("Empty Bid");
      return;
    }
    setmessage("Uploading ipfs");
    setprocess(true);
    try {
      const formdataipfsupload = new FormData();
      formdataipfsupload.append("file", image);

      const res = await axios.post(
        Apiconfigs.ipfsupload,
        formdataipfsupload,
        {
          headers: {
            token: window.localStorage.getItem("token"),
          },
        }
      );

      if (res.data.statusCode === 200) {
        // const walletProvider = getWallet(privateKey)
        // const NFTcontract = getContractWallet(
        //   NFTTokenContract,
        //   NFTokenABI,
        //   walletProvider,
        // )
        // setmessage('Creating NFT')
        // const createRes = await NFTcontract.create(
        //   res.data.result.imageUrl,
        //   name,
        //   { gasLimit: 300000 },
        // )
        // await createRes.wait()
        // const tokenId = await NFTcontract.totalSupply()
        // let tokenNumber = parseInt(tokenId.toString()) - 1
        const createNFTBody = {
          mediaUrl: res.data.result.imageUrl,
          mediaType: image?.name ? image.name.split(".").pop() : "png",
          title: name,
          time: date,
          // tokenId: tokenNumber.toString(),
          tokenId: "N/A",
          network: ACTIVE_NETWORK.toString(),
          startingBid: bid.toString(),
          tokenName: name,
          details: detail,
        };

        const createNFTRes = await axios.post(
          Apiconfigs.createNft,
          createNFTBody,
          {
            headers: {
              token: window.localStorage.getItem("token"),
            },
            data: {
              mediaUrl: res.data.result.imageUrl,
              mediaType: image?.name ? image.name.split(".").pop() : "png",
              title: name,
              time: date,
              // tokenId: tokenNumber.toString(),
              tokenId: "N/A",
              network: ACTIVE_NETWORK.toString(),
              startingBid: bid.toString(),
              tokenName: name,
              details: detail,
            },
          }
        );
        if (createNFTRes.data.result._id) {
          setmessage("Approving token");

          // const approveRes = await NFTcontract.approve(
          //   OpenMarketplace,
          //   tokenNumber,
          // )
          // await approveRes.wait()

          // const contract = getContractWallet(
          //   OpenMarketplace,
          //   OpenMarketplaceABI,
          //   walletProvider,
          // )
          // setmessage('Placing order')
          // const createOrderRes = await contract.createOrder(
          //   NFTTokenContract,
          //   tokenNumber,
          //   ethers.utils.parseEther(bid.toString()),
          //   moment(date).unix(),
          //   { gasLimit: 300000 },
          // )
          // await createOrderRes.wait()
          const createOrderBody = {
            title: name,
            time: date,
            // tokenId: tokenNumber.toString(),
            tokenId: "N/A",
            network: ACTIVE_NETWORK.toString(),
            startingBid: bid.toString(),
            tokenName: name,
            details: detail,
            nftId: createNFTRes.data.result._id,
          };
          axios({
            method: "POST",
            url: Apiconfigs.order,
            data: createOrderBody,
            headers: {
              token: window.localStorage.getItem("token"),
            },
          }).then(async (res) => {
            if (res.data.statusCode === 200) {
              auth.updateUserData();
              updateList();
              setprocess(false);
              toast.success("Your order has been placed successfully");
              setfire(!fire);
              setOpenAuction(false);
            } else if (res.data.statusCode === 404) {
              setprocess(false);
              toast.error("error");
            } else {
              setprocess(false);
              toast.error("error");
            }
          });
        } else {
          setprocess(false);
          toast.error(createNFTRes.data.message);
        }
      } else {
        setprocess(false);
        toast.error(res.data.responseMessage);
      }
    } catch (error) {
      setprocess(false);
      toast.error(error.message);
      console.log(error);
    }

    // } else {
    //   toast.error(`Please switch network ${NetworkContextName}`)
    // }
  };

  const placeAuctionOrder = async () => {
    if (chainId == ACTIVE_NETWORK) {
      if (name === "") {
        toast.error("Empty Name");
        return;
      }
      if (date === "") {
        toast.error("Empty Date");
        return;
      }
      if (!image) {
        toast.error("Empty Image");
        return;
      }
      if (detail === "") {
        toast.error("Empty Details");
        return;
      }
      if (bid === "") {
        toast.error("Empty Bid");
        return;
      }
      setmessage("Uploading ipfs");
      setprocess(true);
      try {
        const formdataipfsupload = new FormData();
        formdataipfsupload.append("file", image);

        const res = await axios.post(
          Apiconfigs.ipfsupload,
          formdataipfsupload,
          {
            headers: {
              token: window.localStorage.getItem("token"),
            },
          }
        );

        if (res.data.statusCode === 200) {
          // toast.success("ipfs");

          setmessage("Creating NFT");
          const createNFTBody = {
            mediaUrl: res.data.result.imageUrl,
            mediaType: image?.name ? image.name.split(".").pop() : "png",
            title: name,
            time: date,
            // tokenId: tokenNumber.toString(),
            network: ACTIVE_NETWORK.toString(),
            startingBid: bid.toString(),
            tokenName: name,
            details: detail,
          };

          const createNFTRes = await axios.post(
            Apiconfigs.createNft,
            createNFTBody,
            {
              headers: {
                token: window.localStorage.getItem("token"),
              },
            }
          );
          if (createNFTRes.data.result._id) {
            setmessage("Approving token");

            setmessage("Placing order");
            const createOrderBody = {
              title: name,
              time: date,
              // tokenId: tokenNumber.toString(),
              network: ACTIVE_NETWORK.toString(),
              startingBid: bid.toString(),
              tokenName: name,
              details: detail,
              nftId: createNFTRes.data.result._id,
            };
            axios({
              method: "POST",
              url: Apiconfigs.order,
              data: createOrderBody,
              headers: {
                token: window.localStorage.getItem("token"),
              },
            })
              .then(async (res) => {
                if (res.data.statusCode === 200) {
                  auth.updateUserData();
                  updateList();
                  console.log(res);
                  setprocess(false);
                  toast.success("Order Placed");
                  setfire(!fire);
                  setOpenAuction(false);
                } else if (res.data.statusCode === 404) {
                  setprocess(false);
                  toast.error("error");
                } else {
                  setprocess(false);
                  toast.error("error");
                }
              })
              .catch((err) => {
                setprocess(false);
                console.log(err.message);
                toast.error("error");
              });
          } else {
            setprocess(false);
            toast.error(createNFTRes.data.message);
          }
        } else {
          setprocess(false);
          toast.error(res.data.responseMessage);
        }
      } catch (error) {
        setprocess(false);
        toast.error(error.message);
      }
    } else {
      toast.error(`Please switch network ${NetworkContextName}`);
    }
  };
  useEffect(() => {
    if (auth.isErrorInWalletConnect && auth.connectWalletError) {
      toast.error(auth.connectWalletError);
    }
  }, [auth.isErrorInWalletConnect, auth.connectWalletError]);

  return (
    <Box className={classes.LoginBox} mb={5}>
      <Box className={classes.masBoxFlex}>
        <Typography variant="h6">My Auctions</Typography>

        {auth?.userData?.userType === "Creator" && (
          <Box>
            <Button
              variant="contained"
              size="large"
              color="secondary"
              className="ml-10"
              onClick={() => setOpenAuction(true)}
            >
              Make a new auction
            </Button>
            {/* <Button
              variant="contained"
              size="large"
              color="secondary"
              className="ml-10"
              onClick={() => setImportNFTPop(true)}
            >
              Import NFT
            </Button> */}
          </Box>
        )}
      </Box>

      <Box maxWidth="lg">
        {!auction[0] ? (
          <Box align="center" mt={4} mb={5}>
            <NoDataFound />
          </Box>
        ) : (
          ""
        )}
        <Grid container spacing={4}>
          {auction.map((data, i) => {
            return (
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <NFTCard data={data} index={i} />
              </Grid>
            );
          })}
        </Grid>
      </Box>
      {OpenAuction && (
        <Dialog
          fullWidth="sm"
          maxWidth="sm"
          open={OpenAuction}
          // onClose={() => setOpenAuction(false)}
          aria-labelledby="max-width-dialog-title"
          disableBackdropClick={process}
          disableEscapeKeyDown={process}
        >
          <DialogTitle className={classes.dailogTitle}>
            Make a new auction
          </DialogTitle>
          <DialogContent>
            {auth.isErrorInWalletConnect && (
              <Box mb={3}>
                <FormHelperText error>{auth.connectWalletError}</FormHelperText>
              </Box>
            )}
            <Box>
              <Grid container spacing={2}>
                <Grid item xs={12} md={12}>
                  <label style={{ margin: "0px", padding: "0px" }}>
                    {" "}
                    Title:
                  </label>
                  <TextField
                    id="standard-basic"
                    placeholder=""
                    className={classes.input_fild2}
                    onChange={(e) => setname(e.target.value)}
                  />
                </Grid>
              </Grid>
            </Box>
            <Box mb={2}>
              <Grid container spacing={0}>
                <Grid item xs={12} md={12}>
                  <label>Upload a photo or video:</label>
                </Grid>
                <Grid item xs={12} md={12}>
                  <Box className={classes.UploadBox}>
                    {/* <input
                        accept="image/*"
                        style={{ display: "none" }}
                        id="raised-button-file"
                        multiple
                        type="file"
                        onChange={(e) => setimage(e.target.value)}
                      /> */}
                    <label htmlFor="raised-button-file">
                      <input
                        accept="image/*,video/mp4"
                        style={{ display: "none" }}
                        className={classes.input}
                        id="contained-button-file"
                        multiple
                        onChange={(e) => {
                          setimage(e.target.files[0]);
                          setimageurl(URL.createObjectURL(e.target.files[0]));
                        }}
                        type="file"
                      />
                      {imageurl ? (
                        <>
                          <img src={imageurl} alt="" width="200px" />
                          <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                          >
                            <Button
                              color="primary"
                              size="large"
                              variant="contained"
                              onClick={() => {
                                setimage("");
                                setimageurl("");
                              }}
                            >
                              Remove
                            </Button>
                          </Box>
                        </>
                      ) : (
                        <label htmlFor="contained-button-file">
                          <Button
                            variant="outined"
                            color="primary"
                            component="span"
                          >
                            Upload &nbsp;
                            <CloudUploadIcon />
                          </Button>
                        </label>
                      )}
                    </label>
                  </Box>
                </Grid>
              </Grid>
            </Box>
            <Box mb={2}>
              <Grid container spacing={0}>
                <Grid item xs={12} md={12}>
                  <label>Details:</label>
                </Grid>
                <Grid item xs={12} md={12}>
                  <Box className={classes.UploadBox}>
                    <TextField
                      id="standard-basic"
                      placeholder=""
                      className={classes.input_fild22}
                      multiline
                      maxRows={6}
                      rows={6}
                      onChange={(e) => setdetail(e.target.value)}
                      style={{ padding: "0px 10px" }}
                    />
                  </Box>
                </Grid>
              </Grid>
            </Box>
            <Box mb={2}>
              <Grid container spacing={0}>
                <Grid item xs={12} md={4}>
                  <label>Expiry time:</label>
                </Grid>
                <Grid item xs={12} md={8} className={classes.dlflex}>
                  <TextField
                    id="datetime-local"
                    onChange={(e) => setdate(e.target.value)}
                    value={date}
                    type="datetime-local"
                    // defaultValue='2021-09-12T23:08'
                    inputProps={{ min: moment().format("YYYY-MM-DDThh:mm") }}
                    className={classes.textField}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    fullWidth
                  />
                </Grid>
              </Grid>
            </Box>
            <Box mb={2}>
              <Grid container spacing={0}>
                <Grid item xs={12} md={4}>
                  <label>Starting bid:</label>
                </Grid>
                <Grid item xs={12} md={8}>
                  <Input
                    placeholder=""
                    className={classes.input_fild2}
                    type="number"
                    onChange={(e) => setbid(e.target.value)}
                    onKeyPress={(event) => {
                      if (event?.key === "-" || event?.key === "+") {
                        event.preventDefault();
                      }
                    }}
                    endAdornment={
                      <InputAdornment position="end">MAS</InputAdornment>
                    }
                  />
                </Grid>
              </Grid>
            </Box>
            {auth.isErrorInWalletConnect && (
              <Box mb={3}>
                <FormHelperText error>{auth.connectWalletError}</FormHelperText>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Box>
              <Button
                variant="contained"
                onClick={() => setOpenAuction(false)}
                color="primary"
                size="large"
                disabled={process}
              >
                cancel
              </Button>
              &nbsp;&nbsp;
              {/* {account ? ( */}
              <Button
                variant="contained"
                onClick={
                  placeOrder
                  // placeAuctionOrder
                  // setOpenAuction(false)
                }
                color="secondary"
                size="large"
                disabled={process}
              >
                {!process ? "Place Auction" : message}
                {process && <ButtonCircularProgress />}
              </Button>
              {/* ) : (
                <Button
                  variant="contained"
                  onClick={() => auth.connectWallet()}
                  color="secondary"
                  size="large"
                  disabled={process}
                >
                  Connect Wallet
                </Button>
              )} */}
            </Box>
          </DialogActions>
        </Dialog>
      )}
      {importNFtPop && (
        <Dialog
          fullWidth="sm"
          maxWidth="sm"
          open={importNFtPop}
          onClose={() => setImportNFTPop(false)}
          aria-labelledby="max-width-dialog-title"
          disableBackdropClick={process}
          disableEscapeKeyDown={process}
        >
          <DialogTitle className={classes.dailogTitle}>Import NFT</DialogTitle>
          <DialogContent>
            {auth.isErrorInWalletConnect && (
              <Box mb={3}>
                <FormHelperText error>{auth.connectWalletError}</FormHelperText>
              </Box>
            )}
            <Box>
              <Grid container spacing={2}>
                <Grid item xs={12} md={12}>
                  <label style={{ margin: "0px", padding: "0px" }}>
                    {" "}
                    Title:
                  </label>
                  <TextField
                    id="standard-basic"
                    placeholder=""
                    className={classes.input_fild2}
                    onChange={(e) => setname(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} md={12}>
                  <label style={{ margin: "0px", padding: "0px" }}>
                    {" "}
                    Contract Adress:
                  </label>
                  <TextField
                    id="standard-basic"
                    placeholder=""
                    className={classes.input_fild2}
                    onChange={(e) => setname(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} md={12}>
                  <label style={{ margin: "0px", padding: "0px" }}>
                    {" "}
                    Token id:
                  </label>
                  <TextField
                    id="standard-basic"
                    placeholder=""
                    className={classes.input_fild2}
                    onChange={(e) => setname(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} md={12}>
                  <label style={{ margin: "0px", padding: "0px" }}>
                    {" "}
                    NFT URL:
                  </label>
                  <TextField
                    id="standard-basic"
                    placeholder=""
                    className={classes.input_fild2}
                    onChange={(e) => setname(e.target.value)}
                  />
                </Grid>
              </Grid>
            </Box>
            <Box mb={2}>
              <Grid container spacing={0}>
                <Grid item xs={12} md={12}>
                  <label>Upload a photo or video:</label>
                </Grid>
                <Grid item xs={12} md={12}>
                  <Box className={classes.UploadBox}>
                    {/* <input
                        accept="image/*"
                        style={{ display: "none" }}
                        id="raised-button-file"
                        multiple
                        type="file"
                        onChange={(e) => setimage(e.target.value)}
                      /> */}
                    <label htmlFor="raised-button-file">
                      <input
                        accept="image/*,video/mp4"
                        style={{ display: "none" }}
                        className={classes.input}
                        id="contained-button-file"
                        multiple
                        onChange={(e) => {
                          setimage(e.target.files[0]);
                          setimageurl(URL.createObjectURL(e.target.files[0]));
                        }}
                        type="file"
                      />
                      {imageurl ? (
                        <>
                          <img src={imageurl} alt="" width="200px" />
                          <Box>
                            <Button
                              variant="outined"
                              color="primary"
                              component="span"
                            >
                              Uploaded Successfully
                            </Button>
                          </Box>
                        </>
                      ) : (
                        <label htmlFor="contained-button-file">
                          <Button
                            variant="outined"
                            color="primary"
                            component="span"
                          >
                            Upload &nbsp;
                            <CloudUploadIcon />
                          </Button>
                        </label>
                      )}
                    </label>
                  </Box>
                </Grid>
              </Grid>
            </Box>
            <Box mb={2}>
              <Grid container spacing={0}>
                <Grid item xs={12} md={12}>
                  <label>Details:</label>
                </Grid>
                <Grid item xs={12} md={12}>
                  <Box className={classes.UploadBox}>
                    <TextField
                      id="standard-basic"
                      placeholder=""
                      className={classes.input_fild22}
                      multiline
                      maxRows={6}
                      rows={6}
                      onChange={(e) => setdetail(e.target.value)}
                      style={{ padding: "0px 10px" }}
                    />
                  </Box>
                </Grid>
              </Grid>
            </Box>
            <Box mb={2}>
              <Grid container spacing={0}>
                <Grid item xs={12} md={4}>
                  <label>Expiry time:</label>
                </Grid>
                <Grid item xs={12} md={8} className={classes.dlflex}>
                  <TextField
                    id="datetime-local"
                    onChange={(e) => setdate(e.target.value)}
                    value={date}
                    type="datetime-local"
                    // defaultValue='2021-09-12T23:08'
                    inputProps={{ min: moment().format("YYYY-MM-DDThh:mm") }}
                    className={classes.textField}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    fullWidth
                  />
                </Grid>
              </Grid>
            </Box>
            <Box mb={2}>
              <Grid container spacing={0}>
                <Grid item xs={12} md={4}>
                  <label>Starting bid:</label>
                </Grid>
                <Grid item xs={12} md={8}>
                  <Input
                    placeholder=""
                    className={classes.input_fild2}
                    type="number"
                    onChange={(e) => setbid(e.target.value)}
                    onKeyPress={(event) => {
                      if (event?.key === "-" || event?.key === "+") {
                        event.preventDefault();
                      }
                    }}
                    endAdornment={
                      <InputAdornment position="end">MAS</InputAdornment>
                    }
                  />
                </Grid>
              </Grid>
            </Box>
            {auth.isErrorInWalletConnect && (
              <Box mb={3}>
                <FormHelperText error>{auth.connectWalletError}</FormHelperText>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Box>
              <Button
                variant="contained"
                onClick={() => setOpenAuction(false)}
                color="primary"
                size="large"
                disabled={process}
              >
                cancel
              </Button>
              &nbsp;&nbsp;
              {/* {account ? ( */}
              <Button
                variant="contained"
                onClick={
                  placeOrder
                  // placeAuctionOrder
                  // setOpenAuction(false)
                }
                color="secondary"
                size="large"
                disabled={process}
              >
                {!process ? "Place Auction" : message}
                {process && <ButtonCircularProgress />}
              </Button>
              {/* ) : (
                <Button
                  variant="contained"
                  onClick={() => auth.connectWallet()}
                  color="secondary"
                  size="large"
                  disabled={process}
                >
                  Connect Wallet
                </Button>
              )} */}
            </Box>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
}
