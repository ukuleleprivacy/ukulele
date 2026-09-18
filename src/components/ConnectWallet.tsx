import { useEffect, useState } from 'react';
import Alert from '@mui/material/Alert';
import Button, { type ButtonProps } from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import { useWeb3React } from '@web3-react/core';

import { injectedConnector } from '../lib/wallet';

const shortenAddress = (address: string) => `${address.slice(0, 6)}…${address.slice(-4)}`;

type InjectedWallet = {
  request?: (request: { method: string; params?: unknown[] }) => Promise<unknown>;
  on?: (event: string, listener: (chainId: string) => void) => void;
  removeListener?: (event: string, listener: (chainId: string) => void) => void;
};

const getInjectedWallet = (): InjectedWallet | undefined =>
  (window as Window & { ethereum?: InjectedWallet }).ethereum;

const ensureEthereumMainnet = async () => {
  const ethereum = getInjectedWallet();
  if (!ethereum?.request) return;

  const chainId = await ethereum.request({ method: 'eth_chainId' });
  if (chainId !== '0x1') {
    await ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x1' }],
    });
  }
};

export const ConnectWallet = (props: ButtonProps) => {
  const { active, account, activate, deactivate } = useWeb3React();
  const [error, setError] = useState('');

  useEffect(() => {
    const ethereum = getInjectedWallet();
    const handleChainChange = (chainId: string) => {
      setError(chainId === '0x1' ? '' : 'This site uses Ethereum Mainnet. Switch your wallet back to Ethereum to continue.');
    };
    ethereum?.on?.('chainChanged', handleChainChange);
    return () => ethereum?.removeListener?.('chainChanged', handleChainChange);
  }, []);

  const connect = async () => {
    setError('');

    try {
      await ensureEthereumMainnet();
      await activate(injectedConnector, undefined, true);
    } catch (ex) {
      setError(
        (ex as { code?: number }).code === 4001
          ? 'Ethereum network switch or wallet connection was declined.'
          : 'Could not connect to Ethereum Mainnet. Check your wallet and try again.'
      );
    }
  };

  const switchAccount = async () => {
    setError('');

    try {
      const ethereum = getInjectedWallet();

      if (!ethereum?.request) {
        throw new Error('MetaMask is unavailable');
      }

      await ethereum.request({
        method: 'wallet_requestPermissions',
        params: [{ eth_accounts: {} }],
      });

      deactivate();
      await ensureEthereumMainnet();
      await activate(injectedConnector, undefined, true);
    } catch (ex) {
      setError('Could not switch accounts. Check your wallet and try again.');
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

  const errorAlert = (
    <Snackbar open={Boolean(error)} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
      <Alert severity="error" variant="filled" onClose={() => setError('')} sx={{ maxWidth: 'min(90vw, 480px)' }}>
        {error}
      </Alert>
    </Snackbar>
  );

  if (active && account) {
    return (
      <>
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
        {errorAlert}
      </>
    );
  }

  return (
    <>
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
      {errorAlert}
    </>
  );
};
