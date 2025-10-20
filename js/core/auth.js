// auth.js - mock auth module
// exports: getSession(), login(email, password), logout(), currentUser
let _session = null;

/**
 * mock users
 * password stored plain-text only for prototype; do not do this in production
 */
const USERS = [
  { id: 'u-admin', email: 'admin@pandda.test', password: 'admin', role: 'admin', dataCadastro: new Date().toISOString() },
  { id: 'u-common', email: 'user@pandda.test', password: 'user', role: 'common', dataCadastro: new Date().toISOString() }
];

export function getSession() {
  return Promise.resolve(_session);
}

export async function login(email, password) {
  try {
    const user = USERS.find(u => u.email === email && u.password === password);
    if (!user) {
      return { success: false, error: { message: 'Credenciais inválidas', code: 'INVALID_CREDENTIALS' } };
    }
    _session = { user: { id: user.id, email: user.email, role: user.role } };
    console.info('auth: login', user.email);
    return { success: true, data: _session };
  } catch (err) {
    console.error('auth.login', err);
    return { success: false, error: { message: 'Erro interno', code: 'ERR_AUTH' } };
  }
}

export async function logout() {
  _session = null;
  return { success: true };
}

export function currentUser() {
  return _session ? _session.user : null;
}
