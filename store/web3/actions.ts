// eslint-disable-next-line import/named
import { ActionTree } from 'vuex'
import { Web3State } from '~/store/web3/state'
import {
  allowance,
  approve,
  connectWallet,
  getTokenBalance,
  getTokenData,
  tokenTransfer
} from '~/utils/web3'

const actions: ActionTree<Web3State, any> = {
  async connectWallet ({ commit }) {
    let response
    try {
      response = await connectWallet()
    } catch (err) {
      console.log('Connect wallet error')
      throw err
    }
    if (!response.ok) {
      return
    }
    commit('setIsConnected', response.ok)
    commit('setUserAddress', response.result.userAddress)
    commit('setChainId', response.result.chainId)
    commit('setNetworkName', response.result.networkName)
  },
  disconnectWallet ({ commit }) {
    commit('setIsConnected', false)
    commit('setUserAddress', '')
    commit('setChainId', '')
    commit('setNetworkName', '')
  },
  async getAllowance (_, payload) {
    return await allowance(payload.tokenAddress, payload.recipientAddress)
  },
  async getApprove (_, payload) {
    await approve(payload.tokenAddress, payload.recipientAddress)
  },
  async getTokenData (_, payload) {
    return await getTokenData(payload)
  },
  async getTokenBalance (_, payload) {
    return await getTokenBalance(payload.value, payload.decimals)
  },
  async tokenTransfer (_, payload) {
    return await tokenTransfer(payload.tokenAddress, payload.recipientAddress, payload.tokenAmount)
  }
}

export default actions
