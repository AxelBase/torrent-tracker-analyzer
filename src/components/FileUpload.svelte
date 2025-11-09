<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher<{ upload: File }>();

  let fileInput: HTMLInputElement;
  let dragOver = false;

  const log = (...args: any[]) => {
    if (import.meta.env.DEV) {
      console.log('[TorrentAnalyzer] FileUpload:', ...args);
    }
  };

  const warn = (...args: any[]) => {
    if (import.meta.env.DEV) {
      console.warn('[TorrentAnalyzer] FileUpload:', ...args);
    }
  };

  const err = (...args: any[]) => {
    if (import.meta.env.DEV) {
      console.error('[TorrentAnalyzer] FileUpload:', ...args);
    }
  };

  function handleDrop(event: DragEvent) {
    try {
      log('Drop event triggered', event);
      event.preventDefault();
      dragOver = false;

      const file = event.dataTransfer?.files[0];
      if (!file) {
        warn('No file in dataTransfer');
        return;
      }

      log('Dropped file:', file.name, file.size, 'bytes');
      if (!file.name.endsWith('.torrent')) {
        alert('Please upload a .torrent file');
        return;
      }

      dispatch('upload', file);
      log('File dispatched to parent');
    } catch (e) {
      err('Error in handleDrop:', e);
    }
  }

  function handleDragOver(event: DragEvent) {
    try {
      event.preventDefault();
      dragOver = true;
      log('Drag over');
    } catch (e) {
      err('Error in handleDragOver:', e);
    }
  }

  function handleDragLeave() {
    try {
      dragOver = false;
      log('Drag leave');
    } catch (e) {
      err('Error in handleDragLeave:', e);
    }
  }

  function handleFileChange() {
    try {
      const file = fileInput.files?.[0];
      if (!file) {
        warn('No file selected');
        return;
      }

      log('File input changed:', file.name, file.size, 'bytes');
      if (!file.name.endsWith('.torrent')) {
        alert('Please upload a .torrent file');
        return;
      }

      dispatch('upload', file);
      log('File dispatched from input');
    } catch (e) {
      err('Error in handleFileChange:', e);
    }
  }

  function handleClick() {
    try {
      log('Drop zone clicked → opening file picker');
      fileInput.click();
    } catch (e) {
      err('Error in handleClick:', e);
    }
  }

  function handleKeyDown(event: KeyboardEvent) {
    try {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        log('Keyboard activation → opening file picker');
        fileInput.click();
      }
    } catch (e) {
      err('Error in handleKeyDown:', e);
    }
  }

  function triggerFileDialog(e: MouseEvent) {
    try {
      e.stopPropagation();
      log('Select button clicked → opening file picker');
      fileInput.click();
    } catch (e) {
      err('Error in triggerFileDialog:', e);
    }
  }
</script>

<div
  class="drop-zone {dragOver ? 'drag-over' : ''}"
  on:drop={handleDrop}
  on:dragover={handleDragOver}
  on:dragleave={handleDragLeave}
  on:click={handleClick}
  on:keydown={handleKeyDown}
  role="button"
  tabindex="0"
  aria-label="Upload .torrent file"
>
  <label for="file-upload" class="form-label">
    Drop .torrent file here or click to upload
  </label>
  <input
    id="file-upload"
    type="file"
    accept=".torrent"
    bind:this={fileInput}
    on:change={handleFileChange}
    class="d-none"
  />
</div>

<div class="file-upload-controls" style="margin-top:0.75rem;">
  <button class="btn btn-secondary" type="button" on:click={triggerFileDialog}>
    Select .torrent file
  </button>
</div>

<style>
  .drop-zone {
    border: 2px dashed #ccc;
    padding: 20px;
    text-align: center;
    cursor: pointer;
    transition: border-color 0.3s, background-color 0.3s;
    outline: none;
  }
  .drop-zone:focus {
    border-color: #007bff;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  }
  .drag-over {
    border-color: #007bff;
    background: #e9ecef;
  }
  .form-label {
    display: block;
    cursor: pointer;
    margin-bottom: 0;
  }
  .d-none {
    display: none;
  }
  .file-upload-controls {
    display: flex;
    gap: 0.5rem;
    justify-content: center;
  }
</style>
