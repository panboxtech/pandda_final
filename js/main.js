// js/main.js - gerencia login-first flow: monta chrome apenas após autenticação
import { getSession } from './core/auth.js';
import { createTopbar } from './ui/topbar.js';
import { createSidebar } from './ui/sidebar.js';
import { initRouter } from './core/router.js';
import { renderPlans } from './views/plans.js';
import { renderApps } from './views/apps.js';
import { renderServers } from './views/servers.js';
import { renderClients } from './views/clients.js';
import { renderLogin } from './views/login.js';
import { toast } from './ui/toast.js';

const appRoot = document.getElementById('app');

let chromeNodes = {
  topbar: null,
  layout: null,
  sidebar: null,
  outlet: null
};

/**
 * mountChrome
 * - Remove conteúdo atual de appRoot (garante remoção de login view)
 * - Insere topbar e layout (sidebar + outlet)
 * - Registra rotas internas usando outlet
 */
function mountChrome() {
  if (chromeNodes.layout) return; // já montado

  // limpar appRoot para remover views anteriores (ex: login)
  appRoot.innerHTML = '';

  // topbar
  const topbar = createTopbar();
  document.body.insertBefore(topbar, appRoot);
  chromeNodes.topbar = topbar;

  // layout com sidebar e outlet
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

  // registrar rotas internas apenas quando chrome montado
  initRouter(outlet, [
    { path: '/', render: (o) => { location.hash = '#/clients'; } },
    { path: '/clients', render: (o) => renderClients(o) },
    { path: '/plans', render: (o) => renderPlans(o) },
    { path: '/apps', render: (o) => renderApps(o) },
    { path: '/servers', render: (o) => renderServers(o) }
  ]);
}

/**
 * unmountChrome
 * - Remove topbar e layout (sidebar + outlet)
 * - Não toca no restante do document
 */
function unmountChrome() {
  if (chromeNodes.topbar && chromeNodes.topbar.parentNode) chromeNodes.topbar.parentNode.removeChild(chromeNodes.topbar);
  if (chromeNodes.layout && chromeNodes.layout.parentNode) chromeNodes.layout.parentNode.removeChild(chromeNodes.layout);
  chromeNodes = { topbar: null, layout: null, sidebar: null, outlet: null };
}

/**
 * mountLoginRouteOnly
 * - Limpa appRoot e registra apenas rota /login dentro de um novo outlet
 */
function mountLoginRouteOnly() {
  // limpar appRoot primeiro para garantir que nenhum chrome esteja presente
  appRoot.innerHTML = '';

  const outlet = document.createElement('div');
  outlet.id = 'outlet';
  appRoot.appendChild(outlet);

  initRouter(outlet, [
    { path: '/', render: (o) => { location.hash = '#/login'; } },
    { path: '/login', render: (o) => renderLogin(o) }
  ]);
}

/**
 * boot
 * - Inicializa aplicacao em modo "login-first"
 * - Se houver sessao ativa (persistida), monta o chrome imediatamente
 */
async function boot() {
  // Inicial: montar apenas rota de login (garante login visível apenas quando não autenticado)
  mountLoginRouteOnly();

  // Se já há sessão persistida, montar chrome e rotas internas
  const sess = await getSession();
  if (sess && sess.user) {
    mountChrome();
    // navegar para clients por segurança
    location.hash = '#/clients';
    toast('info', 'Sessão ativa. Redirecionando...');
    return;
  }

  // garantir rota de login
  if (!location.hash || location.hash === '#/') location.hash = '#/login';
}

boot();

// Expor funções para uso em views/login.js e topbar.js via window
window.__pandda_mountChrome = mountChrome;
window.__pandda_unmountChrome = unmountChrome;
window.__pandda_mountLoginRouteOnly = mountLoginRouteOnly;
