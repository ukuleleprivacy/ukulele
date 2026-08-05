import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { webcrypto } from 'node:crypto';

const MAGIC = Buffer.from('FIDUVLT1');
const ITERATIONS = 310_000;

const [, , sourceArgument, destinationArgument] = process.argv;
const password = process.env.INVESTOR_VAULT_PASSWORD;

if (!sourceArgument || !destinationArgument || !password) {
  console.error(
    'Usage: INVESTOR_VAULT_PASSWORD=<password> node scripts/encrypt-investor-paper.mjs <source.pdf> <destination.enc>',
  );
  process.exit(1);
}

const sourcePath = resolve(sourceArgument);
const destinationPath = resolve(destinationArgument);
const salt = webcrypto.getRandomValues(new Uint8Array(16));
const iv = webcrypto.getRandomValues(new Uint8Array(12));
const passwordBytes = new TextEncoder().encode(password);
const source = await readFile(sourcePath);

const keyMaterial = await webcrypto.subtle.importKey(
  'raw',
  passwordBytes,
  'PBKDF2',
  false,
  ['deriveKey'],
);
const key = await webcrypto.subtle.deriveKey(
  {
    name: 'PBKDF2',
    salt,
    iterations: ITERATIONS,
    hash: 'SHA-256',
  },
  keyMaterial,
  { name: 'AES-GCM', length: 256 },
  false,
  ['encrypt'],
);
const encrypted = await webcrypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, source);

await mkdir(dirname(destinationPath), { recursive: true });
await writeFile(
  destinationPath,
  Buffer.concat([MAGIC, Buffer.from(salt), Buffer.from(iv), Buffer.from(encrypted)]),
);

console.log(`Encrypted investor paper written to ${destinationPath}`);
