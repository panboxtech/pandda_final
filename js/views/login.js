// js/views/login.js
// Renderiza a página de login usando apenas DOM APIs (sem innerHTML).
// Agora persiste explicitamente a sessão via setSession/getSession em core/auth.js
import { login, setSession } from '../core/auth.js';
import { toast } from '../ui/toast.js';

const SVG_NS = 'http://www.w3.org/2000/svg';

function createSvg(tag, attrs = {}) {
  const el = document.createElementNS(SVG_NS, tag);
  for (const [k, v] of Object.entries(attrs)) {
    el.setAttribute(k, String(v));
  }
  return el;
}

function iconWrapper(svgEl) {
  const span = document.createElement('span');
  span.className = 'icon';
  span.appendChild(svgEl);
  return span;
}

function svgUser() {
  const svg = createSvg('svg', { width: '16', height: '16', viewBox: '0 0 24 24', fill: 'none', 'aria-hidden': 'true', focusable: 'false' });
  svg.appendChild(createSvg('path', { d: 'M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5z', stroke: 'currentColor', 'stroke-width': '1.4', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }));
  svg.appendChild(createSvg('path', { d: 'M20 22v-1c0-2.761-2.239-5-5-5H9c-2.761 0-5 2.239-5 5v1', stroke: 'currentColor', 'stroke-width': '1.4', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }));
  return iconWrapper(svg);
}

function svgLock() {
  const svg = createSvg('svg', { width: '16', height: '16', viewBox: '0 0 24 24', fill: 'none', 'aria-hidden': 'true', focusable: 'false' });
  svg.appendChild(createSvg('rect', { x: '3', y: '11', width: '18', height: '11', rx: '2', stroke: 'currentColor', 'stroke-width': '1.4', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }));
  svg.appendChild(createSvg('path', { d: 'M7 11V8a5 5 0 0110 0v3', stroke: 'currentColor', 'stroke-width': '1.4', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }));
  return iconWrapper(svg);
}

function svgEye() {
  const svg = createSvg('svg', { width: '16', height: '16', viewBox: '0 0 24 24', fill: 'none', 'aria-hidden': 'true', focusable: 'false' });
  svg.appendChild(createSvg('path', { d: 'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z', stroke: 'currentColor', 'stroke-width': '1.4', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }));
  svg.appendChild(createSvg('circle', { cx: '12', cy: '12', r: '3', stroke: 'currentColor', 'stroke-width': '1.4' }));
  return iconWrapper(svg);
}

function svgEyeOff() {
  const svg = createSvg('svg', { width: '16', height: '16', viewBox: '0 0 24 24', fill: 'none', 'aria-hidden': 'true', focusable: 'false' });
  svg.appendChild(createSvg('path', { d: 'M17.94 17.94A10.94 10.94 0 0112 19c-6 0-10-7-10-7a20.2 20.2 0 014.3-5.3', stroke: 'currentColor', 'stroke-width': '1.4', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }));
  svg.appendChild(createSvg('path', { d: 'M1 1l22 22', stroke: 'currentColor', 'stroke-width': '1.4', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }));
  return iconWrapper(svg);
}

