import { switchToHome, switchToFavorites } from './exercises.js';

// Current active page
let currentPage = 'home';

// Mobile menu elements
let mobileMenu = null;
let burgerButton = null;
let closeButton = null;

// Switch page and update UI
export function switchPage(page) {
  if (currentPage === page) return;

  currentPage = page;
  document.body.classList.toggle('is-favorites', page === 'favorites');

  // Update nav links active state in desktop nav
  const navLinks = document.querySelectorAll('.header__nav-link');
  navLinks.forEach(link => {
    const linkPage = link.getAttribute('data-page');
    if (linkPage === page) {
      link.classList.add('header__nav-link--active');
    } else {
      link.classList.remove('header__nav-link--active');
    }
  });

  // Update nav links active state in mobile menu
  const mobileNavLinks = document.querySelectorAll('.mobile-menu__nav-link');
  mobileNavLinks.forEach(link => {
    const linkPage = link.getAttribute('data-page');
    if (linkPage === page) {
      link.classList.add('mobile-menu__nav-link--active');
    } else {
      link.classList.remove('mobile-menu__nav-link--active');
    }
  });

  // Call corresponding function to render content
  if (page === 'home') {
    switchToHome();
  } else if (page === 'favorites') {
    switchToFavorites();
  }
}

function toggleMobileMenu(shouldOpen) {
  if (!mobileMenu) return;
  const isOpen = mobileMenu.classList.contains('is-open');
  const nextState = typeof shouldOpen === 'boolean' ? shouldOpen : !isOpen;
  mobileMenu.classList.toggle('is-open', nextState);
  document.body.style.overflow = nextState ? 'hidden' : '';
}

// Initialize header event listeners
export function initHeader() {
  // Desktop nav links
  const nav = document.querySelector('.header__nav');
  if (nav) {
    nav.addEventListener('click', e => {
      const link = e.target.closest('.header__nav-link');
      if (!link) return;
      e.preventDefault();
      const page = link.getAttribute('data-page');
      if (page) {
        switchPage(page);
      }
    });
  }

  // Mobile menu elements
  mobileMenu = document.querySelector('.mobile-menu');
  burgerButton = document.querySelector('.header__burger');
  closeButton = document.querySelector('.mobile-menu__close');

  // Burger button
  if (burgerButton) {
    burgerButton.addEventListener('click', () => toggleMobileMenu());
  }

  // Close button
  if (closeButton) {
    closeButton.addEventListener('click', () => toggleMobileMenu(false));
  }

  // Mobile nav links
  const mobileNav = document.querySelector('.mobile-menu__nav');
  if (mobileNav) {
    mobileNav.addEventListener('click', e => {
      const link = e.target.closest('.mobile-menu__nav-link');
      if (!link) return;
      e.preventDefault();
      const page = link.getAttribute('data-page');
      if (page) {
        switchPage(page);
        toggleMobileMenu(false);
      }
    });
  }

  // Close menu on backdrop click
  if (mobileMenu) {
    mobileMenu.addEventListener('click', e => {
      if (e.target === mobileMenu) {
        toggleMobileMenu(false);
      }
    });
  }
}

// Get current page
export function getCurrentPage() {
  return currentPage;
}
