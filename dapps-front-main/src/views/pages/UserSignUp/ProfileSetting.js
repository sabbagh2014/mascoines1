import React, { useState, useContext, useEffect } from "react";
import {
  Box,
  Container,
  Grid,
  Button,
  TextField,
  makeStyles,
  Typography,
} from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import Apiconfigs from "src/Apiconfig/Apiconfigs";
// import { Editor } from '@tinymce/tinymce-react'
import { UserContext } from "src/context/User";
import {
  isValidationEmail,
  isName,
  isBlank,
  isSpecialChar,
} from "src/CommanFunction/Validation.js";
import ButtonCircularProgress from "src/component/ButtonCircularProgress";
import { FiCopy } from "react-icons/fi";
import { toast } from "react-toastify";
import { CopyToClipboard } from "react-copy-to-clipboard";

const useStyles = makeStyles((theme) => ({
  LoginBox: {
    paddingBottom: "50px",
  },
  basic: {
    textAlign: "center",
    fontFamily: "Poppins",
    fontSize: "30px",
    paddingTop: "20px",
    color: "#141518",
  },
  input_fild2: {
    width: "100%",
    "& input": {
      height: "33px",
      "@media(max-width:960px)": {
        height: "15px",
        marginTop: "-15px",
      },
    },
  },
  Button: {
    display: "flex",
    justifyContent: "flex-end",
    paddingBottom: "25px",
  },
  ButtonBtn: {
    paddingTop: "30px",
    paddingRight: "10px",
    width: "200px",
  },
  name: {
    display: "flex",
    alignItems: "center",
    fontSize: "20px",
    color: "#141518",
    [theme.breakpoints.down("sm")]: {
      display: "block",
    },
    "& p": {
      fontSize: "15px",
      color: "#707070",
      paddingLeft: "5px",
    },
  },
  inputbox: {
    width: "100%",
    height: "150px",
  },
  profile: {
    display: "flex",
    flexDirection: "column",
    marginTop: "-75px",
  },
  coverpic: {
    width: "100%",
  },
  profilepic: {
    width: "127.7px",
    height: "127.7px",
    borderRadius: "50%",
  },
  coverback: {
    height: "127.7px",
    width: "100%",
  },

  CoverBox: {
    display: "flex",
    alignItems: "flex-end",
    flexDirection: "column",
  },
  coverEdit: {
    color: "#ffffff",
    marginTop: "-40px",
    padding: "10px",
    position: "relative",
    "& input": {
      position: "absolute",
      left: "0",
      top: "0",
      width: "100%",
      height: "100%",
      opacity: "0",
    },
  },
  profileFoto: {
    position: "relative",
    "& input": {
      position: "absolute",
      left: "0",
      top: "0",
      width: "100%",
      height: "100%",
      opacity: "0",
    },
  },
  Box: {
    width: "100%",
    height: "125px",
    backgroundImage: "linear-gradient(to bottom, #c04848, #480048)",
    backgroundRepeat: "no-repeat",
    backgroundSize: "100%",
    backgroundPosition: "center center",
  },
  newsec: {
    display: "flex",
    "@media(max-width:560px)": {
      display: "block",
    },
  },
  mainadd: {
    paddingTop: "8px",
    "@media(max-width:560px)": {},
  },
}));
export function copyTextById(id) {
  var copyText = document.getElementById(id);
  copyText.select();
  copyText.setSelectionRange(0, 99999); /* For mobile devices */
  navigator.clipboard.writeText(copyText.value);
  alert(`Copied ${copyText.value}`);
}

