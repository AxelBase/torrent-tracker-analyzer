<script lang="ts">
  import { base } from '$app/paths';
  import { fly } from 'svelte/transition';
  import 'bootstrap/dist/css/bootstrap.min.css';
  import '../app.css';

  const currentYear = new Date().getFullYear();

  let isDropdownOpen = false;

  function toggleDropdown() {
    isDropdownOpen = !isDropdownOpen;
  }

  function closeDropdown() {
    isDropdownOpen = false;
  }

  function clickOutside(node: HTMLElement) {
    const handleClick = (event: MouseEvent) => {
      if (node && !node.contains(event.target as Node)) {
        node.dispatchEvent(new CustomEvent('click_outside'));
      }
    };
    document.addEventListener('click', handleClick, true);
    return {
      destroy() {
        document.removeEventListener('click', handleClick, true);
      }
    };
  }
</script>

<header class="navbar-sticky">
  <nav class="container">
    <div class="nav-left">
      <a href="{base}/" class="nav-brand" aria-label="Home">
        <img src="{base}/AxelLab-Logo.ico" alt="AxelBase Logo" class="logo" />
        <span>AxelBase</span>
      </a>

      <div class="bmac-wrapper" use:clickOutside on:click_outside={closeDropdown}>
        <button
          class="bmac-button d-flex align-items-center gap-2 text-white border-0 px-4 py-2 rounded-pill shadow-sm"
          on:click={toggleDropdown}
          aria-label="Support options"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2,21V19H20V21H2M20,8V5H4V8H20M20,10H4V13C4,14.38 4.5,15.63 5.31,16.58L11.64,19H12.36L18.69,16.58C19.5,15.63 20,14.38 20,13V10M16,2H8V4H16V2Z" />
          </svg>
          <span class="d-none d-sm-inline fw-semibold">Buy me a Coffee</span>
        </button>

        {#if isDropdownOpen}
          <div class="bmac-dropdown mt-2" transition:fly={{ y: -10, duration: 250 }}>
            <a
              href="https://buymeacoffee.com/axelbase"
              target="_blank"
              rel="noopener"
              on:click={closeDropdown}
            >
              <span class="amount">$3</span> One Coffee
            </a>

            <a
              href="https://buymeacoffee.com/axelbase"
              target="_blank"
              rel="noopener"
              on:click={closeDropdown}
            >
              <span class="amount">$5</span> Two Coffees
            </a>

            <a
              href="https://buymeacoffee.com/axelbase"
              target="_blank"
              rel="noopener"
              on:click={closeDropdown}
            >
              <span class="amount">$10</span> Three Coffees
            </a>

            <a
              href="https://buymeacoffee.com/axelbase"
              target="_blank"
              rel="noopener"
              on:click={closeDropdown}
              class="custom-amount"
            >
              Custom Amount
            </a>

            <a
              href="bitcoin:bc1q3p0e6vt492m4w4fpz5m2cl4zcfuqqkgaj6myc9?label=AxelBase&message=Buy%20me%20a%20coffee"
              on:click={closeDropdown}
              class="custom-amount"
            >
              Buy via Crypto (Bitcoin)
            </a>
          </div>
        {/if}
      </div>
    </div>

    <div class="nav-right">
      <ul>
        <li><a class="nav-link" href="{base}/">Home</a></li>
        <li><a class="nav-link" href="{base}/#about">About</a></li>
        <li><a class="nav-link" href="{base}/#how-to-use">How to use</a></li>
        <li><a class="nav-link" href="{base}/#faq">FAQ</a></li>
        <li><a class="nav-link" href="{base}/blog">Blog</a></li>
      </ul>
    </div>
  </nav>
</header>

<main class="main-content">
  <slot />
</main>

<footer class="footer-fixed">
  <div class="container">
    <p>&copy; {currentYear} AxelBase Torrent Tracker Analyzer</p>
    <div>
      <a href="{base}/privacy">Privacy Policy</a>
      <a href="{base}/terms">Terms & Conditions</a>
    </div>
  </div>
</footer>

<style>
  /* Preserve File 1 button identity while fitting File 2 theme */
  .bmac-button {
    background: var(--brand-green, #00a651);
    font-size: 0.95rem;
    transition: all 0.3s ease;
  }

  .bmac-button:hover {
    background: var(--brand-green-hover, #008f39);
    transform: translateY(-1px);
  }

  .bmac-dropdown {
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    width: 240px;
    background: white;
    border-radius: 16px;
    box-shadow: 0 12px 32px rgba(0, 143, 57, 0.15);
    overflow: hidden;
    border: 1px solid rgba(0, 143, 57, 0.1);
    z-index: 1001;
  }

  .bmac-dropdown a {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 20px;
    color: #333;
    text-decoration: none;
    font-size: 0.95rem;
    transition: all 0.2s ease;
  }

  .bmac-dropdown a:hover {
    background: rgba(0, 166, 81, 0.1);
    color: var(--brand-green, #00a651);
    padding-left: 28px;
  }

  .bmac-dropdown .amount {
    font-weight: 700;
    color: var(--brand-green, #00a651);
    font-size: 1.05rem;
  }

  .bmac-dropdown .custom-amount {
    font-weight: 600;
    color: var(--brand-green, #00a651);
    border-top: 1px solid #eee;
    justify-content: center;
  }
</style>
