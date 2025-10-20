// subscription.js - data layer for subscriptions
import { MockDB } from './mockData.js';

export async function listSubscriptions() {
  try {
    return await MockDB.list('subscriptions');
  } catch (err) {
    console.error('subscription.list', err);
    return { success: false, error: { message: 'Erro ao listar assinaturas', code: 'ERR_LIST' } };
  }
}

export async function createSubscription(payload) {
  try {
    if (!payload.clienteId || !payload.planoId) {
      return { success: false, error: { message: 'Cliente e plano são obrigatórios', code: 'VALIDATION' } };
    }
    // ensure single active subscription per client in this mock: delete previous active if exists
    const all = (await MockDB.list('subscriptions')).data || [];
    const active = all.find(s => s.clienteId === payload.clienteId);
    if (active) {
      // for prototype, mark previous as expired by setting dataVencimento in the past
      await MockDB.update('subscriptions', active.id, { dataVencimento: new Date(0).toISOString() });
    }
    payload.renovacoes = payload.renovacoes || 0;
    payload.dataCriacao = new Date().toISOString();
    return await MockDB.create('subscriptions', payload);
  } catch (err) {
    console.error('subscription.create', err);
    return { success: false, error: { message: 'Erro ao criar assinatura', code: 'ERR_CREATE' } };
  }
}

export async function renewSubscription(id, { novaDataVencimento, novoPreco }) {
  try {
    const res = await MockDB.read('subscriptions', id);
    if (!res.success || !res.data) return { success: false, error: { message: 'Assinatura não encontrada' } };
    const sub = res.data;
    const patch = {
      dataVencimento: novaDataVencimento || sub.dataVencimento,
      preco: novoPreco !== undefined ? novoPreco : sub.preco,
      renovacoes: (sub.renovacoes || 0) + 1
    };
    return await MockDB.update('subscriptions', id, patch);
  } catch (err) {
    console.error('subscription.renew', err);
    return { success: false, error: { message: 'Erro ao renovar assinatura', code: 'ERR_RENEW' } };
  }
}

export async function deleteSubscription(id) {
  try {
    return await MockDB.delete('subscriptions', id);
  } catch (err) {
    console.error('subscription.delete', err);
    return { success: false, error: { message: 'Erro ao deletar assinatura', code: 'ERR_DELETE' } };
  }
}
