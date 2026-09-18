import { useRef, useState } from 'react';
import { ethers } from 'ethers';
import { useWeb3React } from '@web3-react/core';
import { Alert, Button, CircularProgress, TextField, Typography } from '@mui/material';
import { applyPrivateBalanceChange } from '../lib/privateBalanceCache';
import { abi, address } from '../contracts/contract1';
import {
  TransactionMessage,
  confirmPrivacyTransaction,
  parseFiduAmount,
  privacyTransactionError,
  requirePrivacySigner,
  transactionDefinitelyStopped,
  transactionOptions,
} from '../lib/privacyTransactions';
import { walletBalanceRefreshEvent } from '../lib/wallet';
import { usePrivacyOperation } from './usePrivacyOperation';
import styles from './privacy.module.css';

type Action = 'full' | 'partial';
type Pending = { tx: ethers.providers.TransactionResponse; owner: string; action: Action; amount: string };
export function PrivacyDecrypt({ onBusyChange }: { onBusyChange: (busy: boolean) => void }) {
  const { library, account } = useWeb3React<ethers.providers.Web3Provider>();
  const [amount, setAmount] = useState('');
  const [busy, setBusy] = useState<Action | null>(null);
  const [pending, setPending] = useState<Pending | null>(null);
  const [status, setStatus] = useState<TransactionMessage | null>(null);
  const [failed, setFailed] = useState(false);
  const [hash, setHash] = useState('');
  const [balanceError, setBalanceError] = useState('');
  const running = useRef(false);
  usePrivacyOperation(Boolean(busy || pending), onBusyChange);
  const run = async (action: Action) => {
    if (running.current) return;
    running.current = true;
    setBusy(action);
    setFailed(false);
    setStatus(null);
    let operation = pending;
    try {
      const signer = await requirePrivacySigner(library, account, operation?.owner);
      if (!operation) {
        const owner = await signer.getAddress();
        const contract = new ethers.Contract(address, abi, signer);
        const method = action === 'full' ? 'decrypt' : 'decrypt_partial';
        const args = action === 'full' ? [transactionOptions] : [parseFiduAmount(amount), transactionOptions];
        setStatus({
          title: 'Checking the request',
          description: 'Simulating this decrypt before requesting your wallet approval.',
        });
        await contract.callStatic[method](...args);
        await requirePrivacySigner(library, account, owner);
        setStatus({
          title: 'Confirm in your wallet',
          description: 'This returns FIDU to your public wallet and uses ETH for gas.',
        });
        const tx = await contract[method](...args);
        operation = { tx, owner, action, amount };
        setPending(operation);
        setHash(tx.hash);
      }
      setStatus({
        title: 'Waiting for Ethereum',
        description: 'Your transaction is submitted. Keep this page open while it confirms.',
      });
      const receipt = await confirmPrivacyTransaction(operation.tx);
      try {
        applyPrivateBalanceChange(operation.owner, receipt.transactionHash,
          operation.action === 'full' ? '0' : parseFiduAmount(operation.amount).mul(-1).toString(), operation.action === 'full');
        setBalanceError('');
      } catch {
        setBalanceError('Decrypt confirmed, but the cached private balance could not be updated. Correct it in Account.');
      }
      setHash(receipt.transactionHash);
      setPending(null);
      setStatus({
        title: 'Decrypt confirmed',
        description:
          operation.action === 'full'
            ? 'Your full private FIDU balance has returned to public state.'
            : `${operation.amount} FIDU has returned to public state.`,
      });
      if (operation.action === 'partial') setAmount('');
      window.dispatchEvent(new Event(walletBalanceRefreshEvent));
    } catch (failure) {
      if (transactionDefinitelyStopped(failure)) {
        operation = null;
        setPending(null);
      }
      setFailed(true);
      const message = privacyTransactionError(failure);
      setStatus({
        ...message,
        description: `${message.description}${operation ? ' Use Check confirmation to check the submitted transaction without sending another.' : ''}`,
      });
    } finally {
      running.current = false;
      setBusy(null);
    }
  };
  return (
    <section>
      <div className={styles.sectionHeading}>
        <span>02 / DECRYPT FIDU</span>
        <h2>
          Bring just enough
          <br />
          back into view.
        </h2>
        <p>Restore all or part of your private Fiducaro token balance to the connected public wallet.</p>
      </div>
      <div className={styles.decryptGrid}>
        {(['full', 'partial'] as const).map((action) => (
          <article
            className={styles.decryptCard}
            key={action}
          >
            <span className={styles.eyebrow}>{action === 'full' ? 'THE WHOLE BALANCE' : 'ONLY WHAT YOU NEED'}</span>
            <h3>{action === 'full' ? 'Full decrypt' : 'Partial decrypt'}</h3>
            <p>
              {action === 'full'
                ? 'Return your entire private FIDU balance to public state in one transaction.'
                : 'Choose a FIDU amount. The remainder stays in private state.'}
            </p>
            {action === 'partial' ? (
              <TextField
                fullWidth
                label="Amount to decrypt"
                value={amount}
                disabled={Boolean(busy || pending)}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                inputProps={{ inputMode: 'decimal' }}
                InputProps={{ endAdornment: <Typography>FIDU</Typography> }}
              />
            ) : (
              <div className={styles.fullSummary}>
                <span>Amount returning public</span>
                <strong>Full private balance</strong>
                <span>Private balance afterward</span>
                <strong>0 FIDU</strong>
              </div>
            )}
            <Button
              variant="contained"
              fullWidth
              disabled={Boolean(busy) || Boolean(pending && pending.action !== action)}
              onClick={() => run(action)}
            >
              {busy === action ? (
                <>
                  <CircularProgress
                    size={18}
                    color="inherit"
                    sx={{ mr: 1 }}
                  />
                  Processing…
                </>
              ) : pending?.action === action ? (
                'Check confirmation'
              ) : action === 'full' ? (
                'Decrypt full balance'
              ) : (
                'Decrypt selected amount'
              )}
            </Button>
          </article>
        ))}
      </div>
      {status && (
        <div
          className={styles.result}
          role={failed ? 'alert' : 'status'}
        >
          <strong>{status.title}</strong>
          <p>{status.description}</p>
        </div>
      )}
      {balanceError && <Alert severity="warning" sx={{ mt: 2 }}>{balanceError}</Alert>}
      {hash && (
        <a
          className={styles.transactionLink}
          href={`https://etherscan.io/tx/${hash}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          View transaction on Etherscan ↗
        </a>
      )}
      <p className={styles.footnote}>
        Private balances cannot be read by this interface, so MAX and percentage controls are unavailable. Contract
        simulation checks the requested operation before submission.
      </p>
    </section>
  );
}
