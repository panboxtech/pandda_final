// server.js - data layer for servers
import { MockDB } from './mockData.js';

export async function listServers() {
  try {
    return await MockDB.list('servers');
  } catch (err) {
    console.error('server.list', err);
    return { success: false, error: { message: 'Erro ao listar servidores', code: 'ERR_LIST' } };
  }
}

export async function createServer(payload) {
  try {
    if (!payload.nome) return { success: false, error: { message: 'Nome é obrigatório', code: 'VALIDATION' } };
    return await MockDB.create('servers', payload);
  } catch (err) {
    console.error('server.create', err);
    return { success: false, error: { message: 'Erro ao criar servidor', code: 'ERR_CREATE' } };
  }
}

export async function updateServer(id, patch) {
  try {
    return await MockDB.update('servers', id, patch);
  } catch (err) {
    console.error('server.update', err);
    return { success: false, error: { message: 'Erro ao atualizar servidor', code: 'ERR_UPDATE' } };
  }
}

export async function deleteServer(id) {
  try {
    // check apps referencing server and block deletion in prototype
    const appsRes = await MockDB.list('apps');
    const apps = appsRes.success ? appsRes.data : [];
    const hasApps = apps.some(a => a.serverId === id);
    if (hasApps) {
      return { success: false, error: { message: 'Servidor vinculado a apps. Remova apps primeiro.', code: 'FK_VIOLATION' } };
    }
    return await MockDB.delete('servers', id);
  } catch (err) {
    console.error('server.delete', err);
    return { success: false, error: { message: 'Erro ao deletar servidor', code: 'ERR_DELETE' } };
  }
}
