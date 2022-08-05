import React, { useContext, useEffect, useState } from 'react'
import AuctionPage from '../UserSignUp/AuctionPage'
import Advertisement from './Advertisement'
import BannerSection from './BannerSection'
import HowItWorks from './HowItWorks'
import OurSolutions from './OurSolutions'
import { UserContext } from 'src/context/User'
import axios from 'axios'
import Apiconfigs from 'src/Apiconfig/Apiconfigs'
export default function Main() {
  const auth = useContext(UserContext)
  const [bannerDetails, setBannerDetails] = useState([])
  const [ourSolutions, setOurSolutions] = useState({})
  const [howItWorksData, setHoeItWorksData] = useState({})
  const [bannerVideo, setBannerVideo] = useState([])
  const getBannerContentHandler = async () => {
    try {
      const res = await axios({
        method: 'GET',
        url: Apiconfigs.getBannerBackground,
      })
      if (res.data.statusCode === 200) {
        console.log('responeBanner', res.data.result)
        setBannerDetails(res.data.result)
      }
    } catch (error) {
      console.log(error)
    }
  }
  const getBannerVideoDataHandler = async () => {
    try {
      const res = await axios({
        method: 'GET',
        url: Apiconfigs.getVideos,
      })
      if (res.data.statusCode === 200) {
        console.log('videos----', res.data.result)

        setBannerVideo(res.data.result)
      }
    } catch (error) {
      console.log(error)
    }
  }
  const getOurSolutionContentHandler = async () => {
    try {
      const res = await axios({
        method: 'GET',
        url: Apiconfigs.content,
        params: {
          type: 'solution',
        },
      })
      if (res.data.statusCode === 200) {
        setOurSolutions(res.data.result)
      }
    } catch (error) {
      console.log(error)
    }
  }
  const getHowitWorksContentHandler = async () => {
    try {
      const res = await axios({
        method: 'GET',
        url: Apiconfigs.content,
        params: {
          type: 'howItWorks',
        },
      })
      if (res.data.statusCode === 200) {
        setHoeItWorksData(res.data.result)
      }
    } catch (error) {
      console.log(error)
    }
  }
  const [isLoading, setIsLoading] = useState(false)
  const [users, setUsers] = useState([])

  function getRandomInt(max) {
    return Math.floor(Math.random() * max)
  }

  const BannerList = async () => {
    setIsLoading(true)
    try {
      const res = await axios({
        method: 'GET',
        url: Apiconfigs.getBanner,
      })

      if (res.data.statusCode === 200) {
        setIsLoading(false)
        const id = getRandomInt(res?.data?.result?.length)
        setUsers(res.data.result[id])
        // setUsers(res.data.result)
      }
    } catch (error) {
      console.log(error)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    BannerList()
  }, [])
  useEffect(() => {
    getBannerContentHandler()
    getOurSolutionContentHandler()
    getHowitWorksContentHandler()
    getBannerVideoDataHandler()
  }, [])
  return (
    <>
      <BannerSection
        auth={auth}
        bannerDetails={bannerDetails}
        bannerVideo={bannerVideo}
      />
      {users && users.length !== 0 && (


        <Advertisement isLoading={isLoading} users={users} />
      )}
      <OurSolutions auth={auth} ourSolutions={ourSolutions} />
      <HowItWorks auth={auth} howItWorksData={howItWorksData} />
      <AuctionPage />
    </>
  )
}
