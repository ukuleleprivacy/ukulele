import { useState } from 'react';
import { ethers } from 'ethers';
import ExpandMoreRounded from '@mui/icons-material/ExpandMoreRounded';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Collapse from '@mui/material/Collapse';
import CheckCircleRounded from '@mui/icons-material/CheckCircleRounded';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Head from 'next/head';
import { useForm } from 'react-hook-form';
import { useWeb3React } from '@web3-react/core';

import { PrivateSendForm, type PrivateSendFields } from '../src/components/PrivateSendForm';
import { ProgressMessageCard } from '../src/components/ProgressMessageCard';
import { abi as privacyAbi, address as privacyAddress } from '../src/contracts/contract2';
import { gasLimit, progressMessagesMap, type Message, type Steps } from '../src/constants';
import { Layout } from '../src/Layout';
import { ProtocolPanel, SectionLabel, StatusDot } from '../src/components/ProtocolUI';

const platformMessage = {
  title: 'Attention Required',
  description:
    'Do not reject the second transaction. If you do, press the submit button to send it again. Every FIDUCARO transaction requires two transactions for completion.',
  buttonTitle: '',
};

const platformMessages: Record<Steps, Message> = {
  ...progressMessagesMap,
  0: platformMessage,
};

const transactionOptions = { gasLimit: ethers.BigNumber.from(gasLimit) };
const platformLogPrefix = '[Platform Private Send]';

type PrivateSendRecoveryRecord = {
  amount: string;
  recipient: string;
  salt: string;
};

const downloadPrivateSendRecoveryRecord = ({
  amount,
  recipient,
  salt,
}: PrivateSendRecoveryRecord) => {
  const record = [
    'FIDUCARO PRIVATE SEND RECORD',
    '',
    `Amount: ${amount} FIDU`,
    `Recipient: ${recipient}`,
    `SALT: ${salt}`,
    '',
    'Keep this file private. It can be used to recover or retry your private send if transaction 2 does not complete.',
  ].join('\n');
  const file = new Blob([record], { type: 'text/plain;charset=utf-8' });
  const objectUrl = URL.createObjectURL(file);
  const download = document.createElement('a');
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

  download.href = objectUrl;
  download.download = `fiducaro-private-send-${timestamp}.txt`;
  download.style.display = 'none';
  document.body.appendChild(download);
  download.click();
  download.remove();
  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1_000);
};

const formatBigNumber = (value: unknown) =>
  ethers.BigNumber.isBigNumber(value) ? value.toString() : value;

const stringifyLogDetails = (details: unknown) => {
  const seen = new WeakSet<object>();

  return JSON.stringify(
    details,
    (_key, value) => {
      if (ethers.BigNumber.isBigNumber(value)) {
        return value.toString();
      }

      if (value instanceof Error) {
        return {
          name: value.name,
          message: value.message,
          stack: value.stack,
        };
      }

      if (value && typeof value === 'object') {
        if (seen.has(value)) {
          return '[Circular]';
        }
        seen.add(value);
      }

      return value;
    },
    2,
  );
};

const formatEncryptedValues = (values: readonly ethers.BigNumberish[]) =>
  values.map((value, index) => ({ index, value: ethers.BigNumber.from(value).toString() }));

const summarizeTransaction = (transaction: unknown) => {
  if (!transaction || typeof transaction !== 'object') {
    return transaction;
  }

  const tx = transaction as Record<string, unknown>;

  return {
    hash: tx.hash,
    from: tx.from,
    to: tx.to,
    nonce: tx.nonce,
    chainId: tx.chainId,
    data: tx.data,
    value: formatBigNumber(tx.value),
    gasLimit: formatBigNumber(tx.gasLimit),
    gasPrice: formatBigNumber(tx.gasPrice),
    maxFeePerGas: formatBigNumber(tx.maxFeePerGas),
    maxPriorityFeePerGas: formatBigNumber(tx.maxPriorityFeePerGas),
  };
};

const summarizeReceipt = (receipt: unknown) => {
  if (!receipt || typeof receipt !== 'object') {
    return receipt;
  }

  const txReceipt = receipt as Record<string, unknown>;
  const logs = Array.isArray(txReceipt.logs) ? txReceipt.logs : [];

  return {
    transactionHash: txReceipt.transactionHash,
    status: txReceipt.status,
    blockNumber: txReceipt.blockNumber,
    confirmations: txReceipt.confirmations,
    from: txReceipt.from,
    to: txReceipt.to,
    gasUsed: formatBigNumber(txReceipt.gasUsed),
    cumulativeGasUsed: formatBigNumber(txReceipt.cumulativeGasUsed),
    effectiveGasPrice: formatBigNumber(txReceipt.effectiveGasPrice),
    logCount: logs.length,
  };
};

