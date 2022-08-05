import React from 'react'
import {
  Grid,
  Container,
  Box,
  Typography,
  makeStyles,
  Button,
} from '@material-ui/core'
import HomeCard from 'src/component/HomeCard'

const cardData = [
  {
    head: 'Bundles',
    description:
      "MAS setup with 'bundles' specific prices and benefits and clients will be able to purchase those bundles",
  },
  {
    head: 'Generic Donations',
    description:
      'Clients can also make generic donations to MAS, in order to support all their projects and activites',
  },
  {
    head: 'NFT auctions',
    description:
      'Clients will be able to buy NFT auctions of their desired MAS',
  },
]

const useStyles = makeStyles((theme) => ({
  mainSection: {
    padding: '30px 0px',
    backgroundImage: 'linear-gradient(45deg, #240b36 30%, #000 90%)',
  },
  rightSection: {
    color: '#d0dfde',
    '& h2': {
      fontSize: '48px',
      fontWeight: '600',
      letterSpacing: '4px',
      marginBottom: '60px',
      '@media(max-width:767px)': {
        fontSize: '28px',
        fontWeight: '600',
        marginBottom: '0px',
        letterSpacing: '3px',
      },
    },
    '& h4': {
      margin: '30px 0px',
      fontSize: '15px',
      fontWeight: '300',
      lineHeight: '28px',
      letterSpacing: '2px',
      '@media(max-width:767px)': {
        fontSize: '10px',
        fontWeight: '300',
        margin: '0px 0px',
        lineHeight: '23px',
        letterSpacing: '2px',
      },
    },
  },
  leftSection: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    '& img': {
      width: '100%',
      maxWidth: '450px',
    },
  },
}))
export default function HowItWorks({ auth, howItWorksData }) {
  const classes = useStyles()
  return (
    <Box className={classes.mainSection}>
      <Container>
        <Grid container spacing={3} alignItems>
          <Grid item lg={6} sm={6} md={6} xs={12}>
            <Box className={classes.leftSection}>
              <img
                src={
                  howItWorksData?.contentFile
                    ? howItWorksData?.contentFile
                    : 'images/home/banner2.png'
                }
                alt="error loading..."
              />
            </Box>
          </Grid>
          <Grid item lg={6} sm={6} md={6} xs={12}>
            <Box className={classes.rightSection}>
              <Typography variant="h2" className="seats">
                How It Works
              </Typography>
              <Typography variant="h4">
                {howItWorksData?.description}
              </Typography>
              <Box className={classes.cardSection}>
                {howItWorksData?.contents &&
                  howItWorksData?.contents.map((data, i) => {
                    return <HomeCard data={data} index={i} />
                  })}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}
