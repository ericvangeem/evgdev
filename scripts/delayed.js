(function analytics() {
  // Only execute if the domain is ericvangeem.dev
  if (window.location.hostname !== 'ericvangeem.dev') {
    return;
  }

  // Load the GTM script asynchronously
  const gtmScript = document.createElement('script');
  gtmScript.async = true;
  gtmScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-K5HMYZ7MGF';
  document.head.appendChild(gtmScript);

  // Set up the dataLayer and gtag function
  window.dataLayer = window.dataLayer || [];
  function gtag(...args) { window.dataLayer.push(args); }
  window.gtag = gtag; // Expose gtag globally if needed

  gtag('js', new Date());
  gtag('config', 'G-K5HMYZ7MGF');
}());
