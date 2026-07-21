// src/components/ProgressMessageCard.tsx

import { Card, CardContent, Stack, Typography, Box } from '@mui/material';
import { IoMdAlert } from 'react-icons/io';
import type { ReactNode } from 'react';

type Message = {
  title: string;
  description: ReactNode;
  buttonTitle: string;
};

interface ProgressMessageCardProps {
  message: Message;
  step: number;
  error: { title: string; description: string } | null;
}

export const ProgressMessageCard = ({ message, step, error }: ProgressMessageCardProps) => {
  const activeMessage = error || message;
  const isAttention = step === 0 && !error;
  const accentColor = isAttention ? '#34E0D0' : '#E6E6E6';

  return (
    <Box
      sx={{
        padding: '1px',
        borderRadius: '8px',
        background: isAttention
          ? 'linear-gradient(91.31deg, rgba(52, 224, 208, 0.7) 0.26%, rgba(52, 224, 208, 0.14) 80.13%)'
          : error
            ? 'linear-gradient(91.31deg, #E6E6E6 0.26%, rgba(230, 230, 230, 0.28) 80.13%)'
            : 'rgba(255, 255, 255, 0.12)',
      }}
    >
      <Card variant="outlined" sx={{ borderRadius: '8px' }}>
        <CardContent sx={{ p: '22px 32px !important' }}>
          <Stack direction="row" alignItems="center" gap={2}>
            {(isAttention || error) && (
              <Box
                sx={{
                  background: isAttention ? 'rgba(52, 224, 208, 0.16)' : 'rgba(255, 255, 255, 0.30)',
                  borderRadius: '8px',
                  display: 'flex',
                  padding: 0.75,
                }}
              >
                <IoMdAlert size={24} style={{ color: accentColor }} />
              </Box>
            )}
            <Typography variant="h5" fontWeight="600">
              {activeMessage.title}
            </Typography>
          </Stack>
          {activeMessage.description && (
            <Typography color="text.secondary" sx={{ mt: 1.5, ml: isAttention || error ? 6 : 0 }}>
              {activeMessage.description}
            </Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};
