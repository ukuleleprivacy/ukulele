import { useState } from 'react';
import type { ChangeEvent } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Collapse from '@mui/material/Collapse';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import useMediaQuery from '@mui/material/useMediaQuery';
import { FaChevronDown } from 'react-icons/fa6';

const Schema = z.object({
  amount: z
    .string()
    .transform(Number)
    .refine((n) => !isNaN(n) && n > 0, {
      message: 'Amount must be a positive number',
    }),
  salt: z
    .string()
    .length(39, {
      message: 'Salt must be a 39 digit number',
    })
    .transform(BigInt)
    .refine((n) => typeof n === 'bigint' && n > 0, {
      message: 'Salt must be a positive number',
    }),
});

type SchemaType = z.infer<typeof Schema>;

type Props = {
  hash: string;
  onSubmit: SubmitHandler<SchemaType>;
  amount?: number;
  salt?: bigint;
};

export function HashForm({ hash, onSubmit, amount, salt: saltProp }: Props) {
  const [isInProcess, setIsInProcess] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const smDown = useMediaQuery((theme: any) => theme.breakpoints.down('sm'));

  const defaultValues =
    typeof amount === 'number' && typeof saltProp === 'bigint'
      ? ({
          amount,
          salt: saltProp,
        } as const)
      : undefined;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<SchemaType>({
    resolver: zodResolver(Schema),
    defaultValues,
  });

  const salt = watch('salt');
  const remainingDigits = 39 - (salt?.toString().length || 0);

  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 4,
        mt: 4,
        background:
          'linear-gradient(109.31deg, #161616 0.09%, rgba(22, 22, 22, 0.45) 73.5%), linear-gradient(0deg, #111111, #0d0d0d)',
      }}
    >
        <CardContent sx={{ p: '22px 32px !important' }}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            gap={2}
            onClick={() => setCollapsed((val) => !val)}
          >
            <Stack
              direction="row"
              alignItems="center"
              gap={2}
            >
              <Typography
                variant="h5"
                fontWeight="600"
                sx={{
                  wordWrap: 'anywhere',
                }}
              >
                You have a hash: {hash}
              </Typography>
            </Stack>
            <FaChevronDown style={{ color: '#FFFFFF99', minWidth: 16 }} />
          </Stack>
          <Collapse in={collapsed}>
            <form
              onSubmit={handleSubmit(async (data) => {
                setIsInProcess(true);
                await onSubmit(data);
                setIsInProcess(false);
                reset();
              })}
            >
              <CardContent
                sx={{
                  opacity: isInProcess ? '0.5' : 'initial',
                  pointerEvents: isInProcess ? 'none' : 'initial',
                  transition: 'opacity 0.5s ease-in-out',
                  mt: 3,
                }}
              >
                <Box
                  gap={1}
                  sx={{ mb: 2.5 }}
                >
                  <InputLabel sx={{ fontSize: 14, color: 'white', mb: 1 }}>Amount</InputLabel>
                  <TextField
                    disabled={Boolean(defaultValues)}
                    type="number"
                    placeholder="0.00"
                    variant="outlined"
                    onKeyDown={(evt) => ['e', 'E', '+', '-'].includes(evt.key) && evt.preventDefault()}
                    fullWidth
                    {...register('amount')}
                    sx={{ borderRadius: 999 }}
                  />
                  {errors.amount && (
                    <InputLabel sx={{ fontSize: 12, mt: 1, color: '#e6e6e6' }}>{errors.amount.message}</InputLabel>
                  )}
                </Box>
                <Box
                  gap={1}
                  sx={{ mb: 2.5 }}
                >
                  <InputLabel sx={{ fontSize: 14, color: 'white', mb: 1 }}>Salt - Input Numbers</InputLabel>
                  <TextField
                    disabled={Boolean(defaultValues)}
                    placeholder="1000000000000"
                    variant="outlined"
                    inputProps={{
                      maxLength: 39,
                    }}
                    fullWidth
                    onInput={(e: ChangeEvent<HTMLInputElement>) => {
                      e.target.value = e.target.value.replace(/[^0-9]/g, '');
                    }}
                    {...register('salt')}
                    sx={{ borderRadius: 999 }}
                  />
                  {remainingDigits > 0 && (
                    <InputLabel sx={{ fontSize: 12, mt: 1, color: 'white' }}>
                      Keep typing numbers until you have a 39 digit number.
                    </InputLabel>
                  )}
                  {errors.salt && (
                    <InputLabel sx={{ fontSize: 12, mt: 1, color: '#e6e6e6' }}>{errors.salt.message}</InputLabel>
                  )}
                </Box>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ mt: 4, mb: 4 }}
                >
                  <Button
                    type="submit"
                    size={smDown ? 'small' : 'large'}
                    color="secondary"
                    sx={{ color: 'white', px: 2 }}
                    variant="outlined"
                  >
                    {isInProcess && (
                      <CircularProgress
                        size={24}
                        sx={{ mr: 2, color: '#fff', minWidth: 24 }}
                      />
                    )}
                    Retrieve Tokens
                  </Button>
                </Stack>
              </CardContent>
            </form>
          </Collapse>
        </CardContent>
    </Card>
  );
}
