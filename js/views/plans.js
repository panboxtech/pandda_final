// plans.js - view for managing plans
import { listPlans, createPlan, updatePlan, deletePlan } from '../data/plan.js';
import { openModal, textInput, numberInput, buildField } from '../core/modal.js';
import { toast } from '../ui/toast.js';
import { currentUser } from '../core/auth.js';
import { canEdit, canDelete } from '../core/access.js';

export function renderPlans(outlet) {
  const container = document.createElement('div');
  container.className = 'container';

  const header = document.createElement('div');
  header.style.display = 'flex';
  header.style.justifyContent = 'space-between';
  header.style.alignItems = 'center';
  header.style.marginBottom = '12px';

  const title = document.createElement('div');
  title.className = 'h1';
  title.textContent = 'Planos';
  header.appendChild(title);

  const addBtn = document.createElement('button');
  addBtn.className = 'btn primary';
  addBtn.textContent = 'Novo Plano';
  addBtn.addEventListener('click', onCreate);
  header.appendChild(addBtn);

  container.appendChild(header);

  const listEl = document.createElement('div');
  listEl.className = 'list card';
  listEl.style.padding = '12px';
  container.appendChild(listEl);

  outlet.appendChild(container);
  fetchAndRender();

  async function fetchAndRender() {
    listEl.innerHTML = '';
    const res = await listPlans();
    if (!res.success) {
      toast('error', res.error.message || 'Erro ao carregar planos');
      return;
    }
    const plans = res.data;
    if (!plans.length) {
      const empty = document.createElement('div');
      empty.className = 'meta';
      empty.textContent = 'Nenhum plano cadastrado.';
      listEl.appendChild(empty);
      return;
    }
    plans.forEach(p => {
      const row = document.createElement('div');
      row.className = 'list-item';
      const left = document.createElement('div');
      const name = document.createElement('div');
      name.textContent = p.nome;
      name.style.fontWeight = 600;
      left.appendChild(name);
      const meta = document.createElement('div');
      meta.className = 'meta';
      meta.textContent = `${p.telas || 0} telas • ${p.validadeEmMeses || 0} meses • R$ ${p.preco || 0}`;
      left.appendChild(meta);
      const actions = document.createElement('div');
      actions.className = 'actions';
      const user = currentUser();
      const editBtn = document.createElement('button');
      editBtn.className = 'btn small';
      editBtn.textContent = 'Editar';
      if (!canEdit(user, 'plan')) editBtn.disabled = true;
      editBtn.addEventListener('click', () => onEdit(p));
      const delBtn = document.createElement('button');
      delBtn.className = 'btn small danger';
      delBtn.textContent = 'Excluir';
      if (!canDelete(user, 'plan')) delBtn.disabled = true;
      delBtn.addEventListener('click', () => onDelete(p));
      actions.appendChild(editBtn);
      actions.appendChild(delBtn);
      row.appendChild(left);
      row.appendChild(actions);
      listEl.appendChild(row);
    });
  }

  function onCreate() {
    const user = currentUser();
    if (!canEdit(user, 'plan')) {
      toast('error', 'Você não tem permissão');
      return;
    }
    openModal({
      title: 'Novo plano',
      initialData: {},
      contentBuilder(container, initialData, helpers) {
        const nome = helpers.textInput({ name: 'nome', value: initialData.nome || '' });
        container.appendChild(helpers.buildField('Nome', nome));
        const telas = helpers.numberInput({ name: 'telas', value: initialData.telas || 1 });
        container.appendChild(helpers.buildField('Telas', telas));
        const meses = helpers.numberInput({ name: 'validadeEmMeses', value: initialData.validadeEmMeses || 1 });
        container.appendChild(helpers.buildField('Validade (meses)', meses));
        const preco = helpers.numberInput({ name: 'preco', value: initialData.preco || 0 });
        container.appendChild(helpers.buildField('Preço (R$)', preco));
        return function getData() {
          return { nome: nome.value.trim(), telas: Number(telas.value||0), validadeEmMeses: Number(meses.value||0), preco: Number(preco.value||0) };
        };
      },
      onSave: async (payload) => {
        return await createPlan(payload);
      },
      onDone: () => {
        toast('success', 'Plano criado');
        fetchAndRender();
      }
    });
  }

  function onEdit(plan) {
    const user = currentUser();
    if (!canEdit(user, 'plan')) { toast('error','Sem permissão'); return; }
    openModal({
      title: 'Editar plano',
      initialData: plan,
      contentBuilder(container, initialData, helpers) {
        const nome = helpers.textInput({ name: 'nome', value: initialData.nome || '' });
        container.appendChild(helpers.buildField('Nome', nome));
        const telas = helpers.numberInput({ name: 'telas', value: initialData.telas || 1 });
        container.appendChild(helpers.buildField('Telas', telas));
        const meses = helpers.numberInput({ name: 'validadeEmMeses', value: initialData.validadeEmMeses || 1 });
        container.appendChild(helpers.buildField('Validade (meses)', meses));
        const preco = helpers.numberInput({ name: 'preco', value: initialData.preco || 0 });
        container.appendChild(helpers.buildField('Preço (R$)', preco));
        return function getData() {
          return { nome: nome.value.trim(), telas: Number(telas.value||0), validadeEmMeses: Number(meses.value||0), preco: Number(preco.value||0), id: initialData.id };
        };
      },
      onSave: async (payload) => {
        if (!payload.id) return { success:false, error:{ message:'ID ausente' } };
        return await updatePlan(payload.id, { nome: payload.nome, telas: payload.telas, validadeEmMeses: payload.validadeEmMeses, preco: payload.preco });
      },
      onDone: () => { toast('success','Plano atualizado'); fetchAndRender(); }
    });
  }

  async function onDelete(plan) {
    const user = currentUser();
    if (!canDelete(user, 'plan')) { toast('error','Sem permissão'); return; }
    if (!confirm(`Excluir plano "${plan.nome}"?`)) return;
    const res = await deletePlan(plan.id);
    if (res.success) { toast('success','Plano excluído'); fetchAndRender(); }
    else { toast('error', res.error.message || 'Erro ao excluir'); }
  }
}
