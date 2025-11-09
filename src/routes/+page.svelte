<script lang="ts">
  import FileUpload from '../components/FileUpload.svelte';
  import MagnetInput from '../components/MagnetInput.svelte';
  import TrackerTable from '../components/TrackerTable.svelte';
  import SummaryPanel from '../components/SummaryPanel.svelte';
  import ExportButtons from '../components/ExportButtons.svelte';
  import ResetButton from '../components/ResetButton.svelte';

  import { parseTorrent } from '$lib/parser/torrentParser';
  import { parseMagnet } from '$lib/parser/magnetParser';
  import { checkTrackers } from '$lib/tracker/checker';
  import { groupTrackers, isPublicTracker } from '$lib/tracker/utils';

  import type { TorrentData } from '$lib/parser/torrentParser';
  import type { MagnetData } from '$lib/parser/magnetParser';
  import type { CheckResult } from '$lib/tracker/checker';
  import type { TieredTracker } from '$lib/tracker/utils';

  import { base } from '$app/paths';

  const log = (...args: any[]) => import.meta.env.DEV && console.log('[TorrentAnalyzer] Page:', ...args);
  const warn = (...args: any[]) => import.meta.env.DEV && console.warn('[TorrentAnalyzer] Page:', ...args);
  const err = (...args: any[]) => import.meta.env.DEV && console.error('[TorrentAnalyzer] Page:', ...args);

  let uploadedFile: File | null = null;
  let magnetLink = '';
  let analyzing = false;
  let error = '';

  let infoHash = '';
  let infoHashBase32 = '';
  let isPrivate: boolean | null = null;
  let totalTrackers = 0;
  let reachable = 0;
  let tieredTrackers: TieredTracker[] = [];
  let checkResults: CheckResult[] = [];
  let publicFlags: boolean[] = [];
  let analysisData: TorrentData | MagnetData | null = null;

  function handleUpload(event: CustomEvent<File>) {
    try {
      uploadedFile = event.detail;
      magnetLink = '';
      log('File uploaded:', uploadedFile.name, uploadedFile.size, 'bytes');
    } catch (e) {
      err('Error in handleUpload:', e);
    }
  }

  async function analyze() {
    if (!uploadedFile && !magnetLink) {
      error = 'Please upload a .torrent file or paste a magnet link.';
      warn('Analyze called without input');
      return;
    }

    analyzing = true;
    error = '';
    log('Starting analysis...');

    try {
      let data: TorrentData | MagnetData;

      if (uploadedFile) {
        log('Parsing .torrent file:', uploadedFile.name);
        data = await parseTorrent(uploadedFile);
        isPrivate = (data as TorrentData).isPrivate;
        log('Torrent parsed successfully');
      } else {
        log('Parsing magnet link:', magnetLink);
        data = parseMagnet(magnetLink);
        isPrivate = null;
        log('Magnet parsed successfully');
      }

      analysisData = data;
      infoHash = data.infoHash;
      infoHashBase32 = data.infoHashBase32;

      const trackers = data.trackers;
      const flatTrackers = trackers.flat();
      totalTrackers = flatTrackers.length;
      log(`Found ${totalTrackers} trackers across ${trackers.length} tiers`);

      log('Detecting public trackers...');
      publicFlags = flatTrackers.map((url, i) => {
        const isPub = isPublicTracker(url);
        if (isPub) log(`Tracker ${i}: ${url} → PUBLIC`);
        return isPub;
      });

      log('Starting tracker reachability checks...');
      checkResults = await checkTrackers(flatTrackers, 10);
      reachable = checkResults.filter((r) => r.success).length;
      log(`Reachability complete: ${reachable}/${totalTrackers} reachable`);

      tieredTrackers = groupTrackers(trackers);
      log('Trackers grouped into tiers');

      log('Analysis complete!');
    } catch (e: any) {
      error = e.message || 'Unknown error during analysis';
      err('Analysis failed:', e);
    } finally {
      analyzing = false;
    }
  }

  function reset() {
    try {
      uploadedFile = null;
      magnetLink = '';
      analysisData = null;
      infoHash = '';
      infoHashBase32 = '';
      isPrivate = null;
      totalTrackers = 0;
      reachable = 0;
      tieredTrackers = [];
      checkResults = [];
      publicFlags = [];
      error = '';
      log('State reset');
    } catch (e) {
      err('Error in reset:', e);
    }
  }

  function formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
