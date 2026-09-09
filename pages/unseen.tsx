import { keyframes } from '@emotion/react';
import ArrowBackRounded from '@mui/icons-material/ArrowBackRounded';
import ArrowForwardRounded from '@mui/icons-material/ArrowForwardRounded';
import DownloadRounded from '@mui/icons-material/DownloadRounded';
import LockOutlined from '@mui/icons-material/LockOutlined';
import OpenInNewRounded from '@mui/icons-material/OpenInNewRounded';
import VisibilityOffOutlined from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlined from '@mui/icons-material/VisibilityOutlined';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Head from 'next/head';
import { FormEvent, useEffect, useRef, useState } from 'react';

import { LogoMark } from '../src/Logo';
import Link from '../src/Link';

const VAULT_URL = '/vault/archive-7f3c9d.enc';
const VAULT_MAGIC = 'FIDUVLT1';
const PBKDF2_ITERATIONS = 310_000;

const gridDrift = keyframes`
  from { transform: perspective(720px) rotateX(64deg) translateY(0); }
  to { transform: perspective(720px) rotateX(64deg) translateY(44px); }
`;

const orbit = keyframes`
  to { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 0.42; transform: scale(0.96); }
  50% { opacity: 1; transform: scale(1.04); }
`;

const bytesToString = (bytes: Uint8Array) =>
  Array.from(bytes, (byte) => String.fromCharCode(byte)).join('');

const decryptVault = async (password: string) => {
  const response = await fetch(VAULT_URL, { cache: 'no-store' });

  if (!response.ok) {
    throw new Error('VAULT_UNAVAILABLE');
  }

  const archive = new Uint8Array(await response.arrayBuffer());
  const magicLength = VAULT_MAGIC.length;

  if (archive.length < magicLength + 16 + 12 || bytesToString(archive.slice(0, magicLength)) !== VAULT_MAGIC) {
    throw new Error('VAULT_UNAVAILABLE');
  }

  const salt = archive.slice(magicLength, magicLength + 16);
  const iv = archive.slice(magicLength + 16, magicLength + 28);
  const encryptedDocument = archive.slice(magicLength + 28);
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveKey'],
  );
  const key = await window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: PBKDF2_ITERATIONS,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['decrypt'],
  );

  return window.crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    encryptedDocument,
  );
};

