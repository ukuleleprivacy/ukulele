import { BigNumber, utils } from 'ethers';
import { privateHistoryEvent } from './privateSendHistory';

export type CachedPrivateBalance = {
  amount: string | null; // Integer token units; null means the opening balance is unknown.
  estimated: boolean;
  applied: string[];
  updatedAt: string;
};
const key = (account: string) => `fiducaro.privateBalance.v1.${account.toLowerCase()}`;

export function readPrivateBalance(account: string): CachedPrivateBalance | null {
  const raw = localStorage.getItem(key(account));
  if (!raw) return null;
  const value = JSON.parse(raw);
  if (!value || (value.amount !== null && (typeof value.amount !== 'string' || !/^\d+$/.test(value.amount))) ||
      typeof value.estimated !== 'boolean' || !Array.isArray(value.applied) ||
      !value.applied.every((id: unknown) => typeof id === 'string')) throw new Error('Invalid cached private balance');
  return value;
}

function save(account: string, value: CachedPrivateBalance) {
  localStorage.setItem(key(account), JSON.stringify(value));
  window.dispatchEvent(new Event(privateHistoryEvent));
}

// Separate from send history: deleting a record does not restore spent tokens.
export function applyPrivateBalanceChange(account: string, transactionId: string, delta: string, reset = false) {
  const previous = readPrivateBalance(account);
  if (previous?.applied.includes(transactionId)) return;
  const next = reset ? BigNumber.from(0) : BigNumber.from(previous?.amount ?? '0').add(delta);
  save(account, {
    amount: next.isNegative() || (!reset && previous?.amount === null) ? null : next.toString(),
    estimated: reset ? false : (previous?.estimated ?? true) || previous?.amount === null || next.isNegative(),
    applied: [...(previous?.applied || []), transactionId],
    updatedAt: new Date().toISOString(),
  });
}

export function setPrivateBalance(account: string, amount: string) {
  if (!/^(?:\d+\.?\d*|\.\d+)$/.test(amount.trim())) throw new Error('Enter a non-negative FIDU amount.');
  const units = utils.parseUnits(amount.trim(), 18);
  save(account, { amount: units.toString(), estimated: true, applied: readPrivateBalance(account)?.applied || [], updatedAt: new Date().toISOString() });
}
