// js/main.js
// SPA principal: monta topbar + sidebar + outlet.
// Ajustado para trabalhar com sidebar overlay API (createSidebar exposes toggleOverlay/openOverlay/closeOverlay)

import { getSession } from './core/auth.js';
import { createTopbar } from './ui/topbar.js';
import { createSidebar } from './ui/sidebar.js';
import { initRouter } from './core/router.js';
import { renderClients } from './views/clients.js';
import { renderPlans } from './views/plans.js';
import { renderApps } from './views/apps.js';
import { renderServers } from './views/servers.js';
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

  // limpa app root
  appRoot.innerHTML = '';

  // Cria sidebar (não montamos no DOM ainda para controlar ordem visual)
  const sidebar = createSidebar();
  sidebar.classList.add('card'); // manter padrão visual 'card'
  chromeNodes.sidebar = sidebar;

  // Topbar - montamos antes do layout para ficar no topo.
  const topbar = createTopbar();
  document.body.insertBefore(topbar, appRoot);
  chromeNodes.topbar = topbar;

  // Layout principal (sidebar + outlet)
  const layout = document.createElement('div');
  layout.className = 'app-layout';
  layout.style.display = 'flex';
  layout.style.gap = '16px';
  layout.style.alignItems = 'flex-start';
  layout.style.justifyContent = 'center';
  layout.style.width = '100%';
  layout.style.padding = '12px 18px';
  layout.style.boxSizing = 'border-box';

  // Inserir sidebar e outlet no layout
  layout.appendChild(sidebar);

  const outlet = document.createElement('div');
  outlet.id = 'outlet';
  outlet.style.flex = '1';
  outlet.style.minWidth = '320px';
  layout.appendChild(outlet);
  chromeNodes.outlet = outlet;

  // adicionar layout abaixo do topbar
  appRoot.appendChild(layout);
  chromeNodes.layout = layout;

  // Iniciar router com rotas básicas
  initRouter(outlet, [
    { path: '/', render: (o) => { location.hash = '#/clients'; } },
    { path: '/clients', render: (o) => renderClients(o) },
    { path: '/plans', render: (o) => renderPlans(o) },
    { path: '/apps', render: (o) => renderApps(o) },
    { path: '/servers', render: (o) => renderServers(o) }
  ]);

  // Expor sidebar API globalmente para facilitar toggles (topbar usa querySelector, mas esta referência ajuda)
  window.__pandda_sidebar = sidebar;
}

function unmountChrome() {
  if (chromeNodes.topbar && chromeNodes.topbar.parentNode) chromeNodes.topbar.parentNode.removeChild(chromeNodes.topbar);
  if (chromeNodes.layout && chromeNodes.layout.parentNode) chromeNodes.layout.parentNode.removeChild(chromeNodes.layout);
  chromeNodes = { topbar: null, layout: null, sidebar: null, outlet: null };
  window.__pandda_sidebar = null;
}

async function boot() {
  // Lê sessão persistida; se não houver, vai para login isolado
  const sess = await getSession();
  if (!sess || !sess.user) {
    window.location.href = './login.html';
    return;
  }

  mountChrome();
  location.hash = '#/clients';
  toast('info', 'Sessão ativa. Bem-vindo.');
}

boot();

// Expor para topbar/logout e outros lugares
window.__pandda_unmountChrome = unmountChrome;
window.__pandda_mountChrome = mountChrome;
