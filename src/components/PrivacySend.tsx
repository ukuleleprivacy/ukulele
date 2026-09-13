import { useRef, useState } from 'react';
import { ethers } from 'ethers';
import { useWeb3React } from '@web3-react/core';
import { useForm } from 'react-hook-form';
import { Box, Button, Typography } from '@mui/material';
import { PrivateSendForm, PrivateSendFields } from './PrivateSendForm';
import { ProgressMessageCard } from './ProgressMessageCard';
import { abi as privacyAbi, address as privacyAddress } from '../contracts/contract2';
import { progressMessagesMap, Steps } from '../constants';
import {
  PrivacyError,
  TransactionMessage,
  confirmPrivacyTransaction,
  parseFiduAmount,
  privacyTransactionError,
  requirePrivacySigner,
  transactionDefinitelyStopped,
  transactionOptions,
  validateRecipient,
} from '../lib/privacyTransactions';
import { walletBalanceRefreshEvent } from '../lib/wallet';
import { usePrivacyOperation } from './usePrivacyOperation';
import styles from './privacy.module.css';

type Draft = {
  owner: string;
  fields: PrivateSendFields;
  encrypted: ethers.BigNumberish[];
  partOneDone: boolean;
  tx?: ethers.providers.TransactionResponse;
};

function downloadRecovery(fields: PrivateSendFields) {
  const content = `FIDUCARO PRIVATE SEND RECORD\n\nAmount: ${fields.amount} FIDU\nRecipient: ${fields.address}\nSALT: ${fields.salt}\n\nKeep this record private. Keep the page open until PART I and PART II confirm.`;
  const url = URL.createObjectURL(new Blob([content], { type: 'text/plain;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = `fiducaro-private-send-${Date.now()}.txt`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function PrivacySend({ onBusyChange }: { onBusyChange: (busy: boolean) => void }) {
  const { library, account } = useWeb3React<ethers.providers.Web3Provider>();
  const [step, setStep] = useState<Steps>(0);
  const [error, setError] = useState<TransactionMessage | null>(null);
  const [busy, setBusy] = useState(false);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [hash, setHash] = useState('');
  const running = useRef(false);
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<PrivateSendFields>({ mode: 'onChange', defaultValues: { amount: '', address: '', salt: '' } });
  usePrivacyOperation(busy || Boolean(draft), onBusyChange);
  const remainingDigits = Math.max(0, 39 - (watch('salt') || '').length);

  const submit = async (fields: PrivateSendFields) => {
    if (running.current) return;
    running.current = true;
    setBusy(true);
    setError(null);
    let operation = draft;
    try {
      const signer = await requirePrivacySigner(library, account, operation?.owner);
      if (!operation) {
        const amount = parseFiduAmount(fields.amount);
        if (validateRecipient(fields.address) !== true)
          throw new PrivacyError('Check the recipient', 'Use a valid, non-zero Ethereum address.');
        if (!/^\d{39}$/.test(fields.salt))
          throw new PrivacyError('Check the SALT', 'Use exactly 39 numeric digits and keep them private.');
        const contract = new ethers.Contract(privacyAddress, privacyAbi, signer);
        const encrypted = await contract.encryptValues(ethers.utils.getAddress(fields.address), amount, fields.salt);
        operation = { owner: await signer.getAddress(), fields: { ...fields }, encrypted, partOneDone: false };
        downloadRecovery(fields);
      }
      const execute = async (part: 'PART_I_' | 'PART_II_') => {
        if (!operation) return;
        const currentSigner = await requirePrivacySigner(library, account, operation.owner);
        const contract = new ethers.Contract(privacyAddress, privacyAbi, currentSigner);
        if (!operation.tx) {
          const args =
            part === 'PART_I_'
              ? [operation.encrypted, transactionOptions]
              : [privacyAddress, operation.encrypted, transactionOptions];
          await contract.callStatic[part](...args);
          await requirePrivacySigner(library, account, operation.owner);
          operation.tx = await contract[part](...args);
          setDraft({ ...operation });
          setHash(operation.tx!.hash);
        }
        const receipt = await confirmPrivacyTransaction(operation.tx!);
        setHash(receipt.transactionHash);
        operation.tx = undefined;
      };
      if (!operation.partOneDone) {
        setStep(1);
        await execute('PART_I_');
        operation.partOneDone = true;
        setDraft({ ...operation });
      }
      setStep(2);
      await execute('PART_II_');
      setDraft(null);
      setStep(3);
      reset();
      window.dispatchEvent(new Event(walletBalanceRefreshEvent));
    } catch (failure) {
      if (operation?.tx && transactionDefinitelyStopped(failure)) operation.tx = undefined;
      const retained = operation && (operation.partOneDone || operation.tx) ? { ...operation } : null;
      setDraft(retained);
      const message = privacyTransactionError(failure);
      setError({
        ...message,
        description: `${message.description}${retained?.tx ? ' A transaction is already submitted. Use Check confirmation; no duplicate will be sent.' : retained?.partOneDone ? ' PART I is confirmed. Keep this page open and retry PART II with the same wallet; PART I will not be repeated.' : ''}`,
      });
      setStep(retained?.partOneDone ? 2 : 0);
    } finally {
      running.current = false;
      setBusy(false);
    }
  };

  return (
    <div className={styles.workspaceGrid}>
      <section>
        <div className={styles.sectionHeading}>
          <span>01 / SEND FIDU</span>
          <h2>
            Choose what moves.
            <br />
            Keep the details yours.
          </h2>
          <p>Send the Fiducaro token into private state. This is a live, two-transaction Ethereum flow.</p>
        </div>
        {(error || step > 0) && (
          <ProgressMessageCard
            message={progressMessagesMap[step]}
            step={step}
            error={error}
          />
        )}
        {draft && (
          <Box className={styles.recovery}>
            <Typography>
              Keep this page open. Your prepared send is tied to {draft.owner.slice(0, 6)}…{draft.owner.slice(-4)}.
            </Typography>
            <Button onClick={() => downloadRecovery(draft.fields)}>Download recovery record again</Button>
          </Box>
        )}
        <PrivateSendForm
          onSubmit={handleSubmit(submit)}
          isInProcess={busy}
          errors={errors}
          register={register}
          encryptedValuesState={draft?.encrypted || null}
          remainingDigits={remainingDigits}
          message={progressMessagesMap[step]}
          isLocked={false}
          step={step}
          submitLabel={draft?.tx ? 'Check confirmation' : draft?.partOneDone ? 'Retry PART II' : 'Begin private send'}
        />
        {hash && (
          <a
            className={styles.transactionLink}
            href={`https://etherscan.io/tx/${hash}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            View latest transaction on Etherscan ↗
          </a>
        )}
      </section>
      <aside className={styles.guide}>
        <span className={styles.eyebrow}>A PRIVATE MOVE, EXPLAINED</span>
        <h2>
          Two confirmations.
          <br />
          One complete send.
        </h2>
        <ol>
          {[
            [
              'Prepare your record',
              'Enter a FIDU amount, recipient address and 39-digit SALT. The recovery file downloads before the first wallet request. Keep it private.',
            ],
            ['Confirm PART I', 'Approve the first transaction in your wallet and wait for its Ethereum confirmation.'],
            [
              'Confirm PART II',
              'Approve the second transaction to complete the send. If declined, retry this step from the same page and wallet.',
            ],
          ].map(([title, text]) => (
            <li key={title}>
              <strong>{title}</strong>
              <p>{text}</p>
            </li>
          ))}
        </ol>
        <div className={styles.guideNote}>
          <strong>FIDU only. ETH for gas.</strong>
          <p>This form does not send ETH or other tokens privately. Ethereum transaction metadata remains public.</p>
        </div>
      </aside>
    </div>
  );
}
