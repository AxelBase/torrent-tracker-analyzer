<!-- src/components/MagnetInput.svelte -->

<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher<{ submit: string }>();

  let magnetLink = '';
  let error = '';

  function handleSubmit() {
    if (!magnetLink.startsWith('magnet:?')) {
      error = 'Invalid magnet link';
      return;
    }
    error = '';
    dispatch('submit', magnetLink);
  }
</script>

<div class="mb-3">
  <label for="magnet-input" class="form-label">Paste magnet link</label>
  <textarea
    id="magnet-input"
    bind:value={magnetLink}
    class="form-control"
    rows="2"
    placeholder="magnet:?xt=urn:btih:..."
  ></textarea>
  {#if error}
    <div class="text-danger">{error}</div>
  {/if}
  <button class="btn btn-primary mt-2" on:click={handleSubmit}>Analyze Magnet</button>
</div>