<!-- src/components/ResetButton.svelte -->

<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher<{ click: void }>();
</script>

<button class="btn btn-danger ms-2" on:click={() => dispatch('click')}>Reset</button>