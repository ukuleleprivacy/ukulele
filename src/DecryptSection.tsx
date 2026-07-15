// DecryptSection.tsx

import { useState } from 'react';
import { ethers } from 'ethers';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { abi, address } from './contracts/contract1';

import { handleErrors } from './lib/handleErrors';

import { useWeb3React } from '@web3-react/core';

const Schema = z.object({
  amount: z
    .string()
    .transform(Number)
    .refine((n) => !isNaN(n) && n > 0, {
      message: 'Amount must be a positive number',
    }),
});

type SchemaType = z.infer<typeof Schema>;

const gasLimit = ethers.utils.parseUnits('300000', 'wei');

const messages = {
  decryptSuccess: {
    title: 'Complete',
    description: 'The interface state completed successfully.',
  },
  partialDecryptSuccess: {
    title: 'Updated',
    description: 'The interface state was updated successfully.',
  },
};

type Props = {
  setMessage: (message: Record<'title' | 'description', string>) => void;
};

export function DecryptSection({ setMessage }: Props) {
  const [isDecryptInProcess, setIsDecryptInProcess] = useState(false);
  const [isPartialDecryptInProcess, setIsPartialDecryptInProcess] = useState(false);
  const { library, account, active } = useWeb3React();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SchemaType>({ resolver: zodResolver(Schema) });

  const onSubmit: SubmitHandler<SchemaType> = async (data) => {
    if (!active || !account || !library) {
      alert('Please connect your wallet.');
      return;
    }

    try {
      setIsPartialDecryptInProcess(true);
      const signer = library.getSigner();
      const contract = new ethers.Contract(address, abi, signer);
      const wei = ethers.utils.parseEther(data.amount.toString());

      await contract.decrypt_partial(wei, { gasLimit });
      setMessage(messages.partialDecryptSuccess);
      reset();
    } catch (error) {
      handleErrors(error, setMessage, {
        title: 'Error',
        description: 'An error occurred during partial decryption.',
      });
    } finally {
      setIsPartialDecryptInProcess(false);
    }
  };

  const handleDecrypt = async () => {
    if (!active || !account || !library) {
      alert('Please connect your wallet.');
      return;
    }

    try {
      setIsDecryptInProcess(true);
      const signer = library.getSigner();
      const contract = new ethers.Contract(address, abi, signer);

      await contract.decrypt({ gasLimit });
      setMessage(messages.decryptSuccess);
    } catch (error) {
      handleErrors(error, setMessage, {
        title: 'Lack of Tokens',
        description: 'You are trying to withdraw a private balance you do not have.',
      });
    } finally {
      setIsDecryptInProcess(false);
    }
  };

  return (
    <>
      <Button
        disabled={isDecryptInProcess}
        type="button"
        variant="contained"
        size="large"
        onClick={handleDecrypt}
        sx={{
          mb: 3,
        }}
        fullWidth
      >
        {isDecryptInProcess ? (
          <>
            <CircularProgress
              size={24}
              sx={{ mr: 2, color: '#fff', minWidth: 24, opacity: '0.5' }}
            />
            Confirming Decryption to the Blockchain…
          </>
        ) : (
          'Full Decrypt'
        )}
      </Button>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box display="flex" gap={3}>
          <TextField
            type="number"
            placeholder="0.00"
            autoFocus
            variant="outlined"
            fullWidth
            {...register('amount')}
            sx={{ borderRadius: 999 }}
          />
          <Button
            disabled={isPartialDecryptInProcess}
            type="submit"
            variant="contained"
            size="large"
            sx={{
              minWidth: 'auto',
            }}
          >
            {isPartialDecryptInProcess ? (
              <>
                <CircularProgress
                  size={24}
                  sx={{ mr: 2, color: '#fff', minWidth: 24, opacity: '0.5' }}
                />
                Confirming Partial Decryption…
              </>
            ) : (
              'Partial Decrypt'
            )}
          </Button>
        </Box>
        {errors.amount && (
          <InputLabel sx={{ fontSize: 12, mt: 1, color: '#e6e6e6' }}>
            {errors.amount.message}
          </InputLabel>
        )}
      </form>
    </>
  );
}
