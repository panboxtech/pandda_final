// js/ui/topbar.js
// Topbar otimizada: barra praticamente full-width horizontal, altura reduzida,
// botão de collapse à esquerda (junto ao início da sidebar), conteúdo à direita.
// Mantém função de toggle que abre overlay no mobile e colapsa no desktop.

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
 * Sincroniza variáveis de CSS relativas à sidebar.
 * Usado pelo layout para alinhar e ajustar margens quando sidebar muda.
 */
function syncTopbarWithSidebar() {
  const sidebar = window.__pandda_sidebar || document.querySelector('aside.sidebar');
  const root = document.documentElement;
  let leftOffset = 14;
  let sidebarWidth = 220;
  let collapsedWidth = 64;

  if (sidebar && sidebar.getBoundingClientRect) {
    const rect = sidebar.getBoundingClientRect();
    leftOffset = Math.max(0, Math.round(rect.left));
    sidebarWidth = Math.round(rect.width) || sidebarWidth;
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

  // topbar container (full width)
  const bar = document.createElement('div');
  bar.className = 'topbar container card';
  // Make bar full-width visually and reduce vertical size
  bar.style.position = 'sticky';
  bar.style.top = '0';
  bar.style.left = '0';
  bar.style.width = '100%';
  bar.style.zIndex = '1500';
  bar.style.boxSizing = 'border-box';
  bar.style.height = '44px'; // reduced vertical height
  bar.style.minHeight = '44px';
  bar.style.display = 'flex';
  bar.style.alignItems = 'center';
  bar.setAttribute('role', 'banner');

  // inner wrapper that holds content; allow it to stretch horizontally
  const inner = document.createElement('div');
  inner.className = 'topbar-inner';
  inner.style.display = 'flex';
  inner.style.alignItems = 'center';
  inner.style.justifyContent = 'space-between';
  inner.style.width = '100%';
  inner.style.padding = '6px 12px'; // small vertical padding keeps reduced height
  inner.style.gap = '8px';
  inner.style.boxSizing = 'border-box';
  inner.style.maxWidth = 'none';

  // Left group contains the collapse/toggle button aligned to the far left edge
  const left = document.createElement('div');
  left.style.display = 'flex';
  left.style.alignItems = 'center';
  left.style.gap = '8px';

  // Collapse/toggle button - moved to the very left and made compact
  const toggleBtn = document.createElement('button');
  toggleBtn.className = 'btn topbar-toggle';
  toggleBtn.type = 'button';
  toggleBtn.setAttribute('aria-label', 'Abrir menu');
  toggleBtn.style.height = '32px';
  toggleBtn.style.width = '36px';
  toggleBtn.style.display = 'inline-flex';
  toggleBtn.style.alignItems = 'center';
  toggleBtn.style.justifyContent = 'center';
  toggleBtn.style.padding = '0';
  toggleBtn.style.fontSize = '16px';
  toggleBtn.textContent = '☰';

  toggleBtn.addEventListener('click', () => {
    const sidebar = window.__pandda_sidebar || document.querySelector('aside.sidebar');
    if (!sidebar) return;
    // Mobile overlay behavior
    if (sidebar.classList.contains('overlay-mode')) {
      if (typeof sidebar.toggleOverlay === 'function') {
        sidebar.toggleOverlay();
      } else {
        sidebar.style.display = sidebar.style.display === 'none' ? 'flex' : 'none';
      }
      return;
    }
    // Desktop: collapse sidebar (simulate click in collapse button)
    const collapseBtn = sidebar.querySelector('.sidebar-collapse');
    if (collapseBtn) collapseBtn.click();
    // Sync CSS variables shortly after
    setTimeout(syncTopbarWithSidebar, 80);
  });

  left.appendChild(toggleBtn);

  // Brand is optional in inner; keep small and not tall to preserve reduced height
  const brand = document.createElement('div');
  brand.className = 'topbar-brand';
  brand.textContent = 'Pandda';
  brand.style.fontSize = '14px';
  brand.style.fontWeight = '700';
  brand.style.lineHeight = '1';
  brand.style.whiteSpace = 'nowrap';
  brand.style.marginLeft = '6px';
  left.appendChild(brand);

  // Right group contains actions (theme, logout) compacted
  const right = document.createElement('div');
  right.style.display = 'flex';
  right.style.alignItems = 'center';
  right.style.gap = '8px';

  const themeBtn = document.createElement('button');
  themeBtn.className = 'btn';
  themeBtn.type = 'button';
  themeBtn.setAttribute('aria-label', 'Alternar tema');
  themeBtn.style.height = '32px';
  themeBtn.style.padding = '0 8px';
  themeBtn.textContent = readTheme() === 'light' ? '🌞' : '🌙';
  themeBtn.addEventListener('click', () => {
    const next = toggleTheme();
    themeBtn.textContent = next === 'light' ? '🌞' : '🌙';
    toast('info', `Tema alterado para ${next === 'light' ? 'claro' : 'escuro'}`);
  });
  right.appendChild(themeBtn);

  const logoutBtn = document.createElement('button');
  logoutBtn.className = 'btn';
  logoutBtn.type = 'button';
  logoutBtn.textContent = 'Sair';
  logoutBtn.style.height = '32px';
  logoutBtn.style.padding = '0 10px';
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

  // Assemble
  inner.appendChild(left);
  inner.appendChild(right);
  bar.appendChild(inner);

  // initial sync and listeners
  syncTopbarWithSidebar();
  window.addEventListener('resize', syncTopbarWithSidebar);
  setTimeout(syncTopbarWithSidebar, 120);

  return bar;
}
