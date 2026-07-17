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
        The website is still in test mode, manuals have not been completed yet, conduct transactions at your own risk.
        <br />
        <br />
        Do not conduct any transactions or press any buttons/toggles before reading the user guide mirror1 mirror2
        mirror3. Uninformed actions may result in loss of privacy and funds.
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
    title: 'Your Private Transaction was Successful',
    description:
      'You have successfully sent your tokens to your recipient. Your public balance has been fully privatized, you may continue sending other private transactions (if you have the balance) or do partial decryptions to publicly move or sell tokens from this wallet. You can also do a Decrypt transaction to reveal your prior public balance after a transaction although this is highly not recommended as the amount you sent will be known.',
    buttonTitle: '',
  },
  4: {
    title: 'You have successfully retrieved your tokens',
    description: '',
    buttonTitle: '',
  },
};

export const gasLimit = '400000'; // Gas limit as a string to prevent BigNumber issues
