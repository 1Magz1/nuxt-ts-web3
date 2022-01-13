// eslint-disable-next-line import/named
import { GetterTree } from 'vuex'
import { Web3State } from '~/store/web3/state'

const getters: GetterTree<Web3State, any> = {
  getUserAddress: (state): string => state.userAddress,
  getIsConnected: (state): boolean => state.isConnected,
  getChainId: (state): string | number => state.chainId,
  getNetworkName: (state): string => state.networkName
}

export default getters
