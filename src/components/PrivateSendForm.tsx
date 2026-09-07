// src/components/PrivateSendForm.tsx

import React from 'react';
import { ethers } from 'ethers';
import {
  Box,
  Button,
  Card,
  CardContent,
  InputLabel,
  Stack,
  TextField,
  Typography,
  CircularProgress,
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import { BaseSyntheticEvent } from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';

export interface PrivateSendFields {
  address: string;
  amount: string;
  salt: string;
}

interface PrivateSendFormProps {
  onSubmit: (e?: BaseSyntheticEvent) => Promise<void>; // Adjusted type
  isInProcess: boolean;
  errors: FieldErrors<PrivateSendFields>;
  register: UseFormRegister<PrivateSendFields>;
  encryptedValuesState: readonly unknown[] | null;
  remainingDigits: number;
  message: any;
  isLocked: boolean;
  step: number;
}

export const PrivateSendForm = ({
  onSubmit,
  isInProcess,
  errors,
  register,
  encryptedValuesState,
  remainingDigits,
  message,
  isLocked,
  step,
}: PrivateSendFormProps) => {
  const isReadOnly = isLocked || Boolean(encryptedValuesState);

  // Determine the card title based on the current step
  let cardTitle = 'Private Send';
  if (step === 1) {
    cardTitle = 'Sending a Private Tx (1/2)';
  } else if (step === 2) {
    cardTitle = 'Completing the Private Transaction Send (2/2)';
  } else if (isLocked) {
    cardTitle = 'Private Send Locked';
  }

  return (
    <Card
      variant="outlined"
      sx={{
        mt: 1.5,
        position: 'relative',
        background: '#3b3c42',
        ...(isLocked && {
          filter: 'grayscale(100%)',
          opacity: 0.6,
        }),
      }}
    >
      {/* Overlay Lock Icon when Locked */}
      {isLocked && (
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 1,
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            borderRadius: '50%',
            padding: 2,
          }}
        >
          <LockIcon sx={{ color: 'white', fontSize: 48 }} />
        </Box>
      )}
      <form onSubmit={onSubmit}>
        <CardContent
          sx={{
            p: { xs: '24px!important', sm: '28px 32px!important' },
            transition: 'opacity 0.5s ease-in-out',
            pointerEvents: isLocked ? 'none' : 'auto', // Disable interaction when locked
          }}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
            <Typography variant="h4" fontWeight="600">{cardTitle}</Typography>
            <Box sx={{ px: 1.2, py: .55, borderRadius: 1, bgcolor: 'rgba(102,255,138,.1)', color: 'primary.main', fontSize: 11, fontWeight: 700 }}>
              ● {isInProcess ? 'PROCESSING' : 'READY'}
            </Box>
          </Stack>

          {/* Amount Input */}
          <Box gap={1} sx={{ mb: 2.5 }}>
            <InputLabel sx={{ fontSize: 11, color: 'text.secondary', mb: .7, textTransform: 'uppercase' }}>Amount</InputLabel>
            <TextField
              InputProps={{
                readOnly: isReadOnly,
              }}
              type="number"
              placeholder="0.00"
              autoFocus
              variant="outlined"
              onKeyDown={(evt) => {
                if (
                  ['e', 'E', '+', '-'].includes(evt.key) &&
                  !evt.metaKey &&
                  !evt.ctrlKey &&
                  !evt.altKey &&
                  !evt.shiftKey
                ) {
                  evt.preventDefault();
                }
              }}
              fullWidth
              {...register('amount', {
                required: 'Amount is required',
                validate: (value) => Number(value) > 0 || 'Amount must be a positive number',
              })}
              sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'rgba(0,0,0,.18)' } }}
            />
            {errors.amount && (
              <InputLabel sx={{ fontSize: 12, mt: 1, color: '#e6e6e6' }}>
                {errors.amount.message}
              </InputLabel>
            )}
          </Box>

          {/* Address Input */}
          <Box gap={1} sx={{ mb: 2.5 }}>
            <InputLabel sx={{ fontSize: 11, color: 'text.secondary', mb: .7, textTransform: 'uppercase' }}>Recipient address</InputLabel>
            <TextField
              InputProps={{
                readOnly: isReadOnly,
              }}
              placeholder="0x37B1CE6433064aFf57Dc6F0f6631a0E4ad7dD01D"
              inputProps={{
                maxLength: 42,
              }}
              variant="outlined"
              fullWidth
              {...register('address', {
                required: 'Please input a valid ethereum address',
                validate: (value) =>
                  ethers.utils.isAddress(value) || 'Please input a valid ethereum address',
              })}
              sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'rgba(0,0,0,.18)' } }}
            />
            {errors.address && (
              <InputLabel sx={{ fontSize: 12, mt: 1, color: '#e6e6e6' }}>
                {errors.address.message}
              </InputLabel>
            )}
          </Box>

          {/* Salt Input */}
          <Box gap={1} sx={{ mb: 2.5 }}>
            <InputLabel sx={{ fontSize: 11, color: 'text.secondary', mb: .7, textTransform: 'uppercase' }}>39-digit SALT</InputLabel>
            <TextField
              InputProps={{
                readOnly: isReadOnly,
              }}
              placeholder="1000000000000"
              variant="outlined"
              inputProps={{
                maxLength: 39,
              }}
              fullWidth
              onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, '');
              }}
              {...register('salt', {
                required: 'Salt must be a 39-digit number',
                validate: (value) =>
                  value.length === 39 || 'Salt must be a 39-digit number',
              })}
              sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'rgba(0,0,0,.18)' } }}
            />
            {remainingDigits > 0 && (
                <InputLabel sx={{ fontSize: 11, mt: 1, color: 'text.secondary' }}>
                  A transaction-specific numeric value. {39 - remainingDigits} / 39 digits entered.
              </InputLabel>
            )}
            {errors.salt && (
              <InputLabel sx={{ fontSize: 12, mt: 1, color: '#e6e6e6' }}>
                {errors.salt.message}
              </InputLabel>
            )}
          </Box>

          {/* Submit Button */}
          <Stack
            direction="column"
            justifyContent="stretch"
            alignItems="center"
            sx={{ mt: 3, mb: 0 }}
          >
            <Button
              type="submit"
              color="primary"
              fullWidth
              sx={{ px: 3, minHeight: 54 }}
              variant="contained"
              disabled={isLocked || isInProcess}
            >
              {isLocked ? (
                'Locked'
              ) : isInProcess ? (
                <>
                  <CircularProgress
                    size={24}
                    sx={{ mr: 2, color: '#fff', minWidth: 24 }}
                  />
                  {message.buttonTitle || 'Processing private send…'}
                </>
              ) : (
                'Begin private send'
              )}
            </Button>
            <Typography color="text.secondary" sx={{ mt: 1.2, textAlign: 'center', fontSize: 11 }}>
              You will confirm PART I and PART II in your wallet.
            </Typography>
          </Stack>
        </CardContent>
      </form>
    </Card>
  );
};
