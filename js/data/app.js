// app.js - data layer for apps
import { MockDB } from './mockData.js';

export async function listApps() {
  try {
    return await MockDB.list('apps');
  } catch (err) {
    console.error('app.list', err);
    return { success: false, error: { message: 'Erro ao listar apps', code: 'ERR_LIST' } };
  }
}

export async function createApp(payload) {
  try {
    if (!payload.nome) return { success: false, error: { message: 'Nome é obrigatório', code: 'VALIDATION' } };
    return await MockDB.create('apps', payload);
  } catch (err) {
    console.error('app.create', err);
    return { success: false, error: { message: 'Erro ao criar app', code: 'ERR_CREATE' } };
  }
}

export async function updateApp(id, patch) {
  try {
    return await MockDB.update('apps', id, patch);
  } catch (err) {
    console.error('app.update', err);
    return { success: false, error: { message: 'Erro ao atualizar app', code: 'ERR_UPDATE' } };
  }
}

export async function deleteApp(id) {
  try {
    return await MockDB.delete('apps', id);
  } catch (err) {
    console.error('app.delete', err);
    return { success: false, error: { message: 'Erro ao deletar app', code: 'ERR_DELETE' } };
  }
}
