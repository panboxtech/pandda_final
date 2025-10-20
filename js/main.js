// main.js - inicializa UI, topbar, router e rota de clients integrada
import { login, currentUser, logout } from './core/auth.js';
import { createTopbar } from './ui/topbar.js';
import { initRouter, navigateTo } from './core/router.js';
import { renderPlans } from './views/plans.js';
import { renderApps } from './views/apps.js';
import { renderServers } from './views/servers.js';
import { renderClients } from './views/clients.js';
import { toast } from './ui/toast.js';

const appRoot = document.getElementById('app');

async function boot() {
  // auto-login para desenvolvimento
  await login('admin@pandda.test', 'admin');

  // topbar
  const top = createTopbar();
  document.body.insertBefore(top, appRoot);

  // outlet
  const outlet = document.createElement('div');
  outlet.id = 'outlet';
  outlet.style.padding = '18px';
  appRoot.appendChild(outlet);

  // router config
  initRouter(outlet, [
    { path: '/', render: (o) => { navigateTo('/clients'); } },
    { path: '/clients', render: (o) => renderClients(o) },
    { path: '/plans', render: (o) => renderPlans(o) },
    { path: '/apps', render: (o) => renderApps(o) },
    { path: '/servers', render: (o) => renderServers(o) }
  ]);

  // set default hash if none
  if (!location.hash) location.hash = '#/clients';
}

boot();
