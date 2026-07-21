import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { useWeb3React } from '@web3-react/core';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { fiducaroToken } from '../token';

const balanceAbi = ['function balanceOf(address owner) view returns (uint256)'] as const;
const balanceRefreshInterval = 15_000;

const formatBalance = (balance: ethers.BigNumber) => {
  const tokenAmount = Number(ethers.utils.formatUnits(balance, fiducaroToken.decimals));

  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 4,
  }).format(tokenAmount);
};

type WalletBalanceProps = {
  fullWidth?: boolean;
};

export const WalletBalance = ({ fullWidth = false }: WalletBalanceProps) => {
  const { active, account, library } = useWeb3React();
  const [balance, setBalance] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!active || !account || !library) {
      setBalance(null);
      setHasError(false);
      return;
    }

    let isCurrent = true;
    const tokenContract = new ethers.Contract(fiducaroToken.address, balanceAbi, library);

    const loadBalance = async () => {
      try {
        const nextBalance = await tokenContract.balanceOf(account);

        if (isCurrent) {
          setBalance(formatBalance(nextBalance));
          setHasError(false);
        }
      } catch (error) {
        console.warn('[Wallet] Could not load the public FIDUCARO balance.', error);

        if (isCurrent) {
          setHasError(true);
        }
      }
    };

    void loadBalance();
    const refreshTimer = window.setInterval(() => void loadBalance(), balanceRefreshInterval);

    return () => {
      isCurrent = false;
      window.clearInterval(refreshTimer);
    };
  }, [account, active, library]);

  if (!active || !account) {
    return null;
  }

  const displayBalance = hasError ? 'Unavailable' : balance === null ? 'Loading…' : `${balance} FIDU`;

  return (
    <Tooltip title="Public FIDUCARO token balance" arrow>
      <Box
        role="status"
        aria-label={`Public FIDUCARO balance: ${displayBalance}`}
        sx={{
          minHeight: 40,
          width: fullWidth ? '100%' : 'auto',
          px: 1.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 999,
          border: '1px solid rgba(255, 255, 255, 0.14)',
          backgroundColor: 'rgba(255, 255, 255, 0.045)',
          whiteSpace: 'nowrap',
        }}
      >
        <Typography variant="caption" color="text.secondary" sx={{ mr: 0.75, fontWeight: 700 }}>
          Balance
        </Typography>
        <Typography variant="caption" color="text.primary" sx={{ fontWeight: 700 }}>
          {displayBalance}
        </Typography>
      </Box>
    </Tooltip>
  );
};
