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
        Read The Obscura Protocol before continuing. Keep the recovery record private and retain it
        until PART II is complete.
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
          fontSize: 'clamp(2rem, 5vw, 3.5rem)',
          fontWeight: 700,
          lineHeight: 1.1,
        }}
      >
        Please wait for and accept the 2nd transaction
      </span>
    ),
    buttonTitle: 'Setting up the hash. Part 1 / 2',
  },
  2: {
    title: 'Completing the Private Transaction Send',
    description:
      "You'll have a plain text file downloaded to you, it has your amount, recipient and SALT just in case the 2nd transaction doesn't pass and for your own personal records, don't freak out out if your balance is zero, that's fine!",
    buttonTitle: 'Sending BV3 to Recipient. Part 2 / 2',
  },
  3: {
    title: 'The Two-Step SEND Confirmed',
    description:
      'Both Ethereum transactions confirmed. Your private SEND is complete; retain the recovery record and inspect the resulting wallet state.',
    buttonTitle: '',
  },
  4: {
    title: 'You have successfully retrieved your tokens',
    description: '',
    buttonTitle: '',
  },
};

export const gasLimit = '400000'; // Gas limit as a string to prevent BigNumber issues
