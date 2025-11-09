<script lang="ts">
  export let infoHash: string = '';
  export let infoHashBase32: string = '';
  export let totalTrackers: number = 0;
  export let reachable: number = 0;
  export let isPrivate: boolean | null = null;

  function copyHash() {
    navigator.clipboard.writeText(infoHash);
    alert('Info Hash copied to clipboard!');
  }
</script>

<div class="card mb-3">
  <div class="card-header d-flex justify-content-between align-items-center">
    <span>Summary</span>
    {#if infoHash}
      <button class="btn btn-sm btn-outline-primary" on:click={copyHash}>
        Copy Hash
      </button>
    {/if}
  </div>
  <ul class="list-group list-group-flush">
    <li class="list-group-item d-flex justify-content-between">
      <span>Info Hash (hex):</span>
      <code class="text-break" style="font-size: 0.8em;">{infoHash}</code>
    </li>
    <li class="list-group-item d-flex justify-content-between">
      <span>Info Hash (base32):</span>
      <code class="text-break" style="font-size: 0.8em;">{infoHashBase32}</code>
    </li>
    <li class="list-group-item d-flex justify-content-between">
      <span>Total Trackers:</span>
      <strong>{totalTrackers}</strong>
    </li>
    <li class="list-group-item d-flex justify-content-between">
      <span>Reachable:</span>
      <strong class="text-success">{reachable} / {totalTrackers}</strong>
    </li>
    <li class="list-group-item d-flex justify-content-between">
      <span>Private:</span>
      <strong>{isPrivate === null ? 'N/A' : isPrivate ? 'Yes' : 'No'}</strong>
    </li>
  </ul>
</div>