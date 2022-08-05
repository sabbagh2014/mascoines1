import {
  Box,
  TableRow,
  TableCell,
  Button,
  makeStyles,
  Link,
} from "@material-ui/core";
import React from "react";

import VisibilityIcon from "@material-ui/icons/Visibility";
import { sortAddress } from "src/utils";
import { Link as RouterLink } from "react-router-dom";

const useStyles = makeStyles((theme) => ({}));

export default function UserList(props) {
  const classes = useStyles();
  const { row, index } = props;
  return (
    <TableRow className={classes.tbody} key={row.name}>
      <TableCell
        style={{ color: "black" }}
        align="Center"
        component="th"
        scope="row"
      >
        {index + 1}
      </TableCell>
      <TableCell style={{ color: "black" }} align="Center">
        {row?.ethAccount?.address
          ? sortAddress(row?.ethAccount?.address)
          : "0x00000"}
      </TableCell>
      <TableCell style={{ color: "black" }} align="Center">
        {row.name}
      </TableCell>
      <TableCell style={{ color: "black" }} align="Center">
        {row.email}
      </TableCell>
      <TableCell style={{ color: "black" }} align="Center">
        {row?.massBalance ? row?.massBalance : "0"}
      </TableCell>
      <TableCell style={{ color: "black" }} align="Center">
        <Box
          style={{
            display: "flex",
            justifyContent: "center",
            // justifyContent: "center",
          }}
        >
          <Link
            to={{
              pathname: "/user-management",
              state: {
                id: row._id,
              },
              search: row._id,
            }}
            component={RouterLink}
          >
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              style={{
                width: "30px",
                height: "30px",
              }}
            >
              <VisibilityIcon style={{ fontSize: "15px" }} />
            </Button>
          </Link>
        </Box>
      </TableCell>
    </TableRow>
  );
}
