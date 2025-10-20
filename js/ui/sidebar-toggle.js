// js/ui/sidebar-toggle.js - botão que alterna a visibilidade do sidebar
export function createSidebarToggle(sidebarEl) {
  const btn = document.createElement('button');
  btn.className = 'btn';
  btn.setAttribute('aria-label', 'Alternar menu lateral');
  btn.textContent = '☰';
  btn.style.fontSize = '16px';
  btn.addEventListener('click', () => {
    if (!sidebarEl) return;
    const hidden = sidebarEl.style.display === 'none';
    sidebarEl.style.display = hidden ? 'flex' : 'none';
  });
  return btn;
}
