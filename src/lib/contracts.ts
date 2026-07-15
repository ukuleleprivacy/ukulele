// src/lib/contracts.ts

import { ethers } from 'ethers';

export const getContract2 = (library: any, address2: string, abi2: any) => {
  const signer = library.getSigner();
  return new ethers.Contract(address2, abi2, signer);
};

export const getContract3 = (library: any, address3: string, abi3: any) => {
  const signer = library.getSigner();
  return new ethers.Contract(address3, abi3, signer);
};

// Additional functions for contract interactions can be added here
