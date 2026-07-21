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
import { useRouter } from 'next/router';

import { navItems } from './brand';
import { ConnectWallet } from './components/ConnectWallet';
import { WalletBalance } from './components/WalletBalance';
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
                    backgroundColor: 'rgba(52, 224, 208, 0.14)',
                    boxShadow: 'inset 0 0 0 1px rgba(52, 224, 208, 0.3)',
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
        <ConnectWallet fullWidth />
        <WalletBalance fullWidth />
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
          py: { xs: 1.25, md: 2 },
          backdropFilter: 'blur(22px)',
          background:
            'linear-gradient(180deg, rgba(9, 12, 13, 0.9) 0%, rgba(9, 12, 13, 0.6) 100%)',
          borderBottom: '1px solid rgba(52, 224, 208, 0.12)',
        }}
      >
        <Toolbar
          disableGutters
          sx={{
            justifyContent: 'space-between',
            gap: 2,
            px: { xs: 2, sm: 3, lg: 5 },
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
              p: 0.35,
              gap: 0.25,
              border: '1px solid rgba(255, 255, 255, 0.09)',
              borderRadius: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.028)',
            }}
            aria-label="Primary navigation"
          >
            {navItems.map((page) => {
              const isActive = router.pathname === page.url;

              return (
                <Button
                  component={Link}
                  key={page.url}
                  href={page.url}
                  variant={isActive ? 'contained' : 'text'}
                  color="primary"
                  sx={{
                    minHeight: 32,
                    px: 1.15,
                    fontSize: 12.5,
                    color: isActive ? 'primary.contrastText' : 'text.secondary',
                    '&:hover': {
                      color: isActive ? undefined : 'primary.main',
                      backgroundColor: isActive ? undefined : 'rgba(52, 224, 208, 0.08)',
                    },
                  }}
                >
                  {page.label}
                </Button>
              );
            })}
          </Stack>

          <Stack direction="row" alignItems="center" gap={1}>
            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
              <WalletBalance />
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