export default function Login() {
  const classes = useStyles();
  const history = useHistory();
  const user = useContext(UserContext);
  const [isLoading, setIsloading] = useState(false);
  const [name, setname] = useState(user.userProfileData?.name);
  const [Email, setEmail] = useState(user.userProfileData?.useremail);
  const [url, seturl] = useState(user.userProfileData?.username);
  const [bio, setbio] = useState(user.userProfileData?.userbio);
  const [profileurl, setprofileurl] = useState(
    user.userProfileData?.userprofile
  );
  const [nameError, setNameError] = useState(false);
  const [coverurl, setcoverurl] = useState(user.userProfileData?.usercover);
  const [profile, setprofile] = useState();
  const [cover, setcover] = useState(user.userProfileData?.usercover);
  const [validname, setvalidname] = useState(false);
  const [validemail, setvalidemail] = useState(false);
  const [validurl, setvalidurl] = useState(false);
  const [validbio, setvalidbio] = useState(false);
  useEffect(() => {
    if (user.userProfileData) {
      setname(user.userProfileData?.name);
      setEmail(user.userProfileData?.useremail);
      seturl(user.userProfileData?.username);
      setbio(user.userProfileData?.userbio);
      setcoverurl(user.userProfileData?.usercover);
      setcover(user.userProfileData?.usercover);
    }
  }, [user.userProfileData]);

  const getBase64 = (file, cb) => {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      cb(reader.result);
    };
    reader.onerror = function (err) {
      console.log("Error: ", err);
    };
  };

  const apply = async () => {
    if (isName(name) && isValidationEmail(Email)) {
      if (name.length <= 20) {
        if (isValidationEmail(Email)) {
          setvalidemail(false);
        }
        setIsloading(true);
        axios({
          method: "PUT",
          url: Apiconfigs.updateprofile,
          headers: {
            token: window.localStorage.getItem("token"),
          },
          data: {
            name: name,
            email: Email,
            profilePic: profile,
            coverPic: cover,
            massPageUrl: url,
            bio: bio,
            facebook: user.link.userfacebook,
            twitter: user.link.usertwitter,
            youtube: user.link.useryoutube,
            telegram: user.link.usertelegram,
          },
        })
          .then(async (res) => {
            if (res.data.statusCode === 200) {
              await user.updateUserData({
                name: name,
                username: user.userProfileData?.username,

                useremail: Email,
                userurl: url,
                userbio: bio,
                profileurl: profile,
                coverurl: cover,
                profile: profileurl,
                cover: coverurl,
              });

              history.push("/Home");
              toast.success("Your profile has been updated successfully");
            } else {
              toast.error(res.data.responseMessage);
            }
            setIsloading(false);
          })
          .catch((error) => {
            setIsloading(false);

            if (error.response) {
              toast.error(error.response.data.responseMessage);
            } else {
              toast.error(error.message);
            }
          });
      } else {
        setNameError(true);
      }
    } else {
      if (!isName(name)) {
        setvalidname(true);
      }
      if (!isValidationEmail(Email)) {
        setvalidemail(true);
      }
      if (!isName(bio)) {
        setvalidbio(true);
      }
    }
  };
  const sociallink = () => {
    user.updateUserStateData({
      name: name,
      username: user.userProfileData?.username,
      useremail: Email,
      userurl: url,
      userbio: bio,
      profileurl: profile,
      coverurl: cover,
      profile: profileurl,
      cover: coverurl,
    });
    history.push("/socialaccounts");
  };
  return (
    <Box className={classes.LoginBox}>
      <Grid className={classes.CoverBox}>
        <Box
          className={classes.Box}
          style={
            coverurl
              ? {
                  backgroundImage: `url(${coverurl})`,
                }
              : null
          }
          // style={{ backgroundImage: `url(${coverurl})` }}
        >
          {/* <img className={classes.coverback} src={coverurl} alt="" /> */}
        </Box>
        <Box className={classes.coverEdit} style={{ curser: "pointer" }}>
          Edit Cover Photo{" "}
          <input
            style={{ curser: "pointer" }}
            type="file"
            accept="image/*"
            onChange={(e) => {
              // setcover(e.target.files[0]);
              setcoverurl(URL.createObjectURL(e.target.files[0]));
              getBase64(e.target.files[0], (result) => {
                setcover(result);
              });
            }}
          />
        </Box>
      </Grid>
      <Container maxWidth="xl">
        <Box className={classes.profile}>
          <img
            className={classes.profilepic}
            src={profileurl ? profileurl : "/images/users/profilepic1.svg"}
            alt=""
          />
          <Box className={classes.profileFoto} style={{ curser: "pointer" }}>
            Edit profile photo{" "}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                // setprofile(e.target.files[0]);
                setprofileurl(URL.createObjectURL(e.target.files[0]));
                getBase64(e.target.files[0], (result) => {
                  setprofile(result);
                });
              }}
            />
          </Box>
        </Box>
        <Box>
          <Grid container spacing={1}>
            <Grid item xs={12} md={1}>
              <label className={classes.name}> Name :</label>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                id="standard-basic"
                value={name}
                // onFocus={(e) => (e.target.value = "")}
                error={validname}
                helperText={validname ? "Please enter valid name" : ""}
                onChange={(e) => setname(e.target.value)}
                className={classes.input_fild2}
              />
              {nameError && (
                <p style={{ margin: "0px", color: "red", fontSize: "12px" }}>
                  {" "}
                  You can only enter 20 charachters.
                </p>
              )}
            </Grid>
          </Grid>
        </Box>
        <Box style={{ marginTop: "-10px" }}>
          <Grid container spacing={1}>
            <Grid item xs={12} md={1}>
              <label className={classes.name}> Email :</label>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                id="standard-basic"
                // onFocus={(e) => (e.target.value = "")}
                // onBlur={(e) => (e.target.value = "adamsberg@mas.com")}
                disabled={user?.userData?.userType !== "User"}
                error={validemail}
                helperText={validemail ? "Please enter valid email" : ""}
                value={Email}
                className={classes.input_fild2}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Grid>
          </Grid>
        </Box>

        <Box style={{ marginTop: "-23px" }}>
          <Grid container spacing={1}>
            <Grid item xs={12} md={6}>
              <input
                type="text"
                id="massPageURL"
                value={`https://apps.masplatform.io/${url}`}
                style={{ display: "none" }}
              />
              <label className={classes.name}>
                MAS Page URL :{" "}
                <p>‎‎‎https://apps.masplatform.io/user-profile?</p> &nbsp;
                <TextField
                  id="outlined-basic"
                  autoFocus="true"
                  value={url}
                  disabled
                  // error={validurl && !isName(url)}
                  // helperText={validurl && !isName(url) ? 'Empty' : ''}
                  onChange={(e) => seturl(e.target.value)}
                />
                {/* <FiCopy onClick={() => copyTextById("massPageURL")} /> */}
                {url && (
                  <CopyToClipboard
                    style={{ curser: "pointer" }}
                    // text={user.userData.ethAccount.address}
                    text={`https://apps.masplatform.io/user-profile?${url}`}
                  >
                    <FiCopy onClick={() => toast.info("Copied")} />
                  </CopyToClipboard>
                )}
              </label>
            </Grid>
          </Grid>
        </Box>
        <Box style={{ marginLeft: "5px", marginTop: "-10px" }}>
          <Grid container spacing={1}>
            {user && user.userData && user?.userData?.ethAccount?.address && (
              <Typography
                variant="h6"
                style={{ marginBottom: "-20px" }}
                className={classes.newsec}
              >
                <span style={{ fontSize: "20px", color: "#141518" }}>
                  Address:
                </span>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <Box style={{ display: "flex" }}>
                  <Box
                    className={classes.mainadd}
                    style={{
                      fontSize: "14px",
                      width: "200px",

                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                    }}
                  >
                    {user.userData.ethAccount.address} &nbsp;
                  </Box>{" "}
                  <Box
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <CopyToClipboard
                      style={{ curser: "pointer" }}
                      text={user.userData.ethAccount.address}
                    >
                      <FiCopy onClick={() => toast.info("Copied")} />
                    </CopyToClipboard>
                  </Box>
                </Box>
              </Typography>
            )}
          </Grid>
        </Box>
        <Box style={{ marginTop: "40px", marginLeft: "5px" }}>
          <Grid container spacing={1}>
            {user.userData?.referralCode && (
              <Typography variant="h6">
                <span style={{ fontSize: "20px", color: "#141518" }}>
                  Referral:
                </span>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                {user.userData?.referralCode} &nbsp;
                <CopyToClipboard text={user.userData?.referralCode}>
                  <FiCopy onClick={() => toast.info("Copied")} />
                </CopyToClipboard>
              </Typography>
            )}
          </Grid>
        </Box>
        <Box>
          <Grid container spacing={1} style={{ alignItems: "center" }}>
            <Grid item xs={12} md={4}>
              <label className={classes.name}> BIO :</label>
              <TextField
                id="outlined-multiline-static"
                focused="true"
                multiline
                rows={4}
                // onFocus={(e) => (e.target.value = "")}
                // onBlur={(e) => (e.target.value = "Type a text")}
                // error={validbio && !isName(bio)}
                // helperText={validbio && !isName(bio) ? 'Empty' : ''}
                value={bio}
                variant="outlined"
                className={classes.inputbox}
                onChange={(e) => setbio(e.target.value)}
              />
            </Grid>
          </Grid>
        </Box>
        <Box>
          <Grid container spacing={1} style={{ alignItems: "center" }}>
            <Grid item xs={12} md={6}>
              <Box
                style={{
                  width: "fit-content",
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
              >
                <Typography
                  variant="h4"
                  className={classes.name}
                  onClick={sociallink}
                >
                  Social Link
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box className={classes.Button}>
                <Box className={classes.ButtonBtn}>
                  <Button
                    variant="contained"
                    size="large"
                    color="primery"
                    className="btn-block btnWidth removeredius"
                    component={Link}
                    to="/home"
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                </Box>

                <Box className={classes.ButtonBtn}>
                  <Button
                    // variant="h6"
                    variant="contained"
                    size="large"
                    color="secondary"
                    className="btn-block btnWidth removeredius"
                    disabled={isLoading}
                    // component={Link}
                    // to="/profile"
                    onClick={apply}
                  >
                    {isLoading ? "Updating..." : "Update"}
                    {isLoading && <ButtonCircularProgress />}
                  </Button>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}
