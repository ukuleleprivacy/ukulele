const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const { ethers } = require('ethers');

// Execute the real TypeScript helper without adding a test runner or contacting a chain.
const source = fs.readFileSync(path.join(__dirname, '../src/lib/privacyTransactions.ts'), 'utf8');
const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
const moduleExports = {};
new Function('require', 'exports', code)((name) => name === '../constants' ? { gasLimit: '400000' } : require(name), moduleExports);
const { parseFiduAmount, validateRecipient, requirePrivacySigner, confirmPrivacyTransaction, privacyTransactionError, transactionDefinitelyStopped } = moduleExports;
const account = '0x5203C6EC24838664af6BF113c062e5502317Cf9d';

test('FIDU amounts retain all 18 decimals', () => {
  assert.equal(parseFiduAmount('0.000000000000000001').toString(), '1');
  assert.equal(parseFiduAmount('9007199254740993.123456789012345678').toString(), '9007199254740993123456789012345678');
});
test('invalid, zero, negative, over-precision and overflowing amounts are rejected', () => {
  for (const value of ['', '0', '-1', '1e3', '1,000', 'NaN', '0.0000000000000000001', '9'.repeat(90)]) assert.throws(() => parseFiduAmount(value));
});
test('recipient must be a non-zero Ethereum address', () => {
  assert.equal(validateRecipient(account), true);
  assert.notEqual(validateRecipient(ethers.constants.AddressZero), true);
  assert.notEqual(validateRecipient('not-an-address'), true);
});
test('wallet, current network and original sender are checked', async () => {
  await assert.rejects(() => requirePrivacySigner(undefined, null), /Connect/);
  const signer = { getAddress: async () => account };
  const library = { send: async () => '0x1', getSigner: () => signer };
  assert.equal(await requirePrivacySigner(library, account), signer);
  await assert.rejects(() => requirePrivacySigner({ ...library, send: async () => '0xaa36a7' }, account), /Mainnet/);
  await assert.rejects(() => requirePrivacySigner(library, account, '0xad8F64166512582ED8E97dD0152650FF06936ac1'), /wallet that started/);
});
test('success requires one confirmation and successful receipt', async () => {
  const receipt = { status: 1, transactionHash: 'confirmed' };
  assert.equal(await confirmPrivacyTransaction({ wait: async (count) => { assert.equal(count, 1); return receipt; } }), receipt);
  await assert.rejects(() => confirmPrivacyTransaction({ wait: async () => ({ status: 0 }) }), /reverted/);
});
test('repriced success is accepted but cancelled or unrelated replacements are not', async () => {
  const receipt = { status: 1, transactionHash: 'replacement' };
  const wait = async () => { throw { code: 'TRANSACTION_REPLACED', cancelled: false, receipt }; };
  assert.equal(await confirmPrivacyTransaction({ wait }), receipt);
  const cancelled = { code: 'TRANSACTION_REPLACED', cancelled: true, receipt };
  await assert.rejects(() => confirmPrivacyTransaction({ wait: async () => { throw cancelled; } }));
  assert.equal(transactionDefinitelyStopped(cancelled), true);
});
test('unknown confirmation failures must retain the submitted transaction', async () => {
  const error = { code: 'NETWORK_ERROR' };
  assert.equal(transactionDefinitelyStopped(error), false);
  await assert.rejects(() => confirmPrivacyTransaction({ wait: async () => { throw error; } }));
});
test('wallet, gas, network and revert errors provide distinct actions without leaking raw details', () => {
  assert.match(privacyTransactionError({ code: 'ACTION_REJECTED' }).title, /declined/);
  assert.match(privacyTransactionError({ error: { code: 4001 } }).title, /declined/);
  assert.match(privacyTransactionError({ code: 'INSUFFICIENT_FUNDS' }).description, /ETH/);
  assert.match(privacyTransactionError({ code: -32002 }).title, /already open/);
  assert.match(privacyTransactionError({ code: 'NETWORK_ERROR' }).description, /before sending/);
  assert.match(privacyTransactionError({ code: 'CALL_EXCEPTION' }).description, /gas/);
  assert.doesNotMatch(privacyTransactionError({ message: 'secret SALT and calldata' }).description, /secret SALT/);
});
