// js/ui/topbar.js
// Toggle do menu agora abre overlay somente se sidebar estiver em overlay-mode
import { toast } from '../ui/toast.js';

export function createTopbar() {
  const bar = document.createElement('div');
  bar.className = 'topbar container card';
  bar.style.display = 'flex';
  bar.style.justifyContent = 'space-between';
  bar.style.alignItems = 'center';
  bar.style.padding = '10px 16px';
  bar.setAttribute('role', 'banner');

  const left = document.createElement('div');
  left.style.display = 'flex';
  left.style.gap = '10px';
  left.style.alignItems = 'center';

  const toggleBtn = document.createElement('button');
  toggleBtn.className = 'btn';
  toggleBtn.textContent = '☰';
  toggleBtn.setAttribute('aria-label', 'Abrir menu');
  toggleBtn.addEventListener('click', () => {
    const sidebar = window.__pandda_sidebar || document.querySelector('aside.card.sidebar');
    if (!sidebar) return;
    // only open overlay if in overlay-mode (mobile)
    if (sidebar.classList.contains('overlay-mode')) {
      if (typeof sidebar.toggleOverlay === 'function') sidebar.toggleOverlay();
      else {
        // fallback toggle display
        if (sidebar.style.display === 'none') sidebar.style.display = 'flex'; else sidebar.style.display = 'none';
      }
      return;
    }
    // desktop: toggle collapsed state instead of overlay
    // simulate user click on collapse button to keep behavior consistent
    const collapseBtn = sidebar.querySelector('.sidebar-collapse');
    if (collapseBtn) collapseBtn.click();
  });
  left.appendChild(toggleBtn);

  const brand = document.createElement('div');
  brand.className = 'h1';
  brand.textContent = 'Pandda';
  left.appendChild(brand);

  bar.appendChild(left);

  const right = document.createElement('div');
  right.style.display = 'flex';
  right.style.gap = '8px';
  right.style.alignItems = 'center';

  const themeBtn = document.createElement('button');
  themeBtn.className = 'btn';
  themeBtn.setAttribute('aria-label', 'Alternar tema');
  themeBtn.textContent = '🌙';
  themeBtn.addEventListener('click', () => {
    // simple toggle demonstration
    const next = document.documentElement.hasAttribute('data-theme') ? '' : 'light';
    if (next) document.documentElement.setAttribute('data-theme', next); else document.documentElement.removeAttribute('data-theme');
    toast('info', 'Tema alternado');
  });
  right.appendChild(themeBtn);

  const logoutBtn = document.createElement('button');
  logoutBtn.className = 'btn';
  logoutBtn.textContent = 'Sair';
  logoutBtn.addEventListener('click', () => {
    // prefer existing logout flow in your app
    if (window.__pandda_unmountChrome) window.__pandda_unmountChrome();
    location.href = './login.html';
  });
  right.appendChild(logoutBtn);

  bar.appendChild(right);

  return bar;
}
