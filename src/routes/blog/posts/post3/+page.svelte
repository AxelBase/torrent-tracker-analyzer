<script lang="ts">
  import { base } from '$app/paths';
</script>

<svelte:head>
  <title>Parsing .torrent Files in the Browser | AxelBase Blog</title>
  <meta name="description"
        content="Explore how the Torrent Tracker Analyzer decodes Bencode, computes info hashes, and extracts file lists — all using pure JavaScript in the browser." />
  <meta property="og:title" content="Parsing .torrent Files in the Browser | AxelBase Blog" />
  <meta property="og:description"
        content="Explore how the Torrent Tracker Analyzer decodes Bencode, computes info hashes, and extracts file lists — all using pure JavaScript in the browser." />
  <meta property="og:url" content="{base}/blog/posts/post3" />
  <meta property="og:type" content="article" />
  <meta name="twitter:card" content="summary_large_image" />
</svelte:head>

<div class="container fade-in post-layout">
  <div class="breadcrumbs">
    <a href="{base}/blog">Blog</a>
    <span>/</span>
    <p>Parsing .torrent Files in the Browser</p>
  </div>

  <article class="prose">
    <h1>Parsing .torrent Files in the Browser</h1>
    <p class="post-meta">Published: November 14, 2025</p>

    <p>
      The <strong>Torrent Tracker Analyzer</strong> can read and interpret <code>.torrent</code> files entirely in your browser — no server, no upload, no third-party tools. This deep dive explains how.
    </p>

    <h2>Bencode: The Torrent Format</h2>
    <p>
      Torrent files use <strong>Bencode</strong> — a simple, text-based serialization format. It supports four types:
    </p>
    <ul>
      <li><code>i123e</code> → integer 123</li>
      <li><code>5:hello</code> → string "hello"</li>
      <li><code>l...e</code> → list</li>
      <li><code>d...e</code> → dictionary</li>
    </ul>

    <p>
      Our parser reads the file as an <code>ArrayBuffer</code>, then recursively decodes these structures into a JavaScript object.
    </p>

    <h2>Extracting Key Data</h2>
    <p>
      From the decoded dictionary, we extract:
    </p>
    <ul>
      <li><code>announce</code> — primary tracker</li>
      <li><code>announce-list</code> — tiered tracker list</li>
      <li><code>info</code> — contains name, files, piece length, and <code>info_hash</code> source</li>
      <li><code>private</code> flag — if present and <code>1</code></li>
    </ul>

    <h3>Computing the Info Hash</h3>
    <p>
      The <code>info_hash</code> is a SHA-1 hash of the <strong>Bencoded</strong> <code>info</code> dictionary. We:
    </p>
    <ol>
      <li>Re-encode the <code>info</code> object (preserving key order)</li>
      <li>Pass it to <code>crypto.subtle.digest('SHA-1', ...)</code></li>
      <li>Convert to hex and base32</li>
    </ol>

    <h2>File List Handling</h2>
    <p>
      For multi-file torrents, the <code>info.files</code> array contains path and length. We reconstruct full paths like <code>folder/subfolder/file.mp4</code>.
    </p>

    <h2>Performance & Accuracy</h2>
    <p>
      Parsing a 1 MB torrent takes &lt;100 ms. We validate dictionary keys and handle edge cases like missing fields or malformed Bencode.
    </p>

    <h2>FAQ</h2>
    <details>
      <summary>Why not use a library?</summary>
      <p>We use a lightweight, zero-dependency Bencode parser for full control and tree-shaking.</p>
    </details>
    <details>
      <summary>Does it support magnet links?</summary>
      <p>Yes — we extract <code>xt=urn:btih:...</code> and <code>tr=...</code> parameters.</p>
    </details>

    <p class="italic-note">
      Ready to inspect your own torrent? <a href="{base}/">Launch the Analyzer</a>
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
  .prose ul, .prose ol { padding-left: 1.5rem; color: var(--text-primary); }
  .prose ul li::marker, .prose ol li::marker { color: var(--accent-primary); }
  .prose li { margin-bottom: 0.5rem; }
  .prose details { background: var(--secondary-bg); border: 1px solid var(--border-color); border-radius: 6px; padding: 1rem; margin-bottom: 1rem; transition: background-color 0.2s ease; }
  .prose details[open] { background-color: var(--card-bg); }
  .prose summary { cursor: pointer; font-weight: 600; color: var(--accent-secondary); list-style: none; }
  .prose summary::-webkit-details-marker { display: none; }
  .prose summary::before { content: '+'; margin-right: 0.75rem; color: var(--accent-primary); font-weight: bold; display: inline-block; transition: transform 0.2s ease; }
  .prose details[open] summary::before { transform: rotate(45deg); }
  .prose details p { margin-top: 1rem; padding-left: 1.5rem; border-left: 2px solid var(--accent-primary); color: var(--text-secondary); }
  .prose .italic-note { font-style: italic; color: var(--text-secondary); text-align: center; margin-top: 3rem; }
</style>