export function renderLogin(outlet) {
  if (!outlet) return;

  // Clear outlet
  while (outlet.firstChild) outlet.removeChild(outlet.firstChild);

  // Wrapper
  const wrapper = document.createElement('div');
  wrapper.className = 'login-wrapper';

  // Card
  const card = document.createElement('div');
  card.className = 'login-card card';
  card.setAttribute('role', 'main');

  // Logo wrap
  const logoWrap = document.createElement('div');
  logoWrap.className = 'login-logo-wrap';
  const logo = document.createElement('div');
  logo.className = 'login-logo';

  const logoImg = document.createElement('img');
  logoImg.src = './assets/icons/logo-72.png';
  logoImg.alt = 'Pandda';
  logoImg.addEventListener('error', () => {
    while (logo.firstChild) logo.removeChild(logo.firstChild);
    const fallback = document.createElement('div');
    fallback.textContent = 'P';
    fallback.style.fontWeight = '800';
    fallback.style.fontSize = '28px';
    fallback.style.color = '#03212e';
    logo.appendChild(fallback);
  }, { once: true });

  logoImg.width = 72;
  logoImg.height = 72;
  logo.appendChild(logoImg);
  logoWrap.appendChild(logo);
  card.appendChild(logoWrap);

  // Header text
  const head = document.createElement('div');
  const title = document.createElement('div');
  title.className = 'login-title';
  title.textContent = 'Acesse sua conta';
  const desc = document.createElement('div');
  desc.className = 'login-desc';
  desc.textContent = 'Use sua conta de protótipo (admin/user) para entrar.';
  head.appendChild(title);
  head.appendChild(desc);
  card.appendChild(head);

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
  inputEmail.setAttribute('aria-label', 'E-mail');
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
  inputPass.setAttribute('aria-label', 'Senha');
  fieldPass.appendChild(inputPass);

  // Show/hide password button
  const showBtn = document.createElement('button');
  showBtn.type = 'button';
  showBtn.className = 'btn ghost action';
  showBtn.setAttribute('aria-label', 'Mostrar senha');
  showBtn.setAttribute('aria-pressed', 'false');
  let showing = false;
  const eyeOn = svgEye();
  const eyeOff = svgEyeOff();
  showBtn.appendChild(eyeOff);

  showBtn.addEventListener('click', (ev) => {
    ev.preventDefault();
    showing = !showing;
    inputPass.type = showing ? 'text' : 'password';
    showBtn.setAttribute('aria-pressed', String(showing));
    if (showBtn.firstChild) showBtn.removeChild(showBtn.firstChild);
    showBtn.appendChild(showing ? eyeOn : eyeOff);
  });

  fieldPass.appendChild(showBtn);
  form.appendChild(fieldPass);

  // Remember + error row
  const rowOptions = document.createElement('div');
  rowOptions.className = 'form-row';

  const remember = document.createElement('label');
  remember.className = 'remember';
  remember.setAttribute('for', 'remember-cb');

  const cb = document.createElement('input');
  cb.type = 'checkbox';
  cb.id = 'remember-cb';
  cb.name = 'remember';
  cb.checked = true;
  cb.setAttribute('aria-label', 'Manter sessão');
  remember.appendChild(cb);

  const rbText = document.createElement('span');
  rbText.textContent = 'Manter sessão (apenas protótipo)';
  remember.appendChild(rbText);
  rowOptions.appendChild(remember);

  const errorLine = document.createElement('div');
  errorLine.className = 'login-error';
  errorLine.setAttribute('aria-live', 'polite');
  rowOptions.appendChild(errorLine);

  form.appendChild(rowOptions);

  // Actions
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

  // Helper text
  const helper = document.createElement('div');
  helper.className = 'helper';
  helper.textContent = 'Credenciais de teste: admin@pandda.test / admin  •  user@pandda.test / user';

  card.appendChild(form);
  card.appendChild(helper);
  wrapper.appendChild(card);
  outlet.appendChild(wrapper);

  // Focus first input (non-blocking)
  setTimeout(() => inputEmail.focus(), 40);

  // Form submit handler
  form.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    errorLine.textContent = '';
    submitBtn.disabled = true;
    submitBtn.textContent = 'Entrando...';
    try {
      const email = String(inputEmail.value || '').trim();
      const password = String(inputPass.value || '');
      const res = await login(email, password);
      if (!res || !res.success) {
        const msg = (res && res.error && res.error.message) ? res.error.message : 'Credenciais inválidas';
        errorLine.textContent = msg;
        toast('error', msg);
        submitBtn.disabled = false;
        submitBtn.textContent = 'Entrar';
        return;
      }

      // Persistir sessão explicitamente (formato compatível com core/auth.setSession)
      try {
        const sessionPayload = res.session || { user: res.user || null, token: res.token || null };
        setSession(sessionPayload);
      } catch (e) {
        console.error('persist.session', e);
      }

      toast('success', 'Login efetuado');

      // Emitir evento para listeners (login-entry.js usa esse evento para redirecionar)
      try {
        window.dispatchEvent(new CustomEvent('pandda:login-success', { detail: { user: res.user || null } }));
      } catch (e) { /* ignore */ }

      // Se SPA já disponível, monte o chrome; caso contrário redirecione para index.html
      if (window.__pandda_mountChrome) {
        window.__pandda_mountChrome();
        location.hash = '#/clients';
      } else {
        location.href = './index.html#/clients';
      }
    } catch (err) {
      console.error('login.submit', err);
      errorLine.textContent = 'Erro inesperado';
      toast('error', 'Erro inesperado ao tentar entrar');
      submitBtn.disabled = false;
      submitBtn.textContent = 'Entrar';
    }
  });

  // Demo login handler
  demoBtn.addEventListener('click', async () => {
    demoBtn.disabled = true;
    try {
      const res = await login('user@pandda.test', 'user');
      if (!res || !res.success) {
        toast('error', (res && res.error && res.error.message) ? res.error.message : 'Erro no login demo');
        demoBtn.disabled = false;
        return;
      }

      try {
        const sessionPayload = res.session || { user: res.user || null, token: res.token || null };
        setSession(sessionPayload);
      } catch (e) {
        console.error('persist.session.demo', e);
      }

      toast('success', 'Logado como usuário comum');

      try {
        window.dispatchEvent(new CustomEvent('pandda:login-success', { detail: { user: res.user || null } }));
      } catch (e) {}

      if (window.__pandda_mountChrome) {
        window.__pandda_mountChrome();
        location.hash = '#/clients';
      } else {
        location.href = './index.html#/clients';
      }
    } catch (err) {
      console.error('login.demo', err);
      toast('error', 'Erro inesperado');
      demoBtn.disabled = false;
    }
  });
}
