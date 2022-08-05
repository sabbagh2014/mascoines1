import React, { useContext, useState, useEffect } from 'react'
import {
  Typography,
  Box,
  makeStyles,
  Avatar,
  Grid,
  Button,
  Link,
} from '@material-ui/core'
import { FaEllipsisV } from 'react-icons/fa'
import { FaHeart } from 'react-icons/fa'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import { BsClockHistory } from 'react-icons/bs'
import { UserContext } from 'src/context/User'

const useStyles = makeStyles((theme) => ({
  token: {
    textAlign: 'center',
    padding: '20px 0',
    '& p': {
      fontSize: '14px',
      fontWeight: '500',
      lineHight: '20px',
      color: '#000',
    },
    '& img': {
      marginTop: '5px',
    },
  },
}))

export default function UsersCard(props) {
  const classes = useStyles()
  const { type, data, balance } = props
  const user = useContext(UserContext)
  const [price, setPrice] = useState()
  useEffect(() => {
    let price = 0
    if (user?.userData || user?.userEarnings) {
      if (balance) {
        if (data.tokenname === 'MASS') {
          price = parseFloat(user?.userData?.massBalance).toFixed(2)
        } else if (data.tokenname === 'BNB') {
          price = parseFloat(user?.userData?.bnbBalance).toFixed(2)
        } else if (data.tokenname === 'USDT') {
          price = parseFloat(user?.userData?.usdtBalance).toFixed(2)
        } else if (data.tokenname === 'BUSD') {
          price = parseFloat(user?.userData?.busdBalance).toFixed(2)
        }
      } else {
        console.log(data)
        if (data.tokenname === 'MASS') {
          price = parseFloat(user?.userEarnings?.massBalance).toFixed(2)
        } else if (data.tokenname === 'BNB') {
          price = parseFloat(user?.userEarnings?.bnbBalance).toFixed(2)
        } else if (data.tokenname === 'USDT') {
          price = parseFloat(user?.userEarnings?.usdtBalance).toFixed(2)
        } else if (data.tokenname === 'BUSD') {
          price = parseFloat(user?.userEarnings?.busdBalance).toFixed(2)
        }
      }
    }

    setPrice(price)
  }, [user?.userData, user?.userEarnings])

  return (
    <Box className="CardBox">
      <Box className={`${classes.token} lesspadd`}>
        <Box>
          <Typography variant="body2" component="p">
            {isNaN(price) ? 0 : price}
          </Typography>
          <Typography variant="body2" component="p">
            {data.tokenname}
          </Typography>
          <img height="20" width="20" src={data.tokenimg} />
        </Box>
      </Box>
    </Box>
  )
}
