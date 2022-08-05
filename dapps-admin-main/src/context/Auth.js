import React, { createContext, useState, useEffect } from 'react'
import axios from 'axios'
import Apiconfigs from 'src/Apiconfig/Apiconfig'

export const AuthContext = createContext()

const setSession = (accessToken) => {
  if (accessToken) {
    localStorage.setItem('creatturAccessToken', accessToken)
    axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`
  } else {
    localStorage.removeItem('creatturAccessToken')
    delete axios.defaults.headers.common.Authorization
  }
}

function checkLogin() {
  const accessToken = window.localStorage.getItem('creatturAccessToken')
  return accessToken ? true : false
}

export default function AuthProvider(props) {
  const [isLogin, setIsLogin] = useState(false)
  const [userData] = useState({})
  const [permissions, setPermissions] = useState()
  const [isLoading, setIsLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState()
  const [platformBalance, setPlatformBalance] = useState({})
  const [adminTotalEarnings, setAdminTotalEarnings] = useState({})
  const [virtualMoney, setVirtualMoney] = useState({})
  const dashboardDataHandler = async () => {
    try {
      const res = await axios.get(Apiconfigs.dashboard, {
        params: {
          searchBy: 'All',
        },
        headers: {
          token: localStorage.getItem('creatturAccessToken'),
        },
      })
      if (res.data.statusCode === 200) {
        setDashboardData(res.data.result)
        setIsLogin(true)
      }
      setIsLoading(false)
    } catch (error) {
      console.log('ERROR', error)
      setIsLoading(false)
    }
  }
  const getTotalAccountBalanceHandler = async () => {
    try {
      const res = await axios({
        method: 'GET',
        url: Apiconfigs.totalAdminBalance,
        headers: {
          token: localStorage.getItem('creatturAccessToken'),
        },
      })
      if (res.data.statusCode === 200) {
        // console.log('response----', res.data.result)
        setPlatformBalance(res.data.result)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const getTotalEarningBalanceHanlder = async () => {
    try {
      const res = await axios({
        method: 'GET',
        url: Apiconfigs.getAdminTotalEarnings,
        headers: {
          token: localStorage.getItem('creatturAccessToken'),
        },
      })
      if (res.data.statusCode === 200) {
        setAdminTotalEarnings(res.data.result)
      }
    } catch (error) {
      console.log(error)
    }
  }
  const getTotalVirtualMoneyHandler = async () => {
    try {
      const res = await axios({
        method: 'GET',
        url: Apiconfigs.totalUserFunds,
        headers: {
          token: localStorage.getItem('creatturAccessToken'),
        },
      })
      if (res.data.statusCode === 200) {
        setVirtualMoney(res?.data?.result[0])
      }
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    // if (window.localStorage.getItem('creatturAccessToken')) {
    dashboardDataHandler()
    // }
    if (window.sessionStorage.getItem('userType') === 'Admin') {
      getTotalAccountBalanceHandler()
      getTotalEarningBalanceHanlder()
      getTotalVirtualMoneyHandler()
    }
    var obj = JSON.parse(sessionStorage.getItem('permission'))
    setPermissions(obj)
  }, [isLogin])
  let data = {
    userLoggedIn: isLogin,
    userData,
    dashboardData,
    isLoading,
    permissions,
    platformBalance,
    adminTotalEarnings,
    virtualMoney,
    // setPermissions: (data) => setPermissions(data),
    userLogIn: (type, data) => {
      setSession(data)
      setIsLogin(type)
    },
    logout: () => {
      setIsLogin(false)
      localStorage.removeItem('creatturAccessToken')
      sessionStorage.removeItem('permission')
    },
  }

  return (
    <AuthContext.Provider value={data}>{props.children}</AuthContext.Provider>
  )
}
