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
import Link from './Link';
import { Logo } from './Logo';

export const TopAppBar = () => {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const drawer = (
    <Box sx={{ p: 2 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Logo />
        <IconButton aria-label="Close menu" onClick={handleDrawerToggle}>
          <Close />
        </IconButton>
      </Stack>
      <Divider />
      <List sx={{ py: 2 }}>
        {navItems.map((item) => {
          const isActive = router.pathname === item.url;

          return (
            <ListItem key={item.url} disablePadding sx={{ mb: 0.5 }}>
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
                    backgroundColor: 'rgba(167, 215, 160, 0.14)',
                    boxShadow: 'inset 0 0 0 1px rgba(167, 215, 160, 0.3)',
                  },
                }}
              >
                <ListItemText
                  primary={item.label}
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
          <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'primary.main', boxShadow: '0 0 12px rgba(167, 215, 160,.7)' }} />
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
          backdropFilter: 'blur(22px)',
          background:
            'linear-gradient(180deg, rgba(37, 38, 42, 0.97) 0%, rgba(37, 38, 42, 0.9) 100%)',
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
              const isActive =
                router.pathname === page.url ||
                (page.url.startsWith('/#') && router.pathname === '/' && router.asPath.includes('#'));

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
                    borderBottom: isActive ? '2px solid #a7d7a0' : '2px solid transparent',
                    fontSize: 14,
                    color: isActive ? 'text.primary' : 'text.secondary',
                    '&:hover': {
                      color: 'text.primary',
                      backgroundColor: 'transparent',
                    },
                  }}
                >
                  {page.label}
                </Button>
              );
            })}
          </Stack>

          <Stack direction="row" alignItems="center" gap={1}>
            <Tooltip title="Join Fiducaro on Telegram" arrow>
              <IconButton
                component="a"
                href="https://t.me/+zVqxwbcpLTlmOWJl"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Join Fiducaro on Telegram"
                sx={{ color: 'primary.main', border: '1px solid rgba(167, 215, 160,.24)', '&:hover': { backgroundColor: 'rgba(167, 215, 160,.1)', boxShadow: '0 0 18px rgba(167, 215, 160,.18)' } }}
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
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'primary.main', boxShadow: '0 0 12px rgba(167, 215, 160,.8)' }} />
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
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        PaperProps={{
          sx: {
            width: 'min(88vw, 360px)',
            borderLeft: '1px solid rgba(255, 255, 255, 0.12)',
            background:
              'linear-gradient(180deg, rgba(18, 18, 18, 0.98) 0%, rgba(0, 0, 0, 0.98) 100%)',
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};
