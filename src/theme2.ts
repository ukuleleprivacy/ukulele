// src/theme.ts

import { Montserrat } from 'next/font/google';
import { createTheme, responsiveFontSizes } from '@mui/material/styles';
import { keyframes } from '@emotion/react'; // Import keyframes if you want to add animation

export const montserrat = Montserrat({
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
});

// Define the gradient animation (optional)
const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  100% { background-position: 200% 50%; }
`;

// Create a theme instance.
const theme = responsiveFontSizes(
  createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: 'rgba(26, 26, 26, 1)',
      },
      background: {
        default: '#050505', // Corrected color code
      },
      secondary: {
        main: '#8c8c8c',
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            minHeight: '100vh',
            background: 'linear-gradient(180deg, #1a1a1a 0%, #050505 100%)',
            backgroundAttachment: 'fixed',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            // Optional: Add animation
            /*
            background: 'linear-gradient(90deg, #1a1a1a, #3a3a3a, #1a1a1a)',
            backgroundSize: '200% 200%',
            animation: `${gradientAnimation} 60s linear infinite`,
            */
          },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          // ... (your existing styles)
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          // ... (your existing styles)
        },
      },
      MuiButton: {
        styleOverrides: {
          // ... (your existing styles)
        },
      },
      MuiLink: {
        styleOverrides: {
          // ... (your existing styles)
        },
      },
      MuiPaper: {
        styleOverrides: {
          // ... (your existing styles)
        },
      },
    },
    typography: {
      fontFamily: montserrat.style.fontFamily,
    },
    breakpoints: {
      values: {
        xs: 0,
        sm: 800,
        md: 1200,
        lg: 1468,
        xl: 1536,
      },
    },
  }),
);

export default theme;
