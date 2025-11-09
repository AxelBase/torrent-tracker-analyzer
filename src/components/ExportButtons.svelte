<!-- src/components/ExportButtons.svelte -->

<script lang="ts">
  import { exportTrackersToJson } from '$lib/export/jsonExporter';
  import { exportAnalysisToCsv } from '$lib/export/csvExporter';
  import type { TieredTracker } from '$lib/tracker/utils';
  import type { CheckResult } from '$lib/tracker/checker';
  import type { TorrentData } from '$lib/parser/torrentParser';
  import type { MagnetData } from '$lib/parser/magnetParser';

  export let tieredTrackers: TieredTracker[] = [];
  export let checkResults: CheckResult[] = [];
  export let publicFlags: boolean[] = [];
  export let analysisData: TorrentData | MagnetData | null = null;

  function handleJson() {
    exportTrackersToJson(tieredTrackers, checkResults, publicFlags);
  }

  function handleCsv() {
    if (analysisData) {
      exportAnalysisToCsv({ ...analysisData, checkResults, publicFlags });
    }
  }
</script>

<div class="mt-3">
  <button class="btn btn-secondary me-2" on:click={handleJson} disabled={!analysisData}>Export JSON ↓</button>
  <button class="btn btn-secondary" on:click={handleCsv} disabled={!analysisData}>Export CSV ↓</button>
</div>