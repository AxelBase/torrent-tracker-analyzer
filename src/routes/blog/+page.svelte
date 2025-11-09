<script lang="ts">
  import { base } from '$app/paths';

  const posts = [
    {
      href: '/blog/posts/post1',
      title: 'Introducing the Torrent Tracker Analyzer',
      description: 'A powerful tool to inspect .torrent files and magnet links, check tracker reachability, and export detailed reports.'
    },
    {
      href: '/blog/posts/post2',
      title: 'How Tracker Reachability Works',
      description: 'Learn how we test HTTP and UDP trackers in the browser, including CORS limitations and timeout handling.'
    },
    {
      href: '/blog/posts/post3',
      title: 'Parsing .torrent Files in the Browser',
      description: 'Deep dive into Bencode decoding, info-hash calculation, and multi-file torrent support using Web APIs.'
    },
    {
      href: '/blog/posts/post4',
      title: 'Understanding Public vs Private Trackers',
      description: 'What makes a tracker public? How DHT and PEX affect privacy, and how to detect private torrents.'
    },
    {
      href: '/blog/posts/post5',
      title: 'Exporting Analysis to CSV and JSON',
      description: 'Generate downloadable reports with tracker status, response times, file lists, and metadata.'
    },
    {
      href: '/blog/posts/post6',
      title: 'Building a Drag-and-Drop File Uploader',
      description: 'Accessible, responsive file upload with instant feedback, keyboard support, and validation.'
    },
    {
      href: '/blog/posts/post7',
      title: 'Deploying SvelteKit Apps to GitHub Pages',
      description: 'Step-by-step guide to build, deploy, and host static SvelteKit sites for free using `adapter-static`.'
    }
  ];
</script>

<svelte:head>
  <title>Blog | AxelBase Insights</title>
  <meta name="description" content="Explore tutorials, updates, and best practices for the Torrent Tracker Analyzer and other AxelBase tools." />
</svelte:head>

<div class="container fade-in blog-index">
  <header class="blog-header">
    <h1>Blog: AxelBase Insights</h1>
    <p class="subtitle">
      Tutorials, deep dives, and updates for the <strong>Torrent Tracker Analyzer</strong> and other open-source tools. Follow our journey on <a href="https://github.com/axelbase" target="_blank" rel="noopener noreferrer">GitHub</a>.
    </p>
  </header>

  <div class="posts-grid">
    {#each posts as post}
      <a href="{base}{post.href}" class="card post-card">
        <div class="card-body">
          <h2 class="post-title">{post.title}</h2>
          <p class="post-description">{post.description}</p>
          <span class="read-more">Read Article</span>
        </div>
      </a>
    {/each}
  </div>
</div>

<style>
  .blog-index {
    padding-top: 2rem;
    padding-bottom: 4rem;
  }

  .blog-header {
    text-align: center;
    margin-bottom: 3rem;
    border-bottom: 1px solid var(--border-color);
    padding-bottom: 2rem;
  }

  .blog-header h1 {
    font-size: 2.8rem;
    margin-bottom: 1rem;
  }

  .subtitle {
    font-size: 1.1rem;
    color: var(--text-secondary);
    max-width: 700px;
    margin: 0 auto;
    line-height: 1.7;
  }

  .posts-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
  }

  .post-card {
    text-decoration: none;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  .post-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0,0,0,0.1);
  }

  .post-card .card-body {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .post-title {
    font-size: 1.25rem;
    color: var(--accent-secondary);
    margin-bottom: 0.75rem;
  }

  .post-description {
    color: var(--text-secondary);
    flex-grow: 1;
    margin-bottom: 1rem;
  }

  .read-more {
    color: var(--accent-primary);
    font-weight: 600;
    align-self: flex-start;
    transition: transform 0.2s ease;
  }

  .post-card:hover .read-more {
    transform: translateX(5px);
  }
</style>