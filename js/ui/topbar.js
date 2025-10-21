// js/ui/topbar.js
// Topbar com botão de collapse ancorado à esquerda (fixo) e conteúdo centralizado/alinhado
// entre duas guias (padding-left / padding-right controláveis via CSS custom props).
// O botão de collapse não se move quando a sidebar é redimensionada ou colapsada.

import { toast } from '../ui/toast.js';

const THEME_KEY = 'pandda_theme';

function readTheme() {
  try {
    const t = localStorage.getItem(THEME_KEY);
    return t === 'light' ? 'light' : 'dark';
  } catch {
    return 'dark';
  }
}

function applyTheme(theme) {
  if (theme === 'light') document.documentElement.setAttribute('data-theme', 'light');
  else document.documentElement.removeAttribute('data-theme');
}

function toggleTheme() {
  const current = readTheme();
  const next = current === 'light' ? 'dark' : 'light';
  try { localStorage.setItem(THEME_KEY, next); } catch {}
  applyTheme(next);
  return next;
}

/**
 * createTopbar
 * - monta .topbar (full-width bar)
 * - monta botão de collapse fixo/ancorado à esquerda (.topbar-collapse-anchor)
 * - monta .topbar-inner cujo conteúdo fica alinhado entre duas guias através de CSS vars:
 *    --topbar-inner-left-guide, --topbar-inner-right-guide
 * - botão de collapse permanece fixo na viewport esquerda e não se move com resize/collapse da sidebar
 */
export function createTopbar() {
  applyTheme(readTheme());

  // root topbar element (full width)
  const bar = document.createElement('div');
  bar.className = 'topbar container card';
  bar.setAttribute('role', 'banner');
  // reduced vertical height via CSS, avoid inline height here

  // Anchor for collapse button (fixed/absolute so it doesn't move with sidebar changes)
  const collapseAnchor = document.createElement('div');
  collapseAnchor.className = 'topbar-collapse-anchor';
  collapseAnchor.setAttribute('aria-hidden', 'false');
  collapseAnchor.style.position = 'absolute';
  collapseAnchor.style.left = 'var(--topbar-collapse-left, 12px)';
  collapseAnchor.style.top = '50%';
  collapseAnchor.style.transform = 'translateY(-50%)';
  collapseAnchor.style.zIndex = '1600'; // above topbar
  collapseAnchor.style.pointerEvents = 'auto';

  // collapse button itself
  const collapseBtn = document.createElement('button');
  collapseBtn.className = 'btn topbar-collapse';
  collapseBtn.type = 'button';
  collapseBtn.title = 'Mostrar/Ocultar menu';
  collapseBtn.setAttribute('aria-pressed', 'false');
  collapseBtn.style.width = '36px';
  collapseBtn.style.height = '36px';
  collapseBtn.style.display = 'inline-flex';
  collapseBtn.style.alignItems = 'center';
  collapseBtn.style.justifyContent = 'center';
  collapseBtn.style.padding = '0';
  collapseBtn.textContent = '☰';

  collapseBtn.addEventListener('click', (ev) => {
    ev.stopPropagation();
    const sidebar = window.__pandda_sidebar || document.querySelector('aside.sidebar');
    if (!sidebar) return;

    // mobile: overlay-mode -> toggle overlay
    if (sidebar.classList.contains('overlay-mode')) {
      if (typeof sidebar.toggleOverlay === 'function') sidebar.toggleOverlay();
      return;
    }

    // desktop: toggle collapse
    const collapseControl = sidebar.querySelector('.sidebar-collapse');
    if (collapseControl) collapseControl.click();

    // reflect pressed state (toggle) after a micro delay
    setTimeout(() => {
      const pressed = sidebar.classList.contains('collapsed');
      collapseBtn.setAttribute('aria-pressed', String(pressed));
    }, 60);
  });

  collapseAnchor.appendChild(collapseBtn);

  // Inner wrapper: this is the content area that must align to the two guides
  const inner = document.createElement('div');
  inner.className = 'topbar-inner';
  inner.style.margin = '0 auto';
  inner.style.width = '100%';
  inner.style.boxSizing = 'border-box';
  // actual left/right alignment are handled in CSS using the guide vars

  // left group (brand optional)
  const left = document.createElement('div');
  left.className = 'topbar-left';
  left.style.display = 'flex';
  left.style.alignItems = 'center';
  left.style.gap = '8px';

  const brand = document.createElement('div');
  brand.className = 'topbar-brand';
  brand.textContent = 'Pandda';
  brand.style.fontWeight = '700';
  brand.style.fontSize = '14px';
  left.appendChild(brand);

  // right group (actions)
  const right = document.createElement('div');
  right.className = 'topbar-actions';
  right.style.display = 'flex';
  right.style.alignItems = 'center';
  right.style.gap = '8px';

  const themeBtn = document.createElement('button');
  themeBtn.className = 'btn topbar-theme';
  themeBtn.type = 'button';
  themeBtn.setAttribute('aria-label', 'Alternar tema');
  themeBtn.textContent = readTheme() === 'light' ? '🌞' : '🌙';
  themeBtn.addEventListener('click', () => {
    const next = toggleTheme();
    themeBtn.textContent = next === 'light' ? '🌞' : '🌙';
    toast('info', `Tema alterado para ${next === 'light' ? 'claro' : 'escuro'}`);
  });

  const logoutBtn = document.createElement('button');
  logoutBtn.className = 'btn topbar-logout';
  logoutBtn.type = 'button';
  logoutBtn.textContent = 'Sair';
  logoutBtn.addEventListener('click', async () => {
    try {
      const auth = await import('../core/auth.js');
      if (auth && typeof auth.logout === 'function') await auth.logout();
      if (window.__pandda_unmountChrome) window.__pandda_unmountChrome();
      location.href = './login.html';
      toast('info', 'Sessão finalizada');
    } catch (err) {
      console.error('topbar.logout', err);
      toast('error', 'Erro ao encerrar sessão');
    }
  });

  right.appendChild(themeBtn);
  right.appendChild(logoutBtn);

  // Assemble inner
  inner.appendChild(left);
  inner.appendChild(right);

  // Ensure bar has relative positioning so absolute anchor is placed correctly
  bar.style.position = 'relative';
  bar.appendChild(collapseAnchor);
  bar.appendChild(inner);

  // Sync function: optional, updates CSS vars based on sidebar geometry if needed
  function syncGuides() {
    // The user provided guides (two vertical lines) will map to CSS vars;
    // we do not override them automatically here; leaving control to CSS custom properties
    // but we provide an opportunity to compute fallback values based on sidebar position.
    const sidebar = window.__pandda_sidebar || document.querySelector('aside.sidebar');
    if (!sidebar) return;
    try {
      const rect = sidebar.getBoundingClientRect();
      // left guide might be a bit to the right of viewport left; set fallback
      document.documentElement.style.setProperty('--topbar-inner-left-fallback', `${Math.max(8, Math.round(rect.left + rect.width + 12))}px`);
      // right fallback keep generous spacing from right edge
      document.documentElement.style.setProperty('--topbar-inner-right-fallback', `24px`);
    } catch {}
  }

  // initial sync and resize listener for fallbacks only
  syncGuides();
  window.addEventListener('resize', syncGuides);

  return bar;
}
