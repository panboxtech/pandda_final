// client.js - data layer for clients
// exports: listClients(), createClient(payload), updateClient(id,payload), deleteClient(id), getClient(id)

import { MockDB } from './mockData.js';

export async function listClients() {
  try {
    return await MockDB.list('clients');
  } catch (err) {
    console.error('client.list', err);
    return { success: false, error: { message: 'Erro ao listar clientes', code: 'ERR_LIST' } };
  }
}

export async function createClient(payload) {
  try {
    // basic validation
    if (!payload.nome || !payload.email) {
      return { success: false, error: { message: 'Nome e e-mail são obrigatórios', code: 'VALIDATION' } };
    }
    return await MockDB.create('clients', payload);
  } catch (err) {
    console.error('client.create', err);
    return { success: false, error: { message: 'Erro ao criar cliente', code: 'ERR_CREATE' } };
  }
}

export async function updateClient(id, patch) {
  try {
    return await MockDB.update('clients', id, patch);
  } catch (err) {
    console.error('client.update', err);
    return { success: false, error: { message: 'Erro ao atualizar cliente', code: 'ERR_UPDATE' } };
  }
}

export async function deleteClient(id) {
  try {
    return await MockDB.delete('clients', id);
  } catch (err) {
    console.error('client.delete', err);
    return { success: false, error: { message: 'Erro ao deletar cliente', code: 'ERR_DELETE' } };
  }
}

export async function getClient(id) {
  try {
    return await MockDB.read('clients', id);
  } catch (err) {
    console.error('client.get', err);
    return { success: false, error: { message: 'Erro ao obter cliente', code: 'ERR_GET' } };
  }
}