const summarizeError = (error: unknown) => {
  if (!error || typeof error !== 'object') {
    return error;
  }

  const transactionError = error as Record<string, unknown>;

  return {
    name: transactionError.name,
    message: transactionError.message,
    code: transactionError.code,
    reason: transactionError.reason,
    cancelled: transactionError.cancelled,
    hash: transactionError.hash,
    method: transactionError.method,
    data: transactionError.data,
    transaction: summarizeTransaction(transactionError.transaction),
    replacement: summarizeTransaction(transactionError.replacement),
    receipt: summarizeReceipt(transactionError.receipt),
    nestedError: transactionError.error,
  };
};

const logPlatform = (event: string, details?: unknown) => {
  const serializedDetails = details === undefined ? '' : `\n${stringifyLogDetails(details)}`;
  console.log(`${platformLogPrefix} ${event}${serializedDetails}`);
};

const getTransactionError = (error: unknown) => {
  const transactionError =
    error && typeof error === 'object'
      ? (error as {
          code?: number | string;
          reason?: string;
          message?: string;
          error?: { reason?: string; message?: string };
          receipt?: { status?: number };
        })
      : null;
  const errorText = [
    transactionError?.reason,
    transactionError?.message,
    transactionError?.error?.reason,
    transactionError?.error?.message,
  ]
    .filter((value): value is string => Boolean(value))
    .join(' ');

  if (
    transactionError?.code === 4001 ||
    /user rejected|user denied|action_rejected/i.test(errorText)
  ) {
    return {
      title: 'Transaction Rejected',
      description: 'No transaction was completed. Press Submit when you are ready to try again.',
    };
  }

  if (/not a privacy contract/i.test(errorText)) {
    return {
      title: 'Transaction Failed',
      description:
        'The selected Naglfar contract is not authorized by the FIDUCARO address registry. No successful transaction was completed.',
    };
  }

  if (
    transactionError?.receipt?.status === 0 ||
    transactionError?.code === 'CALL_EXCEPTION' ||
    /transaction failed|execution reverted/i.test(errorText)
  ) {
    return {
      title: 'Transaction Failed',
      description:
        'The transaction failed on Ethereum. No successful transaction was completed, and the form is ready to try again.',
    };
  }

  return {
    title: 'Transaction Failed',
    description:
      'The transaction could not be completed. No successful transaction was completed; review the form and try again.',
  };
};

