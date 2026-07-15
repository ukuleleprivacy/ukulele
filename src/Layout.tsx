import { motion } from 'framer-motion';
import { PropsWithChildren } from 'react';

export const Layout = ({ children }: PropsWithChildren) => (
  <motion.div
    initial={{ y: 8, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    exit={{ y: 8, opacity: 0 }}
    transition={{
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1],
    }}
    style={{ marginBottom: '0' }}
  >
    {children}
  </motion.div>
);
