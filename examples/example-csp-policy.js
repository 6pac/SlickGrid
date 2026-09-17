if (window.trustedTypes && trustedTypes.createPolicy) { // Feature testing
  // The CSP example uses BrowserSync during local development. Its injected
  // client script assigns a same-origin /browser-sync/ URL to a script src,
  // which requires a TrustedScriptURL under require-trusted-types-for.
  trustedTypes.createPolicy('browser-sync', {
    createScriptURL: (url) => {
      const parsedUrl = new URL(url, document.baseURI);
      if (parsedUrl.origin !== window.location.origin || !parsedUrl.pathname.startsWith('/browser-sync/')) {
        throw new TypeError('Only same-origin BrowserSync script URLs are allowed');
      }
      return parsedUrl.href;
    }
  });
}
