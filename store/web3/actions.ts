// eslint-disable-next-line import/named
import { ActionTree } from 'vuex'
import { Web3State } from '~/store/web3/state'
import { connectWallet, getTokenData } from '~/utils/web3'

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
  async getTokenData (_, payload) {
    return await getTokenData(payload)
  }
}

export default actions