export default function Platform() {
  const [step, setStep] = useState<Steps>(0);
  const [error, setError] = useState<{ title: string; description: string } | null>(null);
  const [isInProcess, setIsInProcess] = useState(false);
  const [encryptedValuesState, setEncryptedValuesState] = useState<ethers.BigNumberish[] | null>(null);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const { library, account, active } = useWeb3React();
  const [isReminderOpen, setIsReminderOpen] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<PrivateSendFields>({ mode: 'onChange' });

  const salt = watch('salt');
  const remainingDigits = Math.max(0, 39 - (salt?.replace(/\D/g, '').length || 0));

  const runPrivacyStep = async (
    privacyContract: ethers.Contract,
    part: 'PART_I_' | 'PART_II_',
    encryptedValues: ethers.BigNumberish[],
  ) => {
    logPlatform(`${part}: preparing transaction`, {
      contract: privacyAddress,
      manualGasLimit: transactionOptions.gasLimit.toString(),
      encryptedValues: formatEncryptedValues(encryptedValues),
      ...(part === 'PART_II_' ? { lillypadAddress: privacyAddress } : {}),
    });

    try {
      if (part === 'PART_I_') {
        await privacyContract.callStatic.PART_I_(encryptedValues, transactionOptions);
      } else {
        await privacyContract.callStatic.PART_II_(
          privacyAddress,
          encryptedValues,
          transactionOptions,
        );
      }

      logPlatform(`${part}: preflight simulation completed`);
    } catch (simulationError) {
      console.error(
        `${platformLogPrefix} ${part}: preflight simulation failed; transaction not submitted\n${stringifyLogDetails(
          summarizeError(simulationError),
        )}`,
        simulationError,
      );
      throw simulationError;
    }

    try {
      const estimatedGas =
        part === 'PART_I_'
          ? await privacyContract.estimateGas.PART_I_(encryptedValues)
          : await privacyContract.estimateGas.PART_II_(privacyAddress, encryptedValues);

      logPlatform(`${part}: gas estimate completed`, {
        estimatedGas: estimatedGas.toString(),
        submittedGasLimit: transactionOptions.gasLimit.toString(),
      });
    } catch (estimateError) {
      console.warn(
        `${platformLogPrefix} ${part}: gas estimation failed; submitting with the manual limit\n${stringifyLogDetails(
          summarizeError(estimateError),
        )}`,
        estimateError,
      );
    }

    try {
      const tx =
        part === 'PART_I_'
          ? await privacyContract.PART_I_(encryptedValues, transactionOptions)
          : await privacyContract.PART_II_(privacyAddress, encryptedValues, transactionOptions);

      logPlatform(`${part}: transaction submitted`, summarizeTransaction(tx));
      logPlatform(`${part}: waiting for confirmation`, { hash: tx.hash });

      const receipt = await tx.wait();

      if (receipt.status !== 1) {
        const receiptError = new Error(`${part} transaction failed on Ethereum.`) as Error & {
          code: string;
          receipt: typeof receipt;
        };
        receiptError.code = 'CALL_EXCEPTION';
        receiptError.receipt = receipt;
        throw receiptError;
      }

      logPlatform(`${part}: transaction confirmed`, summarizeReceipt(receipt));

      return receipt;
    } catch (stepError) {
      console.error(
        `${platformLogPrefix} ${part}: transaction failed\n${stringifyLogDetails(summarizeError(stepError))}`,
        stepError,
      );
      throw stepError;
    }
  };

  const handlePrivateSend = async (data: PrivateSendFields) => {
    logPlatform('Submit requested', {
      active,
      account,
      providerAvailable: Boolean(library),
      recipientInput: data.address,
      amountInput: data.amount,
      saltInput: data.salt,
      saltDigits: data.salt?.replace(/\D/g, '').length,
      resumingPartII: Boolean(encryptedValuesState),
      retainedEncryptedValues: encryptedValuesState
        ? formatEncryptedValues(encryptedValuesState)
        : null,
    });

    if (!active || !account || !library) {
      console.warn(
        `${platformLogPrefix} Submission stopped: wallet is not connected\n${stringifyLogDetails({
          active,
          account,
          providerAvailable: Boolean(library),
        })}`,
      );
      setError({
        title: 'Wallet Required',
        description: 'Please connect your wallet from the header before sending.',
      });
      return;
    }

    setError(null);
    setIsInProcess(true);

    try {
      const signer = library.getSigner();
      const [network, signerAddress] = await Promise.all([library.getNetwork(), signer.getAddress()]);

      logPlatform('Wallet and network resolved', {
        account,
        signerAddress,
        chainId: network.chainId,
        networkName: network.name,
        naglfarAddress: privacyAddress,
        manualGasLimit: transactionOptions.gasLimit.toString(),
      });

      const privacyContract = new ethers.Contract(privacyAddress, privacyAbi, signer);
      let encryptedValues = encryptedValuesState;
      let recoveryRecord: PrivateSendRecoveryRecord | null = null;

      if (!encryptedValues) {
        setStep(1);
        const recipient = ethers.utils.getAddress(data.address);
        const amount = ethers.utils.parseEther(data.amount);
        recoveryRecord = {
          amount: data.amount,
          recipient,
          salt: data.salt,
        };

        logPlatform('Inputs normalized', {
          recipient,
          amountInput: data.amount,
          amountWei: amount.toString(),
          salt: data.salt,
        });

        logPlatform('encryptValues: starting read-only contract call', {
          contract: privacyAddress,
          from: signerAddress,
          recipient,
          amountWei: amount.toString(),
          salt: data.salt,
        });

        const preparedEncryptedValues = await privacyContract.encryptValues(recipient, amount, data.salt);
        logPlatform('encryptValues: call completed', {
          arrayLength: preparedEncryptedValues.length,
          encryptedValues: formatEncryptedValues(preparedEncryptedValues),
        });

        encryptedValues = preparedEncryptedValues;
        await runPrivacyStep(privacyContract, 'PART_I_', preparedEncryptedValues);
        setEncryptedValuesState(preparedEncryptedValues);
        logPlatform('PART_I_: encrypted values retained for PART_II_', {
          encryptedValues: formatEncryptedValues(preparedEncryptedValues),
        });

        downloadPrivateSendRecoveryRecord(recoveryRecord);
        logPlatform('Recovery record downloaded before PART_II_');
      } else {
        logPlatform('PART_I_: skipped because this is a PART_II_ retry', {
          encryptedValues: formatEncryptedValues(encryptedValues),
        });
      }

      if (!encryptedValues) {
        throw new Error('Encrypted transaction values were not prepared.');
      }

      setStep(2);
      await runPrivacyStep(privacyContract, 'PART_II_', encryptedValues);

      setEncryptedValuesState(null);
      setStep(3);
      reset();
      logPlatform('Private send completed successfully', {
        encryptedValuesCleared: true,
      });
    } catch (transactionError) {
      console.error(
        `${platformLogPrefix} Private send stopped with an error\n${stringifyLogDetails(
          summarizeError(transactionError),
        )}`,
        transactionError,
      );
      setStep(0);
      setError(getTransactionError(transactionError));
    } finally {
      setIsInProcess(false);
      logPlatform('Submission handler finished');
    }
  };

  return (
    <Layout>
      <Head>
        <title>Private Send | Fiducaro</title>
      </Head>
      <Box
        component="main"
        sx={{
          minHeight: 'calc(100vh - 70px)',
          bgcolor: '#292a2e',
        }}
      >
        <Box sx={{ maxWidth: 1520, mx: 'auto', px: { xs: 2.5, sm: 4, lg: 6 }, pt: { xs: 6, md: 7 }, pb: { xs: 8, md: 10 } }}>
          <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" gap={3}>
            <Box>
              <SectionLabel>Private Send</SectionLabel>
              <Typography component="h1" sx={{ mt: 1, fontSize: { xs: 42, md: 64 }, lineHeight: 1, letterSpacing: '-.045em' }}>Move value into private state.</Typography>
              <Typography color="text.secondary" sx={{ mt: 1.7, maxWidth: 790, fontSize: { xs: 15, md: 17 } }}>
                Send a selected amount through Fiducaro’s live Ethereum-native privacy protocol. Every Private Send completes through two on-chain confirmations.
              </Typography>
            </Box>
            <Stack alignItems={{ xs: 'flex-start', md: 'flex-end' }} gap={.7}>
              <Stack direction="row" alignItems="center" gap={1}><StatusDot /><Typography sx={{ fontSize: 18 }}>Ethereum Mainnet</Typography></Stack>
              <Typography color="text.secondary" sx={{ fontSize: 11 }}>2 Confirmations • On-chain Execution • Recovery Record</Typography>
            </Stack>
          </Stack>

          {Boolean(error || step > 0) && (
            <Box sx={{ mt: 2.5 }}>
              <ProgressMessageCard message={platformMessages[step]} step={step} error={error} />
            </Box>
          )}

          <Dialog open={isReminderOpen} onClose={() => setIsReminderOpen(false)} aria-labelledby="send-reminder-title" aria-describedby="send-reminder-description" maxWidth="sm" fullWidth>
            <DialogTitle id="send-reminder-title">{platformMessage.title}</DialogTitle>
            <DialogContent>
              <DialogContentText id="send-reminder-description">{platformMessage.description}</DialogContentText>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
              <Button onClick={() => setIsReminderOpen(false)} variant="contained">Got it</Button>
            </DialogActions>
          </Dialog>

          <Box sx={{ mt: 4 }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <SectionLabel>Transaction terminal</SectionLabel>
                <Tooltip title="Two-transaction reminder" arrow>
                  <IconButton color="primary" aria-label="Open two-transaction reminder" aria-haspopup="dialog" onClick={() => setIsReminderOpen(true)}>
                    <CheckCircleRounded fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Stack>
              <PrivateSendForm
                onSubmit={handleSubmit(handlePrivateSend)}
                isInProcess={isInProcess}
                errors={errors}
                register={register}
                encryptedValuesState={encryptedValuesState}
                remainingDigits={remainingDigits}
                message={platformMessages[step]}
                isLocked={false}
                step={step}
              />
          </Box>

          <Box sx={{ mt: 3 }}>
          <Button
            type="button"
            variant="outlined"
            fullWidth
            aria-expanded={isGuideOpen}
            aria-controls="private-send-guide"
            endIcon={
              <ExpandMoreRounded
                sx={{
                  transform: isGuideOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 180ms ease',
                }}
              />
            }
            onClick={() => setIsGuideOpen((isOpen) => !isOpen)}
            sx={{ minHeight: 52 }}
          >
            {isGuideOpen ? 'Close SEND Guide' : 'Open SEND Guide'}
          </Button>

          <Collapse in={isGuideOpen} timeout="auto" unmountOnExit>
            <Card id="private-send-guide" variant="outlined" sx={{ mt: 2 }}>
              <CardContent sx={{ p: { xs: '24px!important', sm: '32px!important' } }}>
                <Typography variant="h5" fontWeight="700">
                  How a private SEND works
                </Typography>
                <Typography color="text.secondary" sx={{ mt: 1.25, mb: 3 }}>
                  A private SEND requires two on-chain confirmations. Keep this page open until both
                  transactions finish.
                </Typography>

                <Stack component="ol" gap={2.5} sx={{ pl: 3, m: 0 }}>
                  <Box component="li">
                    <Typography fontWeight="700">Enter the amount, recipient, and SALT.</Typography>
                    <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                      The amount must be positive, the recipient must be a valid Ethereum address,
                      and the SALT must contain exactly 39 digits.
                    </Typography>
                  </Box>
                  <Box component="li">
                    <Typography fontWeight="700">Confirm transaction 1 in MetaMask.</Typography>
                    <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                      Transaction 1 prepares the encrypted values on chain. Wait for its confirmation
                      before continuing.
                    </Typography>
                  </Box>
                  <Box component="li">
                    <Typography fontWeight="700">Save the downloaded text file.</Typography>
                    <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                      After transaction 1 confirms, the site downloads a private record containing
                      your amount, recipient, and SALT. Do not share it.
                    </Typography>
                  </Box>
                  <Box component="li">
                    <Typography fontWeight="700">Confirm transaction 2.</Typography>
                    <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                      Transaction 2 completes the private SEND. A zero public balance during this step
                      can be normal while the balance remains private.
                    </Typography>
                  </Box>
                  <Box component="li">
                    <Typography fontWeight="700">Retry safely if transaction 2 is rejected.</Typography>
                    <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                      Keep the form values unchanged and press Submit again. The site retains the
                      prepared encrypted values and retries transaction 2 without repeating transaction 1.
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Collapse>
          </Box>

              <ProtocolPanel sx={{ mt: 3, p: { xs: 3, md: 4 }, bgcolor: '#3b3c42' }}>
                <Typography variant="h4">Execution Path</Typography>
                <Stack alignItems="center" gap={0} sx={{ mt: 4 }}>
                  {[
                    ['01 — PREPARE', 'Address · Amount · SALT'],
                    ['02 — PART I', 'First Ethereum confirmation'],
                    ['03 — RECOVERY RECORD', 'Amount · Recipient · SALT'],
                    ['04 — PART II', 'Private Send complete'],
                  ].map(([title, description], index) => {
                    const activeStep = step === 3 ? true : index <= step;
                    return (
                      <Stack alignItems="center" key={title} sx={{ width: '100%' }}>
                        <ProtocolPanel sx={{ width: 'min(100%, 320px)', p: 2, textAlign: 'center', borderColor: activeStep ? 'rgba(167,215,160,.7)' : 'rgba(255,255,255,.17)', boxShadow: activeStep ? '0 0 24px rgba(167,215,160,.13)' : 'none' }}>
                          <Typography sx={{ fontWeight: 700, color: activeStep ? 'text.primary' : 'text.secondary' }}>{title}</Typography>
                          <Typography color="text.secondary" sx={{ mt: .5, fontSize: 12 }}>{description}</Typography>
                        </ProtocolPanel>
                        {index < 3 && <Box sx={{ width: 2, height: 44, bgcolor: activeStep ? 'primary.main' : 'rgba(255,255,255,.18)', boxShadow: activeStep ? '0 0 12px #a7d7a0' : 'none' }} />}
                      </Stack>
                    );
                  })}
                </Stack>
              </ProtocolPanel>
        </Box>
      </Box>
    </Layout>
  );
}
