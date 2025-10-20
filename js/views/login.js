// js/views/login.js - página de login (dispara montagem do chrome após sucesso)
import { login } from '../core/auth.js';
import { toast } from '../ui/toast.js';

/**
 * renderLogin(outlet)
 * monta UI de login dentro do elemento outlet
 * Após login bem-sucedido monta chrome (topbar + sidebar) e registra rotas internas via main.js
 */
export function renderLogin(outlet) {
  outlet.innerHTML = '';

  const wrapper = document.createElement('div');
  wrapper.className = 'login-wrapper';

  const card = document.createElement('div');
  card.className = 'login-card card';

  const title = document.createElement('div');
  title.className = 'login-title';
  title.textContent = 'Entrar no Pandda';
  card.appendChild(title);

  const desc = document.createElement('div');
  desc.className = 'login-desc';
  desc.textContent = 'Faça login com sua conta de protótipo (admin/user).';
  card.appendChild(desc);

  const form = document.createElement('form');
  form.setAttribute('autocomplete', 'off');

  const rowEmail = document.createElement('div');
  rowEmail.className = 'form-row';
  const labelEmail = document.createElement('label');
  labelEmail.className = 'label';
  labelEmail.textContent = 'E-mail';
  const inputEmail = document.createElement('input');
  inputEmail.className = 'input';
  inputEmail.type = 'email';
  inputEmail.name = 'email';
  inputEmail.autocomplete = 'username';
  inputEmail.required = true;
  inputEmail.value = 'admin@pandda.test';
  rowEmail.appendChild(labelEmail);
  rowEmail.appendChild(inputEmail);

  const rowPass = document.createElement('div');
  rowPass.className = 'form-row';
  const labelPass = document.createElement('label');
  labelPass.className = 'label';
  labelPass.textContent = 'Senha';
  const inputPass = document.createElement('input');
  inputPass.className = 'input';
  inputPass.type = 'password';
  inputPass.name = 'password';
  inputPass.autocomplete = 'current-password';
  inputPass.required = true;
  inputPass.value = 'admin';
  rowPass.appendChild(labelPass);
  rowPass.appendChild(inputPass);

  const rowOptions = document.createElement('div');
  rowOptions.className = 'form-row';
  const rbox = document.createElement('label');
  rbox.className = 'remember';
  const cb = document.createElement('input');
  cb.type = 'checkbox';
  cb.name = 'remember';
  cb.checked = true;
  rbox.appendChild(cb);
  const rbText = document.createElement('span');
  rbText.textContent = 'Manter sessão (apenas protótipo)';
  rbox.appendChild(rbText);
  rowOptions.appendChild(rbox);

  const errorLine = document.createElement('div');
  errorLine.className = 'login-error';

  const actions = document.createElement('div');
  actions.className = 'form-actions';
  const btnLogin = document.createElement('button');
  btnLogin.className = 'btn primary';
  btnLogin.type = 'submit';
  btnLogin.textContent = 'Entrar';
  const btnDemoUser = document.createElement('button');
  btnDemoUser.className = 'btn';
  btnDemoUser.type = 'button';
  btnDemoUser.textContent = 'Entrar como usuário';
  actions.appendChild(btnDemoUser);
  actions.appendChild(btnLogin);

  form.appendChild(rowEmail);
  form.appendChild(rowPass);
  form.appendChild(rowOptions);
  form.appendChild(errorLine);
  form.appendChild(actions);

  card.appendChild(form);
  wrapper.appendChild(card);
  outlet.appendChild(wrapper);

  // Handlers
  form.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    errorLine.textContent = '';
    btnLogin.disabled = true;
    btnLogin.textContent = 'Entrando...';
    try {
      const email = inputEmail.value.trim();
      const password = inputPass.value;
      const res = await login(email, password);
      if (!res.success) {
        errorLine.textContent = res.error.message || 'Credenciais inválidas';
        toast('error', res.error.message || 'Erro no login');
        btnLogin.disabled = false;
        btnLogin.textContent = 'Entrar';
        return;
      }
      toast('success', 'Login efetuado');
      // montar chrome e registrar rotas internas
      if (window.__pandda_mountChrome) window.__pandda_mountChrome();
      // navegar para clients
      location.hash = '#/clients';
    } catch (err) {
      console.error('login.submit', err);
      errorLine.textContent = 'Erro inesperado';
      toast('error', 'Erro inesperado ao tentar entrar');
      btnLogin.disabled = false;
      btnLogin.textContent = 'Entrar';
    }
  });

  btnDemoUser.addEventListener('click', async () => {
    btnDemoUser.disabled = true;
    try {
      const res = await login('user@pandda.test', 'user');
      if (!res.success) {
        toast('error', res.error.message || 'Erro no login demo');
        btnDemoUser.disabled = false;
        return;
      }
      toast('success', 'Logado como usuário comum');
      if (window.__pandda_mountChrome) window.__pandda_mountChrome();
      location.hash = '#/clients';
    } catch (err) {
      console.error('login.demo', err);
      toast('error', 'Erro inesperado');
      btnDemoUser.disabled = false;
    }
  });
}
