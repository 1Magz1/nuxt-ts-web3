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

const setCurrentProvider = () :any => {
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

  return currentProvider
}

// handle function

export const disconnect = () :void => {
  const currentProvider = setCurrentProvider()
  console.log('Disconnected')
  // store.dispatch('web3/disconnectUserWallet')
  // eslint-disable-next-line no-use-before-define
  currentProvider.removeListener('chainChanged', handleChainChanged)
  // eslint-disable-next-line no-use-before-define
  currentProvider.removeListener('accountsChanged', handleAccountsChanged)
  // eslint-disable-next-line no-use-before-define
  currentProvider.removeListener('disconnect', handleDisconnected)
}

async function handleChainChanged (chain: any):Promise<any> {
  chainId = +chain
  if (chainId !== store.getters['web3/getChainId']) {
    // eslint-disable-next-line no-use-before-define
    await connectWallet()
  } else {
    disconnect()
  }
}

export const handleAccountsChanged = async (account:any):Promise<any> => {
  if (account.length) {
    await store.dispatch('web3/connectWallet')
  } else {
    disconnect()
  }
}

export const handleDisconnected = () :void => {
  disconnect()
}

// web3 function

export const changeCurrentChain = async () :Promise<any> => {
  const currentProvider = setCurrentProvider()

  if (IS_MAINNET === 'false') {
    try {
      await currentProvider.request(methodSwitchEthereumChainRinkeby)
    } catch (switchError) {
      console.log('err: ', switchError)
      return false
    }
  } else if (IS_MAINNET === 'true') {
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
    const currentProvider = setCurrentProvider()

    currentProvider.removeListener('chainChanged', handleChainChanged)
    currentProvider.removeListener('accountsChanged', handleAccountsChanged)
    currentProvider.removeListener('disconnect', handleDisconnected)

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

    currentProvider.on('chainChanged', handleChainChanged)
    currentProvider.on('accountsChanged', handleAccountsChanged)
    currentProvider.on('disconnect', handleDisconnected)

    return output({ userAddress, chainId, networkName })
  } catch (err) {
    return error(4001, 'connection error', err)
  }
}
