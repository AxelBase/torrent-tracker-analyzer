// src/lib/tracker/checker.ts

export interface CheckResult {
  url: string;
  success: boolean;
  time: number;
  status?: number;
  error?: string;
}

// Reliable CORS proxy (supports HEAD + GET)
const PROXY_URL = 'https://corsproxy.io/?';

export async function checkTracker(originalUrl: string): Promise<CheckResult> {
  const start = performance.now();
  const log = (...args: any[]) => import.meta.env.DEV && console.log('[TorrentAnalyzer] Checker:', ...args);
  const err = (...args: any[]) => import.meta.env.DEV && console.error('[TorrentAnalyzer] Checker:', ...args);

  let url = originalUrl;

  // === CASE 1: HTTP tracker on HTTPS site → Use proxy ===
  if (location.protocol === 'https:' && url.startsWith('http://')) {
    const proxyUrl = PROXY_URL + encodeURIComponent(url);
    log(`Using corsproxy.io for HTTP tracker: ${proxyUrl}`);
    return await tryProxyWithFallback(proxyUrl, originalUrl, start);
  }

  // === CASE 2: UDP → Skip ===
  if (url.startsWith('udp://')) {
    log(`Skipping UDP: ${url}`);
    return { url, success: false, time: 0, error: 'UDP not supported in browser' };
  }

  // === CASE 3: Direct fetch (HTTPS or localhost) ===
  log(`Direct check: ${url}`);
  return await tryDirect(url, originalUrl, start);
}

// Direct HEAD (no-cors)
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
    const message = (error as Error).name === 'AbortError' ? 'Timeout' : (error as Error).message;
    return { url: originalUrl, success: false, time, error: message };
  }
}

// Proxy: Try HEAD → fallback to GET
async function tryProxyWithFallback(proxyUrl: string, originalUrl: string, start: number): Promise<CheckResult> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 300000); // 5 mins

  try {
    // Try HEAD first
    let response = await fetch(proxyUrl, {
      method: 'HEAD',
      signal: controller.signal,
      mode: 'cors',
      credentials: 'omit'
    });

    // If HEAD fails (CORS), try GET
    if (!response.ok && response.type === 'cors') {
      log(`HEAD failed, trying GET via proxy`);
      response = await fetch(proxyUrl, {
        method: 'GET',
        signal: controller.signal,
        mode: 'cors',
        credentials: 'omit'
      });
    }

    clearTimeout(timeoutId);

    if (!response.ok) {
      const time = Math.round(performance.now() - start);
      return { url: originalUrl, success: false, time, error: `Proxy status ${response.status}` };
    }

    const time = Math.round(performance.now() - start);

    // For GET: parse status from headers if available
    const statusHeader = response.headers.get('x-cors-api-status') || response.headers.get('access-control-expose-headers');
    const status = statusHeader ? parseInt(statusHeader) : response.status;

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
    const message = (error as Error).name === 'AbortError' ? 'Proxy timeout (5 mins)' : (error as Error).message;
    return { url: originalUrl, success: false, time, error: message };
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