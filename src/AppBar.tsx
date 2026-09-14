import { useState } from 'react';
import Close from '@mui/icons-material/Close';
import Menu from '@mui/icons-material/Menu';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import { useRouter } from 'next/router';
import { FaTelegramPlane } from 'react-icons/fa';

import { navItems } from './brand';
import { ConnectWallet } from './components/ConnectWallet';
import { useBodyScrollLock } from './components/useBodyScrollLock';
import Link from './Link';
import { Logo } from './Logo';
import { BuildRoadmap } from './components/BuildRoadmap';

const navActive = (url: string, pathname: string) =>
  pathname === url ||
  (url === '/privacy' && ['/platform', '/decrypt'].includes(pathname)) ||
  (url === '/crypto' && ['/gasless', '/activity', '/people'].includes(pathname)) ||
  (url === '/dash' && pathname === '/profile');

const NavLabel = ({ label, status }: { label: string; status?: string }) => (
  <Box
    component="span"
    sx={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '5px', minHeight: 33 }}
  >
    {label}
    {status && (
      <Box
        component="span"
        role="img"
        aria-label={status === 'live' ? 'Live' : 'Not live — concept preview'}
        title={status === 'live' ? 'Live FIDU tools' : 'Not live — concept preview'}
        sx={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          bgcolor: status === 'live' ? '#86da88' : '#e47777',
          boxShadow: `0 0 9px ${status === 'live' ? '#86da8870' : '#e4777750'}`,
        }}
      />
    )}
  </Box>
);

export const TopAppBar = () => {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  useBodyScrollLock(mobileOpen);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const drawer = (
    <Box sx={{ p: 2 }}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 2 }}
      >
        <Logo />
        <IconButton
          aria-label="Close menu"
          onClick={handleDrawerToggle}
        >
          <Close />
        </IconButton>
      </Stack>
      <Divider />
      <List sx={{ py: 2 }}>
        {navItems.map((item) => {
          const isActive = navActive(item.url, router.pathname);

          return (
            <ListItem
              key={item.url}
              disablePadding
              sx={{ mb: 0.5 }}
            >
              <ListItemButton
                component={Link}
                href={item.url}
                selected={isActive}
                onClick={handleDrawerToggle}
                sx={{
                  minHeight: 48,
                  borderRadius: '8px',
                  color: isActive ? 'primary.main' : 'text.secondary',
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(104, 199, 107, 0.14)',
                    boxShadow: 'inset 0 0 0 1px rgba(104, 199, 107, 0.3)',
                  },
                }}
              >
                <ListItemText
                  primary={
                    <NavLabel
                      label={item.label}
                      status={item.status}
                    />
                  }
                  primaryTypographyProps={{ fontWeight: 700 }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      <Stack gap={1}>
        <Button
          component="a"
          href="https://t.me/+zVqxwbcpLTlmOWJl"
          target="_blank"
          rel="noopener noreferrer"
          startIcon={<FaTelegramPlane />}
          sx={{ justifyContent: 'flex-start', color: 'primary.main' }}
        >
          Telegram
        </Button>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary', px: 1 }}>
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              bgcolor: 'primary.main',
              boxShadow: '0 0 12px rgba(104, 199, 107,.7)',
            }}
          />
          Ethereum Mainnet
        </Box>
        <ConnectWallet fullWidth />
      </Stack>
    </Box>
  );

  return (
    <>
      <AppBar
        position="sticky"
        color="transparent"
        elevation={0}
        sx={{
          top: 0,
          zIndex: (theme) => theme.zIndex.appBar,
          py: { xs: 0.5, md: 0.75 },
          backdropFilter: { xs: 'none', md: 'blur(12px)' },
          background: 'linear-gradient(180deg, rgba(3, 8, 11, 0.97) 0%, rgba(3, 8, 11, 0.9) 100%)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.11)',
        }}
      >
        <Toolbar
          disableGutters
          sx={{
            justifyContent: 'space-between',
            gap: 2,
            width: '100%',
            maxWidth: 1920,
            mx: 'auto',
            px: { xs: 2, sm: 3, lg: 4.5 },
          }}
        >
          <Logo />

          <Stack
            component="nav"
            direction="row"
            alignItems="center"
            gap={0.5}
            sx={{
              display: { xs: 'none', md: 'flex' },
              gap: 0.5,
            }}
            aria-label="Primary navigation"
          >
            {navItems.map((page) => {
              const isActive = navActive(page.url, router.pathname);

              return (
                <Button
                  component={Link}
                  key={page.url}
                  href={page.url}
                  variant="text"
                  color="primary"
                  sx={{
                    minHeight: 56,
                    px: 1.5,
                    borderRadius: 0,
                    borderBottom: isActive ? '2px solid #68c76b' : '2px solid transparent',
                    fontSize: 14,
                    color: isActive ? 'text.primary' : 'text.secondary',
                    '&:hover': {
                      color: 'text.primary',
                      backgroundColor: 'transparent',
                    },
                  }}
                >
                  <NavLabel
                    label={page.label}
                    status={page.status}
                  />
                </Button>
              );
            })}
          </Stack>

          <Stack alignItems="flex-end">
            <Stack
              direction="row"
              alignItems="center"
              gap={1}
            >
              <Tooltip
                title="Join Fiducaro on Telegram"
                arrow
              >
                <IconButton
                  component="a"
                  href="https://t.me/+zVqxwbcpLTlmOWJl"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Join Fiducaro on Telegram"
                  sx={{
                    color: 'primary.main',
                    border: '1px solid rgba(104, 199, 107,.24)',
                    '&:hover': {
                      backgroundColor: 'rgba(104, 199, 107,.1)',
                      boxShadow: '0 0 18px rgba(104, 199, 107,.18)',
                    },
                  }}
                >
                  <FaTelegramPlane size={17} />
                </IconButton>
              </Tooltip>
              <Box
                sx={{
                  display: { xs: 'none', lg: 'flex' },
                  alignItems: 'center',
                  gap: 1,
                  minHeight: 40,
                  px: 1.5,
                  border: '1px solid rgba(255,255,255,.14)',
                  borderRadius: 1,
                  color: 'text.primary',
                  fontSize: 13,
                }}
              >
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: 'primary.main',
                    boxShadow: '0 0 12px rgba(104, 199, 107,.8)',
                  }}
                />
                Ethereum Mainnet
              </Box>
              <ConnectWallet sx={{ display: { xs: 'none', sm: 'inline-flex' } }} />
              <IconButton
                color="inherit"
                aria-label="Open menu"
                edge="end"
                onClick={handleDrawerToggle}
                sx={{ display: { xs: 'inline-flex', md: 'none' }, color: 'text.primary' }}
              >
                <Menu />
              </IconButton>
            </Stack>
            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
              <BuildRoadmap compact />
            </Box>
          </Stack>
        </Toolbar>
        <Box sx={{ display: { xs: 'block', md: 'none' } }}>
          <BuildRoadmap />
        </Box>
      </AppBar>

      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true, disableScrollLock: true }}
        PaperProps={{
          sx: {
            width: 'min(88vw, 360px)',
            borderLeft: '1px solid rgba(255, 255, 255, 0.12)',
            background: 'linear-gradient(180deg, rgba(18, 18, 18, 0.98) 0%, rgba(0, 0, 0, 0.98) 100%)',
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};
