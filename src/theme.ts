import { createTheme, responsiveFontSizes } from '@mui/material/styles';

export const montserrat = {
  className: '',
  style: {
    fontFamily:
      '"Montserrat", "Inter", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
};

const fontFamily = montserrat.style.fontFamily;

const theme = responsiveFontSizes(
  createTheme({
    shape: {
      borderRadius: 8,
    },
    palette: {
      mode: 'dark',
      primary: {
        main: '#FFFFFF',
        light: '#E0E0E0',
        dark: '#8C8C8C',
        contrastText: '#0A0A0A',
      },
      secondary: {
        main: '#BFBFBF',
        light: '#E5E5E5',
        dark: '#737373',
        contrastText: '#0A0A0A',
      },
      background: {
        default: '#0A0A0A',
        paper: '#121212',
      },
      text: {
        primary: '#F5F5F5',
        secondary: 'rgba(255, 255, 255, 0.72)',
      },
      divider: 'rgba(255, 255, 255, 0.12)',
    },
    typography: {
      fontFamily,
      h1: {
        fontFamily,
        fontWeight: 700,
        letterSpacing: 0,
        lineHeight: 0.94,
      },
      h2: {
        fontFamily,
        fontWeight: 700,
        letterSpacing: 0,
        lineHeight: 1,
      },
      h3: {
        fontFamily,
        fontWeight: 700,
        letterSpacing: 0,
        lineHeight: 1.08,
      },
      h4: {
        fontFamily,
        fontWeight: 700,
        letterSpacing: 0,
        lineHeight: 1.12,
      },
      h5: {
        fontFamily,
        fontWeight: 700,
        letterSpacing: 0,
      },
      h6: {
        fontFamily,
        fontWeight: 700,
        letterSpacing: 0,
      },
      button: {
        fontWeight: 700,
        letterSpacing: 0,
      },
      body1: {
        lineHeight: 1.72,
      },
      body2: {
        lineHeight: 1.62,
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: '#0A0A0A',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            minHeight: 44,
            minWidth: 0,
            borderRadius: 8,
            boxShadow: 'none',
            textTransform: 'none',
            whiteSpace: 'nowrap',
            '&:focus-visible': {
              outline: '2px solid #E0E0E0',
              outlineOffset: 3,
            },
          },
          containedPrimary: {
            background: 'linear-gradient(135deg, #FFFFFF 0%, #E0E0E0 100%)',
            color: '#0A0A0A',
            '&:hover': {
              background: 'linear-gradient(135deg, #E8E8E8 0%, #C9C9C9 100%)',
              boxShadow: '0 0 28px rgba(255, 255, 255, 0.32)',
            },
          },
          outlined: {
            borderColor: 'rgba(255, 255, 255, 0.22)',
            color: '#F5F5F5',
            '&:hover': {
              borderColor: 'rgba(255, 255, 255, 0.72)',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
            },
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            '&:focus-visible': {
              outline: '2px solid #E0E0E0',
              outlineOffset: 3,
            },
          },
        },
      },
      MuiLink: {
        styleOverrides: {
          root: {
            color: 'inherit',
            textDecoration: 'none',
            '&:focus-visible': {
              outline: '2px solid #E0E0E0',
              outlineOffset: 3,
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
          outlined: {
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: 8,
            background:
              'linear-gradient(180deg, rgba(255, 255, 255, 0.055) 0%, rgba(255, 255, 255, 0.025) 100%)',
            boxShadow: '0 20px 70px rgba(0, 0, 0, 0.28)',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 8,
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            fontWeight: 700,
          },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            maxWidth: 320,
            border: '1px solid rgba(255, 255, 255, 0.14)',
            backgroundColor: '#F5F5F5',
            color: '#0A0A0A',
            borderRadius: 6,
            fontWeight: 700,
          },
          arrow: {
            color: '#F5F5F5',
          },
        },
      },
      MuiTabs: {
        styleOverrides: {
          indicator: {
            backgroundColor: '#E0E0E0',
            height: 3,
            borderRadius: 3,
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            color: 'rgba(255, 255, 255, 0.68)',
            fontWeight: 700,
            textTransform: 'none',
            '&.Mui-selected': {
              color: '#F5F5F5',
            },
          },
        },
      },
    },
    breakpoints: {
      values: {
        xs: 0,
        sm: 720,
        md: 1040,
        lg: 1280,
        xl: 1536,
      },
    },
  }),
);

export default theme;
