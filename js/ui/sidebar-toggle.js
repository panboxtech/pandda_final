// sidebar-toggle.js - simple helper to show/hide a sidebar element
export function createSidebarToggle(sidebarEl) {
  const btn = document.createElement('button');
  btn.className = 'btn';
  btn.textContent = '☰';
  btn.addEventListener('click', () => {
    if (!sidebarEl) return;
    const hidden = sidebarEl.getAttribute('data-hidden') === 'true';
    sidebarEl.style.display = hidden ? 'block' : 'none';
    sidebarEl.setAttribute('data-hidden', hidden ? 'false' : 'true');
  });
  return btn;
}
