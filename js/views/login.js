// js/views/login.js - versão sem innerHTML nem injeção de HTML (tudo criado via DOM APIs)
import { login } from '../core/auth.js';
import { toast } from '../ui/toast.js';

/* Helpers SVG criados via createElementNS para evitar innerHTML */
const SVG_NS = 'http://www.w3.org/2000/svg';

function createSvgElement(tag, attrs = {}) {
  const el = document.createElementNS(SVG_NS, tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'textContent') el.textContent = v;
    else el.setAttribute(k, String(v));
  }
  return el;
}

function svgUser() {
  const wrapper = document.createElement('span');
  wrapper.className = 'icon';
  const svg = createSvgElement('svg', { width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none', 'aria-hidden': 'true', focusable: 'false' });
  const p1 = createSvgElement('path', { d: 'M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5z', stroke: 'currentColor', 'stroke-width': '1.4', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' });
  const p2 = createSvgElement('path', { d: 'M20 22v-1c0-2.761-2.239-5-5-5H9c-2.761 0-5 2.239-5 5v1', stroke: 'currentColor', 'stroke-width': '1.4', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' });
  svg.appendChild(p1); svg.appendChild(p2); wrapper.appendChild(svg);
  return wrapper;
}

function svgLock() {
  const wrapper = document.createElement('span');
  wrapper.className = 'icon';
  const svg = createSvgElement('svg', { width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none', 'aria-hidden': 'true', focusable: 'false' });
  const r = createSvgElement('rect', { x: 3, y: 11, width: 18, height: 11, rx: 2, stroke: 'currentColor', 'stroke-width': '1.4', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' });
  const p = createSvgElement('path', { d: 'M7 11V8a5 5 0 0110 0v3', stroke: 'currentColor', 'stroke-width': '1.4', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' });
  svg.appendChild(r); svg.appendChild(p); wrapper.appendChild(svg);
  return wrapper;
}

function svgEye() {
  const wrapper = document.createElement('span');
  wrapper.className = 'icon';
  const svg = createSvgElement('svg', { width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none', 'aria-hidden': 'true', focusable: 'false' });
  const p1 = createSvgElement('path', { d: 'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z', stroke: 'currentColor', 'stroke-width': '1.4', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' });
  const c = createSvgElement('circle', { cx: 12, cy: 12, r: 3, stroke: 'currentColor', 'stroke-width': '1.4' });
  svg.appendChild(p1); svg.appendChild(c); wrapper.appendChild(svg);
  return wrapper;
}

function svgEyeOff() {
  const wrapper = document.createElement('span');
  wrapper.className = 'icon';
  const svg = createSvgElement('svg', { width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none', 'aria-hidden': 'true', focusable: 'false' });
  const p1 = createSvgElement('path', { d: 'M17.94 17.94A10.94 10.94 0 0112 19c-6 0-10-7-10-7a20.2 20.2 0 014.3-5.3', stroke: 'currentColor', 'stroke-width': '1.4', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' });
  const p2 = createSvgElement('path', { d: 'M1 1l22 22', stroke: 'currentColor', 'stroke-width': '1.4', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' });
  svg.appendChild(p1); svg.appendChild(p2); wrapper.appendChild(svg);
  return wrapper;
}

/* Main render function - creates all nodes via DOM APIs */
export function renderLogin(outlet) {
  // ensure outlet is clean
  outlet.innerHTML = '';

  const wrapper = document.createElement('div');
  wrapper.className = 'login-wrapper';

  const card = document.createElement('div');
  card.className = 'login-card card';

  // Logo area
  const logoWrap = document.createElement('div');
  logoWrap.className = 'login-logo-wrap';
  const logo = document.createElement('div');
  logo.className = 'login-logo';

  // Prefer image asset if exists; fallback to text only if image fails
  const img = document.createElement('img');
  img.alt = 'Pandda';
  img.src = './assets/icons/logo-72.png';
  img.style.width = '100%';
  img.style.height = '100%';
  img.style.objectFit = 'cover';
  img.style.borderRadius = '10px';
  img.addEventListener('error', () => {
    // fallback: if image not found, show letter without using innerHTML
    while (logo.firstChild) logo.removeChild(logo.firstChild);
    const txt = document.createElement('div');
    txt.textContent = 'P';
    txt.style.fontWeight = '800';
    txt.style.fontSize = '28px';
    logo.appendChild(txt);
  }, { once: true });

  logo.appendChild(img);
  logoWrap.appendChild(logo);
  card.appendChild(logoWrap);

  // Header text
  const headText = document.createElement('div');
  const title = document.createElement('div');
  title.className = 'login-title';
  title.textContent = 'Acesse sua conta';
  const desc = document.createElement('div');
  desc.className = 'login-desc';
  desc.textContent = 'Use sua conta de protótipo (admin/user) para entrar.';
  headText.appendChild(title);
  headText.appendChild(desc);
  card.appendChild(headText);

  // Form
  const form = document.createElement('form');
  form.className = 'login-form';
  form.setAttribute('autocomplete', 'off');
  form.setAttribute('aria-label', 'Formulário de login');

  // Email field
  const fieldEmail = document.createElement('div');
  fieldEmail.className = 'field';
  fieldEmail.setAttribute('role', 'group');
  fieldEmail.setAttribute('aria-label', 'E-mail');
  fieldEmail.appendChild(svgUser());

  const inputEmail = document.createElement('input');
  inputEmail.type = 'email';
  inputEmail.className = 'input';
  inputEmail.name = 'email';
  inputEmail.placeholder = 'email@exemplo.com';
  inputEmail.autocomplete = 'username';
  inputEmail.required = true;
  inputEmail.value = 'admin@pandda.test';
  fieldEmail.appendChild(inputEmail);
  form.appendChild(fieldEmail);

  // Password field
  const fieldPass = document.createElement('div');
  fieldPass.className = 'field';
  fieldPass.setAttribute('role', 'group');
  fieldPass.setAttribute('aria-label', 'Senha');
  fieldPass.appendChild(svgLock());

  const inputPass = document.createElement('input');
  inputPass.type = 'password';
  inputPass.className = 'input';
  inputPass.name = 'password';
  inputPass.placeholder = 'Senha';
  inputPass.autocomplete = 'current-password';
  inputPass.required = true;
  inputPass.value = 'admin';
  fieldPass.appendChild(inputPass);

  // show/hide button (uses DOM API only)
  const showBtn = document.createElement('button');
  showBtn.type = 'button';
  showBtn.className = 'btn ghost action';
  showBtn.setAttribute('aria-label', 'Mostrar senha');
  showBtn.setAttribute('aria-pressed', 'false');
  let showing = false;
  const eyeOnEl = svgEye();
  const eyeOffEl = svgEyeOff();
  showBtn.appendChild(eyeOffEl);

  showBtn.addEventListener('click', (ev) => {
    ev.preventDefault();
    showing = !showing;
    inputPass.type = showing ? 'text' : 'password';
    showBtn.setAttribute('aria-pressed', String(showing));
    // swap icon nodes
    if (showBtn.firstChild) showBtn.removeChild(showBtn.firstChild);
    showBtn.appendChild(showing ? eyeOnEl : eyeOffEl);
  });

  fieldPass.appendChild(showBtn);
  form.appendChild(fieldPass);

  // options row (remember + error)
  const rowOptions = document.createElement('div');
  rowOptions.className = 'form-row';

  const remember = document.createElement('label');
  remember.className = 'remember';
  const cb = document.createElement('input');
  cb.type = 'checkbox';
  cb.name = 'remember';
  cb.checked = true;
  remember.appendChild(cb);
  const rbText = document.createElement('span');
  rbText.textContent = 'Manter sessão (apenas protótipo)';
  remember.appendChild(rbText);

  const errorLine = document.createElement('div');
  errorLine.className = 'login-error';

  rowOptions.appendChild(remember);
  rowOptions.appendChild(errorLine);
  form.appendChild(rowOptions);

  // actions
  const actions = document.createElement('div');
  actions.className = 'form-actions';

  const demoBtn = document.createElement('button');
  demoBtn.type = 'button';
  demoBtn.className = 'btn ghost';
  demoBtn.textContent = 'Entrar como usuário';

  const submitBtn = document.createElement('button');
  submitBtn.type = 'submit';
  submitBtn.className = 'btn primary';
  submitBtn.textContent = 'Entrar';

  actions.appendChild(demoBtn);
  actions.appendChild(submitBtn);
  form.appendChild(actions);

  // helper text
  const helper = document.createElement('div');
  helper.className = 'helper';
  helper.textContent = 'Credenciais de teste: admin@pandda.test / admin  •  user@pandda.test / user';

  card.appendChild(form);
  card.appendChild(helper);
  wrapper.appendChild(card);
  outlet.appendChild(wrapper);

  // accessibility: focus first input
  setTimeout(() => { inputEmail.focus(); }, 40);

  // submit handler
  form.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    errorLine.textContent = '';
    submitBtn.disabled = true;
    submitBtn.textContent = 'Entrando...';
    try {
      const email = inputEmail.value.trim();
      const password = inputPass.value;
      const res = await login(email, password);
      if (!res.success) {
        errorLine.textContent = res.error.message || 'Credenciais inválidas';
        toast('error', res.error.message || 'Erro no login');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Entrar';
        return;
      }
      toast('success', 'Login efetuado');
      if (window.__pandda_mountChrome) window.__pandda_mountChrome();
      location.hash = '#/clients';
    } catch (err) {
      console.error('login.submit', err);
      errorLine.textContent = 'Erro inesperado';
      toast('error', 'Erro inesperado ao tentar entrar');
      submitBtn.disabled = false;
      submitBtn.textContent = 'Entrar';
    }
  });

  demoBtn.addEventListener('click', async () => {
    demoBtn.disabled = true;
    try {
      const res = await login('user@pandda.test', 'user');
      if (!res.success) {
        toast('error', res.error.message || 'Erro no login demo');
        demoBtn.disabled = false;
        return;
      }
      toast('success', 'Logado como usuário comum');
      if (window.__pandda_mountChrome) window.__pandda_mountChrome();
      location.hash = '#/clients';
    } catch (err) {
      console.error('login.demo', err);
      toast('error', 'Erro inesperado');
      demoBtn.disabled = false;
    }
  });
}
