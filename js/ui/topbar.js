// js/ui/topbar.js
// Topbar que usa um wrapper interno (.topbar-inner) alinhado ao início da sidebar.
// O wrapper ajusta sua margin-left dinamicamente conforme a largura da sidebar.
// Toggle do menu: abre overlay no mobile (overlay-mode) e colapsa a sidebar no desktop.

import { toast } from '../ui/toast.js';

const THEME_KEY = 'pandda_theme';

function readTheme() {
  try {
    const t = localStorage.getItem(THEME_KEY);
    return t === 'light' ? 'light' : 'dark';
  } catch (e) {
    return 'dark';
  }
}

function applyTheme(theme) {
  try {
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  } catch (e) {
    console.error('applyTheme', e);
  }
}

function toggleTheme() {
  const current = readTheme();
  const next = current === 'light' ? 'dark' : 'light';
  try {
    localStorage.setItem(THEME_KEY, next);
  } catch (e) {
    console.error('theme.save', e);
  }
  applyTheme(next);
  return next;
}

/**
 * Update CSS custom properties used to align .topbar-inner with the sidebar.
 * Reads the current sidebar element (window.__pandda_sidebar or querySelector).
 */
function syncTopbarWithSidebar() {
  const sidebar = window.__pandda_sidebar || document.querySelector('aside.sidebar');
  const root = document.documentElement;
  // Defaults
  let leftOffset = 14; // matches sidebar margin left default
  let sidebarWidth = 220;
  let collapsedWidth = 64;

  if (sidebar && sidebar.getBoundingClientRect) {
    const rect = sidebar.getBoundingClientRect();
    // compute left offset relative to viewport left (use rect.left)
    leftOffset = Math.max(0, Math.round(rect.left));
    // prefer CSS width when available
    sidebarWidth = Math.round(rect.width) || sidebarWidth;
    // collapsed width fallback from class
    if (sidebar.classList.contains('collapsed')) {
      collapsedWidth = Math.round(rect.width) || collapsedWidth;
    }
  }

  root.style.setProperty('--sidebar-left-offset', `${leftOffset}px`);
  root.style.setProperty('--sidebar-width', `${sidebarWidth}px`);
  root.style.setProperty('--sidebar-collapsed-width', `${collapsedWidth}px`);
}

export function createTopbar() {
  applyTheme(readTheme());
  // container (full-width bar)
  const bar = document.createElement('div');
  bar.className = 'topbar container card';
  bar.style.position = 'sticky';
  bar.style.top = '0';
  bar.style.left = '0';
  bar.style.zIndex = '1500';
  bar.setAttribute('role', 'banner');

  // inner wrapper that will be aligned with the sidebar start
  const inner = document.createElement('div');
  inner.className = 'topbar-inner';
  inner.style.display = 'flex';
  inner.style.alignItems = 'center';
  inner.style.justifyContent = 'space-between';
  inner.style.gap = '12px';
  inner.style.padding = '10px 18px';
  inner.style.boxSizing = 'border-box';
  // allow the inner to expand beyond previous max constraints
  inner.style.maxWidth = 'none';
  inner.style.width = '100%';

  // left group (toggle + brand)
  const left = document.createElement('div');
  left.style.display = 'flex';
  left.style.gap = '10px';
  left.style.alignItems = 'center';

  const toggleBtn = document.createElement('button');
  toggleBtn.className = 'btn';
  toggleBtn.textContent = '☰';
  toggleBtn.setAttribute('aria-label', 'Abrir menu');
  toggleBtn.addEventListener('click', () => {
    const sidebar = window.__pandda_sidebar || document.querySelector('aside.sidebar');
    if (!sidebar) return;

    // mobile: overlay-mode -> open overlay
    if (sidebar.classList.contains('overlay-mode')) {
      if (typeof sidebar.toggleOverlay === 'function') {
        sidebar.toggleOverlay();
      } else {
        // fallback: toggle display
        sidebar.style.display = sidebar.style.display === 'none' ? 'flex' : 'none';
      }
      return;
    }

    // desktop: toggle collapsed state (simulate collapse button click)
    const collapseBtn = sidebar.querySelector('.sidebar-collapse');
    if (collapseBtn) collapseBtn.click();
    // sync CSS variables after collapse toggle (delay to allow DOM changes)
    setTimeout(syncTopbarWithSidebar, 80);
  });
  left.appendChild(toggleBtn);

  const brand = document.createElement('div');
  brand.className = 'h1';
  brand.textContent = 'Pandda';
  // brand sits inside inner so it aligns with sidebar start
  left.appendChild(brand);

  // right group (theme + logout)
  const right = document.createElement('div');
  right.style.display = 'flex';
  right.style.gap = '8px';
  right.style.alignItems = 'center';

  const themeBtn = document.createElement('button');
  themeBtn.className = 'btn';
  themeBtn.setAttribute('aria-label', 'Alternar tema');
  themeBtn.textContent = readTheme() === 'light' ? '🌞' : '🌙';
  themeBtn.addEventListener('click', () => {
    const next = toggleTheme();
    themeBtn.textContent = next === 'light' ? '🌞' : '🌙';
    toast('info', `Tema alterado para ${next === 'light' ? 'claro' : 'escuro'}`);
  });
  right.appendChild(themeBtn);

  const logoutBtn = document.createElement('button');
  logoutBtn.className = 'btn';
  logoutBtn.textContent = 'Sair';
  logoutBtn.addEventListener('click', async () => {
    try {
      const auth = await import('../core/auth.js');
      if (auth && typeof auth.logout === 'function') {
        await auth.logout();
      }
      if (window.__pandda_unmountChrome) window.__pandda_unmountChrome();
      location.href = './login.html';
      toast('info', 'Sessão finalizada');
    } catch (err) {
      console.error('topbar.logout', err);
      toast('error', 'Erro ao encerrar sessão');
    }
  });
  right.appendChild(logoutBtn);

  // assemble inner
  inner.appendChild(left);
  inner.appendChild(right);
  bar.appendChild(inner);

  // initial sync and listeners to keep alignment correct
  syncTopbarWithSidebar();
  // keep in sync on resize and on sidebar changes
  window.addEventListener('resize', syncTopbarWithSidebar);
  // if sidebar is mounted later, try sync after short delay
  setTimeout(syncTopbarWithSidebar, 120);

  return bar;
}
