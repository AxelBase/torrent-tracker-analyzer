<script lang="ts">
  import type { CheckResult } from '$lib/tracker/checker';
  import type { TieredTracker } from '$lib/tracker/utils';

  export let tieredTrackers: TieredTracker[] = [];
  export let checkResults: CheckResult[] = [];
  export let publicFlags: boolean[] = [];

  function getCheck(url: string): CheckResult | undefined {
    return checkResults.find(r => r.url === url);
  }
</script>

<div class="tracker-table">
  {#each tieredTrackers as { tier, trackers }}
    <h5 class="mt-4">Tier {tier}</h5>
    <div class="table-responsive">
      <table class="table table-sm table-striped align-middle">
        <thead class="table-light">
          <tr>
            <th>URL</th>
            <th>Public</th>
            <th>Status</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {#each trackers as url, idx}
            {@const check = getCheck(url)}
            {@const isPublic = publicFlags[idx]}
            <tr>
              <td class="text-break" style="max-width: 300px;">
                <small>{url}</small>
              </td>
              <td>
                <span class="badge {isPublic ? 'bg-success' : 'bg-secondary'}">
                  {isPublic ? 'Yes' : 'No'}
                </span>
              </td>
              <td>
                {#if url.startsWith('udp://')}
                  <span class="text-muted">UDP (not checked)</span>
                {:else if check?.success}
                  <span class="text-success">Success</span>
                {:else}
                  <span class="text-danger">Failed</span>
                  {#if check?.error}
                    <br><small class="text-danger">{check.error}</small>
                  {/if}
                {/if}
              </td>
              <td>
                {#if url.startsWith('udp://')}
                  <span class="text-muted">—</span>
                {:else}
                  {check?.time ?? 'N/A'} ms
                {/if}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/each}
</div>