import { useState } from 'react';
import Button, { type ButtonProps } from '@mui/material/Button';
import { InjectedConnector } from '@web3-react/injected-connector';
import { useWeb3React } from '@web3-react/core';

const injected = new InjectedConnector({ supportedChainIds: [1] });

export const ConnectWallet = (props: ButtonProps) => {
  const { active, account, activate, deactivate } = useWeb3React();
  const [error, setError] = useState('');

  const connect = async () => {
    setError('');

    try {
      await activate(injected, undefined, true);
    } catch (ex) {
      console.error(ex);
      setError('Wallet unavailable');
    }
  };

  const disconnect = async () => {
    setError('');

    try {
      deactivate();
    } catch (ex) {
      console.error(ex);
      setError('Sign out failed');
    }
  };

  const { sx, ...buttonProps } = props;
  const sxOverrides = Array.isArray(sx) ? sx : sx ? [sx] : [];
  const sharedSx = {
    minHeight: { xs: 48, md: 56 },
    px: { xs: 2.4, md: 4 },
    borderRadius: 999,
    background: 'linear-gradient(135deg, #FFFFFF 0%, #E0E0E0 100%)',
    color: '#0A0A0A',
    fontSize: { xs: 15, md: 17 },
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
        aria-label={`Sign out wallet ${account}`}
        title={error || account}
        onClick={disconnect}
        {...buttonProps}
        sx={[sharedSx, ...sxOverrides]}
      >
        Sign Out
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
