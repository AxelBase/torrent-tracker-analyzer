// src/lib/tracker/checker.ts

export interface CheckResult {
  url: string;
  success: boolean;
  time: number;
  status?: number;
  error?: string;
}

// CORS proxy that returns JSON with original HTTP status
const PROXY_URL = 'https://api.allorigins.win/get?url=';

export async function checkTracker(originalUrl: string): Promise<CheckResult> {
  const start = performance.now();
  const log = (...args: any[]) => import.meta.env.DEV && console.log('[TorrentAnalyzer] Checker:', ...args);
  const err = (...args: any[]) => import.meta.env.DEV && console.error('[TorrentAnalyzer] Checker:', ...args);

  let url = originalUrl;

  // === CASE 1: HTTP tracker on HTTPS site → Use proxy ===
  if (location.protocol === 'https:' && url.startsWith('http://')) {
    const proxyUrl = PROXY_URL + encodeURIComponent(url);
    log(`Using proxy for HTTP tracker: ${proxyUrl}`);
    return await tryProxy(proxyUrl, originalUrl, start);
  }

  // === CASE 2: UDP tracker → Not checkable in browser ===
  if (url.startsWith('udp://')) {
    log(`Skipping UDP tracker: ${url}`);
    return { url, success: false, time: 0, error: 'UDP not supported in browser' };
  }

  // === CASE 3: Direct fetch (HTTPS or localhost) ===
  log(`Checking directly: ${url}`);
  return await tryDirect(url, originalUrl, start);
}

// Direct HEAD request (no-cors)
async function tryDirect(url: string, originalUrl: string, start: number): Promise<CheckResult> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    await fetch(url, {
      method: 'HEAD',
      signal: controller.signal,
      mode: 'no-cors',
      credentials: 'omit'
    });

    clearTimeout(timeoutId);
    const time = Math.round(performance.now() - start);
    return { url: originalUrl, success: true, time };
  } catch (error) {
    clearTimeout(timeoutId);
    const time = Math.round(performance.now() - start);
    return {
      url: originalUrl,
      success: false,
      time,
      error: (error as Error).name === 'AbortError' ? 'Timeout' : (error as Error).message
    };
  }
}

// Proxy fetch → parse JSON response
async function tryProxy(proxyUrl: string, originalUrl: string, start: number): Promise<CheckResult> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s for proxy

  try {
    const response = await fetch(proxyUrl, {
      method: 'GET',
      signal: controller.signal,
      mode: 'cors'
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const time = Math.round(performance.now() - start);
      return { url: originalUrl, success: false, time, error: `Proxy error ${response.status}` };
    }

    const data = await response.json();
    const time = Math.round(performance.now() - start);
    const status = data.status?.http_code;

    // 400 is OK for HEAD without info_hash
    const success = status >= 200 && status < 500;

    return {
      url: originalUrl,
      success,
      time,
      status,
      error: success ? undefined : `Tracker returned ${status}`
    };
  } catch (error) {
    clearTimeout(timeoutId);
    const time = Math.round(performance.now() - start);
    return {
      url: originalUrl,
      success: false,
      time,
      error: (error as Error).name === 'AbortError' ? 'Proxy timeout' : (error as Error).message
    };
  }
}

export async function checkTrackers(urls: string[], maxConcurrent = 10): Promise<CheckResult[]> {
  const log = (...args: any[]) => import.meta.env.DEV && console.log('[TorrentAnalyzer] Checker:', ...args);
  log(`Starting batch check of ${urls.length} trackers (max ${maxConcurrent} concurrent)`);

  const results: CheckResult[] = [];
  for (let i = 0; i < urls.length; i += maxConcurrent) {
    const batch = urls.slice(i, i + maxConcurrent);
    log(`Checking batch ${i / maxConcurrent + 1}: ${batch.join(', ')}`);
    const batchResults = await Promise.all(batch.map(checkTracker));
    results.push(...batchResults);
  }

  log(`All ${results.length} checks completed`);
  return results;
}