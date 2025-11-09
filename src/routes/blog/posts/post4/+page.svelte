<script lang="ts">
  import { base } from '$app/paths';
</script>

<svelte:head>
  <title>Understanding Public vs Private Trackers | AxelBase Blog</title>
  <meta name="description" content="Learn the difference between public and private trackers, how DHT and PEX work, and how to detect private torrents using the Torrent Tracker Analyzer." />
  <meta property="og:title" content="Understanding Public vs Private Trackers | AxelBase Blog" />
  <meta property="og:description" content="Learn the difference between public and private trackers, how DHT and PEX work, and how to detect private torrents using the Torrent Tracker Analyzer." />
  <meta property="og:url" content="{base}/blog/posts/post4" />
  <meta property="og:type" content="article" />
  <meta name="twitter:card" content="summary_large_image" />
</svelte:head>

<div class="container fade-in post-layout">
  <div class="breadcrumbs">
    <a href="{base}/blog">Blog</a>
    <span>/</span>
    <p>Understanding Public vs Private Trackers</p>
  </div>

  <article class="prose">
    <h1>Understanding Public vs Private Trackers</h1>
    <p class="post-meta">Published: November 16, 2025</p>

    <p>
      Not all torrent trackers are created equal. The <strong>Torrent Tracker Analyzer</strong> helps you identify whether a torrent uses <em>public</em> or <em>private</em> trackers — a critical distinction for privacy, performance, and security.
    </p>

    <h2>What Makes a Tracker Public?</h2>
    <p>
      A <strong>public tracker</strong> is open to anyone. It allows peer discovery without authentication. Examples include:
    </p>
    <ul>
      <li><code>udp://tracker.openbittorrent.com:80</code></li>
      <li><code>http://bttracker.debian.org:6969/</code></li>
      <li><code>udp://tracker.opentrackr.org:1337</code></li>
    </ul>

    <p>
      These are often listed in public torrents and support DHT (Distributed Hash Table) and PEX (Peer Exchange).
    </p>

    <h2>Private Trackers: Invite-Only</h2>
    <p>
      Private trackers require registration and often use passkeys or IP whitelisting. They disable DHT and PEX to prevent leaking peer data. The torrent file includes a <code>private: 1</code> flag in the <code>info</code> dictionary.
    </p>

    <h3>How We Detect Private Torrents</h3>
    <p>
      The analyzer checks two things:
    </p>
    <ol>
      <li><code>info.private === 1</code> → Explicit private flag</li>
      <li>Tracker domain → Known private tracker (e.g., <code>*.pass.the.popcorn.*</code>)</li>
    </ol>

    <p>
      If either is true, the torrent is marked <strong>Private</strong>.
    </p>

    <h2>DHT and PEX: The Privacy Risk</h2>
    <p>
      DHT allows peers to find each other without a tracker. PEX lets peers exchange lists directly. Both are <strong>disabled on private torrents</strong> to prevent data leaks.
    </p>

    <p>
      Public torrents with DHT enabled can expose your IP even if the tracker fails.
    </p>

    <h2>Why It Matters</h2>
    <p>
      Using a private tracker torrent on a public client can leak your IP. Conversely, uploading a private torrent to a public indexer violates rules.
    </p>

    <h2>FAQ</h2>
    <details>
      <summary>Can a public torrent become private?</summary>
      <p>No. The <code>private</code> flag is set at creation and cannot be changed.</p>
    </details>
    <details>
      <summary>Are all UDP trackers public?</summary>
      <p>Most are, but some private sites use UDP. We check the domain and flag.</p>
    </details>
    <details>
      <summary>Does the analyzer support DHT testing?</summary>
      <p>No — DHT is decentralized and cannot be tested via HTTP.</p>
    </details>

    <p class="italic-note">
      Check your torrent’s privacy: <a href="{base}/">Open the Analyzer</a>
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