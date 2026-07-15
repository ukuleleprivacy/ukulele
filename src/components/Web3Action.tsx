// Web3Action.tsx

import React from 'react';
import { Button } from '@mui/material';
import { ethers } from 'ethers';
import { useWeb3React } from '@web3-react/core';

interface Web3ActionProps {
  contractAddress: string;
  contractAbi: any;
  action: (contract: ethers.Contract) => Promise<void>;
  children: React.ReactNode;
  buttonProps?: React.ComponentProps<typeof Button>;
}

export function Web3Action({
  contractAddress,
  contractAbi,
  action,
  children,
  buttonProps,
}: Web3ActionProps) {
  const { library, account, active } = useWeb3React();

  const handleClick = async () => {
    if (!active || !account || !library) {
      alert('Please connect your wallet.');
      return;
    }

    try {
      const signer = library.getSigner();
      const contract = new ethers.Contract(contractAddress, contractAbi, signer);
      await action(contract);
    } catch (err) {
      console.error('Error performing action:', err);
    }
  };

  return (
    <Button variant="contained" onClick={handleClick} {...(buttonProps || {})}>
      {children}
    </Button>
  );
}

export function UnstyledWeb3Action({
  contractAddress,
  contractAbi,
  action,
  children,
}: Web3ActionProps) {
  const { library, account, active } = useWeb3React();

  const handleClick = async () => {
    if (!active || !account || !library) {
      alert('Please connect your wallet.');
      return;
    }

    try {
      const signer = library.getSigner();
      const contract = new ethers.Contract(contractAddress, contractAbi, signer);
      await action(contract);
    } catch (err) {
      console.error('Error performing action:', err);
    }
  };

  return (
    <button onClick={handleClick} className="web-3-button">
      {children}
    </button>
  );
}
