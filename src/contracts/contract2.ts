export const abi = [
  'function encryptValues(address userAddress,uint256 amount,uint256 SALT) view returns (uint256[])',
  'function PART_I_(uint256[] encryptedArray)',
  'function PART_II_(address lillypadAddress,uint256[] encryptedArray)',
  'function PART_I_GSN(uint256[] encryptedArray,address user)',
  'function PART_II_GSN(address lillypadAddress,uint256[] encryptedArray,address user)',
  'function PART_III(uint256 amount_WITHDRAW,address ORIGINAL__address_user) returns (bool)',
  'function deductPrivateBalance(address user,uint256 amount) returns (bool)',
  'function editHash_EMERGENCY(uint256 amount,uint256 SALT) returns (bool)',
  'function viewHash(address user) view returns (bytes32)',
  'function deleteHash(address user)',
  'function setAddresses(address _bv3Address,address _addressRegistry,address _gsnContract)',
] as const;

export const address =
  process.env.NEXT_PUBLIC_PRIVACY_ADDRESS || '0xd56fd7E66E39ddFC16E0e196c49794d17d75d386';
