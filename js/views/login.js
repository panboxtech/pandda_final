// js/views/login.js - página de login refinada, com ícones e mostrar senha
import { login } from '../core/auth.js';
import { toast } from '../ui/toast.js';

/**
 * Pequenas funções utilitárias para criar SVGs inline
 */
function svgUser() {
  const s = document.createElement('span');
  s.className = 'icon';
  s.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
    <path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5z" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M20 22v-1c0-2.761-2.239-5-5-5H9c-2.761 0-5 2.239-5 5v1" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;
  return s;
}
function svgLock() {
  const s = document.createElement('span');
  s.className = 'icon';
  s.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
    <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M7 11V8a5 5 0 0110 0v3" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;
  return s;
}
function svgEye() {
  const s = document.createElement('span');
  s.className = 'icon';
  s.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
    <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.4"/>
  </svg>`;
  return s;
}
function svgEyeOff() {
  const s = document.createElement('span');
  s.className = 'icon';
  s.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
    <path d="M17.94 17.94A10.94 10.94 0 0112 19c-6 0-10-7-10-7a20.2 20.2 0 014.3-5.3" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M1 1l22 22" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;
  return s;
}

/**
 * Render the login view inside the provided outlet element.
 * - builds accessible inputs with icons
 * - includes show/hide password button
 * - on success calls window.__pandda_mountChrome() if available and navigates to #/clients
 */
export function renderLogin(outlet) {
  outlet.innerHTML = '';

  const wrapper = document.createElement('div');
  wrapper.className = 'login-wrapper';

  const card = document.createElement('div');
  card.className = 'login-card card';

  // Header with logo
  const brand = document.createElement('div');
  brand.className = 'login-brand';
  const logo = document.createElement('div');
  logo.className = 'login-logo';
  logo.textContent = 'P';
  logo.setAttribute('aria-hidden', 'true');
  brand.appendChild(logo);

  const headText = document.createElement('div');
  const title = document.createElement('div');
  title.className = 'login-title';
  title.textContent = 'Acesse sua conta';
  const desc = document.createElement('div');
  desc.className = 'login-desc';
  desc.textContent = 'Use sua conta de protótipo (admin/user) para entrar.';
  headText.appendChild(title);
  headText.appendChild(desc);
  brand.appendChild(headText);

  card.appendChild(brand);

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
  const iconUser = svgUser();
  iconUser.style.color = 'var(--muted)';
  fieldEmail.appendChild(iconUser);

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

  // Password field with show/hide
  const fieldPass = document.createElement('div');
  fieldPass.className = 'field';
  fieldPass.setAttribute('role', 'group');
  fieldPass.setAttribute('aria-label', 'Senha');
  const iconLock = svgLock();
  iconLock.style.color = 'var(--muted)';
  fieldPass.appendChild(iconLock);

  const inputPass = document.createElement('input');
  inputPass.type = 'password';
  inputPass.className = 'input';
  inputPass.name = 'password';
  inputPass.placeholder = 'Senha';
  inputPass.autocomplete = 'current-password';
  inputPass.required = true;
  inputPass.value = 'admin';
  fieldPass.appendChild(inputPass);

  const showBtn = document.createElement('button');
  showBtn.type = 'button';
  showBtn.className = 'btn ghost action';
  showBtn.setAttribute('aria-label', 'Mostrar senha');
  let showing = false;
  const eyeOn = svgEye();
  const eyeOff = svgEyeOff();
  showBtn.appendChild(eyeOff);
  showBtn.addEventListener('click', (ev) => {
    ev.preventDefault();
    showing = !showing;
    inputPass.type = showing ? 'text' : 'password';
    showBtn.innerHTML = '';
    showBtn.appendChild(showing ? eyeOn : eyeOff);
    showBtn.setAttribute('aria-pressed', String(showing));
  });
  fieldPass.appendChild(showBtn);

  form.appendChild(fieldPass);

  // Remember and error
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
  rowOptions.appendChild(remember);

  const errorLine = document.createElement('div');
  errorLine.className = 'login-error';
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

  // Accessibility: focus first input
  setTimeout(() => inputEmail.focus(), 40);

  // Handlers
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
      // montar chrome e rotas internas via main.js
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
