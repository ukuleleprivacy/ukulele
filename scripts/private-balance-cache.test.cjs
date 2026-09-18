const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const { utils } = require('ethers');
const source = fs.readFileSync(path.join(__dirname, '../src/lib/privateBalanceCache.ts'), 'utf8');
const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
function setup() {
  const data = new Map();
  const storage = { getItem: (key) => data.get(key) ?? null, setItem: (key, value) => data.set(key, value) };
  const api = {};
  new Function('exports', 'require', 'localStorage', 'window', code)(api,
    (name) => name === './privateSendHistory' ? { privateHistoryEvent: 'changed' } : require(name),
    storage, { dispatchEvent() {} });
  return api;
}
const units = (amount) => utils.parseUnits(amount, 18).toString();

test('sending 300 from a cached private 1000 leaves 700, even with zero public balance', () => {
  const api = setup();
  api.setPrivateBalance('sender', '1000');
  api.applyPrivateBalanceChange('sender', 'part-one', units('-300'));
  assert.equal(api.readPrivateBalance('sender').amount, units('700'));
  api.applyPrivateBalanceChange('sender', 'part-one', units('-300'));
  assert.equal(api.readPrivateBalance('sender').amount, units('700'), 'confirmation retries must not double debit');
});

test('PART I adds public tokens to the private remainder; PART II credits the recipient separately', () => {
  const api = setup();
  api.setPrivateBalance('sender', '1000');
  api.applyPrivateBalanceChange('sender', 'part-one', units('200')); // 500 public minus 300 sent
  api.applyPrivateBalanceChange('recipient', 'part-two', units('300'));
  assert.equal(api.readPrivateBalance('sender').amount, units('1200'));
  assert.equal(api.readPrivateBalance('recipient').amount, units('300'));
  assert.equal(api.readPrivateBalance('recipient').estimated, true);
});

test('an unknown opening private balance is not misrepresented as zero', () => {
  const api = setup();
  assert.equal(api.readPrivateBalance('sender'), null);
  api.applyPrivateBalanceChange('sender', 'debit', units('-300'));
  assert.equal(api.readPrivateBalance('sender').amount, null);
  api.applyPrivateBalanceChange('sender', 'credit', units('20'));
  assert.equal(api.readPrivateBalance('sender').amount, null);
});

test('partial decrypt subtracts exactly; full decrypt establishes zero', () => {
  const api = setup();
  api.setPrivateBalance('sender', '1000.000000000000000001');
  api.applyPrivateBalanceChange('sender', 'partial', units('-0.000000000000000001'));
  assert.equal(api.readPrivateBalance('sender').amount, units('1000'));
  api.applyPrivateBalanceChange('sender', 'full', '0', true);
  assert.equal(api.readPrivateBalance('sender').amount, '0');
  assert.equal(api.readPrivateBalance('sender').estimated, false);
});

test('self sends debit in PART I and credit in PART II without losing value', () => {
  const api = setup();
  api.setPrivateBalance('sender', '1000');
  api.applyPrivateBalanceChange('sender', 'part-one', units('-300'));
  api.applyPrivateBalanceChange('sender', 'part-two', units('300'));
  assert.equal(api.readPrivateBalance('sender').amount, units('1000'));
});

test('manual corrections preserve applied transaction IDs and wallet isolation', () => {
  const api = setup();
  api.setPrivateBalance('0xABC', '1000');
  api.applyPrivateBalanceChange('0xABC', 'part-one', units('-300'));
  api.setPrivateBalance('0xabc', '900');
  api.applyPrivateBalanceChange('0xABC', 'part-one', units('-300'));
  assert.equal(api.readPrivateBalance('0xabc').amount, units('900'));
  assert.equal(api.readPrivateBalance('other'), null);
  for (const bad of ['-1', '', 'NaN', '1e3', '0.0000000000000000001']) assert.throws(() => api.setPrivateBalance('0xABC', bad));
});
