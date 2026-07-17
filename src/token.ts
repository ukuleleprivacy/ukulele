export const ukuleleToken = {
  address: '0x799C411D50d1D67C517A34C842381673E377007c',
  name: 'Ukulele',
  symbol: 'UNK',
  network: 'Ethereum mainnet',
  decimals: 18,
  totalSupply: 10_000_000,
  dailySalePercent: 1,
  dailySaleTokens: 100_000,
  developerReservePercent: 15,
  etherscanUrl: 'https://etherscan.io/token/0x799C411D50d1D67C517A34C842381673E377007c',
  uniswapPool: {
    version: 'Uniswap v4',
    pair: 'ETH / UNK',
    feePercent: 1,
    tickSpacing: 200,
    poolId: '0xbcaf2724492673f9157c59bf441d31ffd1623c781179938d36488d2b5a60ed28',
    poolUrl:
      'https://app.uniswap.org/explore/pools/ethereum/0xbcaf2724492673f9157c59bf441d31ffd1623c781179938d36488d2b5a60ed28',
    buyUrl:
      'https://app.uniswap.org/swap?chain=mainnet&inputCurrency=NATIVE&outputCurrency=0x799C411D50d1D67C517A34C842381673E377007c',
    creationTransactionUrl:
      'https://etherscan.io/tx/0x062b6cf0cabcc35f82a2c195a3f6e17d338c03913bf308c9f38ba2c743b41310',
  },
} as const;
