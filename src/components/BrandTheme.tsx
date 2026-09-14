import { PropsWithChildren, useMemo } from 'react';
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';

export function BrandTheme({ children }: PropsWithChildren) {
  const base = useTheme();
  const theme = useMemo(
    () =>
      createTheme(base, {
        palette: {
          primary: { main: '#b9e991', light: '#d1f3b5', dark: '#8fbc6b', contrastText: '#142211' },
          background: { paper: '#0d1b17' },
          text: { primary: '#e7eeea', secondary: '#95aa9c' },
        },
      }),
    [base],
  );
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
