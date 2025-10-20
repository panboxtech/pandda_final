// user.js - data layer for users (prototype uses auth.js for session)
// Minimal functions to list and manage users (admin only)
import { MockDB } from './mockData.js';

export async function listUsers() {
  try {
    return await MockDB.list('users');
  } catch (err) {
    console.error('user.list', err);
    return { success: false, error: { message: 'Erro ao listar usuários', code: 'ERR_LIST' } };
  }
}

export async function createUser(payload) {
  try {
    if (!payload.email || !payload.role) return { success: false, error: { message: 'Email e role obrigatórios', code: 'VALIDATION' } };
    return await MockDB.create('users', payload);
  } catch (err) {
    console.error('user.create', err);
    return { success: false, error: { message: 'Erro ao criar usuário', code: 'ERR_CREATE' } };
  }
}

export async function updateUser(id, patch) {
  try {
    return await MockDB.update('users', id, patch);
  } catch (err) {
    console.error('user.update', err);
    return { success: false, error: { message: 'Erro ao atualizar usuário', code: 'ERR_UPDATE' } };
  }
}

export async function deleteUser(id) {
  try {
    return await MockDB.delete('users', id);
  } catch (err) {
    console.error('user.delete', err);
    return { success: false, error: { message: 'Erro ao deletar usuário', code: 'ERR_DELETE' } };
  }
}
