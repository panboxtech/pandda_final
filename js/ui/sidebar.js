// js/ui/sidebar.js
// Sidebar responsiva: overlay em telas pequenas e comportamento colapsável (apenas ícones).
// Fecha ao clicar fora (backdrop) em overlay-mode.
// O botão de collapse não cria overlay nem bloqueia interação com a página.

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
  collapseBtn.addEventListener('click', () => {
    // collapse must only toggle collapsed state, never overlay or backdrop
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

  // backdrop element (managed by this module) to detect outside clicks
  let backdrop = null;
  function ensureBackdrop() {
    if (backdrop) return;
    backdrop = document.createElement('div');
    backdrop.className = 'sidebar-backdrop';
    backdrop.setAttribute('aria-hidden', 'true');
    backdrop.addEventListener('click', (e) => {
      // click on backdrop closes overlay
      closeOverlay();
    });
    document.body.appendChild(backdrop);
  }

  // open/close overlay
  function openOverlay() {
    ensureBackdrop();
    requestAnimationFrame(() => {
      document.body.classList.add('sidebar-overlay-active');
      aside.classList.add('sidebar-overlay-open');
      // ensure focus lands on overlay close button for accessibility
      overlayClose.focus();
    });
    // trap focus basic: listen for Esc to close
    window.addEventListener('keydown', escHandler);
  }

  function closeOverlay() {
    aside.classList.remove('sidebar-overlay-open');
    document.body.classList.remove('sidebar-overlay-active');
    window.removeEventListener('keydown', escHandler);
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
      // clear collapsed state when switching to overlay for clarity
      aside.classList.remove('collapsed');
    } else {
      aside.classList.remove('overlay-mode');
      aside.classList.remove('sidebar-overlay-open');
      document.body.classList.remove('sidebar-overlay-active');
      // remove backdrop if present (non-overlay desktop)
      if (backdrop && backdrop.parentNode) {
        backdrop.parentNode.removeChild(backdrop);
        backdrop = null;
      }
    }
  }

  // init
  window.addEventListener('resize', onResize);
  onResize();

  return aside;
}
