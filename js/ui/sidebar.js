// js/ui/sidebar.js
// Sidebar responsiva: overlay em telas pequenas e comport. colapsável (apenas ícones).
// Não exibe informação de usuário. Exporta createSidebar() que monta o elemento.

export function createSidebar() {
  const aside = document.createElement('aside');
  aside.className = 'sidebar card';
  aside.setAttribute('aria-label', 'Navegação');

  // container interno para facilitar transições
  const inner = document.createElement('nav');
  inner.className = 'sidebar-inner';
  aside.appendChild(inner);

  // brand / logo reduzido
  const brand = document.createElement('div');
  brand.className = 'sidebar-brand';
  brand.textContent = 'Pandda';
  inner.appendChild(brand);

  // nav list: apenas botões de entidade (clientes/plans/apps/servers)
  const ul = document.createElement('ul');
  ul.className = 'sidebar-list';

  const items = [
    { id: 'clients', label: 'Clientes', icon: '👥', path: '#/clients' },
    { id: 'plans', label: 'Planos', icon: '📦', path: '#/plans' },
    { id: 'apps', label: 'Apps', icon: '🧩', path: '#/apps' },
    { id: 'servers', label: 'Servidores', icon: '🖥️', path: '#/servers' }
  ];

  items.forEach(it => {
    const li = document.createElement('li');
    li.className = 'sidebar-item';
    const btn = document.createElement('button');
    btn.className = 'sidebar-btn';
    btn.type = 'button';
    btn.dataset.path = it.path;

    const spanIcon = document.createElement('span');
    spanIcon.className = 'sidebar-icon';
    spanIcon.textContent = it.icon;
    btn.appendChild(spanIcon);

    const spanLabel = document.createElement('span');
    spanLabel.className = 'sidebar-label';
    spanLabel.textContent = it.label;
    btn.appendChild(spanLabel);

    btn.addEventListener('click', () => {
      // navegação via hash
      location.hash = it.path;
      // em overlay mode, fechar ao navegar
      if (aside.classList.contains('sidebar-overlay-open')) {
        closeOverlay();
      }
    });

    li.appendChild(btn);
    ul.appendChild(li);
  });

  inner.appendChild(ul);

  // collapse control (toggle between expanded and icons-only)
  const ctrl = document.createElement('div');
  ctrl.className = 'sidebar-controls';

  const collapseBtn = document.createElement('button');
  collapseBtn.className = 'btn sidebar-collapse';
  collapseBtn.type = 'button';
  collapseBtn.setAttribute('aria-pressed', 'false');
  collapseBtn.title = 'Ocultar/mostrar rótulos';
  collapseBtn.textContent = '◀';
  collapseBtn.addEventListener('click', () => {
    const collapsed = aside.classList.toggle('collapsed');
    collapseBtn.setAttribute('aria-pressed', String(collapsed));
    collapseBtn.textContent = collapsed ? '▶' : '◀';
  });

  ctrl.appendChild(collapseBtn);
  inner.appendChild(ctrl);

  // overlay close button (visible in overlay mode)
  const overlayClose = document.createElement('button');
  overlayClose.className = 'sidebar-overlay-close';
  overlayClose.type = 'button';
  overlayClose.title = 'Fechar menu';
  overlayClose.textContent = '✕';
  overlayClose.addEventListener('click', closeOverlay);
  aside.appendChild(overlayClose);

  // helper functions to open/close overlay
  function openOverlay() {
    document.body.classList.add('sidebar-overlay-active');
    aside.classList.add('sidebar-overlay-open');
    // trap focus optionally
    overlayClose.focus();
  }
  function closeOverlay() {
    aside.classList.remove('sidebar-overlay-open');
    document.body.classList.remove('sidebar-overlay-active');
  }

  // Expose methods on element for external toggles (topbar)
  aside.openOverlay = openOverlay;
  aside.closeOverlay = closeOverlay;
  aside.toggleOverlay = () => {
    if (aside.classList.contains('sidebar-overlay-open')) closeOverlay(); else openOverlay();
  };

  // Responsive behavior: overlay on small screens
  function onResize() {
    const mobile = window.innerWidth <= 520;
    if (mobile) {
      aside.classList.add('overlay-mode');
      aside.classList.remove('collapsed');
    } else {
      aside.classList.remove('overlay-mode');
      aside.classList.remove('sidebar-overlay-open');
      document.body.classList.remove('sidebar-overlay-active');
    }
  }

  window.addEventListener('resize', onResize);
  onResize();

  return aside;
}
