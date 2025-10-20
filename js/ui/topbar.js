// topbar.js - reusable topbar that integrates with router and auth
import { navigateTo } from '../core/router.js';
import { currentUser, logout } from '../core/auth.js';
import { toast } from '../ui/toast.js';

export function createTopbar() {
  const bar = document.createElement('div');
  bar.className = 'topbar container card';
  bar.style.justifyContent = 'space-between';

  const left = document.createElement('div');
  left.style.display = 'flex';
  left.style.gap = '8px';
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
    b.addEventListener('click', () => navigateTo(l.path));
    nav.appendChild(b);
  });

  left.appendChild(nav);
  bar.appendChild(left);

  const right = document.createElement('div');
  right.style.display = 'flex';
  right.style.gap = '8px';
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
    await logout();
    toast('info', 'Sessão finalizada');
    location.reload();
  });
  right.appendChild(logoutBtn);

  bar.appendChild(right);
  return bar;
}
