<script lang="ts">
  import { base } from '$app/paths';
</script>

<svelte:head>
  <title>Terms & Conditions | Torrent Tracker Analyzer</title>
  <meta name="description" content="Read the terms of use for the Torrent Tracker Analyzer — a free, open-source tool with no warranties." />
  <meta property="og:title" content="Terms & Conditions | Torrent Tracker Analyzer" />
  <meta property="og:description" content="Read the terms of use for the Torrent Tracker Analyzer — a free, open-source tool with no warranties." />
  <meta property="og:url" content="{base}/terms" />
  <meta property="og:type" content="website" />
  <meta name="twitter:card" content="summary_large_image" />
</svelte:head>

<div class="container fade-in post-layout">
  <div class="breadcrumbs">
    <a href="{base}/">Home</a>
    <span>/</span>
    <p>Terms & Conditions</p>
  </div>

  <article class="prose">
    <h1>Terms & Conditions</h1>
    <p class="post-meta">Last Updated: November 23, 2025</p>

    <h2>1. Acceptance of Terms</h2>
    <p>
      By accessing or using the <strong>Torrent Tracker Analyzer</strong> ("the Tool"), you agree to these Terms & Conditions. If you do not agree, please do not use the Tool.
    </p>

    <h2>2. Nature of the Tool</h2>
    <p>
      The Tool is a <strong>free, open-source</strong> web application hosted on GitHub Pages. It allows users to:
    </p>
    <ul>
      <li>Upload <code>.torrent</code> files</li>
      <li>Paste <code>magnet:</code> links</li>
      <li>View tracker tiers and reachability</li>
      <li>Export results in CSV or JSON</li>
    </ul>
    <p>
      <em>All processing occurs in your browser. No data is sent to us.</em>
    </p>

    <h2>3. License to Use</h2>
    <p>
      You are granted a <strong>non-exclusive, non-transferable, revocable license</strong> to use the Tool for personal, non-commercial purposes. You may not:
    </p>
    <ul>
      <li>Modify, distribute, or reverse-engineer the source code (except as permitted by the MIT License)</li>
      <li>Use the Tool for illegal activities</li>
      <li>Attempt to overload or disrupt the service</li>
    </ul>

    <h2>4. No Warranties</h2>
    <p>
      The Tool is provided <strong>"as is"</strong> and <strong>"as available"</strong> without warranties of any kind, including:
    </p>
    <ul>
      <li>Accuracy of tracker status</li>
      <li>Availability of the service</li>
      <li>Fitness for a particular purpose</li>
    </ul>
    <p>
      <strong>We do not guarantee that trackers marked "Success" will deliver peers.</strong>
    </p>

    <h2>5. Limitation of Liability</h2>
    <p>
      To the fullest extent permitted by law, <strong>AxelBase</strong> shall not be liable for any direct, indirect, incidental, or consequential damages arising from:
    </p>
    <ul>
      <li>Use or inability to use the Tool</li>
      <li>Errors in tracker testing</li>
      <li>Data loss or corruption</li>
    </ul>

    <h2>6. User Responsibilities</h2>
    <p>
      You are responsible for:
    </p>
    <ul>
      <li>Ensuring your use complies with local laws</li>
      <li>Not uploading malicious or copyrighted content without permission</li>
      <li>Securing your own device and network</li>
    </ul>

    <h2>7. Intellectual Property</h2>
    <p>
      The Tool is licensed under the <strong>MIT License</strong>. Source code is available at:
      <br>
      <a href="https://github.com/axelbase/torrent-tracker-analyzer" target="_blank" rel="noopener">github.com/axelbase/torrent-tracker-analyzer</a>
    </p>

    <h2>8. Termination</h2>
    <p>
      We reserve the right to suspend or terminate access to the Tool at any time, without notice, for any reason.
    </p>

    <h2>9. Governing Law</h2>
    <p>
      These terms are governed by the laws of <strong>Sweden</strong>, without regard to conflict of law principles.
    </p>

    <h2>10. Changes to Terms</h2>
    <p>
      We may update these terms. Continued use constitutes acceptance of the new terms.
    </p>

    <h2>11. Contact</h2>
    <p>
      For questions, open an issue on <a href="https://github.com/axelbase/torrent-tracker-analyzer" target="_blank" rel="noopener">GitHub</a>.
    </p>

    <p class="italic-note">
      <strong>Use responsibly.</strong> This is a diagnostic tool, not a guarantee of torrent functionality.
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