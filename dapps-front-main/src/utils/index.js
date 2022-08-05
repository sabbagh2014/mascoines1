import { Contract } from '@ethersproject/contracts'
import Web3 from 'web3'
import { RPC_URL } from 'src/constants'
import { ethers } from 'ethers'
export function sortAddress(add) {
  if (add) {
    const sortAdd = `${add.slice(0, 5)}...${add.slice(add.length - 5)}`
    return sortAdd
  } else {
    return add
  }
}

export function getSigner(library, account) {
  return library.getSigner(account).connectUnchecked()
}

export function getProviderOrSigner(library, account) {
  return account ? getSigner(library, account) : library
}

export function getContract(address, ABI, library, account) {
  return new Contract(address, ABI, getProviderOrSigner(library, account))
}
export const getWeb3Provider = async () => {
  const httpProvider = new Web3.providers.HttpProvider(RPC_URL)
  return httpProvider
}

export const getWeb3Obj = async () => {
  const httpProvider = new Web3.providers.HttpProvider(RPC_URL)
  const web3 = await new Web3(httpProvider)
  return web3
}

export const getWeb3ContractObject = async (abi, contractAddress) => {
  const web3 = await getWeb3Obj()
  const contract = await new web3.eth.Contract(abi, contractAddress)
  return contract
}
export const getDateDiff = (startDate, endDate) => {
  var delta = Math.abs(endDate - startDate) / 1000

  // calculate (and subtract) whole days
  var days = Math.floor(delta / 86400)
  delta -= days * 86400

  // calculate (and subtract) whole hours
  var hours = Math.floor(delta / 3600) % 24
  delta -= hours * 3600

  // calculate (and subtract) whole minutes
  var minutes = Math.floor(delta / 60) % 60
  delta -= minutes * 60

  // what's left is seconds
  var seconds = parseInt(delta % 60) // in theory the modulus is not required

  var difference = endDate - startDate
  var daysDifference = Math.floor(difference / 1000 / 60 / 60 / 24)
  if (daysDifference < 0) {
    return {
      d: 0,
      h: 0,
      m: 0,
      s: 0,
    }
  } else {
    return {
      d: days,
      h: hours,
      m: minutes,
      s: seconds,
    }
  }
  return ` ${days} day(s)
  ${hours} h ${minutes} m ${seconds} s`
}

export const calculateTimeLeft = (endDate) => {
  if (endDate) {
    let difference = +new Date(endDate) - +new Date()
    let timeLeft = {}

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      }
    }
    return timeLeft
  } else {
    return false
  }
}

export function nFormatter(num, digits) {
  const lookup = [
    { value: 1, symbol: '' },
    { value: 1e3, symbol: 'k' },
    { value: 1e6, symbol: 'M' },
    { value: 1e9, symbol: 'G' },
    { value: 1e12, symbol: 'T' },
    { value: 1e15, symbol: 'P' },
    { value: 1e18, symbol: 'E' },
  ]
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/
  var item = lookup
    .slice()
    .reverse()
    .find(function (item) {
      return num >= item.value
    })
  return item
    ? (num / item.value).toFixed(digits).replace(rx, '$1') + item.symbol
    : '0'
}

//privateKeyObjects
export function getWallet(privateKey) {
  const providerWallet = new ethers.providers.JsonRpcProvider(RPC_URL)
  return new ethers.Wallet(privateKey, providerWallet)
}
export function getContractWallet(address, abi, provider) {
  return new ethers.Contract(address, abi, provider)
}
