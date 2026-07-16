import { useState } from 'react';
import { ethers } from 'ethers';
import Container from '@mui/material/Container';
import Head from 'next/head';
import { useForm } from 'react-hook-form';
import { useWeb3React } from '@web3-react/core';

import { PrivateSendForm, type PrivateSendFields } from '../src/components/PrivateSendForm';
import { ProgressMessageCard } from '../src/components/ProgressMessageCard';
import { abi as privacyAbi, address as privacyAddress } from '../src/contracts/contract2';
import { abi as gsnAbi, address as gsnAddress } from '../src/contracts/contract4';
import { gasLimit, progressMessagesMap, type Message, type Steps } from '../src/constants';
import { Layout } from '../src/Layout';
import {
  GASLESS_ACTION,
  isGaslessRelayConfigured,
  relayGaslessAction,
  signGaslessAction,
  toRelayEncryptedArray,
  type GaslessAction,
  type GaslessFunctionName,
} from '../src/lib/gaslessRelay';

const platformMessage = {
  title: 'Attention Required',
  description:
    'Do not reject the second transaction. If you do, press the submit button to send it again. Every UKULELE transaction requires two transactions for completion.',
  buttonTitle: '',
};

const platformMessages: Record<Steps, Message> = {
  ...progressMessagesMap,
  0: platformMessage,
};

const transactionOptions = { gasLimit: ethers.BigNumber.from(gasLimit) };

const getTransactionError = (error: unknown) => {
  if (
    error &&
    typeof error === 'object' &&
    'reason' in error &&
    typeof error.reason === 'string' &&
    error.reason === 'user rejected transaction'
  ) {
    return {
      title: 'User Rejected the Transaction',
      description: 'No transaction was completed. Press Submit when you are ready to try again.',
    };
  }

  if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string') {
    return {
      title: 'Transaction Error',
      description: error.message,
    };
  }

  return {
    title: 'Transaction Error',
    description: 'The transaction could not be completed. Please review the form and try again.',
  };
};

export default function Platform() {
  const [step, setStep] = useState<Steps>(0);
  const [error, setError] = useState<{ title: string; description: string } | null>(null);
  const [isInProcess, setIsInProcess] = useState(false);
  const [encryptedValuesState, setEncryptedValuesState] = useState<ethers.BigNumberish[] | null>(null);
  const { library, account, active } = useWeb3React();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<PrivateSendFields>({ mode: 'onChange' });

  const salt = watch('salt');
  const remainingDigits = Math.max(0, 39 - (salt?.replace(/\D/g, '').length || 0));

  const runGsnStep = async (
    signer: ethers.providers.JsonRpcSigner,
    functionName: GaslessFunctionName,
    action: GaslessAction,
    encryptedValues: ethers.BigNumberish[],
  ) => {
    if (!gsnAddress) {
      throw new Error('No GSN contract is configured for the current protocol release.');
    }

    const gsnContract = new ethers.Contract(gsnAddress, gsnAbi, signer);

    if (isGaslessRelayConfigured()) {
      const nonce = await gsnContract.nonces(account);
      const { chainId } = await library.getNetwork();
      const deadline = Math.floor(Date.now() / 1000) + 20 * 60;
      const signature = await signGaslessAction({
        signer,
        user: account as string,
        chainId,
        verifyingContract: gsnAddress,
        privacyContractAddress: privacyAddress,
        encryptedArray: encryptedValues,
        action,
        nonce,
        deadline,
      });

      await relayGaslessAction({
        target: gsnAddress,
        functionName,
        request: {
          user: account as string,
          privacyContractAddress: privacyAddress,
          encryptedArray: toRelayEncryptedArray(encryptedValues),
          deadline,
          signature,
        },
      });
      return;
    }

    const tx =
      functionName === 'executePartI'
        ? await gsnContract.Part_I(privacyAddress, encryptedValues, transactionOptions)
        : await gsnContract.Part_II(privacyAddress, encryptedValues, transactionOptions);
    await tx.wait();
  };

  const handlePrivateSend = async (data: PrivateSendFields) => {
    if (!active || !account || !library) {
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
      const privacyContract = new ethers.Contract(privacyAddress, privacyAbi, signer);
      let encryptedValues = encryptedValuesState;

      if (!encryptedValues) {
        setStep(1);
        const recipient = ethers.utils.getAddress(data.address);
        const amount = ethers.utils.parseEther(data.amount);

        const preparedEncryptedValues = await privacyContract.encryptValues(recipient, amount, data.salt);
        encryptedValues = preparedEncryptedValues;
        await runGsnStep(signer, 'executePartI', GASLESS_ACTION.partI, preparedEncryptedValues);
        setEncryptedValuesState(preparedEncryptedValues);
      }

      if (!encryptedValues) {
        throw new Error('Encrypted transaction values were not prepared.');
      }

      setStep(2);
      await runGsnStep(signer, 'executePartII', GASLESS_ACTION.partII, encryptedValues);

      setEncryptedValuesState(null);
      setStep(3);
      reset();
    } catch (transactionError) {
      setError(getTransactionError(transactionError));
    } finally {
      setIsInProcess(false);
    }
  };

  return (
    <Layout>
      <Head>
        <title>Platform | Ukulele</title>
      </Head>

      <Container disableGutters maxWidth="md" sx={{ pt: { xs: 5, md: 9 }, pb: { xs: 7, md: 11 } }}>
        <ProgressMessageCard message={platformMessages[step]} step={step} error={error} />
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
      </Container>
    </Layout>
  );
}
