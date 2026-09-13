import { ethers } from 'ethers';
import { gasLimit } from '../constants';

export const transactionOptions = { gasLimit: ethers.BigNumber.from(gasLimit) };
export type TransactionMessage = { title: string; description: string };
export class PrivacyError extends Error {
  constructor(
    public title: string,
    message: string,
  ) {
    super(message);
  }
}

export function parseFiduAmount(value: string) {
  if (!/^(?:\d+\.?\d*|\.\d+)$/.test(value.trim())) {
    throw new PrivacyError('Check the amount', 'Enter a positive FIDU amount without commas or scientific notation.');
  }
  let amount: ethers.BigNumber;
  try {
    amount = ethers.utils.parseUnits(value.trim(), 18);
  } catch {
    throw new PrivacyError('Check the amount', 'FIDU supports up to 18 decimal places.');
  }
  if (amount.lte(0) || amount.gt(ethers.constants.MaxUint256)) {
    throw new PrivacyError('Check the amount', 'Enter a positive amount within the token’s supported range.');
  }
  return amount;
}

export function validateRecipient(value: string) {
  return ethers.utils.isAddress(value) && value.toLowerCase() !== ethers.constants.AddressZero
    ? true
    : 'Enter a valid, non-zero Ethereum recipient address.';
}

export async function requirePrivacySigner(
  library: ethers.providers.Web3Provider | undefined,
  account: string | null | undefined,
  expectedAccount?: string,
) {
  if (!library || !account) throw new PrivacyError('Connect your wallet', 'Connect an Ethereum wallet to continue.');
  // Query the injected provider rather than relying on a cached network object.
  const chainId = await library.send('eth_chainId', []);
  if (Number(chainId) !== 1)
    throw new PrivacyError(
      'Switch to Ethereum Mainnet',
      'This FIDU flow runs on Ethereum Mainnet. Change the network in your wallet and retry.',
    );
  const signer = library.getSigner();
  const currentAccount = await signer.getAddress();
  if (currentAccount.toLowerCase() !== (expectedAccount || account).toLowerCase()) {
    throw new PrivacyError(
      'Wallet account changed',
      'Return to the wallet that started this operation before continuing.',
    );
  }
  return signer;
}

type ReceiptError = {
  code?: string | number;
  cancelled?: boolean;
  receipt?: ethers.providers.TransactionReceipt;
  reason?: string;
  message?: string;
  error?: ReceiptError;
  data?: { message?: string };
};
export const transactionDefinitelyStopped = (error: unknown) => {
  const e = error as ReceiptError | undefined;
  return e?.receipt?.status === 0 || (e?.code === 'TRANSACTION_REPLACED' && e.cancelled === true);
};

export async function confirmPrivacyTransaction(tx: ethers.providers.TransactionResponse) {
  let receipt: ethers.providers.TransactionReceipt;
  try {
    receipt = await tx.wait(1);
  } catch (error) {
    const e = error as ReceiptError;
    // A repriced transaction is the same call. A cancellation or different call is not success.
    if (e.code === 'TRANSACTION_REPLACED' && e.cancelled === false && e.receipt) receipt = e.receipt;
    else throw error;
  }
  if (!receipt || receipt.status !== 1) {
    throw Object.assign(new Error('Transaction reverted'), { code: 'CALL_EXCEPTION', receipt });
  }
  return receipt;
}

export function privacyTransactionError(error: unknown): TransactionMessage {
  if (error instanceof PrivacyError) return { title: error.title, description: error.message };
  const e = error as ReceiptError | undefined;
  const code = e?.code || e?.error?.code;
  const message = [e?.reason, e?.message, e?.error?.message, e?.data?.message].filter(Boolean).join(' ');
  if (code === 4001 || code === 'ACTION_REJECTED' || /user rejected|user denied/i.test(message))
    return {
      title: 'Wallet request declined',
      description: 'This wallet request was declined. You can retry when ready.',
    };
  if (code === 'TRANSACTION_REPLACED' && e?.cancelled)
    return {
      title: 'Transaction replaced or cancelled',
      description: 'The original operation did not complete. Review the replacement in your wallet before retrying.',
    };
  if (code === 'INSUFFICIENT_FUNDS' || /insufficient funds/i.test(message))
    return {
      title: 'ETH needed for gas',
      description: 'Your wallet needs enough ETH to cover network fees. FIDU cannot pay Ethereum gas.',
    };
  if (code === -32002)
    return {
      title: 'Wallet request already open',
      description: 'Open your wallet and finish its pending request before trying again.',
    };
  if (/not a privacy contract/i.test(message))
    return {
      title: 'Contract authorization failed',
      description:
        'The configured privacy contract is not authorized by the address registry. Stop here and contact support.',
    };
  if (code === 'CALL_EXCEPTION' || code === 'UNPREDICTABLE_GAS_LIMIT' || /revert|transaction failed/i.test(message))
    return {
      title: 'Contract rejected this operation',
      description:
        'Check the amount, wallet and current FIDU state. A failed mined transaction may still consume ETH gas.',
    };
  if (code === 'NETWORK_ERROR' || code === 'SERVER_ERROR' || code === 'TIMEOUT' || code === 4900 || code === 4901)
    return {
      title: 'Connection interrupted',
      description:
        'Reconnect to Ethereum Mainnet. If a transaction was submitted, check its confirmation before sending anything again.',
    };
  return {
    title: 'Operation could not finish',
    description: 'Check your wallet and network connection. Any submitted transaction must be checked before retrying.',
  };
}
