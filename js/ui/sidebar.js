// js/ui/sidebar.js
// Sidebar responsiva: desktop sem overlay; collapse minimiza para ícones e oculta a marca.
// Mobile mantém overlay; backdrop criado somente em overlay-mode.
export function createSidebar() {
  const aside = document.createElement('aside');
  aside.className = 'sidebar card';
  aside.setAttribute('aria-label', 'Navegação');

  const inner = document.createElement('nav');
  inner.className = 'sidebar-inner';
  aside.appendChild(inner);

  const brand = document.createElement('div');
  brand.className = 'sidebar-brand';
  brand.textContent = 'Pandda';
  inner.appendChild(brand);

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
      location.hash = it.path;
      // se estiver em overlay-mode e aberto, fechar
      if (aside.classList.contains('sidebar-overlay-open')) closeOverlay();
    });

    li.appendChild(btn);
    ul.appendChild(li);
  });

  inner.appendChild(ul);

  const ctrl = document.createElement('div');
  ctrl.className = 'sidebar-controls';

  const collapseBtn = document.createElement('button');
  collapseBtn.className = 'btn sidebar-collapse';
  collapseBtn.type = 'button';
  collapseBtn.setAttribute('aria-pressed', 'false');
  collapseBtn.title = 'Ocultar/mostrar rótulos';
  collapseBtn.textContent = '◀';
  collapseBtn.addEventListener('click', (ev) => {
    ev.stopPropagation();
    const collapsed = aside.classList.toggle('collapsed');
    collapseBtn.setAttribute('aria-pressed', String(collapsed));
    collapseBtn.textContent = collapsed ? '▶' : '◀';

    // no desktop, quando colapsar, ocultar a marca para ficar apenas ícone
    if (!aside.classList.contains('overlay-mode')) {
      if (collapsed) aside.classList.add('brand-hidden'); else aside.classList.remove('brand-hidden');
    }
  });

  ctrl.appendChild(collapseBtn);
  inner.appendChild(ctrl);

  const overlayClose = document.createElement('button');
  overlayClose.className = 'sidebar-overlay-close';
  overlayClose.type = 'button';
  overlayClose.title = 'Fechar menu';
  overlayClose.textContent = '✕';
  overlayClose.addEventListener('click', (e) => {
    e.stopPropagation();
    closeOverlay();
  });
  aside.appendChild(overlayClose);

  // backdrop will be created only when opening overlay-mode
  let backdrop = null;
  function createBackdrop() {
    if (backdrop) return;
    backdrop = document.createElement('div');
    backdrop.className = 'sidebar-backdrop';
    backdrop.setAttribute('aria-hidden', 'true');
    backdrop.addEventListener('click', () => closeOverlay());
    document.body.appendChild(backdrop);
  }
  function removeBackdrop() {
    if (!backdrop) return;
    if (backdrop.parentNode) backdrop.parentNode.removeChild(backdrop);
    backdrop = null;
  }

  function openOverlay() {
    // only allow overlay if overlay-mode active; if not, enable overlay-mode then open (fallback)
    if (!aside.classList.contains('overlay-mode')) aside.classList.add('overlay-mode');
    createBackdrop();
    requestAnimationFrame(() => {
      document.body.classList.add('sidebar-overlay-active');
      aside.classList.add('sidebar-overlay-open');
      overlayClose.focus();
    });
    window.addEventListener('keydown', escHandler);
  }

  function closeOverlay() {
    aside.classList.remove('sidebar-overlay-open');
    document.body.classList.remove('sidebar-overlay-active');
    window.removeEventListener('keydown', escHandler);
    setTimeout(() => {
      if (!aside.classList.contains('sidebar-overlay-open')) removeBackdrop();
    }, 240);
  }

  function escHandler(e) {
    if (e.key === 'Escape') closeOverlay();
  }

  aside.openOverlay = openOverlay;
  aside.closeOverlay = closeOverlay;
  aside.toggleOverlay = () => { if (aside.classList.contains('sidebar-overlay-open')) closeOverlay(); else openOverlay(); };

  // responsive: overlay-mode only on mobile
  function onResize() {
    const mobile = window.innerWidth <= 520;
    if (mobile) {
      aside.classList.add('overlay-mode');
      aside.classList.remove('collapsed');
      aside.classList.remove('brand-hidden');
    } else {
      // desktop: no overlay behavior
      aside.classList.remove('overlay-mode');
      aside.classList.remove('sidebar-overlay-open');
      document.body.classList.remove('sidebar-overlay-active');
      removeBackdrop();
      // keep collapsed state effect on brand
      if (aside.classList.contains('collapsed')) aside.classList.add('brand-hidden');
      else aside.classList.remove('brand-hidden');
    }
  }

  window.addEventListener('resize', onResize);
  onResize();

  return aside;
}
