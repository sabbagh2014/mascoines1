import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Container,
  makeStyles,
  Button,
  Link,
  Grid,
  Typography,
  TextField,
  Select,
  InputAdornment,
  FormControl,
} from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import InputBase from "@material-ui/core/InputBase";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/icons/Search";
import Apiconfigs from "src/Apiconfig/Apiconfig";
import axios from "axios";
import DataLoading, { NoDataFound } from "src/component/DataLoading";
import Loader from "src/component/Loader";
import VisibilityIcon from "@material-ui/icons/Visibility";
import Pagination from "@material-ui/lab/Pagination";
import { sortAddress } from "src/utils";
import { Link as RouterLink } from "react-router-dom";
import { BsSearch } from "react-icons/bs";
import MenuItem from "@material-ui/core/MenuItem";
import moment from "moment";
import UserList from "./UserList";
// import { XLSX } from "xlsx";
import * as XLSX from "xlsx";
const useStyles = makeStyles((theme) => ({
  LoginBox: {
    paddingTop: "100px",
    minHeight: "calc(100vh - 141px)",
    "& h6": {
      fontWeight: "bold",
      marginBottom: "10px",
    },
  },
  TokenBox: {
    border: "solid 0.5px #e5e3dd",
    padding: "5px",
  },
  table: {
    border: "1px solid #e5e3dd",
    "& th": {
      border: "1px solid #e5e3dd",
    },
    "& td": {
      border: "1px solid #e5e3dd",
    },
  },
  Paper: {
    boxShadow: "none",
  },
  root: {
    padding: "2px 4px",
    display: "flex",
    alignItems: "center",
    width: "100%",
    marginBottom: "7px",
    float: "right",
    backgroundColor: "#ffffff6e",
    borderRadius: "5.5px",
    border: " solid 0.5px #e5e3dd",
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
    variant: "outlined",
  },
  iconButton: {
    padding: "10px",
  },
  Pageno: {
    display: "flex",
    margin: "10px",
    alignItems: "center",
    justifyContent: "center",
  },
  MainRectangle: {
    display: "flex",
    justifyContent: "space-between",
    paddingTop: "10px",
    bottom: "0",
  },
  Rectangle: {
    display: "flex",
    justifyContent: "center",

    width: "27.5px",
    height: "27.5px",
    border: "solid 0.5px #d15b5b",
    backgroundColor: "#792034",
    // textAlign: 'center',
    justifyContent: "center",
    color: "white",
    padding: "5px",
    margin: "10px",
    float: "right",
    cursor: "pointer",
  },
  tbody: {
    "&:nth-of-type(even)": {
      backgroundColor: "#f3f3f3",
    },
  },
  btnSection: {
    paddingBottom: ".5rem",
  },
  btnSection1: {
    paddingBottom: "1rem",
  },
  btnbox1: {
    marginTop: "1rem",
    "& button": {
      borderRadius: "10px",
      fontWeight: "600",
      fontSize: "14px",
      marginRight: "4px",
      "@media(max-width:767px)": {
        marginTop: "1rem",
      },
      "&.active": {
        color: "#fff",
        filter: "drop-shadow(0px 3px 3.5px rgba(0,0,0,0.16))",
        padding: "8px 22px",
        fontSize: "15px",
        background: "linear-gradient(180deg, #c04848 0%, #480048 100%)",
        borderRadius: "50px",
        "@media(max-width:767px)": {
          fontSize: "12px",
          color: "#fff",
          filter: "drop-shadow(0px 3px 3.5px rgba(0,0,0,0.16))",
          padding: "11px 22px",

          background: "linear-gradient(180deg, #c04848 0%, #480048 100%)",
          borderRadius: "50px",
        },
      },
    },
  },
}));

