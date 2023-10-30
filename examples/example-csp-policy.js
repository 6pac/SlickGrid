if (window.trustedTypes && trustedTypes.createPolicy) { // Feature testing
  trustedTypes.createPolicy('sanitizeWithDomPurify', {
    createHTML: string => DOMPurify.sanitize(string, { RETURN_TRUSTED_TYPE: true })
  });
}