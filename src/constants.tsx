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
    description: (
      <>
        Please confirm and do not exit the page until you sign and confirm the amount. Please copy the SALT and the
        amount you are sending until the transaction is confirmed so that if the transaction fails for whatever reason,
        you can get back the token you are sending. If you for any reason reject the second transaction of the private
        send and do not have the correct amount and the salt,{' '}
        <span style={{ fontWeight: 'bold', textDecoration: 'underline' }}>
          you will lose the amount you are sending permanently.
        </span>
      </>
    ),
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
