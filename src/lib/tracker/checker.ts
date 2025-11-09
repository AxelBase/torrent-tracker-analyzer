// src/lib/tracker/checker.ts

export interface CheckResult {
  url: string;
  success: boolean;
  time: number;
  status?: number;
  error?: string;
}

// Multiple fallback proxies
const PROXY_URLS = [
  'https://api.allorigins.win/raw?url=',
  'https://thingproxy.freeboard.io/fetch/',
  'https://corsproxy.io/?'
];

// Main single URL check
export async function checkTracker(originalUrl: string): Promise<CheckResult> {
  const start = performance.now();
  const log = (...args: any[]) => import.meta.env.DEV && console.log('[TrackerCheck]', ...args);
  const err = (...args: any[]) => import.meta.env.DEV && console.error('[TrackerCheck]', ...args);

  let url = originalUrl;

  // UDP trackers not supported
  if (url.startsWith('udp://')) {
    return { url, success: false, time: 0, error: 'UDP not supported in browser' };
  }

  // Use proxy for HTTP trackers when on HTTPS
  if (location.protocol === 'https:' && url.startsWith('http://')) {
    for (const base of PROXY_URLS) {
      const result = await tryProxy(base + encodeURIComponent(url), originalUrl, start, log, err);
      if (result.success) return result;
    }
    const time = Math.round(performance.now() - start);
    return { url: originalUrl, success: false, time, error: 'All proxies failed or timed out' };
  }

  // Direct HTTPS check
  return await tryDirect(url, originalUrl, start, log, err);
}

// Direct HEAD request
async function tryDirect(url: string, originalUrl: string, start: number, log: Function, err: Function): Promise<CheckResult> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 7000);

  try {
    const res = await fetch(url, { method: 'HEAD', mode: 'no-cors', credentials: 'omit', signal: controller.signal });
    clearTimeout(timeout);
    const time = Math.round(performance.now() - start);

    if (res.type === 'opaque' || res.ok) {
      log(`Direct success: ${url}`);
      return { url: originalUrl, success: true, time, status: res.status || 200 };
    } else {
      err(`Direct failed: ${res.status}`);
      return { url: originalUrl, success: false, time, status: res.status, error: `HTTP ${res.status}` };
    }
  } catch (error) {
    clearTimeout(timeout);
    const time = Math.round(performance.now() - start);
    const msg = (error as Error).name === 'AbortError' ? 'Timeout (7s)' : (error as Error).message;
    err(`Direct error: ${msg}`);
    return { url: originalUrl, success: false, time, error: msg };
  }
}

// Proxy helper (GET only, 10s timeout)
async function tryProxy(proxyUrl: string, originalUrl: string, start: number, log: Function, err: Function): Promise<CheckResult> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const res = await fetch(proxyUrl, { method: 'GET', mode: 'cors', credentials: 'omit', signal: controller.signal });
    clearTimeout(timeout);
    const time = Math.round(performance.now() - start);

    if (res.ok || res.type === 'opaque') {
      log(`Proxy success: ${proxyUrl}`);
      return { url: originalUrl, success: true, time, status: res.status || 200 };
    } else {
      err(`Proxy failed: ${res.status}`);
      return { url: originalUrl, success: false, time, error: `Proxy HTTP ${res.status}` };
    }
  } catch (error) {
    clearTimeout(timeout);
    const time = Math.round(performance.now() - start);
    const msg = (error as Error).name === 'AbortError' ? 'Proxy timeout (10s)' : (error as Error).message;
    err(`Proxy error: ${msg}`);
    return { url: originalUrl, success: false, time, error: msg };
  }
}

// Batch checker (maxConcurrent = 10)
export async function checkTrackers(urls: string[], maxConcurrent = 10): Promise<CheckResult[]> {
  const log = (...args: any[]) => import.meta.env.DEV && console.log('[TrackerBatch]', ...args);
  const results: CheckResult[] = [];

  for (let i = 0; i < urls.length; i += maxConcurrent) {
    const batch = urls.slice(i, i + maxConcurrent);
    log(`Checking batch ${i / maxConcurrent + 1}/${Math.ceil(urls.length / maxConcurrent)} (${batch.length} trackers)`);
    const batchResults = await Promise.all(batch.map(checkTracker));
    results.push(...batchResults);
  }

  return results;
}
