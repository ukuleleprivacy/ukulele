import { useState } from 'react';
import Button, { type ButtonProps } from '@mui/material/Button';
import { useWeb3React } from '@web3-react/core';

import { injectedConnector, walletAutoConnectKey } from '../lib/wallet';

const shortenAddress = (address: string) => `${address.slice(0, 6)}…${address.slice(-4)}`;

export const ConnectWallet = (props: ButtonProps) => {
  const { active, account, activate, deactivate } = useWeb3React();
  const [error, setError] = useState('');

  const connect = async () => {
    setError('');

    try {
      await activate(injectedConnector, undefined, true);
      window.localStorage.setItem(walletAutoConnectKey, 'true');
    } catch (ex) {
      console.error(ex);
      setError('Wallet unavailable');
    }
  };

  const disconnect = async () => {
    setError('');

    try {
      window.localStorage.setItem(walletAutoConnectKey, 'false');
      deactivate();
    } catch (ex) {
      console.error(ex);
      setError('Sign out failed');
    }
  };

  const { sx, ...buttonProps } = props;
  const sxOverrides = Array.isArray(sx) ? sx : sx ? [sx] : [];
  const sharedSx = {
    minHeight: { xs: 48, md: 40 },
    px: { xs: 2.4, md: 2 },
    borderRadius: 999,
    background: 'linear-gradient(135deg, #FFFFFF 0%, #E0E0E0 100%)',
    color: '#0A0A0A',
    fontSize: { xs: 15, md: 14 },
    fontWeight: 700,
    boxShadow: 'none',
    '&:hover': {
      background: 'linear-gradient(135deg, #E8E8E8 0%, #C9C9C9 100%)',
      boxShadow: '0 0 30px rgba(255, 255, 255, 0.32)',
    },
  };

  if (active && account) {
    return (
      <Button
        variant="contained"
        aria-label={`Disconnect wallet ${account}`}
        title={error || `Connected as ${account}. Click to disconnect.`}
        onClick={disconnect}
        {...buttonProps}
        sx={[sharedSx, ...sxOverrides]}
      >
        {shortenAddress(account)}
      </Button>
    );
  }

  return (
    <Button
      variant="contained"
      aria-label="Connect wallet"
      title={error || 'Connect MetaMask or another injected web3 wallet'}
      onClick={connect}
      {...buttonProps}
      sx={[sharedSx, ...sxOverrides]}
    >
      Connect Wallet
    </Button>
  );
};
