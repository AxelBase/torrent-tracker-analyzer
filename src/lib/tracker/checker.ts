// src/lib/tracker/checker.ts

export interface CheckResult {
  url: string;
  success: boolean;
  time: number; // ms
  status?: number;
  error?: string;
}

// Multiple CORS proxies with fallback
const PROXIES = [
  'https://api.allorigins.win/get?url=',
  'https://corsproxy.io/?',
  'https://cors-anywhere.herokuapp.com/' // May need one-time access request
];

export async function checkTracker(originalUrl: string): Promise<CheckResult> {
  const start = performance.now();
  const log = (...args: any[]) => import.meta.env.DEV && console.log('[TorrentAnalyzer] Checker:', ...args);
  const err = (...args: any[]) => import.meta.env.DEV && console.error('[TorrentAnalyzer] Checker:', ...args);

  let url = originalUrl;

  // CASE 1: HTTP on HTTPS site → Try proxies with fallback
  if (location.protocol === 'https:' && url.startsWith('http://')) {
    let result: CheckResult | null = null;
    for (const proxy of PROXIES) {
      const proxyUrl = proxy + encodeURIComponent(url);
      log(`Trying proxy ${proxy} for HTTP tracker: ${proxyUrl}`);
      result = await tryProxy(proxyUrl, originalUrl, start);
      if (result.success) {
        return result; // Success on this proxy → Return
      }
      if (!result.error?.includes('timeout')) {
        break; // Non-timeout error → Don't retry
      }
      log(`Proxy ${proxy} timed out, trying next...`);
    }
    return result || { url: originalUrl, success: false, time: Math.round(performance.now() - start), error: 'All proxies timed out' };
  }

  // CASE 2: UDP → Skip
  if (url.startsWith('udp://')) {
    log(`Skipping UDP: ${url}`);
    return { url, success: false, time: 0, error: 'UDP not supported' };
  }

  // CASE 3: Direct fetch
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
    const message = (error as Error).name === 'AbortError' ? 'Direct timeout (5s)' : (error as Error).message;
    return { url: originalUrl, success: false, time, error: message };
  }
}

// Proxy GET → Parse JSON
async function tryProxy(proxyUrl: string, originalUrl: string, start: number): Promise<CheckResult> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 300000); // 5 mins as requested

  try {
    const response = await fetch(proxyUrl, {
      method: 'GET',
      signal: controller.signal,
      mode: 'cors',
      credentials: 'omit'
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const time = Math.round(performance.now() - start);
      return { url: originalUrl, success: false, time, error: `Proxy status ${response.status}` };
    }

    const data = await response.json();
    const time = Math.round(performance.now() - start);
    const status = data.status?.http_code;

    // Treat 400 as success (normal for trackers without params)
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