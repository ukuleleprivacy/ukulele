import { InjectedConnector } from '@web3-react/injected-connector';

export const injectedConnector = new InjectedConnector({ supportedChainIds: [1] });

export const walletAutoConnectKey = 'ukulele.wallet.autoConnect';
