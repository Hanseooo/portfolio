export function isIOSWebView(): boolean {
  const ua = navigator.userAgent;

  // Only iOS devices
  const isIOS = /iP(hone|od|ad)/.test(ua);

  // Safari detection
  const isSafari = /Safari/.test(ua) && /AppleWebKit/.test(ua);

  // Standalone mode (added to home screen)
  let standalone = false;
  if ('standalone' in navigator) {
    const nav = navigator as unknown as { standalone?: boolean };
    standalone = nav.standalone === true;
  }

  // If on iOS, not Safari, and not standalone, it's likely a WebView
  return isIOS && !isSafari && !standalone;
}

export function isAndroidWebView(): boolean {
  const ua = navigator.userAgent;

  // Android WebView usually contains "Version/X.X" and excludes Chrome
  return /Android/.test(ua) && /Version\/[\d.]+/.test(ua) && !/Chrome/.test(ua);
}

export function isInAppBrowser(): boolean {
  const ua = navigator.userAgent || '';

  // Known in-app browsers
  if (/FBAN|FBAV/i.test(ua)) return true;    // Facebook
  if (/Instagram/i.test(ua)) return true;
  if (/TikTok|musically/i.test(ua)) return true;
  if (/Twitter/i.test(ua)) return true;
  if (/LinkedInApp/i.test(ua)) return true;
  if (/Snapchat/i.test(ua)) return true;
  if (/Discord/i.test(ua)) return true;

  // Generic WebViews
  if (isIOSWebView()) return true;
  if (isAndroidWebView()) return true;

  return false; // Normal browsers
}
