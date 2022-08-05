import React from 'react'
import { Box, makeStyles, Typography } from '@material-ui/core'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import moment from 'moment'

const rows = [
  createData('Joe 593', '0.055 MAS', '17/5/2021', '17/5/2021'),
  createData('Joe 593', '0.055 MAS', '17/5/2021', '17/5/2021'),
  createData('Joe 593', '0.055 MAS', '17/5/2021', '17/5/2021'),
  createData('Joe 593', '0.055 MAS', '17/5/2021', '17/5/2021'),
  createData('Joe 593', '0.055 MAS', '17/5/2021', '17/5/2021'),
  createData('Joe 593', '0.055 MAS', '17/5/2021', '17/5/2021'),
  createData('Joe 593', '0.055 MAS', '17/5/2021', '17/5/2021'),
]
function createData(name, Bid, date, status) {
  return { name, Bid, date, status }
}
const useStyles = makeStyles((theme) => ({
  LoginBox: {
    '& h6': {
      fontWeight: 'bold',
      marginBottom: '10px',
      '& span': {
        fontWeight: '300',
      },
    },
  },
  TokenBox: {
    border: 'solid 0.5px #e5e3dd',
    padding: '5px',
  },
  labelText: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#000',
  },
  histortable: {
    padding: '20px',
    backgroundColor: '#f9f9f9',
  },
  table: {
    background: ' #f9f9f9',
    '& td': {
      border: 'none',
    },
  },
  Paper: {
    boxShadow: 'none',
  },
  btnBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    [theme.breakpoints.down('sm')]: {
      display: 'block',
    },
    '& button': {
      width: '180px ',
      maxWidth: '100%',
      [theme.breakpoints.down('sm')]: {
        marginLeft: '0 !important',
        marginBottom: '15px',
        width: '100%',
      },
    },
  },
}))

export default function Login({ data }) {
  const classes = useStyles()
  return (
    <Box className={classes.LoginBox}>
      <label className={classes.labelText}>History:</label>
      {data && data.length > 0 ? (
        <Box className={classes.histortable}>
          <TableContainer className={classes.Paper} component={Paper}>
            <Table className={classes.table} aria-label="simple table">
              <TableHead>
                <TableRow>
                  {/* <TableCell align='Center'>Name</TableCell> */}
                  <TableCell align="Center">Bid</TableCell>
                  <TableCell align="Center">Date</TableCell>
                  <TableCell align="Center">status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((row) => (
                  <TableRow key={row.name}>
                    {/* <TableCell align='Center'>{row.name}</TableCell> */}
                    <TableCell align="Center">{row.bid}</TableCell>
                    <TableCell align="Center">
                      {moment(row.date).format('DD-MM-YYYY hh:mm A')}
                    </TableCell>
                    <TableCell align="Center">{row.bidStatus}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      ) : (
        <Box align="center" mt={4} mb={5}>
          <Typography
            // variant='h1'
            style={{ color: '#000', marginBottom: '10px' }}
          >
            NO DATA FOUND!!
          </Typography>
          {/* <img src='images/noresult.png' /> */}
        </Box>
      )}
    </Box>
  )
}
