import React, { useState } from 'react'
import { TableCell, TableRow, Button, makeStyles } from '@material-ui/core'
import { DonationPopUp } from 'src/component/Bundelscard1'
import { toast } from 'react-toastify'
import { useHistory } from 'react-router-dom'
const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 320,
  },
  table: {
    border: '1px solid #e5e3dd',
    '& th': {
      border: '1px solid #e5e3dd',
    },
    '& td': {
      border: '1px solid #e5e3dd',
    },
  },
  createButton: {
    color: '#fff',
    backgroundImage: 'linear-gradient(45deg, #240b36 30%, #c31432 90%)',
    margin: '0px 10px',
    // "@media(max-width:768px)": {
    //   display: "none",
    // },
  },
}))
export default function ChildTableUser({ row, index, auth }) {
  const classes = useStyles()
  const [openDonation, setOpenDonation] = useState(false)
  const history = useHistory()
  return (
    <>
      <TableRow className={classes.tbody} key={row.coinName}>
        <TableCell
          style={{ color: 'black' }}
          align="Center"
          component="th"
          scope="row"
        >
          {index + 1}
        </TableCell>
        <TableCell
          style={{ color: 'blue', cursor: 'pointer' }}
          align="Center"
          onClick={() =>
            history.push({
              pathname: '/user-profile',
              search: row?._id,
            })
          }
        >
          {row?.ethAccount?.address
            ? row?.ethAccount?.address
            : row?.walletAddress
            ? row?.walletAddress
            : 'N/A'}
        </TableCell>
        <TableCell style={{ color: 'black' }} align="Center">
          {row?.name ? row?.name : row?.userName ? row?.userName : 'N/A'}
        </TableCell>
        <TableCell style={{ color: 'black' }} align="Center">
          {row?.userType ? row?.userType : 'N/A'}
        </TableCell>
        <TableCell style={{ color: 'black' }} align="Center">
          <Button
            className={classes.createButton}
            onClick={() => {
              if (auth?.userData?._id) {
                if (auth?.userData?._id !== row?._id) {
                  setOpenDonation(true)
                } else {
                  toast.error(`You can't transfer to your own account`)
                }
              } else {
                toast.error('Please login first!')
              }
            }}
            disabled={row?.userType === 'User'}
          >
            Transfer Funds
          </Button>
        </TableCell>
      </TableRow>

      {openDonation && (
        <DonationPopUp
          open={openDonation}
          handleClose={() => setOpenDonation(false)}
          userData={row}
        />
      )}
    </>
  )
}
