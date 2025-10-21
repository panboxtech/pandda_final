// js/ui/topbar.js - topbar simplificado: menu toggle, marca, tema, logout.
// O toggle do menu agora tenta usar a API do sidebar (toggleOverlay) se disponível,
// caso contrário usa fallback de style.display toggle.
import { currentUser } from '../core/auth.js';
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

export function createTopbar() {
  applyTheme(readTheme());

  const bar = document.createElement('div');
  bar.className = 'topbar container card';
  bar.style.justifyContent = 'space-between';
  bar.style.alignItems = 'center';
  bar.style.display = 'flex';
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
    // Preferir API do sidebar exposta globalmente
    const sidebar = window.__pandda_sidebar || document.querySelector('aside.card');
    if (!sidebar) return;

    // Se existir função toggleOverlay use-a (overlay-friendly)
    if (typeof sidebar.toggleOverlay === 'function') {
      sidebar.toggleOverlay();
      return;
    }

    // fallback: alterna visibilidade
    const hidden = sidebar.style.display === 'none';
    sidebar.style.display = hidden ? 'flex' : 'none';
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
  themeBtn.textContent = readTheme() === 'light' ? '🌞' : '🌙';
  themeBtn.addEventListener('click', () => {
    const next = toggleTheme();
    themeBtn.textContent = next === 'light' ? '🌞' : '🌙';
    toast('info', `Tema alterado para ${next === 'light' ? 'claro' : 'escuro'}`);
  });
  right.appendChild(themeBtn);

  const user = currentUser();
  // removemos exibição de usuário na topbar (solicitado exibir somente na sidebar - que foi também removida)
  // manter espaço para possíveis ações futuras (notificações, etc.)
  const spacer = document.createElement('div');
  spacer.style.minWidth = '8px';
  right.appendChild(spacer);

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

  bar.appendChild(right);

  return bar;
}
