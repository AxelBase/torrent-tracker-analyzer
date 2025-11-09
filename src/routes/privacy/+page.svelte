<script lang="ts">
  import { base } from '$app/paths';
</script>

<svelte:head>
  <title>Privacy Policy | Torrent Tracker Analyzer</title>
  <meta name="description" content="We collect no data. The Torrent Tracker Analyzer runs entirely in your browser — no uploads, no tracking, no servers." />
  <meta property="og:title" content="Privacy Policy | Torrent Tracker Analyzer" />
  <meta property="og:description" content="We collect no data. The Torrent Tracker Analyzer runs entirely in your browser — no uploads, no tracking, no servers." />
  <meta property="og:url" content="{base}/privacy" />
  <meta property="og:type" content="website" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Privacy Policy | Torrent Tracker Analyzer" />
  <meta name="twitter:description" content="Zero data collection. 100% client-side. Your torrent files never leave your device." />
</svelte:head>

<div class="container fade-in post-layout">
  <div class="breadcrumbs">
    <a href="{base}/">Home</a>
    <span>/</span>
    <p>Privacy Policy</p>
  </div>

  <article class="prose">
    <h1>Privacy Policy</h1>
    <p class="post-meta">Effective Date: November 23, 2025</p>

    <h2>1. Our Commitment to Privacy</h2>
    <p>
      At <strong>AxelBase</strong>, we believe privacy is a fundamental right. The <strong>Torrent Tracker Analyzer</strong> is a <em>100% client-side web application</em> — meaning <strong>your data never leaves your browser</strong>. We do not collect, store, transmit, or process any personal or file data.
    </p>

    <h2>2. No Data Collection</h2>
    <p>
      We explicitly <strong>do not collect</strong> any of the following:
    </p>
    <ul>
      <li><strong>Personal Information</strong>: Name, email, IP address, or location</li>
      <li><strong>Torrent Files</strong>: .torrent files or magnet links are processed locally</li>
      <li><strong>Usage Analytics</strong>: No tracking pixels, cookies, or session logs</li>
      <li><strong>Browser Data</strong>: No fingerprinting, device info, or behavior tracking</li>
    </ul>
    <p>
      <em>All parsing, tracker checks, and exports happen in your browser using Web in-memory APIs.</em>
    </p>

    <h2>3. How the Tool Works</h2>
    <p>
      When you use the analyzer:
    </p>
    <ul>
      <li><strong>Upload or Paste</strong>: Files are read via <code>FileReader</code> API</li>
      <li><strong>Bencode Parsing</strong>: Done with pure JavaScript in memory</li>
      <li><strong>Tracker Testing</strong>: <code>fetch()</code> requests go directly to tracker URLs</li>
      <li><strong>Export</strong>: CSV/JSON generated via <code>Blob</code> and downloaded instantly</li>
    </ul>
    <p>
      <strong>No server is involved at any step.</strong>
    </p>

    <h2>4. Third-Party Services</h2>
    <p>
      We do <strong>not use</strong> any third-party analytics, advertising, or tracking services. The only external requests are to <em>tracker announce URLs</em> (which you explicitly provide via your torrent).
    </p>

    <h2>5. Cookies & Local Storage</h2>
    <p>
      <strong>No cookies are set.</strong> Temporary data (e.g., your input) may be held in memory during use but is <em>cleared on page reload or reset</em>.
    </p>

    <h2>6. Data Security</h2>
    <p>
      Since no data is transmitted, <strong>there is no server to breach</strong>. Your security depends on:
    </p>
    <ul>
      <li>Using a trusted browser</li>
      <li>Avoiding public or compromised networks</li>
      <li>Keeping your device updated</li>
    </ul>

    <h2>7. Children's Privacy</h2>
    <p>
      This tool is not directed at children under 13. We do not knowingly collect data from minors.
    </p>

    <h2>8. Compliance</h2>
    <p>
      Our zero-data model complies by default with <strong>GDPR</strong>, <strong>CCPA</strong>, <strong>LGPD</strong>, and other privacy laws.
    </p>

    <h2>9. Changes to This Policy</h2>
    <p>
      We may update this policy. Changes will be posted here with a new effective date.
    </p>

    <h2>10. Contact</h2>
    <p>
      Questions? Reach us via <a href="https://github.com/axelbase/torrent-tracker-analyzer" target="_blank" rel="noopener">GitHub Issues</a>.
    </p>

    <p class="italic-note">
      <strong>Your privacy is protected by design.</strong> Use the analyzer with confidence.
    </p>
  </article>
</div>

<style>
  .post-layout {
    max-width: 800px;
    padding: 2rem 1rem 4rem;
  }
  .breadcrumbs {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
    font-size: 0.9rem;
    color: var(--text-secondary);
  }
  .breadcrumbs a {
    color: var(--accent-secondary);
  }
  .breadcrumbs a:hover {
    text-decoration: underline;
  }
  .breadcrumbs p {
    margin: 0;
  }
  .prose {
    line-height: 1.8;
  }
  .prose .post-meta {
    color: var(--text-secondary);
    font-size: 0.9rem;
    margin-bottom: 2rem;
    border-bottom: 1px solid var(--border-color);
    padding-bottom: 1rem;
  }
  .prose h1, .prose h2 {
    color: var(--accent-secondary);
  }
  .prose h1 {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
  }
  .prose h2 {
    margin-top: 2.5rem;
    border-bottom: 1px solid var(--secondary-bg);
    padding-bottom: 0.5rem;
  }
  .prose p {
    color: var(--text-primary);
  }
  .prose ul {
    list-style-type: '→ ';
    padding-left: 1.5rem;
    color: var(--text-primary);
  }
  .prose ul li::marker {
    color: var(--accent-primary);
  }
  .prose ul li {
    padding-left: 0.5rem;
    margin-bottom: 0.5rem;
  }
  .prose .italic-note {
    font-style: italic;
    color: var(--text-secondary);
    text-align: center;
    margin-top: 3rem;
  }
</style>