export type PrivateSendRecord = {
  id: string;
  sender: string;
  recipient: string;
  amount: string;
  salt: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
  status: 'prepared' | 'part-one-pending' | 'part-one-confirmed' | 'part-two-pending' | 'complete' | 'incomplete';
  partOneHash?: string;
  partTwoHash?: string;
  publicBalanceBefore?: string;
};

export const privateHistoryEvent = 'fiducaro.privateHistory.changed';
const storageKey = (sender: string) => `fiducaro.privateSends.v1.${sender.toLowerCase()}`;

export function generatePrivateSalt(): string {
  let salt = '';
  // Rejection sampling avoids modulo bias; the first digit is nonzero.
  while (salt.length < 39) {
    const bytes = crypto.getRandomValues(new Uint8Array(64));
    for (let i = 0; i < bytes.length && salt.length < 39; i++) {
      if (bytes[i] >= 250) continue;
      const digit = bytes[i] % 10;
      if (!salt.length && digit === 0) continue;
      salt += digit;
    }
  }
  return salt;
}

export function readPrivateSends(sender: string): PrivateSendRecord[] {
  const raw = localStorage.getItem(storageKey(sender));
  if (!raw) return [];
  const records: unknown = JSON.parse(raw);
  if (!Array.isArray(records) || records.some((record) =>
    !record || typeof record.id !== 'string' || typeof record.sender !== 'string' ||
    record.sender.toLowerCase() !== sender.toLowerCase() || typeof record.recipient !== 'string' ||
    typeof record.amount !== 'string' || !/^\d{39}$/.test(record.salt) ||
    (record.note !== undefined && (typeof record.note !== 'string' || record.note.length > 1000)) ||
    !Number.isFinite(Date.parse(record.createdAt)) ||
    !['prepared', 'part-one-pending', 'part-one-confirmed', 'part-two-pending', 'complete', 'incomplete'].includes(record.status)
  )) throw new Error('The saved private-send history could not be read.');
  return records as PrivateSendRecord[];
}

function writePrivateSends(sender: string, records: PrivateSendRecord[]) {
  localStorage.setItem(storageKey(sender), JSON.stringify(records));
  window.dispatchEvent(new Event(privateHistoryEvent));
}

export function savePrivateSend(record: PrivateSendRecord) {
  const records = readPrivateSends(record.sender);
  const existing = records.findIndex((item) => item.id === record.id);
  if (existing < 0) records.unshift(record);
  else records[existing] = record;
  writePrivateSends(record.sender, records);
}

export function deletePrivateSend(sender: string, id: string) {
  writePrivateSends(sender, readPrivateSends(sender).filter((record) => record.id !== id));
}
