// js/main.js - SPA principal. Assumimos login isolado em login.html.
// main.js monta o chrome apenas quando há sessão válida.
import { getSession } from './core/auth.js';
import { createTopbar } from './ui/topbar.js';
import { createSidebar } from './ui/sidebar.js';
import { initRouter } from './core/router.js';
import { renderPlans } from './views/plans.js';
import { renderApps } from './views/apps.js';
import { renderServers } from './views/servers.js';
import { renderClients } from './views/clients.js';
import { toast } from './ui/toast.js';

const appRoot = document.getElementById('app');

let chromeNodes = {
  topbar: null,
  layout: null,
  sidebar: null,
  outlet: null
};

function mountChrome() {
  if (chromeNodes.layout) return;

  appRoot.innerHTML = '';

  const topbar = createTopbar();
  document.body.insertBefore(topbar, appRoot);
  chromeNodes.topbar = topbar;

  const layout = document.createElement('div');
  layout.style.display = 'flex';
  layout.style.gap = '16px';
  layout.style.alignItems = 'flex-start';
  layout.style.justifyContent = 'center';
  layout.style.width = '100%';
  layout.style.padding = '12px 18px';

  const sidebar = createSidebar();
  layout.appendChild(sidebar);
  chromeNodes.sidebar = sidebar;

  const outlet = document.createElement('div');
  outlet.id = 'outlet';
  outlet.style.flex = '1';
  outlet.style.minWidth = '320px';
  layout.appendChild(outlet);
  chromeNodes.outlet = outlet;

  appRoot.appendChild(layout);
  chromeNodes.layout = layout;

  initRouter(outlet, [
    { path: '/', render: (o) => { location.hash = '#/clients'; } },
    { path: '/clients', render: (o) => renderClients(o) },
    { path: '/plans', render: (o) => renderPlans(o) },
    { path: '/apps', render: (o) => renderApps(o) },
    { path: '/servers', render: (o) => renderServers(o) }
  ]);
}

function unmountChrome() {
  if (chromeNodes.topbar && chromeNodes.topbar.parentNode) chromeNodes.topbar.parentNode.removeChild(chromeNodes.topbar);
  if (chromeNodes.layout && chromeNodes.layout.parentNode) chromeNodes.layout.parentNode.removeChild(chromeNodes.layout);
  chromeNodes = { topbar: null, layout: null, sidebar: null, outlet: null };
}

async function boot() {
  // SPA principal espera sessão; se não houver, redireciona para login.html
  const sess = await getSession();
  if (!sess || !sess.user) {
    // redireciona para a página isolada de login
    window.location.href = './login.html';
    return;
  }

  // montar chrome e iniciar aplicação
  mountChrome();
  location.hash = '#/clients';
  toast('info', 'Sessão ativa. Bem-vindo.');
}

boot();

// Expor unmount para topbar/logout
window.__pandda_unmountChrome = unmountChrome;
window.__pandda_mountChrome = mountChrome;
