import ScienceOutlined from '@mui/icons-material/ScienceOutlined';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

export const TestCaseBanner = () => (
  <Box
    component="aside"
    role="note"
    sx={{
      mt: 2,
      p: { xs: 2, sm: 2.25 },
      border: '1px solid rgba(52, 224, 208, 0.28)',
      borderRadius: '8px',
      background:
        'linear-gradient(90deg, rgba(52, 224, 208, 0.1), rgba(255, 255, 255, 0.025))',
    }}
  >
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      alignItems={{ xs: 'stretch', md: 'center' }}
      justifyContent="space-between"
      gap={2}
    >
      <Stack direction="row" gap={1.5} alignItems="flex-start">
        <ScienceOutlined color="primary" sx={{ mt: 0.15, flex: '0 0 auto' }} />
        <Box>
          <Typography fontWeight="700">FIDUCARO is live on Ethereum mainnet</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.35, maxWidth: 760 }}>
            SEND buries value, Decrypt retrieves hidden balances, and Disruptor projects a visible
            zero-net Transfer signal. Every command uses real Ethereum execution and requires your
            wallet approval.
          </Typography>
        </Box>
      </Stack>
    </Stack>
  </Box>
);
