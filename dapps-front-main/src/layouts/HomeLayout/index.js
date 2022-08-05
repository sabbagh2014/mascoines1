import React from 'react'
import { makeStyles } from '@material-ui/core'
import { useHistory } from 'react-router-dom'
import Footer from './Footer'
import TopBar from './TopBar'

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: '#fff',
    // minHeight: '650px',
  },
  childHeight: {
    minHeight: '850px',
  },
}))

const MainLayout = ({ children }) => {
  const classes = useStyles()
  const history = useHistory()
  return (
    <div className={classes.root}>
      <TopBar />

      <div className={classes.childHeight}>{children}</div>
      <Footer />
    </div>
  )
}

export default MainLayout
