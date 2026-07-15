import { ethers } from 'ethers';

export const GASLESS_ACTION = {
  swapBV3ForETH: 0,
  partI: 1,
  partII: 2,
} as const;

export type GaslessAction = (typeof GASLESS_ACTION)[keyof typeof GASLESS_ACTION];
export type GaslessFunctionName = 'executeSwapBV3ForETH' | 'executePartI' | 'executePartII';

type SignGaslessActionParams = {
  signer: ethers.providers.JsonRpcSigner;
  user: string;
  chainId: number;
  verifyingContract: string;
  privacyContractAddress?: string;
  encryptedArray?: readonly ethers.BigNumberish[];
  action: GaslessAction;
  nonce: ethers.BigNumberish;
  deadline: number;
};

type RelayPayload = {
  target: string;
  functionName: GaslessFunctionName;
  request: {
    user: string;
    privacyContractAddress?: string;
    encryptedArray?: string[];
    deadline: number;
    signature: string;
  };
};

const ZERO_ADDRESS = ethers.constants.AddressZero;
const ZERO_HASH = ethers.constants.HashZero;

export const isGaslessRelayConfigured = () => Boolean(process.env.NEXT_PUBLIC_GSN_RELAY_URL);

export const toRelayEncryptedArray = (encryptedArray: readonly ethers.BigNumberish[]) =>
  encryptedArray.map((value) => ethers.BigNumber.from(value).toString());

export const getEncryptedArrayHash = (encryptedArray?: readonly ethers.BigNumberish[]) => {
  if (!encryptedArray) {
    return ZERO_HASH;
  }

  return ethers.utils.keccak256(
    ethers.utils.defaultAbiCoder.encode(['uint256[]'], [toRelayEncryptedArray(encryptedArray)]),
  );
};

export const signGaslessAction = async ({
  signer,
  user,
  chainId,
  verifyingContract,
  privacyContractAddress,
  encryptedArray,
  action,
  nonce,
  deadline,
}: SignGaslessActionParams) => {
  const domain = {
    name: 'UKULELE GSN',
    version: '1',
    chainId,
    verifyingContract,
  };

  const types = {
    GaslessAction: [
      { name: 'user', type: 'address' },
      { name: 'privacyContractAddress', type: 'address' },
      { name: 'encryptedArrayHash', type: 'bytes32' },
      { name: 'action', type: 'uint8' },
      { name: 'nonce', type: 'uint256' },
      { name: 'deadline', type: 'uint256' },
    ],
  };

  const value = {
    user,
    privacyContractAddress: privacyContractAddress || ZERO_ADDRESS,
    encryptedArrayHash: getEncryptedArrayHash(encryptedArray),
    action,
    nonce: ethers.BigNumber.from(nonce).toString(),
    deadline,
  };

  return signer._signTypedData(domain, types, value);
};

export const relayGaslessAction = async (payload: RelayPayload) => {
  const relayUrl = process.env.NEXT_PUBLIC_GSN_RELAY_URL;

  if (!relayUrl) {
    throw new Error('NEXT_PUBLIC_GSN_RELAY_URL is not configured.');
  }

  const response = await fetch(relayUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const body = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(body?.error || 'Gasless relay request failed.');
  }

  return body;
};
