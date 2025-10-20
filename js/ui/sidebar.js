// js/ui/sidebar.js - componente lateral de navegação
import { navigateTo } from '../core/router.js';
import { currentUser } from '../core/auth.js';

export function createSidebar() {
  const sidebar = document.createElement('aside');
  sidebar.className = 'card';
  sidebar.style.width = '220px';
  sidebar.style.padding = '12px';
  sidebar.style.display = 'flex';
  sidebar.style.flexDirection = 'column';
  sidebar.style.gap = '8px';
  sidebar.style.height = 'calc(100vh - 28px)';
  sidebar.style.position = 'sticky';
  sidebar.style.top = '14px';

  const user = currentUser();

  const profile = document.createElement('div');
  profile.style.marginBottom = '8px';
  const name = document.createElement('div');
  name.style.fontWeight = 700;
  name.textContent = user ? user.email : 'Anônimo';
  profile.appendChild(name);
  const role = document.createElement('div');
  role.className = 'meta';
  role.textContent = user ? `Perfil: ${user.role}` : 'Sem sessão';
  profile.appendChild(role);

  sidebar.appendChild(profile);

  const nav = document.createElement('nav');
  nav.setAttribute('role', 'navigation');
  nav.style.display = 'flex';
  nav.style.flexDirection = 'column';
  nav.style.gap = '6px';

  const links = [
    { label: 'Clientes', path: '#/clients' },
    { label: 'Planos', path: '#/plans' },
    { label: 'Apps', path: '#/apps' },
    { label: 'Servidores', path: '#/servers' },
    { label: 'Usuários', path: '#/users' }
  ];

  links.forEach(l => {
    const b = document.createElement('button');
    b.className = 'btn';
    b.style.width = '100%';
    b.style.textAlign = 'left';
    b.textContent = l.label;
    b.addEventListener('click', () => { location.hash = l.path; });
    nav.appendChild(b);
  });

  sidebar.appendChild(nav);

  const footer = document.createElement('div');
  footer.style.marginTop = 'auto';
  footer.style.fontSize = '13px';
  footer.style.color = 'var(--muted)';
  footer.textContent = 'Pandda Prototype';
  sidebar.appendChild(footer);

  return sidebar;
}
