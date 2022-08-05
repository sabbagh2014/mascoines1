import React, { useContext } from 'react'
import { Typography, Box, makeStyles, Grid } from '@material-ui/core'
import { Link } from 'react-router-dom'
// import { exploreData } from "src/constants";
import { CategoryButtons, exploreData } from 'src/constants'
import { collectionData } from 'src/constants'
import MarketplaceCard from 'src/component/MarketplaceCard'
import Loader from 'src/component/Loader'
import NoDataFound from 'src/component/NoDataFound'

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '40px 0px',
    '& .heading': {
      color: '#000000',
    },
  },
}))

export default function Itembox({
  contentList,
  auth,
  isLoadingConetent,
  isSubscribed,
  bundleDetails,
}) {
  const classes = useStyles()
  // const user = useContext(UserContext);
  return (
    <Box className={classes.root}>
      <Grid container spacing={2}>
        {contentList &&
          contentList.map((data, i) => {
            return (
              <Grid item xs={12} sm={6} md={6} lg={3}>
                <Box mt={2}>
                  <MarketplaceCard
                    type="card"
                    data={data}
                    key={i}
                    auth={auth}
                    isSubscribed={isSubscribed}
                    bundleDetails={bundleDetails}
                  />
                </Box>
              </Grid>
            )
          })}
        <Box
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {isLoadingConetent && <Loader />}
          {!isLoadingConetent && contentList && contentList.length === 0 && (
            <NoDataFound />
          )}
        </Box>
      </Grid>
    </Box>
  )
}
