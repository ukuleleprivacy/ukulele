const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { runInNewContext } = require('node:vm');
const { test } = require('node:test');

const source = readFileSync(require.resolve('../public/wallet-extension-errors.js'), 'utf8');
const extensionScript = 'chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/scripts/inpage.js';

function dispatch(type, error, filename) {
  const listeners = {};
  let prevented = false;
  let stopped = false;
  let warned = false;
  runInNewContext(source, {
    window: {
      addEventListener(name, callback, capture) {
        assert.equal(capture, true);
        listeners[name] = callback;
      },
    },
    console: { warn() { warned = true; } },
  });
  listeners[type]({
    type, error, reason: error, filename,
    preventDefault() { prevented = true; },
    stopImmediatePropagation() { stopped = true; },
  });
  return { prevented, stopped, warned };
}

for (const type of ['error', 'unhandledrejection']) {
  test(`${type}: isolates the reported MetaMask startup failure`, () => {
    assert.deepEqual(dispatch(type, {
      message: 'Failed to connect to MetaMask',
      stack: `i: Failed to connect to MetaMask\n    at Object.connect (${extensionScript}:7:84292)`,
    }), { prevented: true, stopped: true, warned: true });
  });

  test(`${type}: preserves application errors and other wallet failures`, () => {
    for (const error of [
      undefined,
      'Failed to connect to MetaMask',
      { message: 'Failed to connect to MetaMask', stack: 'at connect (http://localhost:3000/app.js:1:1)' },
      { message: 'Transaction rejected', stack: `${extensionScript}:7:84292` },
    ]) {
      assert.deepEqual(dispatch(type, error), { prevented: false, stopped: false, warned: false });
    }
  });
}

test('uses the error event filename when a stack is unavailable', () => {
  assert.deepEqual(dispatch('error', { message: 'Failed to connect to MetaMask' }, extensionScript),
    { prevented: true, stopped: true, warned: true });
});
