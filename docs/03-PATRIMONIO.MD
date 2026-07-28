# Módulo Patrimônio

## Objetivo

Implementar completamente o módulo **Patrimônio**, tornando-o o primeiro módulo funcional do sistema.

Este será o primeiro módulo integrado ao Supabase e servirá como base para os módulos de Demandas, Estoque e Solicitações.

---

# Escopo

Implementar apenas o módulo Patrimônio.

Não alterar os demais módulos.

Não alterar o layout geral da aplicação.

Manter o padrão visual ERP já adotado.

---

# Integração

Implementar integração completa com Supabase.

Utilizar o banco de dados para todas as operações.

Não utilizar LocalStorage.

Todas as operações devem ser realizadas utilizando o cliente oficial do Supabase.

---

# Banco de Dados

Criar as seguintes tabelas.

## secretarias

Campos

- id (UUID)
- codigo (INTEGER)
- nome (TEXT)
- created_at

Popular inicialmente com:

| Código | Nome |
|---------|----------------------|
|100|Administração|
|101|Saúde|
|102|Educação|
|103|Obras|
|104|Assistência Social|

---

## equipamentos

Campos

- id
- nome
- created_at

Popular inicialmente com:

- Desktop
- Notebook
- All in One
- Monitor
- Impressora
- Scanner
- Switch
- Access Point
- Nobreak
- Servidor
- Tablet
- Telefone IP
- Mini PC
- Thin Client
- Projetor
- Firewall
- Storage
- Roteador

---

## tecnologias

Campos

- id
- nome

Popular inicialmente com:

- DDR2
- DDR3
- DDR4
- DDR5
- LPDDR4
- LPDDR5
- Não informado

---

## patrimonios

Campos

- id
- patrimonio
- secretaria_id
- equipamento_id
- tecnologia_id
- marca
- responsavel
- problema
- diagnostico
- solucao
- status
- arquivado
- created_at
- updated_at

Relacionamentos

secretaria_id

→ secretarias

equipamento_id

→ equipamentos

tecnologia_id

→ tecnologias

---

# Número de Patrimônio

O patrimônio deverá possuir prefixo referente à secretaria.

Exemplo

100-000001

Onde

100

é o código da secretaria.

000001

é o número sequencial.

Este formato deverá ser exibido em toda a interface.

---

# Listagem

Alterar a tabela.

Remover:

- Número de série

Renomear:

Modelo

para

Tecnologia

A tabela deverá conter apenas:

- Patrimônio
- Equipamento
- Marca
- Tecnologia
- Secretaria
- Responsável
- Status

---

# Pesquisa

A pesquisa deverá localizar registros por:

- patrimônio
- responsável
- secretaria
- equipamento
- marca

---

# Cadastro

Criar formulário completo.

Campos

Secretaria

Tipo:

Select

Origem:

Tabela secretarias

---

Equipamento

Tipo:

Select

Origem:

Tabela equipamentos

---

Marca

Input texto

---

Tecnologia

Tipo:

Select

Origem:

Tabela tecnologias

---

Responsável

Input texto

---

Status

Select

---

Problema relatado

Textarea

---

Diagnóstico técnico

Textarea

---

Solução aplicada

Textarea

---

Equipamento condenado

Checkbox

---

# Modal de detalhes

Ao clicar duas vezes em um patrimônio ou selecionar "Editar", abrir modal.

O modal deverá carregar todas as informações.

Permitir edição.

Botões

Salvar

Cancelar

---

# Equipamento condenado

Caso o checkbox seja marcado

Exibir seção

Retirada de peças

A lista de peças deverá variar conforme o equipamento.

## Desktop

- Fonte
- SSD
- HD
- Memória
- Processador
- Cooler
- Placa-mãe
- Gabinete
- Unidade Óptica

---

## Notebook

- Tela
- Teclado
- Touchpad
- SSD
- HD
- Memória
- Bateria
- Cooler
- Carcaça
- Webcam

---

## Impressora

- Fonte
- Scanner
- Cabeça
- Motor
- Fusor
- Roletes

---

## Monitor

- Fonte
- Painel LCD
- Placa lógica
- Base
- Cabo

---

# Status

Substituir completamente.

Utilizar apenas:

- Pendente
- Em manutenção
- Aguardando peças
- Pronto
- Baixa patrimonial

---

# Baixa Patrimonial

Quando o usuário selecionar

Baixa patrimonial

O sistema deverá:

- solicitar confirmação

Após confirmação

- arquivado = true

Não excluir registros.

---

# Arquivados

Adicionar duas abas dentro do módulo.

Patrimônio

├── Ativos

├── Arquivados

A aba Arquivados deverá listar apenas registros com

arquivado = true

---

# CRUD

Implementar

- Criar
- Editar
- Excluir lógico
- Listar
- Pesquisar
- Atualizar

Todas as operações devem utilizar Supabase.

---

# Interface

Manter o padrão ERP.

Não alterar o layout existente.

Não adicionar dashboards.

Não adicionar gráficos.

Não adicionar animações.

Priorizar velocidade de uso.

---

# Código

Utilizar

- TypeScript
- Server Actions quando possível
- Componentização
- Hooks
- Componentes reutilizáveis

Evitar

- código duplicado
- any
- lógica espalhada pela interface

---

# Estrutura sugerida

src/

modules/

patrimonio/

components/

PatrimonioTable.tsx

PatrimonioModal.tsx

PatrimonioDetails.tsx

PatrimonioFilters.tsx

hooks/

usePatrimonio.ts

services/

patrimonio.service.ts

types/

patrimonio.ts

---

# Objetivo Final

Ao término desta implementação, o módulo Patrimônio deverá estar completamente funcional, integrado ao Supabase e preparado para servir como entidade principal dos futuros módulos:

- Demandas
- Estoque
- Solicitações

Os demais módulos deverão utilizar referências ao patrimônio em vez de duplicar informações dos equipamentos.