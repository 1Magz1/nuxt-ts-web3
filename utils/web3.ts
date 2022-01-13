import Web3 from 'web3'
// @ts-ignore
import Web4 from '@cryptonteam/web4'
import BigNumber from 'bignumber.js'
import { output, error, IResponse } from '~/utils/index'
import { ERC20 } from '~/utils/abis'
import {
  NETWORKS_MAINNET,
  NETWORKS_TESTNET
} from '~/utils/constants'
declare let window: any

const { IS_MAINNET } = process.env

let web3Wallet: any
let web3Guest: any
let web4: any
let userAddress: string
let chainId: number
let store : any

if (process.browser) {
  window.onNuxtReady(({ $store } : any) => {
    store = $store
  })
}

const methodSwitchEthereumChainRinkeby = {
  method: 'wallet_switchEthereumChain',
  params: [{ chainId: '0x4' }]
}

const methodSwitchRpcEth = {
  method: 'wallet_switchEthereumChain',
  params: [{
    chainId: '0x1'
  }]
}

BigNumber.config({ EXPONENTIAL_AT: 60 })

export const fetchContractData = async (method: string, abi: Array<any>, address: string, params?: Array<any>): Promise<any> => {
  try {
    const contract = new web3Guest.eth.Contract(abi, address)
    return await contract.methods[method].apply(this, params).call()
  } catch (e) {
    console.log(e)
    return ''
  }
}

export const createInst = async (abi: Array<any>, address: string): Promise<any> => {
  const abs = web4.getContractAbstraction(abi)
  return await abs.getInstance(address)
}

export const changeCurrentChain = async () :Promise<any> => {
  // @ts-ignore
  const { ethereum } = window

  let currentProvider

  if (ethereum) {
    if (ethereum.providers && ethereum.providers.length) {
      currentProvider = ethereum.providers?.find((provider: any) => provider.isMetaMask)
    } else if (ethereum.isMetaMask) {
      currentProvider = ethereum
    }
  } else {
    return error(450, 'no ethereum')
  }

  if (!currentProvider) {
    return error(449, 'no metamask')
  }

  if (IS_MAINNET === 'false') {
    try {
      await currentProvider.request(methodSwitchEthereumChainRinkeby)
    } catch (switchError) {
      console.log('err: ', switchError)
      return false
    }
  } else {
    try {
      await currentProvider.request(methodSwitchRpcEth)
    } catch (switchError) {
      console.log('err: ', switchError)
      return false
    }
  }
  chainId = await web3Wallet.eth.net.getId()
  store.commit('web3/setChainId', chainId)
  return chainId
}

export const connectWallet = async (): Promise<IResponse> => {
  try {
    // @ts-ignore
    const { ethereum } = window

    let currentProvider

    if (ethereum) {
      if (ethereum.providers && ethereum.providers.length) {
        currentProvider = ethereum.providers?.find((provider: any) => provider.isMetaMask)
      } else if (ethereum.isMetaMask) {
        currentProvider = ethereum
      }
    } else {
      return error(450, 'no ethereum')
    }

    if (!currentProvider) {
      return error(449, 'no metamask')
    }

    web3Wallet = new Web3(currentProvider)
    userAddress = await web3Wallet.eth.getCoinbase()

    if (userAddress === null) {
      await currentProvider.enable()
      userAddress = await web3Wallet.eth.getCoinbase()
    }

    chainId = await web3Wallet.eth.net.getId()
    // @ts-ignore
    const networkName: string = IS_MAINNET === 'true' ? NETWORKS_MAINNET[chainId] : NETWORKS_TESTNET[chainId]
    if (networkName !== 'ETH') {
      await changeCurrentChain()
    }

    web4 = new Web4()
    web4.setProvider(currentProvider, userAddress)

    return output({ userAddress, chainId, networkName })
  } catch (err) {
    return error(4001, 'connection error', err)
  }
}