export default function Unseen() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [error, setError] = useState('');
  const [documentUrl, setDocumentUrl] = useState('');
  const activeDocumentUrl = useRef('');

  useEffect(
    () => () => {
      if (activeDocumentUrl.current) {
        URL.revokeObjectURL(activeDocumentUrl.current);
      }
    },
    [],
  );

  const handleUnlock = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!password || isUnlocking) {
      return;
    }

    setError('');
    setIsUnlocking(true);

    try {
      const decrypted = await decryptVault(password);
      const nextDocumentUrl = URL.createObjectURL(
        new Blob([decrypted], { type: 'application/pdf' }),
      );

      if (activeDocumentUrl.current) {
        URL.revokeObjectURL(activeDocumentUrl.current);
      }

      activeDocumentUrl.current = nextDocumentUrl;
      setDocumentUrl(nextDocumentUrl);
      setPassword('');
    } catch (unlockError) {
      setError(
        unlockError instanceof Error && unlockError.message === 'VAULT_UNAVAILABLE'
          ? 'The private archive is temporarily unavailable.'
          : 'Access phrase not recognized. Try again.',
      );
    } finally {
      setIsUnlocking(false);
    }
  };

  return (
    <>
      <Head>
        <title>Private Archive · Fiducaro</title>
        <meta name="robots" content="noindex, nofollow, noarchive, nosnippet" />
        <meta name="googlebot" content="noindex, nofollow, noarchive, nosnippet" />
      </Head>

      <Box
        component="main"
        sx={{
          position: 'relative',
          minHeight: '100dvh',
          isolation: 'isolate',
          overflow: 'hidden',
          py: { xs: 2, sm: 3 },
          '&::before': {
            content: '""',
            position: 'absolute',
            zIndex: -3,
            inset: 0,
            background:
              'radial-gradient(circle at 50% 38%, rgba(104, 199, 107, 0.13), transparent 27%), radial-gradient(circle at 10% 82%, rgba(104, 199, 107, 0.06), transparent 24%)',
          },
        }}
      >
        <Box
          aria-hidden="true"
          sx={{
            position: 'absolute',
            zIndex: -2,
            left: '-20%',
            bottom: '-56%',
            width: '140%',
            height: '86%',
            opacity: 0.25,
            transformOrigin: 'center bottom',
            backgroundImage:
              'linear-gradient(rgba(104, 199, 107, 0.22) 1px, transparent 1px), linear-gradient(90deg, rgba(104, 199, 107, 0.22) 1px, transparent 1px)',
            backgroundSize: '44px 44px',
            maskImage: 'linear-gradient(to bottom, transparent, black 30%, black)',
            animation: `${gridDrift} 3.8s linear infinite`,
          }}
        />

        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ position: 'relative', zIndex: 2 }}
        >
          <Link href="/" aria-label="Fiducaro home" sx={{ display: 'inline-flex' }}>
            <LogoMark size={42} />
          </Link>
          <Button
            component={Link}
            href="/"
            variant="text"
            color="secondary"
            startIcon={<ArrowBackRounded />}
            sx={{ color: 'text.secondary', fontSize: 13 }}
          >
            Return to public site
          </Button>
        </Stack>

        {!documentUrl ? (
          <Stack
            alignItems="center"
            justifyContent="center"
            sx={{
              position: 'relative',
              zIndex: 1,
              minHeight: { xs: 'calc(100dvh - 92px)', sm: 'calc(100dvh - 106px)' },
              py: { xs: 6, md: 9 },
            }}
          >
            <Box sx={{ width: '100%', maxWidth: 560, minWidth: 0, textAlign: 'center' }}>
              <Box
                aria-hidden="true"
                sx={{
                  position: 'relative',
                  display: 'grid',
                  placeItems: 'center',
                  width: 104,
                  height: 104,
                  mx: 'auto',
                  mb: 4,
                  borderRadius: '50%',
                  border: '1px solid rgba(104, 199, 107, 0.3)',
                  backgroundColor: 'rgba(3, 12, 7, 0.78)',
                  boxShadow:
                    'inset 0 0 30px rgba(104, 199, 107, 0.08), 0 0 60px rgba(104, 199, 107, 0.16)',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    inset: -9,
                    borderRadius: '50%',
                    borderTop: '1px solid #68c76b',
                    borderRight: '1px solid transparent',
                    animation: `${orbit} 5s linear infinite`,
                  },
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    inset: 8,
                    borderRadius: '50%',
                    border: '1px dashed rgba(104, 199, 107, 0.24)',
                    animation: `${orbit} 9s linear infinite reverse`,
                  },
                }}
              >
                <LockOutlined
                  sx={{
                    position: 'relative',
                    zIndex: 1,
                    fontSize: 38,
                    color: 'primary.main',
                    filter: 'drop-shadow(0 0 10px rgba(104, 199, 107, 0.8))',
                    animation: `${pulse} 2.6s ease-in-out infinite`,
                  }}
                />
              </Box>

              <Typography
                variant="overline"
                color="primary.light"
                sx={{
                  display: 'block',
                  fontWeight: 700,
                  letterSpacing: { xs: '0.12em', sm: '0.2em' },
                  lineHeight: 1.7,
                  whiteSpace: 'normal',
                }}
              >
                Fiducaro // Private investor archive
              </Typography>
              <Typography
                variant="h2"
                component="h1"
                sx={{
                  mt: 1.5,
                  mb: 2,
                  fontSize: { xs: 'clamp(2.35rem, 12vw, 3.4rem)', sm: '3.75rem' },
                }}
              >
                See what others can’t.
              </Typography>
              <Typography color="text.secondary" sx={{ maxWidth: 470, mx: 'auto', mb: 4 }}>
                This document is sealed. Enter your access phrase to decrypt it locally in this
                browser.
              </Typography>

              <Box
                component="form"
                onSubmit={handleUnlock}
                sx={{
                  position: 'relative',
                  p: { xs: 2, sm: 2.5 },
                  border: '1px solid rgba(104, 199, 107, 0.24)',
                  borderRadius: '8px',
                  background:
                    'linear-gradient(180deg, rgba(9, 20, 13, 0.9), rgba(2, 7, 4, 0.94))',
                  boxShadow:
                    '0 30px 90px rgba(0, 0, 0, 0.6), inset 0 1px rgba(255, 255, 255, 0.04)',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: -1,
                    left: '12%',
                    width: '32%',
                    height: '1px',
                    background: 'linear-gradient(90deg, transparent, #68c76b, transparent)',
                    boxShadow: '0 0 16px #68c76b',
                  },
                }}
              >
                <Stack direction={{ xs: 'column', sm: 'row' }} gap={1.25}>
                  <TextField
                    autoFocus
                    fullWidth
                    type={showPassword ? 'text' : 'password'}
                    label="Access phrase"
                    value={password}
                    error={Boolean(error)}
                    disabled={isUnlocking}
                    autoComplete="current-password"
                    onChange={(event) => {
                      setPassword(event.target.value);
                      if (error) setError('');
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockOutlined fontSize="small" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            type="button"
                            aria-label={showPassword ? 'Hide access phrase' : 'Show access phrase'}
                            onClick={() => setShowPassword((visible) => !visible)}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOffOutlined /> : <VisibilityOutlined />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        minHeight: 54,
                        backgroundColor: 'rgba(0, 0, 0, 0.3)',
                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.14)' },
                        '&:hover fieldset': { borderColor: 'rgba(104, 199, 107, 0.5)' },
                        '&.Mui-focused fieldset': {
                          borderColor: 'primary.main',
                          boxShadow: '0 0 18px rgba(104, 199, 107, 0.18)',
                        },
                      },
                    }}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={!password || isUnlocking}
                    endIcon={
                      isUnlocking ? (
                        <CircularProgress color="inherit" size={17} />
                      ) : (
                        <ArrowForwardRounded />
                      )
                    }
                    sx={{ minHeight: 54, px: 3.25 }}
                  >
                    {isUnlocking ? 'Decrypting' : 'Unlock'}
                  </Button>
                </Stack>
                <Typography
                  variant="caption"
                  role={error ? 'alert' : undefined}
                  aria-live="polite"
                  sx={{
                    display: 'block',
                    minHeight: 20,
                    mt: 1.25,
                    px: 0.25,
                    textAlign: 'left',
                    color: error ? '#FF8C8C' : 'text.secondary',
                  }}
                >
                  {error || 'AES-256 encrypted · decrypted only in this session'}
                </Typography>
              </Box>
            </Box>
          </Stack>
        ) : (
          <Box sx={{ position: 'relative', zIndex: 1, pt: { xs: 5, md: 7 }, pb: 4 }}>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              alignItems={{ xs: 'flex-start', sm: 'flex-end' }}
              justifyContent="space-between"
              gap={2}
              sx={{ mb: 3 }}
            >
              <Box>
                <Typography
                  variant="overline"
                  color="primary.light"
                  sx={{ fontWeight: 700, letterSpacing: '0.18em' }}
                >
                  Access granted
                </Typography>
                <Typography variant="h3" component="h1" sx={{ mt: 0.5 }}>
                  Investor Paper
                </Typography>
              </Box>
              <Stack direction="row" gap={1}>
                <Button
                  component="a"
                  href={documentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="outlined"
                  startIcon={<OpenInNewRounded />}
                >
                  Open
                </Button>
                <Button
                  component="a"
                  href={documentUrl}
                  download="fiducaro-investor-paper.pdf"
                  variant="contained"
                  startIcon={<DownloadRounded />}
                >
                  Download
                </Button>
              </Stack>
            </Stack>

            <Box
              sx={{
                overflow: 'hidden',
                border: '1px solid rgba(104, 199, 107, 0.28)',
                borderRadius: '8px',
                backgroundColor: '#0A0E0B',
                boxShadow: '0 30px 100px rgba(0, 0, 0, 0.62), 0 0 36px rgba(104, 199, 107, 0.08)',
              }}
            >
              <Box
                component="iframe"
                src={`${documentUrl}#view=FitH&navpanes=0`}
                title="Fiducaro investor paper"
                sx={{ display: 'block', width: '100%', height: '78dvh', minHeight: 620, border: 0 }}
              />
            </Box>
          </Box>
        )}
      </Box>
    </>
  );
}
