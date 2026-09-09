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

  const switchAccount = async () => {
    setError('');

    try {
      const ethereum = (
        window as Window & {
          ethereum?: {
            request?: (request: { method: string; params?: unknown[] }) => Promise<unknown>;
          };
        }
      ).ethereum;

      if (!ethereum?.request) {
        throw new Error('MetaMask is unavailable');
      }

      await ethereum.request({
        method: 'wallet_requestPermissions',
        params: [{ eth_accounts: {} }],
      });

      deactivate();
      await activate(injectedConnector, undefined, true);
      window.localStorage.setItem(walletAutoConnectKey, 'true');
    } catch (ex) {
      console.error(ex);
      setError('Wallet switch cancelled');
    }
  };

  const { sx, ...buttonProps } = props;
  const sxOverrides = Array.isArray(sx) ? sx : sx ? [sx] : [];
  const sharedSx = {
    minHeight: { xs: 48, md: 40 },
    px: { xs: 2.4, md: 2 },
    borderRadius: 8,
    border: '1px solid rgba(255,255,255,.16)',
    background: 'linear-gradient(180deg, rgba(255,255,255,.12), rgba(255,255,255,.07))',
    color: '#EDF1F2',
    fontSize: { xs: 15, md: 14 },
    fontWeight: 700,
    boxShadow: 'none',
    '&:hover': {
      background: 'rgba(104, 199, 107,.12)',
      borderColor: 'rgba(104, 199, 107,.65)',
      boxShadow: '0 0 22px rgba(104, 199, 107, 0.16)',
    },
  };

  if (active && account) {
    return (
      <Button
        variant="contained"
        aria-label={`Connected wallet ${account}. Choose another MetaMask account.`}
        title={error || `Connected as ${account}. Click to choose another MetaMask account.`}
        onClick={switchAccount}
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
