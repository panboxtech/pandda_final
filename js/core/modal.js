// modal.js - reusable modal implementation
// API: openModal({ title, initialData, contentBuilder, onSave, onDone })
// contentBuilder(container, initialData, helpers) -> should append inputs to container and return a getData() function
// helpers: input helpers provided below

const ACTIVE_ATTR = 'data-modal-active';

function createModalShell() {
  const root = document.createElement('div');
  root.className = 'modal-root';
  root.setAttribute('role', 'dialog');
  root.setAttribute('aria-modal', 'true');
  root.style.position = 'fixed';
  root.style.left = 0;
  root.style.top = 0;
  root.style.right = 0;
  root.style.bottom = 0;
  root.style.display = 'flex';
  root.style.alignItems = 'center';
  root.style.justifyContent = 'center';
  root.style.zIndex = 1200;
  const overlay = document.createElement('div');
  overlay.style.position = 'absolute';
  overlay.style.left = 0;
  overlay.style.top = 0;
  overlay.style.right = 0;
  overlay.style.bottom = 0;
  overlay.style.background = 'rgba(0,0,0,0.5)';
  overlay.style.backdropFilter = 'blur(2px)';
  root.appendChild(overlay);

  const panel = document.createElement('div');
  panel.className = 'card';
  panel.style.minWidth = '320px';
  panel.style.maxWidth = '720px';
  panel.style.zIndex = 2;
  root.appendChild(panel);

  return { root, overlay, panel };
}

export function buildField(labelText, inputEl) {
  const wrapper = document.createElement('div');
  wrapper.className = 'field';
  const label = document.createElement('label');
  label.className = 'label';
  label.textContent = labelText;
  wrapper.appendChild(label);
  wrapper.appendChild(inputEl);
  return wrapper;
}

export function textInput({ name, value = '', placeholder = '' }) {
  const input = document.createElement('input');
  input.className = 'input';
  input.type = 'text';
  if (name) input.name = name;
  input.value = value;
  input.placeholder = placeholder;
  return input;
}

export function emailInput(opts) {
  const input = textInput(opts);
  input.type = 'email';
  return input;
}

export function telInput(opts) {
  const input = textInput(opts);
  input.type = 'tel';
  return input;
}

export function numberInput(opts) {
  const input = document.createElement('input');
  input.className = 'input';
  input.type = 'number';
  if (opts && opts.name) input.name = opts.name;
  if (opts && opts.value !== undefined) input.value = opts.value;
  return input;
}

export function openModal({ title = '', initialData = {}, contentBuilder, onSave, onDone }) {
  const { root, overlay, panel } = createModalShell();

  const header = document.createElement('div');
  header.style.display = 'flex';
  header.style.justifyContent = 'space-between';
  header.style.alignItems = 'center';
  header.style.marginBottom = '8px';

  const h = document.createElement('div');
  h.className = 'h1';
  h.textContent = title;
  header.appendChild(h);

  const closeBtn = document.createElement('button');
  closeBtn.className = 'btn';
  closeBtn.textContent = 'Fechar';
  closeBtn.addEventListener('click', close);
  header.appendChild(closeBtn);

  panel.appendChild(header);

  const content = document.createElement('div');
  content.style.marginBottom = '12px';
  panel.appendChild(content);

  const errorLine = document.createElement('div');
  errorLine.className = 'modal-error';
  errorLine.style.color = 'var(--danger)';
  errorLine.style.minHeight = '18px';
  panel.appendChild(errorLine);

  const footer = document.createElement('div');
  footer.style.display = 'flex';
  footer.style.justifyContent = 'flex-end';
  footer.style.gap = '8px';

  const btnCancel = document.createElement('button');
  btnCancel.className = 'btn';
  btnCancel.textContent = 'Cancelar';
  btnCancel.addEventListener('click', close);

  const btnSave = document.createElement('button');
  btnSave.className = 'btn primary';
  btnSave.textContent = 'Salvar';

  footer.appendChild(btnCancel);
  footer.appendChild(btnSave);
  panel.appendChild(footer);

  document.body.appendChild(root);
  document.body.style.overflow = 'hidden';

  // build content
  let getDataFn = () => ({});
  try {
    getDataFn = contentBuilder(content, initialData, { textInput, emailInput, telInput, numberInput, buildField });
  } catch (err) {
    console.error('modal.contentBuilder', err);
    errorLine.textContent = 'Erro ao montar formulário';
  }

  async function handleSave() {
    try {
      btnSave.disabled = true;
      btnSave.textContent = 'Salvando...';
      errorLine.textContent = '';
      const payload = getDataFn();
      const res = await onSave(payload);
      if (res && res.success) {
        onDone && onDone(res.data);
        close();
      } else {
        const msg = res && res.error ? res.error.message : 'Erro ao salvar';
        errorLine.textContent = msg;
        btnSave.disabled = false;
        btnSave.textContent = 'Salvar';
      }
    } catch (err) {
      console.error('modal.save', err);
      errorLine.textContent = 'Erro inesperado';
      btnSave.disabled = false;
      btnSave.textContent = 'Salvar';
    }
  }

  btnSave.addEventListener('click', handleSave);
  overlay.addEventListener('click', close);

  // focus trap basic: focus first input
  setTimeout(() => {
    const first = panel.querySelector('input,button,textarea,select');
    if (first) first.focus();
  }, 50);

  function close() {
    if (root.parentNode) document.body.removeChild(root);
    document.body.style.overflow = '';
  }

  return { close };
}
