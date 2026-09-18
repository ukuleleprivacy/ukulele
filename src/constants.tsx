// src/constants.ts

import type { ReactNode } from 'react';

export type Steps = 0 | 1 | 2 | 3 | 4;

export type Message = {
  title: string;
  description: ReactNode;
  buttonTitle: string;
};

export const progressMessagesMap: Record<Steps, Message> = {
  0: {
    title: 'Attention Required',
    description: (
      <>
        FIDUCARO is live on Ethereum mainnet. Transactions and gas costs are real; review every
        wallet request before approving it.
        <br />
        <br />
        Your send details are saved in Account. Keep this page open until PART II is complete.
      </>
    ),
    buttonTitle: '',
  },
  1: {
    title: 'Sending a Private Tx',
    description: (
      <span
        style={{
          display: 'block',
          color: '#F5F5F5',
          fontSize: 'clamp(1.4rem, 2.5vw, 2rem)',
          fontWeight: 700,
          lineHeight: 1.25,
        }}
      >
        Confirm PART I in your wallet, then wait for Ethereum confirmation.
      </span>
    ),
    buttonTitle: 'Setting up the hash. Part 1 / 2',
  },
  2: {
    title: 'Completing the Private Transaction Send',
    description:
      'Your amount, recipient, SALT and note are saved in Account. Confirm PART II in your wallet and keep this page open until it completes. Your public balance may show zero after PART I.',
    buttonTitle: 'Completing private send · PART II',
  },
  3: {
    title: 'The Two-Step SEND Confirmed',
    description:
      'Both Ethereum transactions confirmed. Your private send is complete. View the record and cached private balance in Account.',
    buttonTitle: '',
  },
  4: {
    title: 'You have successfully retrieved your tokens',
    description: '',
    buttonTitle: '',
  },
};

export const gasLimit = '400000'; // Gas limit as a string to prevent BigNumber issues
