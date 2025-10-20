// servers.js - view for servers
import { listServers, createServer, updateServer, deleteServer } from '../data/server.js';
import { openModal, textInput, buildField } from '../core/modal.js';
import { toast } from '../ui/toast.js';
import { currentUser } from '../core/auth.js';
import { canEdit, canDelete } from '../core/access.js';

export async function renderServers(outlet) {
  const container = document.createElement('div');
  container.className = 'container';
  const header = document.createElement('div');
  header.style.display = 'flex';
  header.style.justifyContent = 'space-between';
  header.style.alignItems = 'center';
  header.style.marginBottom = '12px';
  const title = document.createElement('div');
  title.className = 'h1';
  title.textContent = 'Servidores';
  header.appendChild(title);
  const addBtn = document.createElement('button');
  addBtn.className = 'btn primary';
  addBtn.textContent = 'Novo Servidor';
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
    const res = await listServers();
    if (!res.success) { toast('error', res.error.message || 'Erro ao carregar servidores'); return; }
    const servers = res.data;
    if (!servers.length) { const empty = document.createElement('div'); empty.className='meta'; empty.textContent='Nenhum servidor cadastrado.'; listEl.appendChild(empty); return; }
    servers.forEach(s => {
      const row = document.createElement('div'); row.className='list-item';
      const left = document.createElement('div'); const name = document.createElement('div'); name.textContent = s.nome; name.style.fontWeight = 600; left.appendChild(name);
      const meta = document.createElement('div'); meta.className='meta'; meta.textContent = s.alias ? `Alias: ${s.alias}` : 'Sem alias'; left.appendChild(meta);
      const actions = document.createElement('div'); actions.className='actions';
      const user = currentUser();
      const editBtn = document.createElement('button'); editBtn.className='btn small'; editBtn.textContent='Editar'; if(!canEdit(user,'server')) editBtn.disabled=true; editBtn.addEventListener('click', ()=>onEdit(s));
      const delBtn = document.createElement('button'); delBtn.className='btn small danger'; delBtn.textContent='Excluir'; if(!canDelete(user,'server')) delBtn.disabled=true; delBtn.addEventListener('click', ()=>onDelete(s));
      actions.appendChild(editBtn); actions.appendChild(delBtn);
      row.appendChild(left); row.appendChild(actions); listEl.appendChild(row);
    });
  }

  function onCreate() {
    const user = currentUser();
    if (!canEdit(user, 'server')) { toast('error','Sem permissão'); return; }
    openModal({
      title: 'Novo Servidor',
      initialData: {},
      contentBuilder: (container, initialData, helpers) => {
        const nome = helpers.textInput({ name:'nome', value: initialData.nome || '' });
        container.appendChild(helpers.buildField('Nome', nome));
        const alias = helpers.textInput({ name:'alias', value: initialData.alias || '' });
        container.appendChild(helpers.buildField('Alias', alias));
        return () => ({ nome: nome.value.trim(), alias: alias.value.trim() || null });
      },
      onSave: async (payload) => await createServer(payload),
      onDone: () => { toast('success','Servidor criado'); fetchAndRender(); }
    });
  }

  function onEdit(server) {
    const user = currentUser();
    if (!canEdit(user, 'server')) { toast('error','Sem permissão'); return; }
    openModal({
      title: 'Editar Servidor',
      initialData: server,
      contentBuilder: (container, initialData, helpers) => {
        const nome = helpers.textInput({ name:'nome', value: initialData.nome || '' });
        container.appendChild(helpers.buildField('Nome', nome));
        const alias = helpers.textInput({ name:'alias', value: initialData.alias || '' });
        container.appendChild(helpers.buildField('Alias', alias));
        return () => ({ id: initialData.id, nome: nome.value.trim(), alias: alias.value.trim() || null });
      },
      onSave: async (payload) => {
        if (!payload.id) return { success:false, error:{ message:'ID ausente' } };
        return await updateServer(payload.id, { nome: payload.nome, alias: payload.alias });
      },
      onDone: () => { toast('success','Servidor atualizado'); fetchAndRender(); }
    });
  }

  async function onDelete(server) {
    const user = currentUser();
    if (!canDelete(user, 'server')) { toast('error','Sem permissão'); return; }
    if (!confirm(`Excluir servidor "${server.nome}"?`)) return;
    const res = await deleteServer(server.id);
    if (res.success) { toast('success','Servidor excluído'); fetchAndRender(); } else { toast('error', res.error.message || 'Erro ao excluir'); }
  }
}
