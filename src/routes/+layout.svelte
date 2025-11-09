<script lang="ts">
  import { base } from '$app/paths';
  import { fly } from 'svelte/transition';
  import 'bootstrap/dist/css/bootstrap.min.css';
  import '../app.css'; // Import our new custom styles

  // --- Buy me a coffee logic ---
  const paypalUsername = 'YOUR_USERNAME'; // !! IMPORTANT: Update this
  const donationAmounts = [1, 3, 5, 10];
  let isDropdownOpen = false;

  function toggleDropdown() {
    isDropdownOpen = !isDropdownOpen;
  }
  function closeDropdown() {
    isDropdownOpen = false;
  }

  // Action to detect clicks outside an element
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

  // --- Footer logic ---
  const currentYear = new Date().getFullYear();
</script>

<header class="navbar-sticky">
  <nav class="container">
    <div class="nav-left">
      <a href="{base}/" class="nav-brand" aria-label="Home">
        <img src="{base}/AxelLab-Logo.ico" alt="AxelBase Logo" class="logo" />
        <span>AxelBase</span>
      </a>

      <div class="bmac-wrapper" use:clickOutside on:click_outside={closeDropdown}>
        <button class="bmac-button" on:click={toggleDropdown} title="Support the developer">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path
              d="M12.35,22.2L12,22A10,10,0,0,1,2,12V10A2,2,0,0,1,4,8H7.2A5.13,5.13,0,0,1,12,3A5.13,5.13,0,0,1,16.8,8H20A2,2,0,0,1,22,10V12A10,10,0,0,1,12.35,22.2M4,10V12A8,8,0,0,0,12,20A8,8,0,0,0,20,12V10H16.8A5.11,5.11,0,0,1,12.5,5.12A5.15,5.15,0,0,1,7.2,10H4Z"
            />
          </svg>
          Buy me a coffee
        </button>

        {#if isDropdownOpen}
          <div class="bmac-dropdown" transition:fly={{ y: -10, duration: 250 }}>
            {#each donationAmounts as amount}
              <a
                href="https://paypal.me/{paypalUsername}/{amount}"
                target="_blank"
                rel="noopener noreferrer"
                on:click={closeDropdown}
              >
                ${amount}
              </a>
            {/each}
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