import React, { useState, useContext, useEffect } from 'react'
import {
  Grid,
  Container,
  Box,
  Typography,
  makeStyles,
  TextField,
  Button,
  FormHelperText,
} from '@material-ui/core'
import { useHistory, useLocation } from 'react-router-dom'
import { colors } from '@material-ui/core'
import CloudUploadIcon from '@material-ui/icons/CloudUpload'
import Apiconfigs from 'src/Apiconfig/Apiconfig'
import axios from 'axios'
import { toast } from 'react-toastify'
import ButtonCircularProgress from 'src/component/ButtonCircularProgress'
import { UserContext } from 'src/context/User'
import { getBase64 } from 'src/utils'
const useStyles = makeStyles((theme) => ({
  bannerSectionBody: {
    padding: '80px 0px',
    minHeight: '770px',
    '& h3': {
      colors: '#000',
    },
  },
  dailogTitle: {
    textAlign: 'Center',
    '& h2': {
      color: '#141518',
      fontSize: '23px',
    },
  },
  input_fild2: {
    width: '100%',
    '& input': {
      height: '30px',
      paddingTop: '22px',
    },
  },
  input_fild3: {
    width: '100%',
    '& input': {
      height: '30px',
      paddingTop: '10px',
    },
  },
  UploadBox: {
    border: 'solid 0.5px #707070',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '110px',
  },
  input_fild22: {
    width: '100%',
    '& input': {
      height: '45px',
      border: 0,
    },
    '& .MuiInput-underline:before': {
      border: 0,
    },
  },
  newbox: {
    marginTop: '10px',
    display: 'flex',
    justifyContent: 'center',
  },
}))

