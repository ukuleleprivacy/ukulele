import { useEffect } from 'react';

// MUI 6.1's scroll lock is incompatible with the installed newer @mui/utils.
// Use with disableScrollLock to preserve modal focus management without that path.
export function useBodyScrollLock(open: boolean) {
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previousOverflow; };
  }, [open]);
}
