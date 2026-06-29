/* ============================================
   FLOWDESK — THEME.JS
   Dark/Light mode manager
   ============================================ */

(function () {
  'use strict';

  const STORAGE_KEY = 'flowdesk-theme';
  const THEMES = { DARK: 'dark', LIGHT: 'light' };

  /* Light mode overrides */
  const lightVars = {
    '--color-bg': '#F8F8FF',
    '--color-bg-secondary': '#EEEEF8',
    '--color-bg-card': '#FFFFFF',
    '--color-bg-elevated': '#F0F0FA',
    '--color-border': 'rgba(0,0,0,0.08)',
    '--color-border-strong': 'rgba(0,0,0,0.14)',
    '--color-text-primary': '#0F0F1A',
    '--color-text-secondary': '#4A4A6A',
    '--color-text-muted': '#8A8AAA',
    '--color-text-inverse': '#F1F1F5',
    '--shadow-sm': '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)',
    '--shadow-md': '0 4px 16px rgba(0,0,0,0.1)',
    '--shadow-lg': '0 10px 40px rgba(0,0,0,0.12)',
  };

  function applyTheme(theme) {
    const root = document.documentElement;
    if (theme === THEMES.LIGHT) {
      Object.entries(lightVars).forEach(([k, v]) => root.style.setProperty(k, v));
      document.body.dataset.theme = 'light';
    } else {
      Object.keys(lightVars).forEach(k => root.style.removeProperty(k));
      document.body.dataset.theme = 'dark';
    }
    localStorage.setItem(STORAGE_KEY, theme);
    updateToggle(theme);
  }

  function getCurrentTheme() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return stored;
    return window.matchMedia('(prefers-color-scheme: light)').matches
      ? THEMES.LIGHT
      : THEMES.DARK;
  }

  function updateToggle(theme) {
    const btn = document.querySelector('[data-theme-toggle]');
    if (!btn) return;
    btn.setAttribute('aria-label', `Switch to ${theme === THEMES.DARK ? 'light' : 'dark'} mode`);
    btn.title = `Switch to ${theme === THEMES.DARK ? 'light' : 'dark'} mode`;
    btn.textContent = theme === THEMES.DARK ? '☀️' : '🌙';
  }

  function injectToggleButton() {
    const navActions = document.querySelector('.nav-actions');
    if (!navActions) return;

    const btn = document.createElement('button');
    btn.setAttribute('data-theme-toggle', '');
    btn.className = 'btn btn-ghost';
    btn.style.cssText = 'padding: 0.5rem; font-size: 18px; line-height: 1;';
    btn.addEventListener('click', () => {
      const next = document.body.dataset.theme === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK;
      applyTheme(next);
    });

    navActions.insertBefore(btn, navActions.firstChild);
  }

  document.addEventListener('DOMContentLoaded', () => {
    const theme = getCurrentTheme();
    applyTheme(theme);
    injectToggleButton();

    // Listen to system preference changes
    window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', e => {
      if (!localStorage.getItem(STORAGE_KEY)) {
        applyTheme(e.matches ? THEMES.LIGHT : THEMES.DARK);
      }
    });
  });

  // Prevent flash of wrong theme
  (function () {
    const stored = localStorage.getItem(STORAGE_KEY);
    const preferLight = window.matchMedia('(prefers-color-scheme: light)').matches;
    const theme = stored || (preferLight ? 'light' : 'dark');
    if (theme === 'light') {
      Object.entries({
        '--color-bg': '#F8F8FF',
        '--color-bg-secondary': '#EEEEF8',
        '--color-bg-card': '#FFFFFF',
        '--color-bg-elevated': '#F0F0FA',
        '--color-border': 'rgba(0,0,0,0.08)',
        '--color-border-strong': 'rgba(0,0,0,0.14)',
        '--color-text-primary': '#0F0F1A',
        '--color-text-secondary': '#4A4A6A',
        '--color-text-muted': '#8A8AAA',
      }).forEach(([k, v]) => document.documentElement.style.setProperty(k, v));
    }
  })();

})();