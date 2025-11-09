// src/lib/export/csvExporter.ts

import type { CheckResult } from '../tracker/checker';
import type { TieredTracker } from '../tracker/utils';
import type { TorrentData } from '../parser/torrentParser';
import type { MagnetData } from '../parser/magnetParser';

type AnalysisData = (TorrentData | MagnetData) & {
  checkResults: CheckResult[];
  publicFlags: boolean[];
};

const log = (...args: any[]) => import.meta.env.DEV && console.log('[TorrentAnalyzer] CSV Export:', ...args);
const err = (...args: any[]) => import.meta.env.DEV && console.error('[TorrentAnalyzer] CSV Export:', ...args);

function escapeCsv(value: string): string {
  return `"${value.replace(/"/g, '""')}"`;
}

export function exportAnalysisToCsv(data: AnalysisData): void {
  try {
    log('Starting CSV export...');

    const lines: string[] = [];

    // Summary Section
    log('Adding summary section');
    lines.push('Section,Key,Value');
    lines.push(`Summary,Info Hash (hex),${escapeCsv(data.infoHash)}`);
    lines.push(`Summary,Info Hash (base32),${escapeCsv(data.infoHashBase32)}`);
    lines.push(`Summary,Private,${'isPrivate' in data ? (data.isPrivate ? 'Yes' : 'No') : 'N/A'}`);
    if ('name' in data) {
      lines.push(`Summary,Name,${escapeCsv(data.name || '')}`);
    }
    if ('files' in data) {
      const totalSize = data.files.reduce((sum, f) => sum + f.length, 0);
      lines.push(`Summary,File Count,${data.files.length}`);
      lines.push(`Summary,Total Size,${totalSize}`);
      log(`File summary: ${data.files.length} files, ${totalSize} bytes`);
    }

    // Trackers Section
    log(`Adding ${data.trackers.flat().length} trackers from ${data.trackers.length} tiers`);
    lines.push('');
    lines.push('Tier,URL,Is Public,Success,Time (ms),Status,Error');

    data.trackers.forEach((tierTrackers, tier) => {
      tierTrackers.forEach((url, idx) => {
        const check = data.checkResults.find(r => r.url === url) || {
          success: false,
          time: 0,
          status: undefined,
          error: 'Not checked'
        };
        const isPublic = data.publicFlags[idx] || false;

        lines.push([
          tier.toString(),
          escapeCsv(url),
          isPublic ? 'Yes' : 'No',
          check.success ? 'Yes' : 'No',
          check.time.toString(),
          check.status?.toString() || '',
          escapeCsv(check.error || '')
        ].join(','));
      });
    });

    // Files Section (if torrent)
    if ('files' in data) {
      log(`Adding ${data.files.length} file entries`);
      lines.push('');
      lines.push('Files,Path,Size (bytes)');
      data.files.forEach(f => {
        lines.push(`Files,${escapeCsv(f.path)},${f.length}`);
      });
    }

    // Finalize & Trigger Download
    const csv = lines.join('\n');
    log(`CSV generated: ${csv.length} characters`);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'torrent-analysis.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);
    log('CSV download triggered: torrent-analysis.csv');

  } catch (error) {
    err('Failed to export CSV:', error);
    alert('Failed to export CSV. Check console for details.');
  }
}