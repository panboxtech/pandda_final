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

// refresh-control.js (insira no final de js/login-entry.js ou importe e execute)
(function attachLoginRefresh() {
  // criar botão
  const btn = document.createElement('button');
  btn.className = 'login-refresh';
  btn.setAttribute('aria-label', 'Recarregar página');
  btn.title = 'Recarregar';
  btn.type = 'button';
  btn.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
      <path d="M21 12a9 9 0 10-2.6 6.1" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"></path>
      <path d="M21 3v6h-6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"></path>
    </svg>
  `;

  // inserir no DOM
  document.body.appendChild(btn);

  // apenas mostrar em telas pequenas
  function isMobileView() {
    return window.innerWidth <= 520;
  }

  // controlar visibilidade: aparecerá com fade top→down quando em mobile
  function updateVisibility() {
    if (isMobileView()) {
      // delay leve para não aparecer instantaneamente ao carregar
      requestAnimationFrame(() => {
        setTimeout(() => btn.classList.add('show'), 80);
      });
    } else {
      btn.classList.remove('show');
    }
  }

  // estado de "carregando" (gira o ícone)
  function setLoading(on) {
    if (on) {
      btn.classList.add('loading');
      btn.setAttribute('aria-busy', 'true');
      // prevenir múltiplos cliques
      btn.disabled = true;
    } else {
      btn.classList.remove('loading');
      btn.removeAttribute('aria-busy');
      btn.disabled = false;
    }
  }

  // clique: anima, espera 300ms para feedback visual e recarrega
  btn.addEventListener('click', async (ev) => {
    ev.preventDefault();
    if (btn.classList.contains('loading')) return;
    setLoading(true);
    // pequeno debounce visual antes de reload
    setTimeout(() => {
      // recarregar mantendo hash / query
      window.location.reload();
    }, 220);
  });

  // ajustar visibilidade ao redimensionar
  window.addEventListener('resize', updateVisibility);
  // inicial
  updateVisibility();

  // opcional: se quiser que o botão desapareça após navegação completa, remover listener
  // Exemplo: ouvir evento de rota e esconder até próxima página, se necessário.
})();

