// js/ui/topbar.js - topbar com logout que redireciona para login.html (página isolada)
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

  const left = document.createElement('div');
  left.style.display = 'flex';
  left.style.gap = '10px';
  left.style.alignItems = 'center';

  const toggleBtn = document.createElement('button');
  toggleBtn.className = 'btn';
  toggleBtn.textContent = '☰';
  toggleBtn.setAttribute('aria-label', 'Toggle sidebar');
  toggleBtn.addEventListener('click', () => {
    const sidebar = document.querySelector('aside.card');
    if (!sidebar) return;
    const hidden = sidebar.style.display === 'none';
    sidebar.style.display = hidden ? 'flex' : 'none';
  });
  left.appendChild(toggleBtn);

  const brand = document.createElement('div');
  brand.className = 'h1';
  brand.textContent = 'Pandda';
  left.appendChild(brand);

  const nav = document.createElement('div');
  nav.style.display = 'flex';
  nav.style.gap = '6px';
  const links = [
    { label: 'Clientes', path: '#/clients' },
    { label: 'Planos', path: '#/plans' },
    { label: 'Apps', path: '#/apps' },
    { label: 'Servidores', path: '#/servers' }
  ];
  links.forEach(l => {
    const b = document.createElement('button');
    b.className = 'btn';
    b.textContent = l.label;
    b.addEventListener('click', () => { location.hash = l.path; });
    nav.appendChild(b);
  });
  left.appendChild(nav);

  bar.appendChild(left);

  const right = document.createElement('div');
  right.style.display = 'flex';
  right.style.gap = '8px';
  right.style.alignItems = 'center';

  // Theme toggle UI
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
  const userBadge = document.createElement('div');
  userBadge.className = 'card';
  userBadge.style.padding = '6px 10px';
  userBadge.textContent = user ? `${user.email} (${user.role})` : 'Anônimo';
  right.appendChild(userBadge);

  const logoutBtn = document.createElement('button');
  logoutBtn.className = 'btn';
  logoutBtn.textContent = 'Sair';
  logoutBtn.addEventListener('click', async () => {
    try {
      const auth = await import('../core/auth.js');
      if (auth && typeof auth.logout === 'function') {
        await auth.logout();
      }
      // desmonta chrome se existir
      if (window.__pandda_unmountChrome) window.__pandda_unmountChrome();
      // redireciona para a página de login isolada
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
