import React from 'react'
import { Box, Typography, makeStyles, Grid } from '@material-ui/core'
import UserDeatilsCard from 'src/component/UserDeatilsCard'
import NoDataFound from 'src/component/NoDataFound'

const useStyles = makeStyles((theme) => ({
  input_fild: {
    backgroundColor: '#ffffff6e',
    borderRadius: '5.5px',
    border: ' solid 0.5px #e5e3dd',
    color: '#141518',
    height: '48px',
    width: '100%',
    maxWidth: '500px',
    margin: '0 auto',
    borderRadius: '20px',
    '&:hover': {
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: 'transparent',
      },
    },
    '& .MuiInputBase-input': {
      color: '#141518',
    },
    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: 'transparent',
      borderWidth: 0,
    },
  },
  LoginBox: {
    paddingTop: '20px',
    '& h6': {
      fontWeight: 'bold',
      marginBottom: '10px',
      fontSize: '20px',
      color: '#000',
      '& span': {
        fontWeight: '300',
      },
    },
  },
  TokenBox: {
    border: 'solid 0.5px #e5e3dd',
    padding: '5px',
  },
  masBoxFlex: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
  },
}))

export default function UserDeatilsCardPage({
  userList,
  isdonor,
  callbackFn,
  type,
}) {
  const classes = useStyles()
  return (
    <>
      <Box className={classes.LoginBox} mb={5}>
        <Box className={classes.masBoxFlex}>
          <Typography variant="h6">
            My {type === 'donor' ? 'Supporter' : 'Subscriber'}
          </Typography>
        </Box>
        <Box>
          {userList && userList.length === 0 ? (
            <Box align="center" mt={4} mb={5}>
              <NoDataFound />
            </Box>
          ) : (
            ''
          )}
          <Grid container spacing={1}>
            {userList &&
              userList.map((data, i) => {
                return (
                  <Grid item xs={12} md={4} lg={3} key={1}>
                    <UserDeatilsCard
                      data={data}
                      indaex={i}
                      isdonor={isdonor}
                      callbackFn={callbackFn}
                    />
                  </Grid>
                )
              })}
          </Grid>
        </Box>
      </Box>
    </>
  )
}
