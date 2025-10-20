// router.js - minimal client router
// API: initRouter(routes) where routes is [{ path, render }]
// supports simple hash routes like #/clients, #/plans
const routes = [];
let outlet = null;

export function initRouter(rootEl, routeList) {
  outlet = rootEl;
  routes.splice(0, routes.length, ...routeList);
  window.addEventListener('hashchange', handleRoute);
  handleRoute();
}

function matchRoute(hash) {
  const path = hash.replace(/^#/, '') || '/';
  return routes.find(r => r.path === path) || null;
}

function handleRoute() {
  const hash = location.hash || '#/';
  const route = matchRoute(hash);
  if (!route) {
    outlet.innerHTML = '';
    const el = document.createElement('div');
    el.textContent = 'Rota não encontrada';
    outlet.appendChild(el);
    return;
  }
  outlet.innerHTML = '';
  try {
    route.render(outlet);
  } catch (err) {
    console.error('router.render', err);
    const errEl = document.createElement('div');
    errEl.textContent = 'Erro ao renderizar página';
    outlet.appendChild(errEl);
  }
}

export function navigateTo(path) {
  location.hash = path;
}
