<script lang="ts">
  import { base } from '$app/paths';
</script>

<svelte:head>
  <title>Exporting Analysis to CSV and JSON | AxelBase Blog</title>
  <meta name="description" content="Learn how to export tracker status, response times, file lists, and metadata from the Torrent Tracker Analyzer in CSV or JSON format." />
  <meta property="og:title" content="Exporting Analysis to CSV and JSON | AxelBase Blog" />
  <meta property="og:description" content="Learn how to export tracker status, response times, file lists, and metadata from the Torrent Tracker Analyzer in CSV or JSON format." />
  <meta property="og:url" content="{base}/blog/posts/post5" />
  <meta property="og:type" content="article" />
  <meta name="twitter:card" content="summary_large_image" />
</svelte:head>

<div class="container fade-in post-layout">
  <div class="breadcrumbs">
    <a href="{base}/blog">Blog</a>
    <span>/</span>
    <p>Exporting Analysis to CSV and JSON</p>
  </div>

  <article class="prose">
    <h1>Exporting Analysis to CSV and JSON</h1>
    <p class="post-meta">Published: November 18, 2025</p>

    <p>
      After analyzing a torrent, you often want to save the results. The <strong>Torrent Tracker Analyzer</strong> lets you export everything — tracker status, response times, file lists, and metadata — in **CSV** or **JSON** format with one click.
    </p>

    <h2>CSV Export: Spreadsheet Ready</h2>
    <p>
      The CSV file includes:
    </p>
    <ul>
      <li><strong>Summary</strong>: Info hash, private flag, file count, total size</li>
      <li><strong>Trackers</strong>: Tier, URL, public status, success, time, error</li>
      <li><strong>Files</strong>: Path and size (for multi-file torrents)</li>
    </ul>

    <p>
      Open it in Excel, Google Sheets, or any data tool. Perfect for auditing or reporting.
    </p>

    <h3>Filename</h3>
    <p>
      <code>torrent-analysis.csv</code> — UTF-8 encoded, comma-separated, quoted fields.
    </p>

    <h2>JSON Export: Developer Friendly</h2>
    <p>
      The JSON export contains a structured <code>trackers</code> array with:
    </p>
    <ul>
      <li><code>url</code>, <code>tier</code>, <code>isPublic</code></li>
      <li><code>check</code> object with <code>success</code>, <code>time</code>, <code>error</code></li>
    </ul>

    <p>
      Ideal for scripting, automation, or integration with other tools.
    </p>

    <h3>Filename</h3>
    <p>
      <code>torrent-trackers.json</code> — pretty-printed with 2-space indentation.
    </p>

<h2>How It Works</h2>
<p>
  We use <code>Blob</code> and <code>URL.createObjectURL()</code> to generate a downloadable file instantly — no server needed.
</p>

<pre><code>const blob = new Blob([data], {{ type: 'text/csv' }});
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'torrent-analysis.csv';
a.click();</code></pre>

    <h2>Use Cases</h2>
    <ul>
      <li>Archive tracker health over time</li>
      <li>Compare different torrent releases</li>
      <li>Share analysis with team members</li>
      <li>Import into monitoring dashboards</li>
    </ul>

    <h2>FAQ</h2>
    <details>
      <summary>Are exports private?</summary>
      <p>Yes. Files are generated in your browser and never uploaded.</p>
    </details>
    <details>
      <summary>Can I export magnet link results?</summary>
      <p>Yes. Only trackers and info hash are included (no file list).</p>
    </details>

    <p class="italic-note">
      Export your analysis now: <a href="{base}/">Try the Analyzer</a>
    </p>
  </article>
</div>

<style>
  /* Same as before */
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
  .prose pre { background: #f4f4f4; padding: 1rem; border-radius: 6px; overflow-x: auto; font-size: 0.9rem; }
  .prose ul { list-style-type: '→ '; padding-left: 1.5rem; color: var(--text-primary); }
  .prose ul li::marker { color: var(--accent-primary); }
  .prose li { margin-bottom: 0.5rem; }
  .prose details { background: var(--secondary-bg); border: 1px solid var(--border-color); border-radius: 6px; padding: 1rem; margin-bottom: 1rem; }
  .prose details[open] { background-color: var(--card-bg); }
  .prose summary { cursor: pointer; font-weight: 600; color: var(--accent-secondary); list-style: none; }
  .prose summary::-webkit-details-marker { display: none; }
  .prose summary::before { content: '+'; margin-right: 0.75rem; color: var(--accent-primary); font-weight: bold; transition: transform 0.2s ease; }
  .prose details[open] summary::before { transform: rotate(45deg); }
  .prose details p { margin-top: 1rem; padding-left: 1.5rem; border-left: 2px solid var(--accent-primary); color: var(--text-secondary); }
  .prose .italic-note { font-style: italic; color: var(--text-secondary); text-align: center; margin-top: 3rem; }
</style>