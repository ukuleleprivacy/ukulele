import type { PropsWithChildren, ReactNode } from 'react';
import Box, { type BoxProps } from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

export const panelSx = {
  border: '1px solid rgba(255,255,255,.14)',
  borderRadius: 1.25,
  background:
    'linear-gradient(145deg, rgba(255,255,255,.10) 0%, rgba(255,255,255,.045) 45%, rgba(255,255,255,.075) 100%)',
  boxShadow: 'inset 0 1px rgba(255,255,255,.04), 0 18px 44px rgba(0,0,0,.28)',
  backdropFilter: 'blur(16px)',
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
      color: 'rgba(237,241,242,.62)',
      fontSize: 12,
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
      boxShadow: tone === 'live' ? '0 0 12px rgba(102,255,138,.8)' : 'none',
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
