// MetaMask can fail asynchronously while initializing its injected provider,
// independently of any wallet request made by this application.
(function () {
  var extensionScript =
    'chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/scripts/inpage.js';

  function handleExtensionFailure(event) {
    var error = event.type === 'unhandledrejection' ? event.reason : event.error;
    if (!error || error.message !== 'Failed to connect to MetaMask') return;

    var fromMetaMask =
      event.filename === extensionScript ||
      (typeof error.stack === 'string' &&
        error.stack.indexOf(extensionScript + ':') !== -1);
    if (!fromMetaMask) return;

    // Keep this extension failure out of the application runtime overlay, but
    // retain a diagnostic. Wallet requests still report failures in their UI.
    event.preventDefault();
    event.stopImmediatePropagation();
    console.warn('[Wallet] MetaMask extension could not initialize.', error);
  }

  window.addEventListener('error', handleExtensionFailure, true);
  window.addEventListener('unhandledrejection', handleExtensionFailure, true);
})();
