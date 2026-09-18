const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const { webcrypto } = require('node:crypto');

const source = fs.readFileSync(path.join(__dirname, '../src/lib/privateSendHistory.ts'), 'utf8');
const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
function setup() {
  const data = new Map();
  const localStorage = {
    getItem: (key) => data.get(key) ?? null,
    setItem: (key, value) => data.set(key, value),
  };
  const api = {};
  const events = [];
  new Function('exports', 'localStorage', 'window', 'crypto', code)(api, localStorage, { dispatchEvent: (event) => events.push(event.type) }, webcrypto);
  return { api, data, localStorage, events };
}
const record = {
  id: 'test-send', sender: '0xABC', recipient: '0xDEF', amount: '12.123456789012345678',
  salt: '123456789012345678901234567890123456789',
  createdAt: '2026-09-18T00:00:00.000Z', updatedAt: '2026-09-18T00:00:00.000Z', status: 'prepared',
};

test('secure SALTs always have 39 digits and a nonzero first digit', () => {
  const { api } = setup();
  const salts = Array.from({ length: 1000 }, () => api.generatePrivateSalt());
  for (const salt of salts) assert.match(salt, /^[1-9]\d{38}$/);
  assert.equal(new Set(salts).size, salts.length);
});

test('two transaction parts update one record while preserving exact recovery values', () => {
  const { api, events } = setup();
  api.savePrivateSend(record);
  api.savePrivateSend({ ...record, status: 'part-one-confirmed', partOneHash: 'part-one' });
  const complete = { ...record, status: 'complete', partOneHash: 'part-one', partTwoHash: 'replacement-part-two' };
  api.savePrivateSend(complete);
  assert.deepEqual(api.readPrivateSends('0xabc'), [complete]);
  assert.equal(events.length, 3);
  assert.ok(events.every((event) => event === api.privateHistoryEvent));
});

test('wallet histories are separate and deletion persists without deleting another send', () => {
  const { api } = setup();
  api.savePrivateSend(record);
  api.savePrivateSend({ ...record, id: 'second' });
  api.savePrivateSend({ ...record, sender: '0xOther' });
  api.deletePrivateSend('0xabc', record.id);
  assert.deepEqual(api.readPrivateSends('0xABC').map((item) => item.id), ['second']);
  assert.equal(api.readPrivateSends('0xOther').length, 1);
  api.deletePrivateSend('0xABC', 'second');
  assert.deepEqual(api.readPrivateSends('0xabc'), []);
});

test('storage failures propagate and existing corrupt records are never overwritten', () => {
  const { api, data, localStorage } = setup();
  api.savePrivateSend(record);
  const key = [...data.keys()][0];
  data.set(key, 'corrupt-records');
  assert.throws(() => api.savePrivateSend(record));
  assert.equal(data.get(key), 'corrupt-records');
  data.clear();
  localStorage.setItem = () => { throw new Error('Quota exceeded'); };
  assert.throws(() => api.savePrivateSend(record), /Quota/);
});
