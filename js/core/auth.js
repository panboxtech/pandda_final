// js/core/auth.js
// Auth helper minimal: persistência de sessão em localStorage e funções de login/logout/getSession.
// Mantém compatibilidade com chamadas existentes que esperam { success, user, token, error }.

const STORAGE_KEY = 'pandda_session';

/**
 * Salva o objeto de sessão no localStorage.
 * sessionObj: { user: { email, role, ... }, token?: string, expiresAt?: number }
 */
export function setSession(sessionObj) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionObj || {}));
    return true;
  } catch (e) {
    console.error('setSession', e);
    return false;
  }
}

/**
 * Recupera a sessão do localStorage.
 * Retorna null se não existir ou se o parse falhar.
 */
export function getSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.error('getSession', e);
    return null;
  }
}

/**
 * Remove a sessão do storage.
 */
export function clearSession() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (e) {
    console.error('clearSession', e);
    return false;
  }
}

/**
 * currentUser convenience: retorna user dentro da sessão ou null.
 */
export function currentUser() {
  const s = getSession();
  return s && s.user ? s.user : null;
}

/**
 * login(email, password)
 * Implementação de protótipo: aceita duas contas:
 * - admin@pandda.test / admin  -> role: admin
 * - user@pandda.test  / user   -> role: user
 *
 * Em integração real, substitua por chamada ao backend e retorne { success, user, token }.
 */
export async function login(email, password) {
  try {
    // Trim inputs
    const e = String(email || '').trim();
    const p = String(password || '');

    // Simular latência mínima
    await new Promise((r) => setTimeout(r, 120));

    // Protótipo: validação simples
    if (e === 'admin@pandda.test' && p === 'admin') {
      const user = { email: e, role: 'admin', name: 'Administrador' };
      const token = 'token-admin-000'; // placeholder
      const session = { user, token, createdAt: Date.now() };
      setSession(session);
      return { success: true, user, token, session };
    }

    if (e === 'user@pandda.test' && p === 'user') {
      const user = { email: e, role: 'user', name: 'Usuário' };
      const token = 'token-user-000';
      const session = { user, token, createdAt: Date.now() };
      setSession(session);
      return { success: true, user, token, session };
    }

    return { success: false, error: { message: 'Credenciais inválidas' } };
  } catch (err) {
    console.error('auth.login', err);
    return { success: false, error: { message: 'Erro interno' } };
  }
}

/**
 * logout: limpa sessão local e retorna sucesso.
 * Em ambiente real pode também chamar endpoint de logout remoto.
 */
export async function logout() {
  try {
    clearSession();
    // simular latência mínima
    await new Promise((r) => setTimeout(r, 60));
    return { success: true };
  } catch (err) {
    console.error('auth.logout', err);
    return { success: false, error: err };
  }
}