export default function Login() {
  const csvLink = useRef();
  const classes = useStyles();
  const [details, setdetails] = useState([]);
  const [page, setpage] = useState(1);
  const [noOfPages, setnoOfPages] = useState(1);

  const [numberOfPages, setNumberOfPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [fireSearch, setFireSearch] = useState(false);
  const [tabview, setTabView] = useState("Creator");

  const [pages, setPages] = useState(1);
  const [filterData, setFilterData] = useState({
    toDate: "",
    fromDate: "",
    search: "",
    planType: "",
    User: "",
  });
  const _onInputChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    const temp = { ...filterData, [name]: value };

    setFilterData(temp);
  };
  const userdetails = async (filter) => {
    setIsLoading(true);
    axios({
      method: "GET",
      url: Apiconfigs.userlist,
      headers: {
        token: window.localStorage.getItem("creatturAccessToken"),
      },
      params: {
        type: tabview,
        page: page,
        limit: 20,
        search: filter?.searchKey ? filter?.searchKey : null,
        planType: filter?.planType ? filter?.planType : null,
        fromDate: filter?.fromDate
          ? moment(filter?.fromDate).format("YYYY-MM-DD")
          : null,
        toDate: filter?.toDate
          ? moment(filter?.toDate).format("YYYY-MM-DD")
          : null,
      },
    })
      .then(async (res) => {
        setIsLoading(false);

        if (res.data.statusCode === 200) {
          const result = res.data.result.docs.filter((data) => data.ethAccount);
          setdetails(result);
          setNumberOfPages(res.data.result.pages);
          csvLink.current.link.click();
        }
      })
      .catch((err) => {
        setIsLoading(false);

        console.log(err.message);
      });
  };

  // useEffect(() => {
  //   if (search) {
  //     userdetails(page, search);
  //   } else {
  //     userdetails(page);
  //   }
  // }, [page, search]);
  useEffect(() => {
    userdetails();
  }, [page, tabview]);
  useEffect(() => {
    if (
      filterData.fromDate !== "" ||
      filterData.planType !== "select" ||
      filterData.toDate !== "" ||
      filterData.searchKey !== ""
    ) {
      if (fireSearch) {
        userdetails(filterData);
      }
    }
  }, [filterData, fireSearch]);
  const downloadExcel = () => {
    const workSheet = XLSX.utils.json_to_sheet(details);
    const workBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook, workSheet, "userList");
    let buf = XLSX.write(workBook, { bookType: "xlsx", type: "buffer" });
    XLSX.write(workBook, { bookType: "xlsx", type: "binary" });
    XLSX.writeFile(workBook, "user_list.xlsx");
  };
  return (
    <Box className={classes.LoginBox}>
      <Container maxWidth="xl">
        <Box className={classes.filterBox} mb={5} mt={4}>
          <Typography variant="h6">Filter</Typography>
          <Grid container spacing={3} alignItems="flex-end">
            <Grid item xs={12} sm={6} md={4} lg={2}>
              <Typography>From</Typography>
              <TextField
                id="outlined-basic"
                type="date"
                variant="outlined"
                fullWidth
                name="fromDate"
                onChange={_onInputChange}
                value={filterData.fromDate}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={2}>
              <Typography>To</Typography>
              <TextField
                id="outlined-basic"
                type="date"
                variant="outlined"
                fullWidth
                name="toDate"
                onChange={_onInputChange}
                value={filterData.toDate}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={2}>
              <Typography>Search </Typography>
              <TextField
                id="outlined-basic"
                type="search"
                variant="outlined"
                fullWidth
                name="searchKey"
                placeholder="Search by e-mail and user name "
                onChange={_onInputChange}
                value={filterData.searchKey}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {" "}
                      <IconButton className="iconbtn">
                        <BsSearch style={{ color: "#000" }} />
                      </IconButton>{" "}
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4} lg={2}>
              <Box>
                <Typography>Plan</Typography>

                <Select
                  id="demo-simple-select-outlined"
                  fullWidth
                  name="planType"
                  variant="outlined"
                  MenuProps={{
                    disableScrollLock: true,
                  }}
                  className={classes.divsection1}
                  value={filterData.planType}
                  onChange={_onInputChange}
                >
                  <MenuItem value="select">Select </MenuItem>
                  <MenuItem value={"Diamond"}>Diamond</MenuItem>
                  <MenuItem value={"Silver"}>Silver</MenuItem>
                  <MenuItem value={"Gold"}>Gold</MenuItem>
                  <MenuItem value={"Mass Plus"}>Mass Plus</MenuItem>
                </Select>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={2}>
              <Box className={classes.btnSection}>
                <Button
                  variant="contained"
                  color="secondary"
                  fullWidth
                  style={{ backgroundColor: "#5a86ff" }}
                  onClick={() => setFireSearch(true)}
                >
                  Search
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={2}>
              <Box className={classes.btnSection}>
                <Button
                  variant="contained"
                  color="secondary"
                  fullWidth
                  style={{ backgroundColor: "#5a86ff" }}
                  onClick={downloadExcel}
                >
                  Download CSV
                </Button>
              </Box>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Box className={classes.btnbox1}>
                <Button
                  className={tabview === "Creator" ? "active" : ""}
                  onClick={() => setTabView("Creator")}
                >
                  Content Creators
                </Button>
                <Button
                  className={tabview === "User" ? "active" : ""}
                  onClick={() => setTabView("User")}
                >
                  Subscribers Users
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
        {isLoading ? (
          // <DataLoading />
          <Loader />
        ) : (
          <>
            {" "}
            <TableContainer className={classes.Paper} component={Paper}>
              <Table className={classes.table} aria-label="simple table">
                <TableHead
                  style={{
                    background:
                      "linear-gradient(180deg, #c04848 0%, #480048 100%)",
                  }}
                >
                  <TableRow>
                    <TableCell align="Center" style={{ color: "white" }}>
                      Sr.No
                    </TableCell>
                    <TableCell align="Center" style={{ color: "white" }}>
                      Wallet address
                    </TableCell>
                    <TableCell align="Center" style={{ color: "white" }}>
                      Name
                    </TableCell>
                    <TableCell align="Center" style={{ color: "white" }}>
                      Email
                    </TableCell>
                    <TableCell align="Center" style={{ color: "white" }}>
                      MASS Balance
                    </TableCell>
                    <TableCell align="Center" style={{ color: "white" }}>
                      Action
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {details.map((row, index) => {
                    return <UserList row={row} key={index} index={index} />;
                  })}
                </TableBody>
              </Table>

              {!isLoading && details.length === 0 && <NoDataFound />}
            </TableContainer>
            {/* <div className={classes.MainRectangle}>
              <span className={classes.Pageno}>
                {page} of {numberOfPages}
              </span>
              <div>
                {Array.from({ length: parseInt(numberOfPages) }).map(
                  (data, i) => {
                    let value = numberOfPages - i;
                    return (
                      <div
                        onClick={() => setpage(value)}
                        className={classes.Rectangle}
                      >
                        <span>{value}</span>
                      </div>
                    );
                  }
                )}
              </div>
            </div> */}
            {details && details.length >= 20 && (
              <Box mb={2} mt={2} display="flex" justifyContent="flex-start">
                <Pagination
                  count={noOfPages}
                  page={page}
                  onChange={(e, v) => setpage(v)}
                />
              </Box>
            )}
          </>
        )}{" "}
      </Container>
    </Box>
  );
}
