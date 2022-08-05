import React, { useContext } from 'react'
import {
  Box,
  Container,
  Grid,
  Button,
  TextField,
  makeStyles,
  Typography,
} from '@material-ui/core'
import { AuthContext } from 'src/context/Auth'
import DashboardCard from 'src/component/DashboardCard'
import TokenImgCard from 'src/component/TokenImgCard'
const Dashboardcard = [
  {
    title: 'unique wallets connected',
    data: '3000',
  },
]
const useStyles = makeStyles((theme) => ({
  LoginBox: {
    paddingTop: '150px',
    minHeight: '780px',
    '& h6': {
      fontWeight: 'bold',
      marginBottom: '10px',
    },
  },
  TokenBox: {
    border: 'solid 0.5px #e5e3dd',
    padding: '5px',
  },
  tok: {
    fontFamily: 'Poppins',
    color: '#080707',
    letterSpacing: '1px',
  },
}))

export default function Login() {
  const classes = useStyles()
  const auth = useContext(AuthContext)

  return (
    <Box className={classes.LoginBox}>
      <Container maxWidth="md">
        <Grid container spacing={4} style={{ textAlign: 'center' }}>
          <Grid item xs={12} sm={6} md={6} className="">
            <DashboardCard
              name="Total Content Creators"
              value={
                auth?.dashboardData?.creatorCount
                  ? auth?.dashboardData?.creatorCount
                  : '0'
              }
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <DashboardCard
              name="Total Registered Users"
              value={
                auth?.dashboardData?.userCount
                  ? auth?.dashboardData?.userCount
                  : '0'
              }
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <DashboardCard
              name="Total Bundles Created"
              value={
                auth?.dashboardData?.bundleCount
                  ? auth?.dashboardData?.bundleCount
                  : '0'
              }
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <DashboardCard
              name="Total Donation Amount Transfered "
              value={
                auth?.dashboardData?.donationSent
                  ? auth?.dashboardData?.donationSent
                  : '0'
              }
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <DashboardCard
              name="Total platform Earning"
              value={
                auth?.platformBalance?.referralBalance
                  ? auth?.platformBalance?.referralBalance
                  : '0'
              }
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <DashboardCard
              name="Total Subscribers Users"
              value={
                auth?.dashboardData?.subscriberCount
                  ? auth?.dashboardData?.subscriberCount
                  : '0'
              }
            />
          </Grid>

          {/* <Grid item xs={12} sm={6} md={4}>
            <DashboardCard />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <DashboardCard />
          </Grid> */}
        </Grid>
      </Container>

      <>
        <Container maxWidth="xl">
          <Box mt={5} pt={5}>
            <Typography variant="h6" className={classes.tok}>
              Tokens in the platform wallet:
            </Typography>
            <Box className={classes.TokenBox} mb={4}>
              <Grid
                container
                spacing={4}
                style={{ display: 'flex', justifyContent: 'space-evenly' }}
              >
                <Grid item xs={12} md={12} lg={2} className="">
                  <TokenImgCard
                    image="images/tokens/1.png"
                    value={
                      auth?.platformBalance?.massBalance
                        ? auth?.platformBalance?.massBalance
                        : '0'
                    }
                  />
                </Grid>
                <Grid item xs={12} md={12} lg={2}>
                  <TokenImgCard
                    image="images/tokens/2.png"
                    value={
                      auth?.platformBalance?.bnbBalance
                        ? auth?.platformBalance?.bnbBalance
                        : '0'
                    }
                  />
                </Grid>
                <Grid item xs={12} md={12} lg={2}>
                  <TokenImgCard
                    image="images/tokens/4.png"
                    value={
                      auth?.platformBalance?.ethBalance
                        ? auth?.platformBalance?.ethBalance
                        : '0'
                    }
                  />
                </Grid>
                <Grid item xs={12} md={12} lg={2}>
                  <TokenImgCard
                    image="images/tokens/6.png"
                    value={
                      auth?.platformBalance?.btcBalance
                        ? auth?.platformBalance?.btcBalance
                        : '0'
                    }
                  />
                </Grid>
                <Grid item xs={12} md={12} lg={2}>
                  <TokenImgCard
                    image="images/tokens/2.png"
                    value={
                      auth?.platformBalance?.usdtBalance
                        ? auth?.platformBalance?.usdtBalance
                        : '0'
                    }
                  />
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Container>
        <Container maxWidth="xl">
          <Box mt={5} pt={5}>
            <Typography variant="h6" className={classes.tok}>
              Total earnings of the platform:
            </Typography>
            <Box className={classes.TokenBox} mb={4}>
              <Grid
                container
                spacing={4}
                style={{ display: 'flex', justifyContent: 'space-evenly' }}
              >
                <Grid item xs={12} md={12} lg={2} className="">
                  <TokenImgCard
                    image="images/tokens/1.png"
                    value={
                      auth?.adminTotalEarnings?.massBalance
                        ? auth?.adminTotalEarnings?.massBalance
                        : '0'
                    }
                  />
                </Grid>
                <Grid item xs={12} md={12} lg={2}>
                  <TokenImgCard
                    image="images/tokens/2.png"
                    value={
                      auth?.adminTotalEarnings?.bnbBalance
                        ? auth?.adminTotalEarnings?.bnbBalance
                        : '0'
                    }
                  />
                </Grid>
                <Grid item xs={12} md={12} lg={2}>
                  <TokenImgCard
                    image="images/tokens/4.png"
                    value={
                      auth?.adminTotalEarnings?.ethBalance
                        ? auth?.adminTotalEarnings?.ethBalance
                        : '0'
                    }
                  />
                </Grid>
                <Grid item xs={12} md={12} lg={2}>
                  <TokenImgCard
                    image="images/tokens/6.png"
                    value={
                      auth?.adminTotalEarnings?.btcBalance
                        ? auth?.adminTotalEarnings?.btcBalance
                        : '0'
                    }
                  />
                </Grid>
                <Grid item xs={12} md={12} lg={2}>
                  <TokenImgCard
                    image="images/tokens/2.png"
                    value={
                      auth?.adminTotalEarnings?.usdtBalance
                        ? auth?.adminTotalEarnings?.usdtBalance
                        : '0'
                    }
                  />
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Container>
        <Container maxWidth="xl">
          <Box mt={5} pt={5}>
            <Typography variant="h6" className={classes.tok}>
              Total virtual money in the platform:
            </Typography>
            <Box className={classes.TokenBox} mb={4}>
              <Grid
                container
                spacing={4}
                style={{ display: 'flex', justifyContent: 'space-evenly' }}
              >
                <Grid item xs={12} md={12} lg={2} className="">
                  <TokenImgCard
                    image="images/tokens/1.png"
                    value={
                      auth?.virtualMoney?.massBalance
                        ? auth?.virtualMoney?.massBalance
                        : '0'
                    }
                  />
                </Grid>
                <Grid item xs={12} md={12} lg={2}>
                  <TokenImgCard
                    image="images/tokens/2.png"
                    value={
                      auth?.virtualMoney?.bnbBalance
                        ? auth?.virtualMoney?.bnbBalance
                        : '0'
                    }
                  />
                </Grid>
                <Grid item xs={12} md={12} lg={2}>
                  <TokenImgCard
                    image="images/tokens/4.png"
                    value={
                      auth?.virtualMoney?.ethBalance
                        ? auth?.virtualMoney?.ethBalance
                        : '0'
                    }
                  />
                </Grid>
                <Grid item xs={12} md={12} lg={2}>
                  <TokenImgCard
                    image="images/tokens/6.png"
                    value={
                      auth?.virtualMoney?.btcBalance
                        ? auth?.virtualMoney?.btcBalance
                        : '0'
                    }
                  />
                </Grid>
                <Grid item xs={12} md={12} lg={2}>
                  <TokenImgCard
                    image="images/tokens/2.png"
                    value={
                      auth?.virtualMoney?.usdtBalance
                        ? auth?.virtualMoney?.usdtBalance
                        : '0'
                    }
                  />
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Container>
      </>
    </Box>
  )
}
