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
        main: '#a7d7a0',
        light: '#c4e6bf',
        dark: '#80b779',
        contrastText: '#04110F',
      },
      secondary: {
        main: '#9AA6AD',
        light: '#C4CDD2',
        dark: '#5D686E',
        contrastText: '#0B0D0E',
      },
      background: {
        default: '#25262a',
        paper: '#37383e',
      },
      text: {
        primary: '#EDF1F2',
        secondary: 'rgba(237, 241, 242, 0.74)',
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
            backgroundColor: '#25262a',
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
              outline: '2px solid #a7d7a0',
              outlineOffset: 3,
            },
          },
          containedPrimary: {
            background: 'linear-gradient(135deg, #a7d7a0 0%, #93c68c 100%)',
            color: '#04110F',
            boxShadow: '0 0 0 1px rgba(167, 215, 160, 0.35), 0 10px 30px rgba(167, 215, 160, 0.18)',
            '&:hover': {
              background: 'linear-gradient(135deg, #c4e6bf 0%, #afd5a8 100%)',
              boxShadow: '0 0 26px rgba(167, 215, 160, 0.5), 0 0 0 1px rgba(167, 215, 160, 0.6)',
            },
            '&.Mui-disabled': {
              background: 'rgba(167, 215, 160, 0.12)',
              color: 'rgba(237, 241, 242, 0.5)',
              boxShadow: 'none',
            },
          },
          outlined: {
            borderColor: 'rgba(167, 215, 160, 0.34)',
            color: '#EDF1F2',
            '&:hover': {
              borderColor: 'rgba(167, 215, 160, 0.85)',
              backgroundColor: 'rgba(167, 215, 160, 0.08)',
              boxShadow: '0 0 20px rgba(167, 215, 160, 0.18)',
            },
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            '&:focus-visible': {
              outline: '2px solid #a7d7a0',
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
              outline: '2px solid #a7d7a0',
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
              'linear-gradient(180deg, rgba(255, 255, 255, 0.032) 0%, rgba(255, 255, 255, 0.01) 100%)',
            boxShadow: '0 24px 70px rgba(0, 0, 0, 0.58)',
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
            border: '1px solid rgba(167, 215, 160, 0.28)',
            backgroundColor: '#37383e',
            color: '#EDF1F2',
            borderRadius: 6,
            fontWeight: 700,
            boxShadow: '0 0 24px rgba(167, 215, 160, 0.12)',
          },
          arrow: {
            color: '#37383e',
          },
        },
      },
      MuiTabs: {
        styleOverrides: {
          indicator: {
            backgroundColor: '#a7d7a0',
            height: 3,
            borderRadius: 3,
            boxShadow: '0 0 12px rgba(167, 215, 160, 0.7)',
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
              color: '#a7d7a0',
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
