<script lang="ts">
  import { base } from '$app/paths';
</script>

<svelte:head>
  <title>Introducing the Torrent Tracker Analyzer | AxelBase Blog</title>
  <meta name="description" content="Discover the Torrent Tracker Analyzer — a free, open-source tool to inspect .torrent files, test tracker reachability, and export detailed reports directly in your browser." />
  <meta property="og:title" content="Introducing the Torrent Tracker Analyzer | AxelBase Blog" />
  <meta property="og:description" content="Discover the Torrent Tracker Analyzer — a free, open-source tool to inspect .torrent files, test tracker reachability, and export detailed reports directly in your browser." />
  <meta property="og:url" content="{base}/blog/posts/post1" />
  <meta property="og:type" content="article" />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Introducing the Torrent Tracker Analyzer" />
  <meta name="twitter:description" content="Free tool to analyze .torrent files, check tracker health, and export CSV/JSON reports — all in the browser." />
</svelte:head>

<div class="container fade-in post-layout">
  <div class="breadcrumbs">
    <a href="{base}/blog">Blog</a>
    <span>/</span>
    <p>Introducing the Torrent Tracker Analyzer</p>
  </div>

  <article class="prose">
    <h1>Introducing the Torrent Tracker Analyzer</h1>
    <p class="post-meta">Published: November 10, 2025</p>

    <p>
      The <strong>Torrent Tracker Analyzer</strong> is a free, open-source web tool that lets you upload a <code>.torrent</code> file or paste a <code>magnet:</code> link and instantly get a full breakdown of its trackers, metadata, and connectivity status — all without installing any software.
    </p>

    <p>
      Whether you're debugging a stalled download, verifying tracker tiers, or auditing privacy settings, this tool gives you real-time insights in seconds.
    </p>

    <h2>Why This Tool Exists</h2>
    <p>
      Torrent users often face issues like “dead trackers” or “private torrents leaking data.” Traditional clients only show peer counts — not whether the tracker is actually responding. This tool fills that gap by testing each tracker URL directly in the browser.
    </p>

    <h3>Core Features</h3>
    <ul>
      <li><strong>Drag & Drop Upload</strong> — Instant file name and size feedback</li>
      <li><strong>Magnet Link Support</strong> — Paste any magnet URI to extract trackers</li>
      <li><strong>Live Tracker Testing</strong> — Concurrent HEAD requests with 5-second timeout</li>
      <li><strong>Response Time Display</strong> — See latency in milliseconds</li>
      <li><strong>Public vs Private Detection</strong> — Based on tracker domain and torrent flags</li>
      <li><strong>Export to CSV/JSON</strong> — Download full analysis reports</li>
      <li><strong>File List Viewer</strong> — For multi-file torrents</li>
    </ul>

    <h2>How It Works</h2>
    <p>
      When you upload a file, the tool decodes the Bencode structure, calculates the info hash (in both hex and base32), and extracts all announce URLs. It then sends lightweight <code>HEAD</code> requests to each HTTP tracker. UDP trackers are marked as “not checkable” due to browser limitations.
    </p>

    <p>
      Results are grouped by tier (as defined in the torrent), with success/failure status and response time. You can export everything for documentation or further analysis.
    </p>

    <h2>Privacy First</h2>
    <p>
      No data leaves your browser. The entire analysis runs locally using Web APIs. No telemetry, no tracking, no server uploads.
    </p>

    <h2>FAQ</h2>
    <details>
      <summary>Can it check UDP trackers?</summary>
      <p>No — browsers cannot send UDP packets. These are marked as “not checked”.</p>
    </details>
    <details>
      <summary>Is it safe to upload private torrents?</summary>
      <p>Yes. Nothing is sent to any server. The file is processed entirely in your browser.</p>
    </details>
    <details>
      <summary>Can I use it on mobile?</summary>
      <p>Absolutely. It’s fully responsive and works on phones and tablets.</p>
    </details>

    <p class="italic-note">
      Try it now: <a href="{base}/">Go to Torrent Tracker Analyzer</a>
    </p>
  </article>
</div>

<style>
  .post-layout { max-width: 800px; padding: 2rem 1rem 4rem; }
  .breadcrumbs { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1.5rem; font-size: 0.9rem; color: var(--text-secondary); }
  .breadcrumbs a { color: var(--accent-secondary); }
  .breadcrumbs a:hover { text-decoration: underline; }
  .breadcrumbs p { margin: 0; }
  .prose { line-height: 1.8; }
  .prose .post-meta { color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 2rem; border-bottom: 1px solid var(--border-color); padding-bottom: 1rem; }
  .prose h1, .prose h2, .prose h3 { color: var(--accent-secondary); }
  .prose h1 { font-size: 2.5rem; margin-bottom: 0.5rem; }
  .prose h2 { margin-top: 2.5rem; border-bottom: 1px solid var(--secondary-bg); padding-bottom: 0.5rem; }
  .prose p { color: var(--text-primary); }
  .prose ul { list-style-type: '→ '; padding-left: 1.5rem; color: var(--text-primary); }
  .prose ul li::marker { color: var(--accent-primary); }
  .prose ul li { padding-left: 0.5rem; margin-bottom: 0.5rem; }
  .prose details { background: var(--secondary-bg); border: 1px solid var(--border-color); border-radius: 6px; padding: 1rem; margin-bottom: 1rem; transition: background-color 0.2s ease; }
  .prose details[open] { background-color: var(--card-bg); }
  .prose summary { cursor: pointer; font-weight: 600; color: var(--accent-secondary); list-style: none; }
  .prose summary::-webkit-details-marker { display: none; }
  .prose summary::before { content: '+'; margin-right: 0.75rem; color: var(--accent-primary); font-weight: bold; display: inline-block; transition: transform 0.2s ease; }
  .prose details[open] summary::before { transform: rotate(45deg); }
  .prose details p { margin-top: 1rem; padding-left: 1.5rem; border-left: 2px solid var(--accent-primary); color: var(--text-secondary); }
  .prose .italic-note { font-style: italic; color: var(--text-secondary); text-align: center; margin-top: 3rem; }
</style>