</script>

<div class="page-container">
  <h1 class="mb-4">Torrent Tracker Analyzer</h1>

  <FileUpload on:upload={handleUpload} />

  {#if uploadedFile}
    <div class="alert alert-success d-flex align-items-center mt-3" role="alert">
      <svg class="bi flex-shrink-0 me-2" width="20" height="20" role="img" aria-label="Success:">
        <use xlink:href="#check-circle-fill" />
      </svg>
      <div>
        <strong>Uploaded:</strong> <code>{uploadedFile.name}</code> ({formatBytes(uploadedFile.size)})
      </div>
    </div>
  {/if}

  {#if magnetLink && !uploadedFile}
    <div class="alert alert-info d-flex align-items-center mt-3" role="alert">
      <svg class="bi flex-shrink-0 me-2" width="20" height="20" role="img" aria-label="Info:">
        <use xlink:href="#info-fill" />
      </svg>
      <div>
        <strong>Magnet link ready:</strong>
        <code class="text-break" style="font-size:0.85em;">{magnetLink}</code>
      </div>
    </div>
  {/if}

  <div class="mb-3">
    <label for="magnet-input" class="form-label">Paste magnet link</label>
    <!-- FIXED: Use explicit closing tag instead of self-closing -->
    <textarea
      id="magnet-input"
      bind:value={magnetLink}
      class="form-control"
      rows="2"
      placeholder="magnet:?xt=urn:btih:..."
    ></textarea>
  </div>

  <div class="d-flex gap-2 mb-3">
    <button
      class="btn btn-primary"
      on:click={analyze}
      disabled={analyzing || (!uploadedFile && !magnetLink)}
    >
      {analyzing ? 'Analyzing...' : 'Analyze'}
    </button>
    <ResetButton on:click={reset} />
  </div>

  {#if analyzing}
    <div class="text-center my-4">
      <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
        <span class="visually-hidden">Analyzing torrent...</span>
      </div>
      <p class="mt-2 text-muted">Checking trackers and parsing metadata...</p>
    </div>
  {/if}

  {#if error}
    <div class="alert alert-danger">{error}</div>
  {/if}

  {#if analysisData}
    <SummaryPanel {infoHash} {infoHashBase32} {totalTrackers} {reachable} {isPrivate} />

    {#if 'files' in analysisData && analysisData.files.length > 0}
      <div class="card mb-3">
        <div class="card-header">
          Files ({analysisData.files.length})
        </div>
        <div class="card-body p-0">
          <div class="list-group list-group-flush">
            {#each analysisData.files as file}
              <div class="list-group-item d-flex justify-content-between align-items-center">
                <span class="text-break" style="max-width: 70%;">{file.path}</span>
                <span class="badge bg-light text-dark">{formatBytes(file.length)}</span>
              </div>
            {/each}
          </div>
        </div>
      </div>
    {/if}

    <h4 class="mt-4">Trackers by Tier</h4>
    <TrackerTable {tieredTrackers} {checkResults} {publicFlags} />

    <ExportButtons {tieredTrackers} {checkResults} {publicFlags} {analysisData} />
  {/if}
</div>

<div id="about" class="page-section page-container">
  <h2>About the Torrent Tracker Analyzer</h2>

  <p>
    The <strong>Torrent Tracker Analyzer</strong> is a <em>free, open-source, privacy-first</em> web tool developed by <strong>AxelBase</strong> to help users inspect, validate, and debug <code>.torrent</code> files and <code>magnet:</code> links with surgical precision — all without installing software or sending data to any server.
  </p>

  <p>
    Built with modern web technologies (SvelteKit, TypeScript, and Web APIs), this tool runs <strong>entirely in your browser</strong>. Whether you're a torrent enthusiast, a developer debugging tracker issues, or a content creator verifying metadata, this analyzer gives you real-time, actionable insights into:
  </p>

  <ul class="feature-list">
    <li><strong>Tracker Health</strong>: Live reachability checks for HTTP/HTTPS trackers</li>
    <li><strong>Tiered Tracker Lists</strong>: Visual grouping as defined in the torrent spec</li>
    <li><strong>Info Hash</strong>: Both hex and base32 formats for cross-client compatibility</li>
    <li><strong>File Lists</strong>: Full path and size breakdown for multi-file torrents</li>
    <li><strong>Privacy Detection</strong>: Identifies private torrents and public tracker usage</li>
    <li><strong>Export Tools</strong>: Download results in CSV or JSON for documentation</li>
  </ul>

  <h3>Why We Built This</h3>
  <p>
    Torrent users frequently face mysterious issues: <em>“Why is my torrent not connecting?”</em> or <em>“Are these trackers even alive?”</em> Traditional clients only show peer counts — not whether the tracker is responding. This tool answers those questions in seconds.
  </p>

  <p>
    We also noticed a gap in <strong>privacy awareness</strong>. Many users unknowingly upload private torrents to public trackers or enable DHT on restricted content. The analyzer flags these risks clearly.
  </p>

  <h3>Privacy by Design</h3>
  <p>
    Unlike cloud-based tools, <strong>nothing is uploaded</strong>. Your torrent file is parsed using <code>FileReader</code>, Bencode is decoded in memory, and tracker checks use direct <code>fetch()</code> calls. No logs, no cookies, no telemetry.
  </p>

  <h3>Open Source & Community-Driven</h3>
  <p>
    The project is fully open source under the <strong>MIT License</strong> and hosted on GitHub. We welcome contributions, bug reports, and feature requests. Whether you want to add UDP tracker simulation, WebTorrent integration, or dark mode — your pull request is welcome.
  </p>

  <p>
    <a href="https://github.com/axelbase/torrent-tracker-analyzer" target="_blank" rel="noopener" class="btn btn-outline-primary mt-3">
      View on GitHub
    </a>
  </p>

  <p class="italic-note">
    <strong>Built for transparency.</strong> Empowering users with knowledge, not control.
  </p>
</div>

<div id="how-to-use" class="page-section page-container">
  <h2>How to Use the Torrent Tracker Analyzer</h2>

  <p>
    Getting started is simple. Follow these steps to analyze any torrent in under a minute.
  </p>

  <h3>Step 1: Upload a .torrent File</h3>
  <p>
    Click the <strong>“Drop .torrent file here”</strong> zone or drag a file directly from your file manager. The tool accepts standard <code>.torrent</code> files (Bencoded metadata). You’ll see instant feedback:
  </p>
  <ul>
    <li>File name</li>
    <li>File size (in KB/MB)</li>
    <li>Success alert with checkmark</li>
  </ul>
  <p>
    <em>Tip:</em> You can also click to open your system file picker.
  </p>

  <h3>Step 2: Or Paste a Magnet Link</h3>
  <p>
    Copy a full <code>magnet:</code> URI (including <code>xt=urn:btih:</code> and <code>tr=</code> parameters) and paste it into the text area. The tool extracts:
  </p>
  <ul>
    <li>Info hash</li>
    <li>All tracker URLs</li>
  </ul>
  <p>
    <strong>Note:</strong> Magnet links do <em>not</em> include file lists — only metadata available in the URI.
  </p>

  <h3>Step 3: Click “Analyze”</h3>
  <p>
    Once input is provided, the <strong>Analyze</strong> button activates. Click it to begin:
  </p>
  <ul>
    <li><strong>Parsing</strong>: Bencode decoding (for files) or URI parsing</li>
    <li><strong>Hash calculation</strong>: SHA-1 → hex + base32</li>
    <li><strong>Tracker checks</strong>: Up to 10 concurrent <code>HEAD</code> requests with 5-second timeout</li>
  </ul>
  <p>
    A spinner shows progress. Most analyses complete in <strong>3–8 seconds</strong>.
  </p>

  <h3>Step 4: Review Results</h3>
  <p>
    After analysis, you’ll see:
  </p>

  <div class="result-grid">
    <div class="result-card">
      <h4>Summary Panel</h4>
      <p>Info hash, private flag, tracker stats</p>
    </div>
    <div class="result-card">
      <h4>File List</h4>
      <p>Only for .torrent files — full paths + sizes</p>
    </div>
    <div class="result-card">
      <h4>Tracker Table</h4>
      <p>Tiered list with status, latency, public/private</p>
    </div>
  </div>

  <h3>Step 5: Export or Reset</h3>
  <p>
    Use <strong>Export to CSV</strong> or <strong>JSON</strong> to save results. Click <strong>Reset</strong> to clear everything and start over.
  </p>

  <h3>Pro Tips</h3>
  <ul>
    <li>Use <kbd>Ctrl+V</kbd> to paste magnet links</li>
    <li>Keyboard: <kbd>Enter</kbd> in textarea = Analyze</li>
    <li>Mobile: Tap to upload or long-press to paste</li>
  </ul>

  <p class="italic-note">
    <strong>Fast. Private. Accurate.</strong> Debug torrents like a pro.
  </p>
</div>

<div id="faq" class="page-section page-container">
  <h2>Frequently Asked Questions</h2>

  <details class="faq-item">
    <summary><strong>What does “Reachable” mean?</strong></summary>
    <p>
      A tracker is marked <strong>Reachable</strong> if the browser successfully sends a <code>HEAD</code> request and receives a <code>2xx</code> or <code>3xx</code> response — or if a <code>4xx</code> error confirms the server is online (e.g., <code>400 Bad Request</code> due to missing <code>info_hash</code>).
    </p>
    <p>
      <em>It does not guarantee the tracker will return peers</em> — only that it’s alive and responding.
    </p>
  </details>

  <details class="faq-item">
    <summary><strong>Why can’t UDP trackers be checked?</strong></summary>
    <p>
      Web browsers <strong>cannot send UDP packets</strong> due to security restrictions. UDP trackers (e.g., <code>udp://...</code>) are marked <em>“not checked”</em> in the results.
    </p>
    <p>
      Use a local client like qBittorrent to test UDP connectivity.
    </p>
  </details>

  <details class="faq-item">
    <summary><strong>Why is the file list empty for magnet links?</strong></summary>
    <p>
      Magnet links contain only the <strong>info hash</strong> and <strong>trackers</strong> — <em>not the file list</em>. The file structure is stored in the <code>.torrent</code> file’s <code>info</code> dictionary.
    </p>
    <p>
      To see files, download the <code>.torrent</code> file from the source and upload it here.
    </p>
  </details>

  <details class="faq-item">
    <summary><strong>How is “Private” torrent detected?</strong></summary>
    <p>
      A torrent is flagged <strong>Private</strong> if:
    </p>
    <ul>
      <li><code>info.private = 1</code> in the Bencoded metadata</li>
      <li>OR it uses known private tracker domains</li>
    </ul>
    <p>
      Private torrents disable DHT and PEX to prevent IP leaks.
    </p>
  </details>

  <details class="faq-item">
    <summary><strong>Is my data safe? Will you see my files?</strong></summary>
    <p>
      <strong>100% safe.</strong> Your file is <em>never uploaded</em>. All processing uses:
    </p>
    <ul>
      <li><code>FileReader</code> API (local)</li>
      <li>In-memory Bencode parsing</li>
      <li>Direct <code>fetch()</code> to trackers</li>
    </ul>
    <p>
      No server, no logs, no storage. See our <a href="{base}/privacy">Privacy Policy</a>.
    </p>
  </details>

  <details class="faq-item">
    <summary><strong>Can I use this on mobile?</strong></summary>
    <p>
      Yes! The tool is <strong>fully responsive</strong> and works on:
    </p>
    <ul>
      <li>iOS Safari (14+)</li>
      <li>Android Chrome</li>
      <li>Tablets and phones</li>
    </ul>
    <p>
      Tap to upload, long-press to paste magnet links.
    </p>
  </details>

  <details class="faq-item">
    <summary><strong>Why is export disabled?</strong></summary>
    <p>
      Export buttons appear <strong>only after analysis</strong>. If you see them grayed out:
    </p>
    <ul>
      <li>Analysis is still running</li>
      <li>No trackers were found</li>
      <li>An error occurred</li>
    </ul>
  </details>

  <details class="faq-item">
    <summary><strong>How accurate are response times?</strong></summary>
    <p>
      Times are measured from <code>fetch()</code> start to response headers. They include:
    </p>
    <ul>
      <li>DNS lookup</li>
      <li>TCP handshake</li>
      <li>Server processing</li>
    </ul>
    <p>
      Values are rounded to milliseconds and highly accurate under normal conditions.
    </p>
  </details>

  <p class="italic-note text-center mt-4">
    <strong>Still have questions?</strong> Open an issue on <a href="https://github.com/axelbase/torrent-tracker-analyzer" target="_blank" rel="noopener">GitHub</a>.
  </p>
</div>

<svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
  <symbol id="check-circle-fill" viewBox="0 0 16 16">
    <path
      d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"
    />
  </symbol>
  <symbol id="info-fill" viewBox="0 0 16 16">
    <path
      d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"
    />
  </symbol>
</svg>