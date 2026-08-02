export const faucetAddress = '0xe3262d474FE2f6D92cE7B6C6060b01A1e4684Fc3';

export const faucetAbi = [
  'function claim()',
  'function FAUCET_AMOUNT() view returns (uint256)',
  'function fiduToken() view returns (address)',
  'function getBalance() view returns (uint256)',
  'function hasClaimed(address) view returns (bool)',
  'event Claimed(address indexed user,uint256 amount)',
] as const;
