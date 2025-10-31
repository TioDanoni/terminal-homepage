# 🚀 Página Inicial Estilo Terminal

Uma página inicial moderna e personalizável com interface de terminal, modo de edição intuitivo e relógio em tempo real.

## 📁 Arquivos
- `index.html` — página principal
- `styles.css` — estilos com gradientes, glow e design responsivo
- `script.js` — funcionalidades interativas e gerenciamento de configurações

## 🎯 Como Usar

### Instalação
1. Abra `index.html` no navegador ou use um servidor local:
   ```bash
   python3 -m http.server 8000
   ```
2. Configure como página inicial no Firefox/Chrome usando `file:///caminho/completo/index.html`

## ✨ Funcionalidades

### 🕐 Relógio em Tempo Real
- Exibe hora e data atualizadas automaticamente
- Design integrado ao tema terminal

### ✏️ Modo Edição (Botão no Canto Superior Direito)
Clique no ícone ✏️ para habilitar o modo de edição:

**Editar Categorias (Colunas):**
- Clique no título para editar inline
- Arraste colunas para reorganizar
- Use o botão 🗑️ para remover

**Editar Sites:**
- Clique em qualquer site para editar nome e URL
- Arraste sites para reorganizar
- Botão ✕ para remover

**Adicionar Novos:**
- Botão "+ Adicionar Site" em cada coluna
- Botão "+ Nova Coluna" no final

**Teclas de Atalho:**
- `ESC` - Sair do modo edição
- `/` - Focar no prompt de pesquisa

### 🔍 Sistema de Busca

**Prefixos Padrão:**
- `g termo` - Google
- `d termo` - DuckDuckGo  
- `yt termo` - YouTube
- `gh termo` - GitHub
- `tw termo` - Twitter
- `wiki termo` - Wikipedia

**Gerenciar Buscas:**
No modo edição, clique em "Gerenciar" para:
- Adicionar novos mecanismos de busca
- Editar prefixos e URLs
- Remover buscadores
- URLs devem conter `{query}` onde a busca aparecerá

**Exemplo de URL:**
```
https://www.google.com/search?q={query}
```

### 💾 Armazenamento
- Todas as configurações são salvas automaticamente no `localStorage`
- Suas personalizações persistem entre sessões
- Suporta múltiplas colunas e sites ilimitados

## 🎨 Personalização

### Tema e Cores
As cores podem ser ajustadas no arquivo `styles.css`:
```css
:root {
  --accent1: #6ee7b7;  /* Verde/Teal */
  --accent2: #7c5cff;  /* Roxo */
}
```

### Estrutura de Dados
A configuração é armazenada em JSON com esta estrutura:
```json
{
  "categories": [
    {
      "title": "Dev",
      "items": [
        { "label": "GitHub", "url": "https://github.com" }
      ]
    }
  ],
  "search": {
    "g": "https://www.google.com/search?q={query}"
  }
}
```

## 🌟 Dicas

- **Busca Rápida**: Digite direto no prompt e pressione Enter para buscar no Google
- **URLs Diretas**: Use `open github.com` para abrir sites diretamente
- **Reorganização**: Modo edição permite arrastar e soltar para reordenar
- **Backup**: Exporte suas configurações pelo console: `localStorage.getItem('homepage_config_v1')`

## 📱 Responsivo
Interface adaptável para desktop, tablet e mobile com layout inteligente.
	- Categories: interface visual para adicionar/editar/remover categorias e sites (label + url).
	- Buscas: edite prefixos de busca e suas URLs template (use {query}).
	- JSON: edição raw do JSON se preferir.

Salvar/Importar
- Use "Exportar JSON" para baixar a configuração atual.
- Use "Importar JSON" para carregar um arquivo salvo anteriormente.

Uso recomendado
- Edite visualmente em "Categories" para gravar seus sites favoritos, clique em "Aplicar e Salvar".
- Teste os prefixos no prompt: ex: `g exemplo`, `yt musica`, `open dominio.com`.

Se quiser que eu adicione validação de URLs, pré-visualização de ícones (favicon) ou um botão para definir uma categoria como colapsável, eu implemento na próxima etapa.

Se quiser, eu posso:
- adicionar ícones SVG para cada tile,
- adicionar animação de digitação do prompt no histórico (log),
- gerar uma versão com links configuráveis via JSON e UI de edição.

