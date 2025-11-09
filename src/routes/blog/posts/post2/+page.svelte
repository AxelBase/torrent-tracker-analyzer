<script lang="ts">
  import { base } from '$app/paths';
</script>

<svelte:head>
  <title>How Tracker Reachability Works | AxelBase Blog</title>
  <meta name="description" content="Learn how the Torrent Tracker Analyzer tests HTTP and UDP trackers in the browser, including CORS, timeouts, and concurrency strategies." />
  <meta property="og:title" content="How Tracker Reachability Works | AxelBase Blog" />
  <meta property="og:description" content="Learn how the Torrent Tracker Analyzer tests HTTP and UDP trackers in the browser, including CORS, timeouts, and concurrency strategies." />
  <meta property="og:url" content="{base}/blog/posts/post2" />
  <meta property="og:type" content="article" />
  <meta name="twitter:card" content="summary_large_image" />
</svelte:head>

<div class="container fade-in post-layout">
  <div class="breadcrumbs">
    <a href="{base}/blog">Blog</a>
    <span>/</span>
    <p>How Tracker Reachability Works</p>
  </div>

  <article class="prose">
    <h1>How Tracker Reachability Works</h1>
    <p class="post-meta">Published: November 12, 2025</p>

    <p>
      One of the most powerful features of the <strong>Torrent Tracker Analyzer</strong> is its ability to test whether trackers are actually reachable — not just listed in the torrent file. This article explains the technical process behind it.
    </p>

    <h2>HTTP Trackers: HEAD Requests</h2>
    <p>
      For <code>http://</code> and <code>https://</code> trackers, we use the browser’s native <code>fetch()</code> API with the <code>HEAD</code> method. This sends a lightweight request that asks only for headers — no body is downloaded.
    </p>

    <pre><code>fetch(url, {{ method: 'HEAD', signal: AbortSignal.timeout(5000) }}})</code></pre>

    <p>
      If the server responds with any <code>2xx</code> or <code>3xx</code> status, the tracker is marked <strong>Success</strong> with response time in milliseconds.
    </p>

    <h3>CORS Limitations</h3>
    <p>
      Many trackers don’t send CORS headers. We use <code>mode: 'no-cors'</code> to allow the request to go through, but this means we can’t read the response status. In such cases, a successful network connection still counts as “reachable.”
    </p>

    <h2>UDP Trackers: Not Supported in Browser</h2>
    <p>
      UDP announce requests require raw socket access, which is not available in web browsers for security reasons. These trackers are clearly marked as <em>“UDP (not checked)”</em> in the UI.
    </p>

    <h2>Concurrency & Timeouts</h2>
    <p>
      To avoid slowing down the user, we check up to <strong>10 trackers concurrently</strong> using <code>Promise.all()</code>. Each request has a <strong>5-second timeout</strong> via <code>AbortController</code>.
    </p>

    <h3>Performance Example</h3>
    <p>
      A torrent with 25 trackers takes ~6–8 seconds total — far faster than sequential checks.
    </p>

    <h2>FAQ</h2>
    <details>
      <summary>Why use HEAD instead of GET?</summary>
      <p>HEAD is lighter and faster. Trackers don’t need to send scrape data during announce checks.</p>
    </details>
    <details>
      <summary>Can it detect tracker redirects?</summary>
      <p>Yes — 301/302 responses are considered successful if the final destination responds.</p>
    </details>
    <details>
      <summary>What if a tracker requires the info_hash?</summary>
      <p>Some trackers return 400 without it — still counts as “reachable” since the server is online.</p>
    </details>

    <p class="italic-note">
      Want to test your own torrent? <a href="{base}/">Open the Analyzer</a>
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
  .prose pre { background: #f4f4f4; padding: 1rem; border-radius: 6px; overflow-x: auto; font-size: 0.9rem; }
  .prose details { background: var(--secondary-bg); border: 1px solid var(--border-color); border-radius: 6px; padding: 1rem; margin-bottom: 1rem; transition: background-color 0.2s ease; }
  .prose details[open] { background-color: var(--card-bg); }
  .prose summary { cursor: pointer; font-weight: 600; color: var(--accent-secondary); list-style: none; }
  .prose summary::-webkit-details-marker { display: none; }
  .prose summary::before { content: '+'; margin-right: 0.75rem; color: var(--accent-primary); font-weight: bold; display: inline-block; transition: transform 0.2s ease; }
  .prose details[open] summary::before { transform: rotate(45deg); }
  .prose details p { margin-top: 1rem; padding-left: 1.5rem; border-left: 2px solid var(--accent-primary); color: var(--text-secondary); }
  .prose .italic-note { font-style: italic; color: var(--text-secondary); text-align: center; margin-top: 3rem; }
</style>