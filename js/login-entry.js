// js/login-entry.js
// Entry point para a página de login isolada.
// Reutiliza a renderLogin presente em js/views/login.js

import { renderLogin } from './views/login.js';

// Se desejar um wrapper mínimo para compatibilidade com renderLogin
const root = document.getElementById('login-root') || (() => {
  const el = document.createElement('div');
  el.id = 'login-root';
  document.body.appendChild(el);
  return el;
})();

// Cria um "outlet" simples para a view de login
const outlet = document.createElement('div');
outlet.id = 'outlet';
root.appendChild(outlet);

// Rendeiza a view de login
renderLogin(outlet);

// Observador opcional: se a aplicação usar redirecionamento após login, garantir que
// quando o usuário efetuar login a página navegue para index.html (SPA principal).
// A responsabilidade de navegar para index.html já está em renderLogin (chama location.hash),
// mas aqui reforçamos um fallback: se houver sucesso, ir para index.html#clients.
(function interceptMountChrome() {
  // listener custom que a view de login pode disparar (opcional)
  window.addEventListener('pandda:login-success', () => {
    // redireciona para SPA principal
    window.location.href = './index.html#/clients';
  });
})();