export default function AddBannerVideo() {
  const history = useHistory()
  const location = useLocation()
  const [isSubmit, setIsSubmit] = useState(false)
  const classes = useStyles()
  const [bannerImage, setbannerImage] = useState('')
  const [url, setUrl] = useState('')
  const [imageurl, setimageurl] = useState('')
  const [process, setprocess] = useState(false)
  const [bannerTitle, setbannerTitle] = useState('')
  const [message, setmessage] = useState('')
  const accessToken = localStorage.getItem('creatturAccessToken')
  const [locationState, setLocationState] = useState('')
  const [locationSearch, setLocationSearch] = useState('')
  const [bannerData, setBannerData] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const post = async () => {
    setIsSubmit(true)
    if (bannerTitle !== '' && bannerImage !== '') {
      const formData = new FormData()
      formData.append('video', bannerImage)
      formData.append('title', bannerTitle)
      if (locationState === 'Edit') {
        formData.append('_id', locationSearch)
      }
      try {
        setmessage('Creating Banner...')
        setprocess(true)
        const apiCallCheck = locationState === 'Edit' ? 'PUT' : 'POST'

        const res = await axios({
          method: apiCallCheck,
          url: Apiconfigs.video,
          headers: {
            token: accessToken,
          },
          data: formData,
        })
        if (res.data.statusCode === 200) {
          console.log('response---', res.data.result)
          setprocess(false)
          history.push('/landing')
          toast.success('Video has been added successfully. ')
        }
      } catch {
        setprocess(false)

        console.log('hjds')
      }
    }
  }

  const getBannerDetailsHandler = async (id) => {
    setIsLoading(true)
    try {
      const res = await axios({
        method: 'GET',
        url: Apiconfigs.video,
        params: {
          _id: id,
        },
      })
      if (res.data.statusCode === 200) {
        console.log('responseView----', res.data.result)
        setBannerData(res.data.result)
        setIsLoading(false)
      }
    } catch (error) {
      console.log(error)
      setIsLoading(false)
    }
  }
  useEffect(() => {
    if (bannerData) {
      setbannerTitle(bannerData?.title ? bannerData?.title : '')

      //   setUrl(bannerData?.url ? bannerData?.url : '')
      setbannerImage(bannerData?.video ? bannerData?.video : '')
      setimageurl(bannerData?.video ? bannerData?.video : '')
    }
  }, [bannerData])

  useEffect(() => {
    const locationSearchKey = location.search.split('?')[1]
    const locationStateKey = location.state.componentCall
    if (locationSearchKey) {
      getBannerDetailsHandler(locationSearchKey)
    }
    setLocationState(locationStateKey)
    setLocationSearch(locationSearchKey)
  }, [location])

  return (
    <Box className={classes.bannerSectionBody} mt={1}>
      <Container maxWidth="xl">
        <Box>
          <Typography variant="h3">{`${locationState} Banner Video`}</Typography>

          <Box>
            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <label> Video Title :</label>
              </Grid>
              <Grid item xs={12} md={9}>
                <TextField
                  id="standard-basic"
                  placeholder="Video title"
                  className={classes.input_fild2}
                  value={bannerTitle}
                  onChange={(e) => setbannerTitle(e.target.value)}
                  error={isSubmit && bannerTitle === ''}
                  helperText={
                    isSubmit &&
                    bannerTitle === '' &&
                    '*Please enter valid title'
                  }
                />
              </Grid>
            </Grid>
            {/* <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <label>URL :</label>
              </Grid>
              <Grid item xs={12} md={9}>
                <TextField
                  fullWidth
                  type="text"
                  placeholder="Enter url"
                  className={classes.input_fild3}
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  error={isSubmit && url === ''}
                  helperText={isSubmit && url === '' && '*Please enter url'}
                />
              </Grid>
            </Grid> */}
          </Box>
        </Box>

        <Box mb={2}>
          <Grid container spacing={0}>
            <Grid item xs={12} md={12}>
              <label>Upload a video</label>
            </Grid>
            <Grid item xs={12} md={12}>
              <Box className={classes.UploadBox}>
                <label htmlFor="raised-button-file">
                  <input
                    accept="video/*"
                    style={{ display: 'none' }}
                    className={classes.input}
                    id="contained-button-file-add-bun"
                    multiple
                    onChange={(e) => {
                      //   getBase64(e.target.files[0], (result) => {
                      //     setbannerImage(result)
                      //   })
                      setbannerImage(e.target.files[0])
                      setimageurl(URL.createObjectURL(e.target.files[0]))
                    }}
                    type="file"
                  />
                  {imageurl ? (
                    <>
                      <video
                        controls="false"
                        autoPlay="true"
                        loop
                        muted
                        playsinline="true"
                        width="200px"
                      >
                        <source src={imageurl} type="video/mp4" />
                      </video>

                      {locationState !== 'View' && (
                        <Box textAlign="center" width="100%">
                          <Button
                            variant="outined"
                            color="primary"
                            component="span"
                            onClick={() => {
                              setbannerImage('')
                              setimageurl('')
                            }}
                          >
                            Remove
                          </Button>
                        </Box>
                      )}
                    </>
                  ) : (
                    <label htmlFor="contained-button-file-add-bun">
                      <Button
                        variant="outined"
                        color="primary"
                        component="span"
                      >
                        Upload &nbsp;
                        <CloudUploadIcon />
                      </Button>
                    </label>
                  )}
                </label>
              </Box>
              {isSubmit && imageurl === '' && (
                <FormHelperText error>*Please select video</FormHelperText>
              )}
            </Grid>
          </Grid>
        </Box>

        <Box className={classes.newbox}>
          <Box>
            {' '}
            <Button
              variant="contained"
              size="large"
              color="secondary"
              className="ml-10"
              onClick={() => history.push('/landing')}
              disabled={process}
            >
              Cancel
            </Button>
          </Box>
          {locationState !== 'View' && (
            <Box>
              {' '}
              <Button
                variant="contained"
                size="large"
                color="secondary"
                className="ml-10"
                onClick={post}
                disabled={process}
              >
                {!process ? 'Post' : message}{' '}
                {process && <ButtonCircularProgress />}
              </Button>
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  )
}
