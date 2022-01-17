import Web3 from 'web3'
// @ts-ignore
import BigNumber from 'bignumber.js'
import { createLogger } from 'vuex'
import { output, error, IResponse } from '~/utils/index'
import { ERC20 } from '~/utils/abis'
import {
  NETWORKS_MAINNET,
  NETWORKS_TESTNET
} from '~/utils/constants'
declare let window: any

const { IS_MAINNET } = process.env

let web3Wallet: any
let userAddress: string
let chainId: number
let store : any
const subscribedEvents = {}

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
  store.dispatch('web3/disconnectWallet')
  // eslint-disable-next-line no-use-before-define
  currentProvider.removeListener('chainChanged', handleChainChanged)
  // eslint-disable-next-line no-use-before-define
  currentProvider.removeListener('accountsChanged', handleAccountsChanged)
  // eslint-disable-next-line no-use-before-define
  currentProvider.removeListener('disconnect', handleDisconnected)
}

async function handleChainChanged (chain: any): Promise<any> {
  chainId = +chain
  if (chainId !== store.getters['web3/getChainId']) {
    await connectWallet()
  } else {
    disconnect()
  }
}

export const handleAccountsChanged = async (account:any): Promise<any> => {
  if (account.length) {
    await store.dispatch('web3/connectWallet')
  } else {
    disconnect()
  }
}

export const handleDisconnected = (): void => {
  disconnect()
}

// web3 function

export const changeCurrentChain = async (): Promise<any> => {
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

export const getTokenData = async (tokenAddress: string): Promise<any> => {
  try {
    const instance: any = await new web3Wallet.eth.Contract(ERC20, tokenAddress)
    const data = await Promise.all([
      instance.methods.symbol().call(),
      instance.methods.decimals().call(),
      instance.methods.name().call()])
    return {
      symbol: data[0],
      decimals: data[1],
      name: data[2]
    }
  } catch (err) {
    console.log('err: ', err)
  }
}

export const getTokenBalance = async (tokenAddress: string, decimals: number): Promise<any> => {
  try {
    const instance: any = await new web3Wallet.eth.Contract(ERC20, tokenAddress)
    const balance = await instance.methods.balanceOf(userAddress).call()
    return new BigNumber(balance).shiftedBy(-decimals).toString()
  } catch (err) {
    console.log('err: ', err)
  }
}

export const allowance = async (tokenAddress: string, recipientAddress: string): Promise<any> => {
  try {
    let allowance
    const instance : any = await new web3Wallet.eth.Contract(ERC20, tokenAddress)
    const decimals = await instance.methods.decimals().call()
    if (decimals) {
      allowance = await instance.methods.allowance(userAddress, recipientAddress).call()
    }

    return new BigNumber(allowance).shiftedBy(-decimals).toString()
  } catch (err) {
    console.log('err: ', err)
  }
}

export const approve = async (tokenAddress: string, recipientAddress: string) :Promise<any> => {
  try {
    let approve
    const instance : any = await new web3Wallet.eth.Contract(ERC20, tokenAddress)
    const decimals = await instance.methods.decimals().call()
    if (decimals) {
      const amount = new BigNumber(1000000).shiftedBy(+decimals).toString()
      approve = await instance.methods.approve(recipientAddress, amount).send({ from: userAddress })
    }

    return approve
  } catch (err) {
    console.log('err: ', err)
  }
}

export const tokenTransfer = async (tokenAddress: string, recipientAddress: string, tokenAmount: string):Promise <any> => {
  try {
    const instance : any = await new web3Wallet.eth.Contract(ERC20, tokenAddress)
    const decimals = await instance.methods.decimals().call()
    const amount = new BigNumber(tokenAmount).shiftedBy(+decimals).toString()
    return await instance.methods.transfer(recipientAddress, amount).send({ from: userAddress })
  } catch (err) {
    console.log('err: ', err)
  }
}

export const subscribeToEvents = async (tokenAddress: string): Promise<any> => {
  const instance: any = await new web3Wallet.eth.Contract(ERC20, tokenAddress)
  console.log('subscribeToEvents')

  instance.events.allEvents()
    .on('data', (event: any) => {
      if (event.event === 'Transfer' || event.event === 'Approval') {
        const transaction = store.getters['web3/getTransactionList']
        const transactionList = JSON.parse(JSON.stringify(transaction))
        transactionList.push(event)
        store.commit('web3/setTransactionList', transactionList)
      }
    })
    .on('error', (err: any) => {
      console.log('subscribeToTransferEvents', err)
    })
}
