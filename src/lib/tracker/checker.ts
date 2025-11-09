// src/lib/tracker/checker.ts

export interface CheckResult {
  url: string;
  success: boolean;
  time: number;
  status?: number;
  error?: string;
}

// CORS proxy
const PROXY_URL = 'https://corsproxy.io/?';

export async function checkTracker(originalUrl: string): Promise<CheckResult> {
  const start = performance.now();

  // Define log and err here to ensure scope
  const log = (...args: any[]) => {
    if (import.meta.env.DEV) {
      console.log('[TorrentAnalyzer] Checker:', ...args);
    }
  };
  const err_log = (...args: any[]) => {
    if (import.meta.env.DEV) {
      console.error('[TorrentAnalyzer] Checker:', ...args);
    }
  };

  let url = originalUrl;

  // CASE 1: HTTP on HTTPS → Proxy
  if (location.protocol === 'https:' && url.startsWith('http://')) {
    const proxyUrl = PROXY_URL + encodeURIComponent(url);
    log(`Using proxy for HTTP: ${proxyUrl}`);
    return await tryProxy(proxyUrl, originalUrl, start, log, err_log);
  }

  // CASE 2: UDP
  if (url.startsWith('udp://')) {
    log(`Skipping UDP: ${url}`);
    return { url, success: false, time: 0, error: 'UDP not supported' };
  }

  // CASE 3: Direct
  log(`Direct check: ${url}`);
  return await tryDirect(url, originalUrl, start, log, err_log);
}

// Direct fetch helper
async function tryDirect(url: string, originalUrl: string, start: number, log: Function, err_log: Function): Promise<CheckResult> {
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
    log(`Direct success: ${url} (${time}ms)`);
    return { url: originalUrl, success: true, time };
  } catch (error) {
    clearTimeout(timeoutId);
    const time = Math.round(performance.now() - start);
    const message = (error as Error).name === 'AbortError' ? 'Timeout' : (error as Error).message;
    err_log(`Direct failed: ${url} (${time}ms)`, message);
    return { url: originalUrl, success: false, time, error: message };
  }
}

// Proxy fetch helper
async function tryProxy(proxyUrl: string, originalUrl: string, start: number, log: Function, err_log: Function): Promise<CheckResult> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 300000); // 5 mins

  try {
    let response = await fetch(proxyUrl, {
      method: 'HEAD',
      signal: controller.signal,
      mode: 'cors',
      credentials: 'omit'
    });

    if (!response.ok && response.type === 'cors') {
      log(`HEAD failed, trying GET`);
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
      err_log(`Proxy failed: ${response.status}`);
      return { url: originalUrl, success: false, time, error: `Proxy status ${response.status}` };
    }

    const data = await response.json();
    const time = Math.round(performance.now() - start);
    const status = data.status?.http_code || response.status;

    const success = status >= 200 && status < 500;

    log(success ? `Proxy success: ${originalUrl} (${time}ms)` : `Proxy failed: ${status}`);
    return {
      url: originalUrl,
      success,
      time,
      status,
      error: success ? undefined : `Returned ${status}`
    };
  } catch (error) {
    clearTimeout(timeoutId);
    const time = Math.round(performance.now() - start);
    const message = (error as Error).name === 'AbortError' ? 'Proxy timeout (5 mins)' : (error as Error).message;
    err_log(`Proxy error: ${message}`);
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