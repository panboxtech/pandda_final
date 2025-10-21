// js/ui/sidebar.js
// Sidebar responsiva: overlay em telas pequenas e comportamento colapsável (apenas ícones).
// Backdrop/overlay controlado estritamente: backdrop existe somente quando overlay-mode + open.
// Collapse não cria overlay nem backdrop; overlay fecha ao clicar fora ou pressionar Esc.

export function createSidebar() {
  const aside = document.createElement('aside');
  aside.className = 'sidebar card';
  aside.setAttribute('aria-label', 'Navegação');

  // container interno
  const inner = document.createElement('nav');
  inner.className = 'sidebar-inner';
  aside.appendChild(inner);

  // brand
  const brand = document.createElement('div');
  brand.className = 'sidebar-brand';
  brand.textContent = 'Pandda';
  inner.appendChild(brand);

  // nav list
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
      if (aside.classList.contains('sidebar-overlay-open')) {
        // close only if overlay mode
        closeOverlay();
      }
    });

    li.appendChild(btn);
    ul.appendChild(li);
  });

  inner.appendChild(ul);

  // controls container
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
    // collapse must only toggle collapsed state, never create overlay/backdrop
    const collapsed = aside.classList.toggle('collapsed');
    collapseBtn.setAttribute('aria-pressed', String(collapsed));
    collapseBtn.textContent = collapsed ? '▶' : '◀';
    // ensure no overlay/backdrop remains when collapsing
    if (!aside.classList.contains('overlay-mode')) return;
    // if currently overlay-open, do not convert collapse into a blocking overlay
    if (aside.classList.contains('sidebar-overlay-open')) {
      // keep overlay open but ensure backdrop stays behind and interactive only outside sidebar
      // nothing else required here since overlay/backdrop are managed explicitly
    }
  });

  ctrl.appendChild(collapseBtn);
  inner.appendChild(ctrl);

  // overlay close button (visible in overlay mode)
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

  // backdrop element (created only when overlay open)
  let backdrop = null;
  function createBackdrop() {
    if (backdrop) return;
    backdrop = document.createElement('div');
    backdrop.className = 'sidebar-backdrop';
    backdrop.setAttribute('aria-hidden', 'true');
    // clicking backdrop closes overlay
    backdrop.addEventListener('click', () => closeOverlay());
    // insert just before the sidebar in DOM for proper stacking (backdrop behind sidebar)
    document.body.appendChild(backdrop);
  }

  function removeBackdrop() {
    if (!backdrop) return;
    if (backdrop.parentNode) backdrop.parentNode.removeChild(backdrop);
    backdrop = null;
  }

  // open/close overlay
  function openOverlay() {
    // only allowed when overlay-mode is active
    if (!aside.classList.contains('overlay-mode')) {
      // switch to overlay-mode if needed (fallback)
      aside.classList.add('overlay-mode');
    }
    createBackdrop();
    // small delay to allow CSS transitions
    requestAnimationFrame(() => {
      document.body.classList.add('sidebar-overlay-active');
      aside.classList.add('sidebar-overlay-open');
      // focus on close button for accessibility
      overlayClose.focus();
    });
    window.addEventListener('keydown', escHandler);
  }

  function closeOverlay() {
    aside.classList.remove('sidebar-overlay-open');
    document.body.classList.remove('sidebar-overlay-active');
    window.removeEventListener('keydown', escHandler);
    // remove backdrop after CSS transition to avoid click-capture issues
    // use a small timeout matched to CSS transition (220ms)
    setTimeout(() => {
      // only remove if overlay still closed
      if (!aside.classList.contains('sidebar-overlay-open')) removeBackdrop();
    }, 240);
  }

  function escHandler(e) {
    if (e.key === 'Escape') closeOverlay();
  }

  // Expose methods for external toggles
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
      aside.classList.remove('collapsed'); // reset collapsed in overlay
    } else {
      aside.classList.remove('overlay-mode');
      aside.classList.remove('sidebar-overlay-open');
      document.body.classList.remove('sidebar-overlay-active');
      removeBackdrop();
    }
  }

  window.addEventListener('resize', onResize);
  onResize();

  return aside;
}
