import { type PropsWithChildren, useEffect, useRef } from 'react';
import { useWeb3React } from '@web3-react/core';

import { injectedConnector, walletAutoConnectKey } from '../lib/wallet';

export const WalletSession = ({ children }: PropsWithChildren) => {
  const { active, activate } = useWeb3React();
  const triedEagerConnection = useRef(false);

  useEffect(() => {
    if (active || triedEagerConnection.current) {
      return;
    }

    triedEagerConnection.current = true;

    if (window.localStorage.getItem(walletAutoConnectKey) === 'false') {
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
        console.warn('[Wallet] Could not restore the previous MetaMask session.', error);
      });

    return () => {
      isCurrent = false;
    };
  }, [active, activate]);

  return <>{children}</>;
};
