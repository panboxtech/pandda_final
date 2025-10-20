// toast.js - simple toast system
// exports: toast(type, message, options)
const TOAST_TIMEOUT = 3500;

function createContainer() {
  let c = document.getElementById('toast-container');
  if (c) return c;
  c = document.createElement('div');
  c.id = 'toast-container';
  c.style.position = 'fixed';
  c.style.right = '20px';
  c.style.top = '20px';
  c.style.zIndex = 1500;
  c.style.display = 'flex';
  c.style.flexDirection = 'column';
  c.style.gap = '8px';
  document.body.appendChild(c);
  return c;
}

export function toast(type = 'info', message = '', { persistent = false } = {}) {
  const container = createContainer();
  const el = document.createElement('div');
  el.className = 'card';
  el.style.padding = '10px 12px';
  el.style.minWidth = '220px';
  el.style.borderLeft = `4px solid ${type === 'error' ? 'var(--danger)' : type === 'success' ? 'var(--success)' : 'var(--accent)'}`;

  const text = document.createElement('div');
  text.textContent = message;
  text.style.color = 'var(--text)';
  el.appendChild(text);

  container.appendChild(el);
  if (!persistent) {
    setTimeout(() => {
      if (el.parentNode) container.removeChild(el);
    }, TOAST_TIMEOUT);
  }
  return el;
}
