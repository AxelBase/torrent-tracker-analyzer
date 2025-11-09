// src/lib/export/jsonExporter.ts

import type { CheckResult } from '../tracker/checker';
import type { TieredTracker } from '../tracker/utils';

interface TrackerWithCheck {
  url: string;
  tier: number;
  isPublic: boolean;
  check: CheckResult | null;
}

const log = (...args: any[]) => import.meta.env.DEV && console.log('[TorrentAnalyzer] JSON Export:', ...args);
const err = (...args: any[]) => import.meta.env.DEV && console.error('[TorrentAnalyzer] JSON Export:', ...args);

export function exportTrackersToJson(
  tieredTrackers: TieredTracker[],
  checkResults: CheckResult[],
  publicFlags: boolean[]
): void {
  try {
    log('Starting JSON export...');

    const trackers: TrackerWithCheck[] = [];

    let totalTrackers = 0;
    tieredTrackers.forEach(({ tier, trackers: tierTrackers }) => {
      tierTrackers.forEach((url, idx) => {
        const check = checkResults.find(r => r.url === url) || null;
        const isPublic = publicFlags[idx] || false;
        trackers.push({ url, tier, isPublic, check });
        totalTrackers++;
      });
    });

    log(`Prepared ${totalTrackers} tracker entries for export`);

    const json = JSON.stringify({ trackers }, null, 2);
    log(`JSON generated: ${json.length} characters`);

    const blob = new Blob([json], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'torrent-trackers.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);
    log('JSON download triggered: torrent-trackers.json');

  } catch (error) {
    err('Failed to export JSON:', error);
    alert('Failed to export JSON. Check console for details.');
  }
}