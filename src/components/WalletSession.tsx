import { type PropsWithChildren, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';

import { injectedConnector, walletAutoConnectKey } from '../lib/wallet';

export const WalletSession = ({ children }: PropsWithChildren) => {
  const { active, activate } = useWeb3React();

  useEffect(() => {
    if (active || window.localStorage.getItem(walletAutoConnectKey) !== 'true') {
      return;
    }

    let isCurrent = true;

    void injectedConnector
      .isAuthorized()
      .then((isAuthorized) => {
        if (isAuthorized && isCurrent) {
          return activate(injectedConnector, undefined, true);
        }

        return undefined;
      })
      .catch((error) => {
        if (isCurrent) {
          console.warn('[Wallet] Could not restore the previous MetaMask session.', error);
        }
      });

    return () => {
      isCurrent = false;
    };
  }, [active, activate]);

  return <>{children}</>;
};
