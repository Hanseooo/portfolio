

export function isIOSWebView(): boolean {
  const ua = navigator.userAgent;

  // iOS device?
  const isIOS = /iP(hone|od|ad)/.test(ua);

  // Safari appears as "Safari"
  const isSafari = /Safari/.test(ua);

  // WebViews do NOT include Safari in UA
  return isIOS && !isSafari;
}

export function isAndroidWebView(): boolean {
  const ua = navigator.userAgent;

  // Android WebView typically includes "Version/X.X"
  // and excludes "Chrome"
  return /Version\/[\d.]+/.test(ua) && !/Chrome/.test(ua);
}


export function isInAppBrowser(): boolean {
  const ua = navigator.userAgent || "";

  // Known app in-app browsers
  if (/FBAN|FBAV|FB_IAB/i.test(ua)) return true;      // Facebook
  if (/Instagram/i.test(ua)) return true;             // Instagram
  if (/TikTok|musically/i.test(ua)) return true;      // TikTok
  if (/Twitter/i.test(ua)) return true;               // Twitter
  if (/LinkedInApp/i.test(ua)) return true;           // LinkedIn
  if (/Snapchat/i.test(ua)) return true;              // Snapchat
  if (/Discord/i.test(ua)) return true;               // Discord

  // Generic iOS / Android WebViews
  if (isIOSWebView()) return true;
  if (isAndroidWebView()) return true;

  return false;
}

