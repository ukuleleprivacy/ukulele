// src/validation.ts

import { z } from 'zod';
import { ethers } from 'ethers';

export const Schema = z.object({
  address: z
    .string()
    .startsWith('0x', {
      message: 'Address must start with 0x',
    })
    .length(42, {
      message: 'Address must be a valid Ethereum address',
    })
    .refine((addr) => ethers.utils.isAddress(addr), {
      message: 'Address must be a valid Ethereum address',
    }),
  amount: z
    .string()
    .transform((val) => Number(val))
    .refine((n) => !isNaN(n) && n > 0, {
      message: 'Amount must be a positive number',
    }),
  salt: z
    .string()
    .length(39, {
      message: 'Salt must be a 39-digit number',
    })
    .refine((val) => /^\d{39}$/.test(val), {
      message: 'Salt must be a 39-digit number',
    })
    .transform((val) => BigInt(val)),
});

export type SchemaType = z.infer<typeof Schema>;
