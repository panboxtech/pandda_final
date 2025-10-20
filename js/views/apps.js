// apps.js - view for managing apps
import { listApps, createApp, updateApp, deleteApp } from '../data/app.js';
import { listServers } from '../data/server.js';
import { openModal, textInput, buildField } from '../core/modal.js';
import { toast } from '../ui/toast.js';
import { currentUser } from '../core/auth.js';
import { canEdit, canDelete } from '../core/access.js';

export async function renderApps(outlet) {
  const container = document.createElement('div');
  container.className = 'container';
  const header = document.createElement('div');
  header.style.display = 'flex';
  header.style.justifyContent = 'space-between';
  header.style.alignItems = 'center';
  header.style.marginBottom = '12px';
  const title = document.createElement('div');
  title.className = 'h1';
  title.textContent = 'Apps';
  header.appendChild(title);
  const addBtn = document.createElement('button');
  addBtn.className = 'btn primary';
  addBtn.textContent = 'Novo App';
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
    const res = await listApps();
    if (!res.success) { toast('error', res.error.message || 'Erro ao carregar apps'); return; }
    const apps = res.data;
    if (!apps.length) {
      const empty = document.createElement('div'); empty.className='meta'; empty.textContent='Nenhum app cadastrado.'; listEl.appendChild(empty); return;
    }
    for (const a of apps) {
      const row = document.createElement('div'); row.className = 'list-item';
      const left = document.createElement('div'); const name = document.createElement('div'); name.textContent = a.nome; name.style.fontWeight = 600; left.appendChild(name);
      const meta = document.createElement('div'); meta.className = 'meta'; meta.textContent = `${a.codigoDeAcesso || '-'} • Server: ${a.serverId || '-'}`; left.appendChild(meta);
      const actions = document.createElement('div'); actions.className='actions';
      const user = currentUser();
      const editBtn = document.createElement('button'); editBtn.className='btn small'; editBtn.textContent='Editar'; if(!canEdit(user,'app')) editBtn.disabled=true; editBtn.addEventListener('click', ()=>onEdit(a));
      const delBtn = document.createElement('button'); delBtn.className='btn small danger'; delBtn.textContent='Excluir'; if(!canDelete(user,'app')) delBtn.disabled=true; delBtn.addEventListener('click', ()=>onDelete(a));
      actions.appendChild(editBtn); actions.appendChild(delBtn);
      row.appendChild(left); row.appendChild(actions); listEl.appendChild(row);
    }
  }

  function onCreate() {
    const user = currentUser();
    if (!canEdit(user, 'app')) { toast('error','Você não tem permissão'); return; }
    openModal({
      title: 'Novo App',
      initialData: {},
      contentBuilder: (container, initialData, helpers) => {
        const nome = helpers.textInput({ name:'nome', value: initialData.nome || '' });
        container.appendChild(helpers.buildField('Nome', nome));
        const codigo = helpers.textInput({ name:'codigoDeAcesso', value: initialData.codigoDeAcesso || '' });
        container.appendChild(helpers.buildField('Código de Acesso', codigo));
        const urlA = helpers.textInput({ name:'urlDownloadAndroid', value: initialData.urlDownloadAndroid || '', placeholder: 'https://...' });
        container.appendChild(helpers.buildField('URL Android', urlA));
        const urlI = helpers.textInput({ name:'urlDownloadIos', value: initialData.urlDownloadIos || '', placeholder: 'https://...' });
        container.appendChild(helpers.buildField('URL iOS', urlI));
        return () => ({ nome: nome.value.trim(), codigoDeAcesso: codigo.value.trim(), urlDownloadAndroid: urlA.value.trim() || null, urlDownloadIos: urlI.value.trim() || null });
      },
      onSave: async (payload) => await createApp(payload),
      onDone: () => { toast('success','App criado'); fetchAndRender(); }
    });
  }

  function onEdit(app) {
    const user = currentUser();
    if (!canEdit(user, 'app')) { toast('error','Você não tem permissão'); return; }
    openModal({
      title: 'Editar App',
      initialData: app,
      contentBuilder: (container, initialData, helpers) => {
        const nome = helpers.textInput({ name:'nome', value: initialData.nome || '' });
        container.appendChild(helpers.buildField('Nome', nome));
        const codigo = helpers.textInput({ name:'codigoDeAcesso', value: initialData.codigoDeAcesso || '' });
        container.appendChild(helpers.buildField('Código de Acesso', codigo));
        const urlA = helpers.textInput({ name:'urlDownloadAndroid', value: initialData.urlDownloadAndroid || '' });
        container.appendChild(helpers.buildField('URL Android', urlA));
        const urlI = helpers.textInput({ name:'urlDownloadIos', value: initialData.urlDownloadIos || '' });
        container.appendChild(helpers.buildField('URL iOS', urlI));
        return () => ({ id: initialData.id, nome: nome.value.trim(), codigoDeAcesso: codigo.value.trim(), urlDownloadAndroid: urlA.value.trim() || null, urlDownloadIos: urlI.value.trim() || null });
      },
      onSave: async (payload) => {
        if (!payload.id) return { success:false, error:{ message:'ID ausente' } };
        return await updateApp(payload.id, { nome: payload.nome, codigoDeAcesso: payload.codigoDeAcesso, urlDownloadAndroid: payload.urlDownloadAndroid, urlDownloadIos: payload.urlDownloadIos });
      },
      onDone: () => { toast('success','App atualizado'); fetchAndRender(); }
    });
  }

  async function onDelete(app) {
    const user = currentUser();
    if (!canDelete(user, 'app')) { toast('error','Sem permissão'); return; }
    if (!confirm(`Excluir app "${app.nome}"?`)) return;
    const res = await deleteApp(app.id);
    if (res.success) { toast('success','App excluído'); fetchAndRender(); } else { toast('error', res.error.message || 'Erro ao excluir'); }
  }
}
