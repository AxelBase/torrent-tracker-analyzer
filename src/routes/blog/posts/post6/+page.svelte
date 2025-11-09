<script lang="ts">
  import { base } from '$app/paths';
</script>

<svelte:head>
  <title>Building a Drag-and-Drop File Uploader | AxelBase Blog</title>
  <meta name="description" content="Discover how we built an accessible, responsive drag-and-drop file uploader with instant feedback, keyboard support, and .torrent validation." />
  <meta property="og:title" content="Building a Drag-and-Drop File Uploader | AxelBase Blog" />
  <meta property="og:description" content="Discover how we built an accessible, responsive drag-and-drop file uploader with instant feedback, keyboard support, and .torrent validation." />
  <meta property="og:url" content="{base}/blog/posts/post6" />
  <meta property="og:type" content="article" />
  <meta name="twitter:card" content="summary_large_image" />
</svelte:head>

<div class="container fade-in post-layout">
  <div class="breadcrumbs">
    <a href="{base}/blog">Blog</a>
    <span>/</span>
    <p>Building a Drag-and-Drop File Uploader</p>
  </div>

  <article class="prose">
    <h1>Building a Drag-and-Drop File Uploader</h1>
    <p class="post-meta">Published: November 20, 2025</p>

    <p>
      The <strong>Torrent Tracker Analyzer</strong> starts with a seamless file upload experience. Here’s how we built a **drag-and-drop uploader** that’s accessible, fast, and user-friendly.
    </p>

    <h2>Core Requirements</h2>
    <ul>
      <li>Click to upload or drag & drop</li>
      <li>Instant feedback with file name and size</li>
      <li>Keyboard accessible (Enter/Space)</li>
      <li>Only accept <code>.torrent</code> files</li>
      <li>Works on mobile and desktop</li>
    </ul>
    
    <h2>Drag & Drop API</h2>
    <p>
      We listen to <code>dragover</code>, <code>dragleave</code>, and <code>drop</code> events. <code>preventDefault()</code> is critical to allow dropping.
    </p>

    <h3>Visual Feedback</h3>
    <p>
      A <code>.drag-over</code> class changes border and background during drag.
    </p>

    <h2>Keyboard Support</h2>
    <p>
      Pressing <kbd>Enter</kbd> or <kbd>Space</kbd> triggers the hidden file input.
    </p>

    <h2>Validation</h2>
    <p>
      We check <code>file.name.endsWith('.torrent')</code> and show an alert if invalid.
    </p>

    <h2>Accessibility (a11y)</h2>
    <ul>
      <li><code>aria-label</code> on drop zone</li>
      <li>Focus outline on keyboard navigation</li>
      <li>Screen reader announces upload</li>
    </ul>

    <h2>FAQ</h2>
    <details>
      <summary>Why not use &lt;input type="file" /&gt; directly?</summary>
      <p>Hidden inputs can’t be styled. A custom zone offers better UX.</p>
    </details>
    <details>
      <summary>Does it work on iOS?</summary>
      <p>Yes. Tap to open picker; drag & drop works in Safari 14+.</p>
    </details>

    <p class="italic-note">
      Try the uploader: <a href="{base}/">Go to Analyzer</a>
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