// src/lib/tracker/checker.ts

export interface CheckResult {
  url: string;
  success: boolean;
  time: number; // ms
  status?: number;
  error?: string;
}

export async function checkTracker(url: string): Promise<CheckResult> {
  const start = performance.now();
  const log = (...args: any[]) => import.meta.env.DEV && console.log('[TorrentAnalyzer] Checker:', ...args);
  const err = (...args: any[]) => import.meta.env.DEV && console.error('[TorrentAnalyzer] Checker:', ...args);

  try {
    if (url.startsWith('udp://')) {
      log(`Skipping UDP tracker (not checkable): ${url}`);
      return { url, success: false, time: 0, error: 'UDP trackers not checkable in browser' };
    }

    log(`Checking: ${url}`);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(url, {
      method: 'HEAD',
      signal: controller.signal,
      mode: 'no-cors'
    });

    clearTimeout(timeoutId);
    const time = Math.round(performance.now() - start);

    log(`Success: ${url} (${time}ms)`);
    return { url, success: true, time, status: undefined };
  } catch (error) {
    const time = Math.round(performance.now() - start);
    err(`Failed: ${url} (${time}ms)`, error);
    return { url, success: false, time, error: (error as Error).message };
  }
}

/* ←←← ADD THIS FUNCTION ←←← */
export async function checkTrackers(urls: string[], maxConcurrent: number = 10): Promise<CheckResult[]> {
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