// clients.js - view para gerenciar clientes (separado de main.js)
// usa modal reutilizável, data layer client.js, toasts e access checks

import { listClients, createClient, updateClient, deleteClient } from '../data/client.js';
import { openModal, textInput, emailInput, telInput, buildField } from '../core/modal.js';
import { toast } from '../ui/toast.js';
import { currentUser } from '../core/auth.js';
import { canEdit, canDelete } from '../core/access.js';

/**
 * renderClients(outlet)
 * monta UI da lista de clientes dentro do elemento outlet
 */
export function renderClients(outlet) {
  outlet.innerHTML = '';

  const container = document.createElement('div');
  container.className = 'container';

  // header
  const header = document.createElement('div');
  header.className = 'header';
  header.style.marginBottom = '12px';

  const title = document.createElement('div');
  title.className = 'h1';
  title.textContent = 'Clientes';
  header.appendChild(title);

  const user = currentUser();
  const badge = document.createElement('div');
  badge.className = 'card';
  badge.style.padding = '8px';
  badge.textContent = user ? `${user.email} (${user.role})` : 'Anônimo';
  header.appendChild(badge);

  container.appendChild(header);

  // controls
  const controls = document.createElement('div');
  controls.style.display = 'flex';
  controls.style.justifyContent = 'space-between';
  controls.style.alignItems = 'center';
  controls.style.marginBottom = '10px';

  const left = document.createElement('div');
  const refreshBtn = document.createElement('button');
  refreshBtn.className = 'btn';
  refreshBtn.textContent = 'Atualizar';
  left.appendChild(refreshBtn);
  controls.appendChild(left);

  const right = document.createElement('div');
  right.style.display = 'flex';
  right.style.gap = '8px';
  const addBtn = document.createElement('button');
  addBtn.className = 'btn primary';
  addBtn.textContent = 'Novo Cliente';
  right.appendChild(addBtn);
  controls.appendChild(right);

  container.appendChild(controls);

  // list
  const listEl = document.createElement('div');
  listEl.className = 'list card';
  listEl.style.padding = '12px';
  container.appendChild(listEl);

  outlet.appendChild(container);

  // wire actions
  refreshBtn.addEventListener('click', () => renderList());
  addBtn.addEventListener('click', onCreateClient);

  // initial render
  renderList();

  // -- functions --

  async function renderList() {
    listEl.innerHTML = '';
    const res = await listClients();
    if (!res.success) {
      toast('error', res.error.message || 'Erro ao carregar clientes');
      return;
    }
    const clients = res.data;
    if (!clients.length) {
      const empty = document.createElement('div');
      empty.className = 'meta';
      empty.textContent = 'Nenhum cliente encontrado.';
      listEl.appendChild(empty);
      return;
    }

    clients.forEach(c => {
      const row = document.createElement('div');
      row.className = 'list-item';

      const left = document.createElement('div');
      const name = document.createElement('div');
      name.textContent = c.nome;
      name.style.fontWeight = 600;
      left.appendChild(name);
      const meta = document.createElement('div');
      meta.className = 'meta';
      meta.textContent = `${c.email} • ${c.telefone || '-'}`;
      left.appendChild(meta);

      const actions = document.createElement('div');
      actions.className = 'actions';

      const user = currentUser();

      const editBtn = document.createElement('button');
      editBtn.className = 'btn small';
      editBtn.textContent = 'Editar';
      if (!canEdit(user, 'client')) editBtn.disabled = true;
      editBtn.addEventListener('click', () => onEditClient(c));

      const delBtn = document.createElement('button');
      delBtn.className = 'btn small danger';
      delBtn.textContent = 'Excluir';
      if (!canDelete(user, 'client')) delBtn.disabled = true;
      delBtn.addEventListener('click', () => onDeleteClient(c));

      actions.appendChild(editBtn);
      actions.appendChild(delBtn);

      row.appendChild(left);
      row.appendChild(actions);
      listEl.appendChild(row);
    });
  }

  function onCreateClient() {
    const user = currentUser();
    if (!canEdit(user, 'client')) {
      toast('error', 'Você não tem permissão para criar clientes');
      return;
    }
    openModal({
      title: 'Novo cliente',
      initialData: {},
      contentBuilder(container, initialData, helpers) {
        const nome = helpers.textInput({ name: 'nome', value: initialData.nome || '', placeholder: 'Nome da empresa' });
        container.appendChild(helpers.buildField('Nome', nome));

        const email = helpers.emailInput({ name: 'email', value: initialData.email || '', placeholder: 'email@exemplo.com' });
        container.appendChild(helpers.buildField('E-mail', email));

        const tel = helpers.telInput({ name: 'telefone', value: initialData.telefone || '', placeholder: '+55 63 9xxxx-xxxx' });
        container.appendChild(helpers.buildField('Telefone', tel));

        return function getData() {
          return { nome: nome.value.trim(), email: email.value.trim(), telefone: tel.value.trim() || null };
        };
      },
      onSave: async (payload) => {
        return await createClient(payload);
      },
      onDone: () => {
        toast('success', 'Cliente criado com sucesso');
        renderList();
      }
    });
  }

  function onEditClient(client) {
    const user = currentUser();
    if (!canEdit(user, 'client')) {
      toast('error', 'Você não tem permissão para editar clientes');
      return;
    }
    openModal({
      title: 'Editar cliente',
      initialData: client,
      contentBuilder(container, initialData, helpers) {
        const nome = helpers.textInput({ name: 'nome', value: initialData.nome || '' });
        container.appendChild(helpers.buildField('Nome', nome));

        const email = helpers.emailInput({ name: 'email', value: initialData.email || '' });
        container.appendChild(helpers.buildField('E-mail', email));

        const tel = helpers.telInput({ name: 'telefone', value: initialData.telefone || '' });
        container.appendChild(helpers.buildField('Telefone', tel));

        return function getData() {
          return { id: initialData.id, nome: nome.value.trim(), email: email.value.trim(), telefone: tel.value.trim() || null };
        };
      },
      onSave: async (payload) => {
        if (!payload.id) return { success: false, error: { message: 'ID ausente' } };
        return await updateClient(payload.id, { nome: payload.nome, email: payload.email, telefone: payload.telefone });
      },
      onDone: () => {
        toast('success', 'Cliente atualizado');
        renderList();
      }
    });
  }

  function onDeleteClient(client) {
    const user = currentUser();
    if (!canDelete(user, 'client')) {
      toast('error', 'Você não tem permissão para excluir');
      return;
    }
    if (!confirm(`Excluir cliente "${client.nome}"? Esta ação é irreversível.`)) return;
    deleteClient(client.id).then(res => {
      if (res.success) {
        toast('success', 'Cliente excluído');
        renderList();
      } else {
        toast('error', res.error.message || 'Erro ao excluir');
      }
    });
  }
}
