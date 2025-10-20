// plan.js - data layer for plans (uses MockDB)
import { MockDB } from './mockData.js';

export async function listPlans() {
  try {
    return await MockDB.list('plans');
  } catch (err) {
    console.error('plan.list', err);
    return { success: false, error: { message: 'Erro ao listar planos', code: 'ERR_LIST' } };
  }
}

export async function createPlan(payload) {
  try {
    if (!payload.nome || !payload.preco) {
      return { success: false, error: { message: 'Nome e preço são obrigatórios', code: 'VALIDATION' } };
    }
    return await MockDB.create('plans', payload);
  } catch (err) {
    console.error('plan.create', err);
    return { success: false, error: { message: 'Erro ao criar plano', code: 'ERR_CREATE' } };
  }
}

export async function updatePlan(id, patch) {
  try {
    return await MockDB.update('plans', id, patch);
  } catch (err) {
    console.error('plan.update', err);
    return { success: false, error: { message: 'Erro ao atualizar plano', code: 'ERR_UPDATE' } };
  }
}

export async function deletePlan(id) {
  try {
    return await MockDB.delete('plans', id);
  } catch (err) {
    console.error('plan.delete', err);
    return { success: false, error: { message: 'Erro ao deletar plano', code: 'ERR_DELETE' } };
  }
}

export async function getPlan(id) {
  try {
    return await MockDB.read('plans', id);
  } catch (err) {
    console.error('plan.get', err);
    return { success: false, error: { message: 'Erro ao obter plano', code: 'ERR_GET' } };
  }
}
