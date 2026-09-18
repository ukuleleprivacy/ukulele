// src/components/PrivateSendForm.tsx

import React from 'react';
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
  MenuItem,
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import { BaseSyntheticEvent } from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { parseFiduAmount, validateRecipient } from '../lib/privacyTransactions';
import type { Message } from '../constants';

export interface PrivateSendFields {
  address: string;
  amount: string;
  salt: string;
  note: string;
}

interface PrivateSendFormProps {
  onSubmit: (e?: BaseSyntheticEvent) => Promise<void>; // Adjusted type
  isInProcess: boolean;
  errors: FieldErrors<PrivateSendFields>;
  register: UseFormRegister<PrivateSendFields>;
  encryptedValuesState: readonly unknown[] | null;
  remainingDigits: number;
  message: Message;
  isLocked: boolean;
  step: number;
  submitLabel?: string;
  onGenerateSalt: () => void;
  previousRecipients: string[];
  onSelectRecipient: (address: string) => void;
  noteLength: number;
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
  submitLabel = 'Begin private send',
  onGenerateSalt,
  previousRecipients,
  onSelectRecipient,
  noteLength,
}: PrivateSendFormProps) => {
  const isReadOnly = isLocked || isInProcess || Boolean(encryptedValuesState);

  // Determine the card title based on the current step
  let cardTitle = 'Private Send';
  if (step === 1) {
    cardTitle = 'Sending a Private Tx (1/2)';
  } else if (step === 2) {
    cardTitle = 'Completing private send (2/2)';
  } else if (isLocked) {
    cardTitle = 'Private Send Locked';
  }

  return (
    <Card
      variant="outlined"
      sx={{
        mt: 1.5,
        position: 'relative',
        borderColor: 'rgba(104, 199, 107, .28)',
        background:
          'radial-gradient(circle at 12% 0%, rgba(104, 199, 107, .09), transparent 34%), linear-gradient(145deg, #101c22 0%, #0b1419 58%, #071014 100%)',
        boxShadow: 'inset 0 1px rgba(255,255,255,.035), 0 22px 70px rgba(0,0,0,.36)',
      }}
    >
      {isLocked && (
        <Stack direction="row" alignItems="center" gap={1} role="status" sx={{ px: 3, pt: 2, color: 'primary.main' }}>
          <LockIcon fontSize="small" />
          <Typography variant="body2">Send details are locked until PART II confirms.</Typography>
        </Stack>
      )}
      <form onSubmit={onSubmit}>
        <CardContent
          sx={{
            p: { xs: '24px!important', sm: '28px 32px!important' },
            transition: 'opacity 0.5s ease-in-out',
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 3 }}
          >
            <Typography
              variant="h4"
              fontWeight="600"
            >
              {cardTitle}
            </Typography>
            <Box
              sx={{
                px: 1.2,
                py: 0.55,
                borderRadius: 1,
                bgcolor: 'rgba(104, 199, 107,.1)',
                color: 'primary.main',
                fontSize: 11,
                fontWeight: 700,
              }}
            >
              ● {isInProcess ? 'PROCESSING' : 'READY'}
            </Box>
          </Stack>

          {/* Amount Input */}
          <Box
            gap={1}
            sx={{ mb: 2.5 }}
          >
            <InputLabel sx={{ fontSize: 11, color: 'text.secondary', mb: 0.7, textTransform: 'uppercase' }}>
              Amount
            </InputLabel>
            <TextField
              InputProps={{
                readOnly: isReadOnly,
              }}
              type="text"
              inputProps={{ inputMode: 'decimal', 'aria-label': 'FIDU amount' }}
              placeholder="0.00"
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
                validate: (value) => {
                  try {
                    parseFiduAmount(value);
                    return true;
                  } catch (error) {
                    return (error as Error).message;
                  }
                },
              })}
              sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#071318' } }}
            />
            {errors.amount && (
              <InputLabel sx={{ fontSize: 12, mt: 1, color: '#e6e6e6' }}>{errors.amount.message}</InputLabel>
            )}
          </Box>

          {/* Address Input */}
          <Box
            gap={1}
            sx={{ mb: 2.5 }}
          >
            <InputLabel sx={{ fontSize: 11, color: 'text.secondary', mb: 0.7, textTransform: 'uppercase' }}>
              Recipient address
            </InputLabel>
            <TextField
              InputProps={{
                readOnly: isReadOnly,
              }}
              placeholder="0x37B1CE6433064aFf57Dc6F0f6631a0E4ad7dD01D"
              inputProps={{
                maxLength: 42,
                'aria-label': 'Recipient Ethereum address',
              }}
              variant="outlined"
              fullWidth
              {...register('address', {
                required: 'Please input a valid ethereum address',
                validate: validateRecipient,
              })}
              sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#071318' } }}
            />
            {errors.address && (
              <InputLabel sx={{ fontSize: 12, mt: 1, color: '#e6e6e6' }}>{errors.address.message}</InputLabel>
            )}
            {previousRecipients.length > 0 && (
              <TextField select fullWidth size="small" value="" disabled={isReadOnly}
                onChange={(event) => onSelectRecipient(event.target.value)}
                SelectProps={{ displayEmpty: true, inputProps: { 'aria-label': 'Previous recipients' } }} sx={{ mt: 1 }}>
                <MenuItem value="" disabled>Choose a previous recipient</MenuItem>
                {previousRecipients.map((address) => <MenuItem key={address} value={address} sx={{ fontSize: 12, overflowWrap: 'anywhere', whiteSpace: 'normal' }}>{address}</MenuItem>)}
              </TextField>
            )}
          </Box>

          {/* Salt Input */}
          <Box
            gap={1}
            sx={{ mb: 2.5 }}
          >
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 0.7 }}>
              <InputLabel sx={{ fontSize: 11, color: 'text.secondary', textTransform: 'uppercase' }}>
                39-digit SALT
              </InputLabel>
              <Button type="button" size="small" variant="outlined" disabled={isReadOnly} onClick={onGenerateSalt}>
                Generate SALT
              </Button>
            </Stack>
            <TextField
              InputProps={{
                readOnly: isReadOnly,
              }}
              placeholder="Enter your private 39-digit SALT"
              variant="outlined"
              inputProps={{
                maxLength: 39,
                inputMode: 'numeric',
                'aria-label': '39-digit SALT',
              }}
              fullWidth
              onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, '');
              }}
              {...register('salt', {
                required: 'Salt must be a 39-digit number',
                validate: (value) => /^\d{39}$/.test(value) || 'Salt must contain exactly 39 numeric digits',
              })}
              sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#071318' } }}
            />
            {remainingDigits > 0 && (
              <InputLabel sx={{ fontSize: 11, mt: 1, color: 'text.secondary' }}>
                A transaction-specific numeric value. {39 - remainingDigits} / 39 digits entered.
              </InputLabel>
            )}
            {errors.salt && (
              <InputLabel sx={{ fontSize: 12, mt: 1, color: '#e6e6e6' }}>{errors.salt.message}</InputLabel>
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
              disabled={isInProcess}
            >
              {isInProcess ? (
                <>
                  <CircularProgress
                    size={24}
                    sx={{ mr: 2, color: '#fff', minWidth: 24 }}
                  />
                  {message.buttonTitle || 'Processing private send…'}
                </>
              ) : (
                submitLabel
              )}
            </Button>
            <Typography
              color="text.secondary"
              sx={{ mt: 1.2, textAlign: 'center', fontSize: 11 }}
            >
              You will confirm PART I and PART II in your wallet.
            </Typography>
          </Stack>
          <Box component="details" sx={{ mt: 2, '& summary': { cursor: 'pointer', color: 'text.secondary', fontSize: 13, py: 1 } }}>
            <summary>Note (optional)</summary>
            <TextField fullWidth multiline minRows={3} label="Private note (optional)"
              placeholder="Add a note to this send in Account"
              InputProps={{ readOnly: isReadOnly }} inputProps={{ maxLength: 1000 }}
              {...register('note', { maxLength: { value: 1000, message: 'Notes can contain up to 1,000 characters.' } })}
              error={Boolean(errors.note)} helperText={errors.note?.message || `${noteLength} / 1,000 characters · Saved in Account`} sx={{ mt: 1 }} />
          </Box>
        </CardContent>
      </form>
    </Card>
  );
};
