// js/ui/topbar.js - topbar integrado com logout que desmonta o chrome e retorna à rota de login
import { currentUser } from '../core/auth.js';
import { toast } from '../ui/toast.js';

/**
 * createTopbar()
 * - Cria a topbar sem assumir referências externas diretas.
 * - O listener de logout usa window.__pandda_unmountChrome e window.__pandda_mountLoginRouteOnly
 *   definidos em main.js para desmontar chrome e restaurar rota de login sem reload.
 */
export function createTopbar() {
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
      // importar logout dinamicamente evita ciclo de dependência
      const auth = await import('../core/auth.js');
      if (auth && typeof auth.logout === 'function') {
        await auth.logout();
      }
      // desmonta chrome (topbar + sidebar + outlet) e restaura apenas rota de login
      if (window.__pandda_unmountChrome) window.__pandda_unmountChrome();
      if (window.__pandda_mountLoginRouteOnly) window.__pandda_mountLoginRouteOnly();
      // navega para login sem reload
      location.hash = '#/login';
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
