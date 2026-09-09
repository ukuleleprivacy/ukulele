import type { PropsWithChildren, ReactNode } from 'react';
import Box, { type BoxProps } from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

export const panelSx = {
  border: '1px solid rgba(104, 199, 107,.22)',
  borderRadius: 1.25,
  background:
    'linear-gradient(145deg, #101c22 0%, #0b1419 55%, #0c181c 100%)',
  boxShadow: 'inset 0 1px rgba(255,255,255,.06), 0 14px 32px rgba(0,0,0,.16)',
};

export const ProtocolPanel = ({ children, sx, ...props }: PropsWithChildren<BoxProps>) => (
  <Box {...props} sx={[panelSx, ...(Array.isArray(sx) ? sx : sx ? [sx] : [])]}>
    {children}
  </Box>
);

export const SectionLabel = ({ children }: PropsWithChildren) => (
  <Typography
    component="div"
    sx={{
      color: 'rgba(237,241,242,.76)',
      fontSize: 13,
      fontWeight: 600,
      letterSpacing: '.04em',
      textTransform: 'uppercase',
    }}
  >
    {children}
  </Typography>
);

export const StatusDot = ({ tone = 'live' }: { tone?: 'live' | 'muted' | 'warning' }) => (
  <Box
    component="span"
    sx={{
      width: 8,
      height: 8,
      flex: '0 0 auto',
      borderRadius: '50%',
      bgcolor: tone === 'live' ? 'primary.main' : tone === 'warning' ? '#a8a8a8' : '#666',
      boxShadow: tone === 'live' ? '0 0 12px rgba(104, 199, 107,.8)' : 'none',
    }}
  />
);

export const StatusLine = ({
  label,
  status = 'Live',
  tone = 'live',
}: {
  label: string;
  status?: string;
  tone?: 'live' | 'muted' | 'warning';
}) => (
  <Stack direction="row" alignItems="center" gap={1} sx={{ minWidth: 0 }}>
    <StatusDot tone={tone} />
    <Typography sx={{ fontSize: 13, whiteSpace: 'nowrap' }}>
      {label}{' '}
      <Box component="span" sx={{ color: tone === 'live' ? 'primary.main' : 'text.secondary' }}>
        — {status}
      </Box>
    </Typography>
  </Stack>
);

export const Metric = ({ label, value, icon }: { label: string; value: ReactNode; icon?: ReactNode }) => (
  <Stack direction="row" gap={1.5} alignItems="center" sx={{ minWidth: 0 }}>
    {icon}
    <Box sx={{ minWidth: 0 }}>
      <Typography sx={{ fontSize: { xs: 20, md: 23 }, fontWeight: 700, lineHeight: 1.05 }}>
        {value}
      </Typography>
      <Typography sx={{ mt: .4, color: 'text.secondary', fontSize: 12 }}>{label}</Typography>
    </Box>
  </Stack>
);
