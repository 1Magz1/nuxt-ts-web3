// eslint-disable-next-line import/named
import { MutationTree } from 'vuex'
import { Web3State } from '~/store/web3/state'

const mutations: MutationTree<Web3State> = {
  setUserAddress: (state, payload: string) => (state.userAddress = payload),
  setIsConnected: (state, payload: boolean) => (state.isConnected = payload),
  setChainId: (state, payload: number | string) => (state.chainId = payload),
  setNetworkName: (state, payload: string) => (state.networkName = payload),
  setTransactionList: (state, payload: Array<Record<string, undefined>>) => (state.transactionList = payload)
}

export default mutations
