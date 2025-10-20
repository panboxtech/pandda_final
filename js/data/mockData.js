// mockData.js - in-memory DB with localStorage fallback
// exports: MockDB object with simple CRUD: create(table, item), read(table, id), update(table, id, patch), delete(table, id), list(table)
const STORAGE_KEY = 'pandda_mockdb_v1';

const defaultState = {
  clients: [
    { id: 'c-1', nome: 'ACME Ltda', telefone: '+55 63 99999-0000', email: 'contato@acme.test', assinaturaId: null, dataCadastro: new Date().toISOString() },
    { id: 'c-2', nome: 'Beta SA', telefone: '+55 63 98888-1111', email: 'hello@beta.test', assinaturaId: null, dataCadastro: new Date().toISOString() }
  ],
  plans: [],
  subscriptions: [],
  apps: [],
  servers: []
};

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return JSON.parse(JSON.stringify(defaultState));
    return JSON.parse(raw);
  } catch (err) {
    console.error('mockdb.load', err);
    return JSON.parse(JSON.stringify(defaultState));
  }
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error('mockdb.save', err);
  }
}

let state = loadState();

function makeId(prefix = 'id') {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

export const MockDB = {
  async list(table) {
    await delay();
    return { success: true, data: (state[table] || []).slice() };
  },
  async create(table, item) {
    await delay();
    const id = item.id || makeId(table.slice(0,3));
    const record = Object.assign({}, item, { id, dataCadastro: item.dataCadastro || new Date().toISOString() });
    state[table] = state[table] || [];
    state[table].push(record);
    saveState(state);
    return { success: true, data: record };
  },
  async read(table, id) {
    await delay();
    const rec = (state[table] || []).find(r => r.id === id) || null;
    return { success: true, data: rec };
  },
  async update(table, id, patch) {
    await delay();
    const idx = (state[table] || []).findIndex(r => r.id === id);
    if (idx === -1) return { success: false, error: { message: 'Registro não encontrado', code: 'NOT_FOUND' } };
    state[table][idx] = Object.assign({}, state[table][idx], patch);
    saveState(state);
    return { success: true, data: state[table][idx] };
  },
  async delete(table, id) {
    await delay();
    const idx = (state[table] || []).findIndex(r => r.id === id);
    if (idx === -1) return { success: false, error: { message: 'Registro não encontrado', code: 'NOT_FOUND' } };
    const removed = state[table].splice(idx, 1)[0];
    saveState(state);
    return { success: true, data: removed };
  }
};

function delay() {
  return new Promise(resolve => setTimeout(resolve, 180));
}
