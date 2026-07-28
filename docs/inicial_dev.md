# CPD Manager
## Refatoração da Interface e Estrutura

## Objetivo

Refatorar completamente a interface do projeto existente.

O sistema NÃO deve seguir o padrão SaaS (Vercel, Linear, Notion, etc.).

O objetivo é transformar a aplicação em um ERP interno para uso do Centro de Processamento de Dados (CPD) de uma prefeitura.

Priorizar produtividade, velocidade de operação e facilidade de uso após treinamento dos usuários.

---

# Regras Gerais

- Não alterar a stack atual.
- Não integrar ao banco de dados neste momento.
- Manter dados mockados.
- Preparar toda a estrutura para futura integração com Supabase.
- Não remover componentes existentes que possam ser reaproveitados.
- Refatorar somente a interface e a estrutura dos módulos.

---

# Estilo Visual

## Objetivo

A interface deve lembrar sistemas ERP tradicionais.

Características obrigatórias:

- Layout compacto.
- Bordas retas.
- Sem cantos arredondados.
- Pouco espaçamento.
- Pouca utilização de cores.
- Interface limpa.
- Foco em tabelas.
- Foco em produtividade.
- Evitar elementos decorativos.
- Evitar dashboards modernos.

Inspirar-se em:

- TOTVS Protheus
- RM
- Sankhya
- WinThor
- SAP GUI
- Sisloc

---

# Dashboard

Simplificar completamente.

Exibir apenas:

- Demandas abertas
- Solicitações pendentes
- Equipamentos em manutenção
- Estoque abaixo do mínimo

Remover:

- gráficos
- cards grandes
- textos descritivos
- atalhos visuais

O dashboard deve funcionar apenas como resumo operacional.

---

# Visualização dos módulos

Todos os módulos deverão possuir dois modos de visualização.

## Lista

Modo padrão.

Utilizar tabela.

A tabela deverá possuir:

- pesquisa
- ordenação
- filtros
- paginação
- seleção de linhas
- duplo clique para editar

---

## Cards

Modo alternativo.

Adicionar botão para alternância entre:

- Lista
- Cards

A preferência do usuário deverá permanecer salva.

---

# Barra de ferramentas

Todos os módulos deverão possuir uma toolbar superior.

Botões:

- Novo
- Editar
- Excluir
- Atualizar
- Pesquisar
- Filtrar

Não utilizar botões flutuantes.

---

# Demandas

Existem dois tipos de demanda.

## Manutenção Interna

Equipamentos que estão dentro do CPD.

Campos:

- Identificador
- Patrimônio
- Secretaria
- Equipamento
- Defeito
- Técnico responsável
- Status
- Entrada
- Saída
- Observações
- Relatório técnico

Status:

- Em análise
- Em manutenção
- Aguardando peça
- Pronto
- Entregue
- Cancelado

---

## Atendimento em Campo

Campos:

- Identificador
- Secretaria
- Local
- Solicitante
- Ramal
- Problema informado
- Técnico responsável
- Técnico que abriu
- Data abertura
- Data conclusão
- Status
- Relatório técnico

Regras:

- Um técnico somente pode estar responsável por uma demanda ativa.
- Ao finalizar uma demanda o técnico volta para disponível.
- Deve existir um botão para gerar relatório técnico.

---

# Solicitações

Finalidade:

Solicitação de:

- peças
- equipamentos
- materiais
- serviços externos

Remover:

- valor
- setor

Campos:

- Identificador
- Categoria
- Item
- Quantidade
- Solicitante
- Justificativa
- Status
- Observações

Status:

- Aberta
- Em análise
- Aprovada
- Em compra
- Recebida
- Cancelada

---

# Estoque

Controle simples.

Remover:

- valor
- localização

Campos:

- Código
- Item
- Categoria
- Quantidade
- Quantidade mínima
- Observações

Movimentações:

- Entrada
- Saída
- Ajuste

---

# Patrimônio

Campos:

- Patrimônio
- Equipamento
- Marca
- Modelo
- Número de série
- Secretaria
- Responsável
- Status
- Observações

Status:

- Em manutenção
- Pronto para despacho
- Retirada de peças
- Baixa patrimonial

Remover:

- garantia
- valor
- depreciação

---

# Formulários

Os formulários devem priorizar velocidade.

Regras:

- Campos distribuídos em grade.
- Poucas quebras de linha.
- Máximo de informações visíveis.
- Evitar assistentes (wizard).
- Evitar múltiplas etapas.

---

# Componentes

Padronizar:

- DataGrid
- Toolbar
- Modal
- Dialog
- Input
- Select
- Badge
- Tabs
- SearchBox
- Pagination

Todos reutilizáveis.

---

# Código

Manter:

- TypeScript
- Componentização
- Hooks
- Organização atual

Evitar:

- Código duplicado
- Componentes muito grandes
- Qualquer integração com Supabase neste momento

---

# Objetivo Final

Ao término desta refatoração, o sistema deverá possuir aparência e comportamento de um ERP tradicional.

A prioridade é reduzir cliques, aumentar a densidade de informação em tela e tornar o fluxo operacional mais eficiente para os técnicos do CPD.

Nenhuma funcionalidade de banco deverá ser implementada nesta etapa.

Apenas a estrutura da interface e dos componentes.