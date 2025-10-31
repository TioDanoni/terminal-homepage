const form = document.getElementById('searchForm');
const cmd = document.getElementById('cmd');
const tilesGrid = document.getElementById('tilesGrid');
const SETTINGS_KEY = 'homepage_config_v1';
const defaultConfig = {
  categories: [
    { title: 'General', items: [
      { label: 'Portfolio', url: 'https://yourportfolio.com' },
      { label: 'Keybase', url: 'https://keybase.io' },
      { label: 'GPT', url: 'https://chat.openai.com' },
      { label: 'OCI', url: 'https://cloud.oracle.com' }
    ]},
    { title: 'Dev', items: [
      { label: 'GitHub', url: 'https://github.com' },
      { label: 'GitLab', url: 'https://gitlab.com' },
      { label: 'Dev.to', url: 'https://dev.to' },
      { label: 'Stack Overflow', url: 'https://stackoverflow.com' }
    ]},
    { title: 'Social', items: [
      { label: 'Twitter', url: 'https://twitter.com' },
      { label: 'Mastodon', url: 'https://mastodon.social' },
      { label: 'Reddit', url: 'https://reddit.com' },
      { label: 'Polywork', url: 'https://polywork.com' }
    ]},
    { title: 'Gaming', items: [
      { label: 'Polygon', url: 'https://polygon.com' },
      { label: 'IGN', url: 'https://ign.com' },
      { label: 'RPS', url: 'https://rockpapershotgun.com' },
      { label: '80lv', url: 'https://80.lv' }
    ]},
    { title: 'Science', items: [
      { label: 'PopSci', url: 'https://popsci.com' },
      { label: 'Space', url: 'https://space.com' },
      { label: 'NASA', url: 'https://nasa.gov' },
      { label: 'ESA', url: 'https://esa.int' }
    ]},
    { title: 'Tech', items: [
      { label: 'TechCrunch', url: 'https://techcrunch.com' },
      { label: 'Verge', url: 'https://theverge.com' },
      { label: "It's Foss", url: 'https://itsfoss.com' },
      { label: '9To5 Linux', url: 'https://9to5linux.com' }
    ]}
  ],
  search: {
    g: 'https://www.google.com/search?q={query}',
    d: 'https://duckduckgo.com/?q={query}',
    yt: 'https://www.youtube.com/results?search_query={query}',
    gh: 'https://github.com/search?q={query}',
    tw: 'https://twitter.com/search?q={query}',
    wiki: 'https://en.wikipedia.org/wiki/{query}'
  },
  defaultSearch: 'g'
};
function loadConfig(){
  try{
    const raw = localStorage.getItem(SETTINGS_KEY);
    if(!raw) return JSON.parse(JSON.stringify(defaultConfig));
    return JSON.parse(raw);
  }catch(e){
    console.warn('Erro ao carregar config, usando padrão', e);
    return JSON.parse(JSON.stringify(defaultConfig));
  }
}
function saveConfig(cfg){
  try{
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(cfg));
  }catch(e){
    console.error('Erro ao salvar config', e);
  }
}
let config = loadConfig();
let editMode = false;
function renderGrid(){
  tilesGrid.innerHTML = '';
  config.categories.forEach((cat, catIndex) => {
    const col = document.createElement('div');
    col.className = 'col';
    col.dataset.catIndex = catIndex;
    col.draggable = editMode;
    if(editMode) {
      col.addEventListener('dragstart', (e) => {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', catIndex);
        e.dataTransfer.setData('type', 'column');
        col.classList.add('dragging');
      });
      col.addEventListener('dragend', () => {
        col.classList.remove('dragging');
      });
      col.addEventListener('dragover', (e) => {
        e.preventDefault();
        const dragType = e.dataTransfer.types.includes('type') ? 'column' : null;
        if(dragType === 'column') {
          col.classList.add('drag-over');
        }
      });
      col.addEventListener('dragleave', () => {
        col.classList.remove('drag-over');
      });
      col.addEventListener('drop', (e) => {
        e.preventDefault();
        col.classList.remove('drag-over');
        const dragType = [...e.dataTransfer.types].find(t => t === 'type');
        if(e.dataTransfer.getData('type') === 'column') {
          const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
          const toIndex = catIndex;
          if(fromIndex !== toIndex) {
            const [removed] = config.categories.splice(fromIndex, 1);
            config.categories.splice(toIndex, 0, removed);
            saveConfig(config);
            renderGrid();
          }
        }
      });
    }
    const header = document.createElement('div');
    header.className = 'col-header';
    const h = document.createElement('h3');
    h.textContent = cat.title;
    h.contentEditable = false;
    h.dataset.catIndex = catIndex;
    header.appendChild(h);
    if(editMode) {
      const controls = document.createElement('div');
      controls.className = 'col-controls';
      const dragHandle = document.createElement('span');
      dragHandle.className = 'drag-handle';
      dragHandle.innerHTML = '⋮⋮';
      dragHandle.title = 'Arrastar coluna';
      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'control-btn delete-col-btn';
      deleteBtn.innerHTML = '🗑️';
      deleteBtn.title = 'Remover coluna';
      deleteBtn.onclick = (e) => {
        e.stopPropagation();
        if(confirm(`Remover coluna "${cat.title}"?`)) {
          config.categories.splice(catIndex, 1);
          saveConfig(config);
          renderGrid();
        }
      };
      controls.appendChild(dragHandle);
      controls.appendChild(deleteBtn);
      header.appendChild(controls);
      h.contentEditable = true;
      h.classList.add('editable');
      h.addEventListener('blur', () => {
        config.categories[catIndex].title = h.textContent.trim();
        saveConfig(config);
      });
      h.addEventListener('keydown', (e) => {
        if(e.key === 'Enter') {
          e.preventDefault();
          h.blur();
        }
      });
    }
    col.appendChild(header);
    cat.items.forEach((it, itemIndex) => {
      const tileWrapper = document.createElement('div');
      tileWrapper.className = 'tile-wrapper';
      tileWrapper.dataset.itemIndex = itemIndex;
      tileWrapper.dataset.catIndex = catIndex;
      tileWrapper.draggable = editMode;
      if(editMode) {
        tileWrapper.addEventListener('dragstart', (e) => {
          e.stopPropagation();
          e.dataTransfer.effectAllowed = 'move';
          e.dataTransfer.setData('text/plain', JSON.stringify({catIndex, itemIndex}));
          e.dataTransfer.setData('type', 'tile');
          tileWrapper.classList.add('dragging');
        });
        tileWrapper.addEventListener('dragend', () => {
          tileWrapper.classList.remove('dragging');
        });
        tileWrapper.addEventListener('dragover', (e) => {
          e.preventDefault();
          e.stopPropagation();
          if(e.dataTransfer.getData('type') === 'tile') {
            tileWrapper.classList.add('drag-over');
          }
        });
        tileWrapper.addEventListener('dragleave', () => {
          tileWrapper.classList.remove('drag-over');
        });
        tileWrapper.addEventListener('drop', (e) => {
          e.preventDefault();
          e.stopPropagation();
          tileWrapper.classList.remove('drag-over');
          if(e.dataTransfer.getData('type') === 'tile') {
            const data = JSON.parse(e.dataTransfer.getData('text/plain'));
            const fromCat = data.catIndex;
            const fromItem = data.itemIndex;
            const toCat = catIndex;
            const toItem = itemIndex;
            if(fromCat === toCat && fromItem === toItem) return;
            const [removed] = config.categories[fromCat].items.splice(fromItem, 1);
            let adjustedToItem = toItem;
            if(fromCat === toCat && fromItem < toItem) {
              adjustedToItem--;
            }
            config.categories[toCat].items.splice(adjustedToItem + 1, 0, removed);
            saveConfig(config);
            renderGrid();
          }
        });
      }
      const a = document.createElement('a');
      a.className = 'tile';
      if(!it.url) a.classList.add('dim');
      a.href = it.url || '#';
      if(it.url) a.dataset.url = it.url;
      a.textContent = it.label;
      a.dataset.catIndex = catIndex;
      a.dataset.itemIndex = itemIndex;
      if(editMode) {
        const dragHandle = document.createElement('span');
        dragHandle.className = 'tile-drag-handle';
        dragHandle.innerHTML = '⋮';
        a.insertBefore(dragHandle, a.firstChild);
      }
      tileWrapper.appendChild(a);
      if(editMode) {
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'control-btn delete-tile-btn';
        deleteBtn.innerHTML = '✕';
        deleteBtn.title = 'Remover site';
        deleteBtn.onclick = (e) => {
          e.stopPropagation();
          config.categories[catIndex].items.splice(itemIndex, 1);
          saveConfig(config);
          renderGrid();
        };
        tileWrapper.appendChild(deleteBtn);
      }
      col.appendChild(tileWrapper);
    });
    if(editMode) {
      const addBtn = document.createElement('button');
      addBtn.className = 'add-tile-btn';
      addBtn.innerHTML = '+ Adicionar Site';
      addBtn.onclick = () => {
        config.categories[catIndex].items.push({label: 'Novo Site', url: ''});
        saveConfig(config);
        renderGrid();
      };
      col.appendChild(addBtn);
    }
    tilesGrid.appendChild(col);
  });
  if(editMode) {
    const addColBtn = document.createElement('button');
    addColBtn.className = 'add-col-btn';
    addColBtn.innerHTML = '+ Nova Coluna';
    addColBtn.onclick = () => {
      config.categories.push({title: 'Nova Categoria', items: []});
      saveConfig(config);
      renderGrid();
    };
    tilesGrid.appendChild(addColBtn);
  }
  updateHeader();
}
function updateHeader(){
  const titleEl = document.querySelector('.shell-header .title');
  if(titleEl && customize && customize.title) {
    titleEl.textContent = customize.title;
  } else if(titleEl) {
    titleEl.textContent = (config.header && config.header.title) || 'Bem vindo';
  }
  const userEl = document.querySelector('.prompt .user');
  if(userEl) userEl.textContent = (config.header && config.header.user) || 'excalitha@firefox';
  const hintEl = document.querySelector('.prompt .hint');
  if(hintEl) hintEl.innerHTML = (config.header && config.header.hint) || 'Dica: digite uma pesquisa e pressione Enter. Prefixe com <code>g </code> para pesquisar no Google, ou clique nos links acima.';
  if(config.theme){
    document.documentElement.style.setProperty('--accent1', config.theme.accent1 || '#6ee7b7');
    document.documentElement.style.setProperty('--accent2', config.theme.accent2 || '#7c5cff');
  }
  updateSearchEnginesHint();
}
function updateSearchEnginesHint() {
  const hintEl = document.getElementById('searchEnginesHint');
  if(!hintEl) return;
  if(editMode) {
    hintEl.style.display = 'block';
    const engines = Object.keys(config.search || {});
    if(engines.length > 0) {
      hintEl.innerHTML = `Mecanismos de busca: ${engines.map(e => `<code>${e}</code>`).join(', ')} 
        <button class="manage-search-btn" onclick="openSearchManager()">Gerenciar</button>`;
    } else {
      hintEl.innerHTML = `<button class="manage-search-btn" onclick="openSearchManager()">➕ Adicionar Mecanismos de Busca</button>`;
    }
  } else {
    const engines = Object.keys(config.search || {}).filter(e => e !== 'g');
    if(engines.length > 0) {
      hintEl.style.display = 'block';
      hintEl.innerHTML = `Prefixos disponíveis: ${engines.map(e => `<code>${e}</code>`).join(', ')}`;
    } else {
      hintEl.style.display = 'none';
    }
  }
}
function updateClock() {
  const now = new Date();
  const timeEl = document.querySelector('.clock .time');
  const dateEl = document.querySelector('.clock .date');
  if(timeEl) {
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    timeEl.textContent = `${hours}:${minutes}`;
  }
  if(dateEl) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateEl.textContent = now.toLocaleDateString('pt-BR', options);
  }
}
setInterval(updateClock, 1000);
updateClock();
const cmdInput = document.getElementById('cmd');
const caret = document.querySelector('.caret');
const promptLine = document.querySelector('.prompt-line');
function updateCaretPosition() {
  if(!cmdInput || !caret || !promptLine) return;
  const span = document.createElement('span');
  span.style.font = window.getComputedStyle(cmdInput).font;
  span.style.visibility = 'hidden';
  span.style.position = 'absolute';
  span.textContent = cmdInput.value || '';
  document.body.appendChild(span);
  const textWidth = span.offsetWidth;
  document.body.removeChild(span);
  const inputRect = cmdInput.getBoundingClientRect();
  const lineRect = promptLine.getBoundingClientRect();
  const offsetLeft = inputRect.left - lineRect.left + parseInt(window.getComputedStyle(cmdInput).paddingLeft);
  caret.style.left = (offsetLeft + textWidth) + 'px';
}
cmdInput.addEventListener('input', updateCaretPosition);
cmdInput.addEventListener('focus', updateCaretPosition);
cmdInput.addEventListener('blur', updateCaretPosition);
window.addEventListener('resize', updateCaretPosition);
setTimeout(updateCaretPosition, 100);
const CUSTOMIZE_KEY = 'homepage_customize_v1';
const defaultCustomize = {
  title: 'Bem vindo',
  shellHeight: 'auto',
  shellWidth: 1200,
  theme: 'default',
  accent1: '#6ee7b7',
  accent2: '#7c5cff',
  crtEffect: true
};
const themes = {
  default: { accent1: '#6ee7b7', accent2: '#7c5cff' },
  ocean: { accent1: '#00d4ff', accent2: '#0099ff' },
  fire: { accent1: '#ff6b6b', accent2: '#ffd93d' },
  cyberpunk: { accent1: '#ff00ff', accent2: '#00ffff' },
  dracula: { accent1: '#bd93f9', accent2: '#ff79c6' }
};
function loadCustomize() {
  try {
    const saved = localStorage.getItem(CUSTOMIZE_KEY);
    if(!saved) return { ...defaultCustomize };
    return { ...defaultCustomize, ...JSON.parse(saved) };
  } catch(e) {
    return { ...defaultCustomize };
  }
}
function saveCustomize(customize) {
  try {
    localStorage.setItem(CUSTOMIZE_KEY, JSON.stringify(customize));
  } catch(e) {
    console.error('Erro ao salvar customização', e);
  }
}
let customize = loadCustomize();
function applyCustomize() {
  const titleEl = document.querySelector('.title');
  if(titleEl) titleEl.textContent = customize.title;
  const shell = document.querySelector('.shell');
  if(shell) {
    shell.style.maxWidth = customize.shellWidth + 'px';
    if(customize.shellHeight !== 'auto') {
      shell.style.height = customize.shellHeight + 'px';
      shell.style.maxHeight = customize.shellHeight + 'px';
    } else {
      shell.style.height = 'auto';
      shell.style.maxHeight = 'none';
    }
  }
  document.documentElement.style.setProperty('--accent1', customize.accent1);
  document.documentElement.style.setProperty('--accent2', customize.accent2);
  if(customize.crtEffect) {
    document.body.classList.remove('no-crt');
  } else {
    document.body.classList.add('no-crt');
  }
}
const customizeBtn = document.getElementById('customizeBtn');
const customizePanel = document.getElementById('customizePanel');
const closeCustomize = document.getElementById('closeCustomize');
customizeBtn.addEventListener('click', () => {
  customizePanel.classList.toggle('open');
  customizeBtn.classList.toggle('active');
  populateCustomizePanel();
});
closeCustomize.addEventListener('click', () => {
  customizePanel.classList.remove('open');
  customizeBtn.classList.remove('active');
});
function populateCustomizePanel() {
  document.getElementById('customTitle').value = customize.title;
  document.getElementById('shellWidth').value = customize.shellWidth;
  document.getElementById('widthValue').textContent = customize.shellWidth + 'px';
  if(customize.shellHeight === 'auto') {
    document.getElementById('shellHeight').value = 400;
    document.getElementById('heightValue').textContent = 'Auto';
  } else {
    document.getElementById('shellHeight').value = customize.shellHeight;
    document.getElementById('heightValue').textContent = customize.shellHeight + 'px';
  }
  document.getElementById('customAccent1').value = customize.accent1;
  document.getElementById('customAccent2').value = customize.accent2;
  document.getElementById('crtEffect').checked = customize.crtEffect;
  document.querySelectorAll('.theme-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.theme === customize.theme);
  });
}
document.getElementById('customTitle').addEventListener('input', (e) => {
  const value = e.target.value.trim();
  if(value) {
    customize.title = value;
    saveCustomize(customize);
    applyCustomize();
  }
});
document.getElementById('shellHeight').addEventListener('input', (e) => {
  const value = parseInt(e.target.value);
  if(value === 400) {
    customize.shellHeight = 'auto';
    document.getElementById('heightValue').textContent = 'Auto';
  } else {
    customize.shellHeight = value;
    document.getElementById('heightValue').textContent = value + 'px';
  }
  saveCustomize(customize);
  applyCustomize();
});
document.getElementById('shellWidth').addEventListener('input', (e) => {
  customize.shellWidth = parseInt(e.target.value);
  document.getElementById('widthValue').textContent = e.target.value + 'px';
  saveCustomize(customize);
  applyCustomize();
});
document.querySelectorAll('.theme-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const theme = btn.dataset.theme;
    customize.theme = theme;
    customize.accent1 = themes[theme].accent1;
    customize.accent2 = themes[theme].accent2;
    document.getElementById('customAccent1').value = customize.accent1;
    document.getElementById('customAccent2').value = customize.accent2;
    document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    saveCustomize(customize);
    applyCustomize();
  });
});
document.getElementById('customAccent1').addEventListener('input', (e) => {
  customize.accent1 = e.target.value;
  customize.theme = 'custom';
  document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
  saveCustomize(customize);
  applyCustomize();
});
document.getElementById('customAccent2').addEventListener('input', (e) => {
  customize.accent2 = e.target.value;
  customize.theme = 'custom';
  document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
  saveCustomize(customize);
  applyCustomize();
});
document.getElementById('crtEffect').addEventListener('change', (e) => {
  customize.crtEffect = e.target.checked;
  saveCustomize(customize);
  applyCustomize();
});
document.getElementById('resetCustomize').addEventListener('click', () => {
  if(!confirm('Restaurar configurações padrão de aparência?')) return;
  customize = { ...defaultCustomize };
  saveCustomize(customize);
  applyCustomize();
  populateCustomizePanel();
});
applyCustomize();
tilesGrid.addEventListener('click', e => {
  const a = e.target.closest('.tile');
  if(!a) return;
  if(editMode) {
    e.preventDefault();
    openTileEditor(parseInt(a.dataset.catIndex), parseInt(a.dataset.itemIndex));
    return;
  }
  const url = a.dataset.url;
  if(url){
    e.preventDefault();
    window.open(url, '_blank');
  }
});
const editModeBtn = document.getElementById('editModeBtn');
editModeBtn.addEventListener('click', () => {
  editMode = !editMode;
  editModeBtn.classList.toggle('active', editMode);
  document.body.classList.toggle('edit-mode', editMode);
  if(editMode) {
    editModeBtn.textContent = '💾';
    editModeBtn.title = 'Salvar e Sair';
  } else {
    editModeBtn.textContent = '✏️';
    editModeBtn.title = 'Modo Edição';
  }
  renderGrid();
  updateSearchEnginesHint();
});
function openTileEditor(catIndex, itemIndex) {
  const item = config.categories[catIndex].items[itemIndex];
  const modal = document.createElement('div');
  modal.className = 'tile-editor-modal';
  modal.innerHTML = `
    <div class="tile-editor-content">
      <h3>Editar Site</h3>
      <label>
        Nome do Site
        <input type="text" id="tileLabel" value="${item.label}" placeholder="Ex: GitHub">
      </label>
      <label>
        URL
        <input type="text" id="tileUrl" value="${item.url}" placeholder="https:
      </label>
      <div class="tile-editor-actions">
        <button class="cancel-btn">Cancelar</button>
        <button class="save-btn">Salvar</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  setTimeout(() => modal.classList.add('show'), 10);
  const labelInput = modal.querySelector('#tileLabel');
  const urlInput = modal.querySelector('#tileUrl');
  labelInput.focus();
  labelInput.select();
  modal.querySelector('.cancel-btn').onclick = () => {
    modal.classList.remove('show');
    setTimeout(() => modal.remove(), 200);
  };
  modal.querySelector('.save-btn').onclick = () => {
    config.categories[catIndex].items[itemIndex].label = labelInput.value.trim();
    config.categories[catIndex].items[itemIndex].url = urlInput.value.trim();
    saveConfig(config);
    renderGrid();
    modal.classList.remove('show');
    setTimeout(() => modal.remove(), 200);
  };
  modal.addEventListener('click', (e) => {
    if(e.target === modal) {
      modal.classList.remove('show');
      setTimeout(() => modal.remove(), 200);
    }
  });
}
function openSearchManager() {
  const modal = document.createElement('div');
  modal.className = 'tile-editor-modal search-manager-modal';
  let enginesHtml = '';
  const engines = config.search || {};
  const defaultSearch = config.defaultSearch || 'g';
  Object.keys(engines).forEach(key => {
    const isDefault = key === defaultSearch;
    enginesHtml += `
      <div class="search-engine-row" data-key="${key}">
        <input type="radio" name="defaultSearch" value="${key}" ${isDefault ? 'checked' : ''} title="Marcar como padrão">
        <input type="text" class="engine-prefix" value="${key}" placeholder="Prefixo">
        <input type="text" class="engine-url" value="${engines[key]}" placeholder="URL com {query}">
        <button class="delete-engine-btn" onclick="deleteSearchEngine('${key}')">🗑️</button>
      </div>
    `;
  });
  modal.innerHTML = `
    <div class="tile-editor-content search-manager-content">
      <h3>Mecanismos de Busca</h3>
      <div class="search-engines-list">
        ${enginesHtml}
      </div>
      <button class="add-engine-btn" onclick="addSearchEngine()">➕ Adicionar Mecanismo</button>
      <div class="help-text">
        <strong>Dica:</strong> Use <code>{query}</code> no URL onde a pesquisa deve aparecer.<br>
        <strong>Exemplo:</strong> Prefixo: <code>yt</code> | URL: <code>https:
        <br><strong>Padrão:</strong> Marque o círculo para definir qual mecanismo usar quando não especificar prefixo.
      </div>
      <div class="tile-editor-actions">
        <button class="cancel-btn" onclick="closeSearchManager()">Cancelar</button>
        <button class="save-btn" onclick="saveSearchEngines()">Salvar</button>
      </div>
    </div>
  `;
  modal.id = 'searchManagerModal';
  document.body.appendChild(modal);
  setTimeout(() => modal.classList.add('show'), 10);
  modal.addEventListener('click', (e) => {
    if(e.target === modal) {
      closeSearchManager();
    }
  });
}
function addSearchEngine() {
  const list = document.querySelector('.search-engines-list');
  const newRow = document.createElement('div');
  newRow.className = 'search-engine-row';
  const tempKey = 'new_' + Date.now();
  newRow.innerHTML = `
    <input type="radio" name="defaultSearch" value="${tempKey}" title="Marcar como padrão">
    <input type="text" class="engine-prefix" value="" placeholder="Prefixo (ex: yt)">
    <input type="text" class="engine-url" value="" placeholder="URL com {query}">
    <button class="delete-engine-btn" onclick="this.parentElement.remove()">🗑️</button>
  `;
  list.appendChild(newRow);
  newRow.querySelector('.engine-prefix').focus();
}
function deleteSearchEngine(key) {
  const row = document.querySelector(`[data-key="${key}"]`);
  if(row) row.remove();
}
function saveSearchEngines() {
  const newSearch = {};
  const rows = document.querySelectorAll('.search-engine-row');
  const selectedDefault = document.querySelector('input[name="defaultSearch"]:checked');
  let defaultPrefix = 'g';
  rows.forEach(row => {
    const prefix = row.querySelector('.engine-prefix').value.trim();
    const url = row.querySelector('.engine-url').value.trim();
    const radio = row.querySelector('input[type="radio"]');
    if(prefix && url) {
      newSearch[prefix] = url;
      if(selectedDefault && radio && radio.checked) {
        defaultPrefix = prefix;
      }
    }
  });
  config.search = newSearch;
  config.defaultSearch = defaultPrefix;
  saveConfig(config);
  updateSearchEnginesHint();
  closeSearchManager();
}
function closeSearchManager() {
  const modal = document.getElementById('searchManagerModal');
  if(modal) {
    modal.classList.remove('show');
    setTimeout(() => modal.remove(), 200);
  }
}
renderGrid();
form.addEventListener('submit', e => {
  e.preventDefault();
  const text = cmd.value.trim();
  if(!text) return;
  const lower = text;
  if(lower.startsWith('open ')){
    const url = maybeUrl(text.slice(5));
    window.open(url, '_blank');
    cmd.value = '';
    return;
  }
  const firstSpace = text.indexOf(' ');
  if(firstSpace > 0){
    const prefix = text.slice(0, firstSpace);
    const rest = text.slice(firstSpace+1).trim();
    if(config.search && config.search[prefix]){
      const template = config.search[prefix];
      const url = template.replace('{query}', encodeURIComponent(rest));
      window.open(url, '_blank');
      cmd.value = '';
      return;
    }
  }
  const q = encodeURIComponent(text);
  const defaultSearchKey = config.defaultSearch || 'g';
  const fallback = (config.search && config.search[defaultSearchKey]) 
    ? config.search[defaultSearchKey].replace('{query}', q) 
    : 'https://www.google.com/search?q=' + q;
  window.open(fallback, '_blank');
  cmd.value = '';
});
function maybeUrl(s){
  s = s.trim();
  if(/^https?:\/\//.test(s)) return s;
  if(s.includes('.') && !s.includes(' ')) return 'https://' + s;
  return 'https://www.google.com/search?q=' + encodeURIComponent(s);
}
window.addEventListener('keydown', e => {
  if(e.key === '/' && document.activeElement !== cmd && !isTypingInModal()){
    e.preventDefault();
    cmd.focus();
    return;
  }
  if(e.key === 'Escape'){
    if(editMode) {
      editMode = false;
      editModeBtn.classList.remove('active');
      document.body.classList.remove('edit-mode');
      editModeBtn.textContent = '✏️';
      editModeBtn.title = 'Modo Edição';
      renderGrid();
    } else {
      cmd.value = '';
      cmd.blur();
    }
  }
});
window.addEventListener('load', ()=> cmd.focus());
const demos = ["bem-vindo ao seu novo inicio", "g criar pagina inicial bonita", "open github.com"];
let dIndex = 0;
const placeholderLoop = () => {
  const ph = demos[dIndex++ % demos.length];
  typePlaceholder(ph, 0, ()=> setTimeout(placeholderLoop, 2000));
}
function typePlaceholder(text, i, done){
  cmd.setAttribute('placeholder', '');
  if(i < text.length){
    cmd.setAttribute('placeholder', text.slice(0,i+1));
    setTimeout(()=> typePlaceholder(text, i+1, done), 45);
  } else done();
}
placeholderLoop();
