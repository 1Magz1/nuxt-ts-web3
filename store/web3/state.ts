export interface Web3State {
  userAddress: string,
  isConnected: boolean,
  chainId: number | string,
  networkName: string,
  transactionList: Array<Record<string, undefined>>
}

export const initWeb3State = (): Web3State => ({
  userAddress: '',
  isConnected: false,
  chainId: '',
  networkName: '',
  transactionList: []
})

export default initWeb3State
