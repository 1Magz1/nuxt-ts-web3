export interface Web3State {
  userAddress: string,
  isConnected: boolean,
  chainId: number | string,
  networkName: string,
}

export const initWeb3State = (): Web3State => ({
  userAddress: '',
  isConnected: false,
  chainId: '',
  networkName: ''
})

export default initWeb3State
