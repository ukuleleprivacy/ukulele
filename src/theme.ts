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
        main: '#34E0D0',
        light: '#6FF0E4',
        dark: '#15B7A8',
        contrastText: '#04110F',
      },
      secondary: {
        main: '#9AA6AD',
        light: '#C4CDD2',
        dark: '#5D686E',
        contrastText: '#0B0D0E',
      },
      background: {
        default: '#0B0D0E',
        paper: '#14181B',
      },
      text: {
        primary: '#EDF1F2',
        secondary: 'rgba(237, 241, 242, 0.64)',
      },
      divider: 'rgba(255, 255, 255, 0.10)',
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
            backgroundColor: '#0B0D0E',
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
              outline: '2px solid #34E0D0',
              outlineOffset: 3,
            },
          },
          containedPrimary: {
            background: 'linear-gradient(135deg, #34E0D0 0%, #17BBAC 100%)',
            color: '#04110F',
            boxShadow: '0 0 0 1px rgba(52, 224, 208, 0.35), 0 10px 30px rgba(52, 224, 208, 0.18)',
            '&:hover': {
              background: 'linear-gradient(135deg, #4CE9DA 0%, #22C7B7 100%)',
              boxShadow: '0 0 26px rgba(52, 224, 208, 0.5), 0 0 0 1px rgba(52, 224, 208, 0.6)',
            },
            '&.Mui-disabled': {
              background: 'rgba(52, 224, 208, 0.12)',
              color: 'rgba(237, 241, 242, 0.5)',
              boxShadow: 'none',
            },
          },
          outlined: {
            borderColor: 'rgba(52, 224, 208, 0.34)',
            color: '#EDF1F2',
            '&:hover': {
              borderColor: 'rgba(52, 224, 208, 0.85)',
              backgroundColor: 'rgba(52, 224, 208, 0.08)',
              boxShadow: '0 0 20px rgba(52, 224, 208, 0.18)',
            },
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            '&:focus-visible': {
              outline: '2px solid #34E0D0',
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
              outline: '2px solid #34E0D0',
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
            border: '1px solid rgba(255, 255, 255, 0.09)',
            borderRadius: 8,
            background:
              'linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.018) 100%)',
            boxShadow: '0 24px 70px rgba(0, 0, 0, 0.45)',
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
            border: '1px solid rgba(52, 224, 208, 0.28)',
            backgroundColor: '#0F1518',
            color: '#EDF1F2',
            borderRadius: 6,
            fontWeight: 700,
            boxShadow: '0 0 24px rgba(52, 224, 208, 0.12)',
          },
          arrow: {
            color: '#0F1518',
          },
        },
      },
      MuiTabs: {
        styleOverrides: {
          indicator: {
            backgroundColor: '#34E0D0',
            height: 3,
            borderRadius: 3,
            boxShadow: '0 0 12px rgba(52, 224, 208, 0.7)',
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            color: 'rgba(237, 241, 242, 0.62)',
            fontWeight: 700,
            textTransform: 'none',
            '&.Mui-selected': {
              color: '#34E0D0',
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
