import { useEffect } from 'react';
import { useRouter } from 'next/router';

export function usePrivacyOperation(blocked: boolean, onBusyChange: (busy: boolean) => void) {
  const router = useRouter();
  useEffect(() => {
    onBusyChange(blocked);
    return () => onBusyChange(false);
  }, [blocked, onBusyChange]);
  useEffect(() => {
    if (!blocked) return;
    const warn = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };
    const preventNavigation = () => {
      router.events.emit('routeChangeError');
      throw 'Finish or resolve the pending privacy operation before leaving this page.';
    };
    window.addEventListener('beforeunload', warn);
    router.events.on('routeChangeStart', preventNavigation);
    return () => {
      window.removeEventListener('beforeunload', warn);
      router.events.off('routeChangeStart', preventNavigation);
    };
  }, [blocked, router.events]);
}
