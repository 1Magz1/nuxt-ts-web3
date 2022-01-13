import Web3 from 'web3'
// @ts-ignore
import Web4 from '@cryptonteam/web4'
import BigNumber from 'bignumber.js'
import { output, error, IResponse } from '~/utils/index'
import { ERC20 } from '~/utils/abis'

const { IS_MAINNET } = process.env

let web3Wallet: any
let web3Guest: any
let web4: any
let userAddress: string
let chainId: number

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

    web4 = new Web4()
    web4.setProvider(currentProvider, userAddress)

    return output({ userAddress, chainId })
  } catch (err) {
    return error(4001, 'connection error', err)
  }
}
