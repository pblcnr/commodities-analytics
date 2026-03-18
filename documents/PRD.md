# PRD — Plataforma de Inteligência de Compras de Matérias-Primas Agrícolas

**Versão:** 1.0  
**Data:** 17/03/2026  
**Status:** Em elaboração

---

## 1. Visão Geral do Produto

### 1.1 Problema

Indústrias que utilizam matérias-primas agrícolas (algodão, borracha, madeira, lã, etc.) sofrem com a volatilidade de preços ao longo do tempo. Sem uma análise histórica estruturada e preditiva, o setor de compras tende a adquirir insumos em períodos de alta, elevando o custo de produção desnecessariamente.

### 1.2 Solução Proposta

Uma plataforma **web e mobile** com módulo de Inteligência Artificial capaz de analisar a série histórica de preços de matérias-primas agrícolas (1990–2020) e recomendar os melhores períodos de compra, gerando alertas e relatórios estratégicos para o time de compras da indústria.

- **Aplicação Web:** interface completa voltada para uso em desktop/notebook, com dashboards analíticos, geração de relatórios e administração do sistema.
- **Aplicação Mobile:** interface nativa ou híbrida para smartphones (iOS e Android), focada no consumo de recomendações, recebimento de alertas push e consulta rápida de preços pelo comprador em campo.

### 1.3 Base de Dados

| Atributo | Detalhe |
|---|---|
| **Fonte** | Kaggle — Agricultural Raw Material Prices 1990–2020 |
| **URL** | https://www.kaggle.com/datasets/kianwee/agricultural-raw-material-prices-19902020 |
| **Cobertura temporal** | Janeiro de 1990 a Dezembro de 2020 (30 anos) |
| **Materiais cobertos** | Algodão (Cotton), Lã (Fine Motion Wool, Coarse Wool), Borracha (Rubber), Madeira/Compensado (Hardwood logs, Softwood logs, Plywood), entre outros |
| **Granularidade** | Mensal |

### 1.4 Público-Alvo

- **Usuário:** Comprador da indústria

---

## 2. Objetivos e Métricas de Sucesso

| Objetivo | Indicador de Sucesso |
|---|---|
| Reduzir custo de aquisição de matérias-primas | Redução ≥ 10% no custo médio de compra em 12 meses |
| Antecipar tendências de alta | Acurácia de previsão ≥ 75% para horizonte de 3 meses |
| Aumentar agilidade do time de compras | Tempo de decisão reduzido de dias para horas |
| Centralizar inteligência de mercado | 100% das matérias-primas monitoradas em um único painel |

---

## 3. Requisitos Funcionais (RF)

### RF-01 — Importação e Ingestão de Dados
- O sistema deve importar a base de dados histórica em formato CSV.
- O sistema deve suportar atualização periódica da base com novos dados de preço (manuais ou via API externa).
- O sistema deve validar a integridade dos dados importados (ausência de campos obrigatórios, valores negativos, datas inválidas).

### RF-02 — Visualização de Histórico de Preços
- O sistema deve exibir gráficos de linha com a evolução histórica de preços por matéria-prima.
- O usuário deve poder filtrar por:
  - Matéria-prima específica
  - Intervalo de datas (mês/ano)
  - Variação percentual (alta/baixa)
- O sistema deve destacar visualmente os períodos de mínima histórica e máxima histórica.

### RF-03 — Previsão de Preços (Forecasting)
- O módulo de IA deve gerar previsões de preço para os próximos 1, 3 e 6 meses por matéria-prima.
- As previsões devem exibir intervalo de confiança (mínimo e máximo esperado).
- O sistema deve indicar a tendência esperada: **Alta**, **Estável** ou **Queda**.

### RF-04 — Alertas e Notificações
- O usuário deve poder configurar alertas de preço (ex.: "Notificar quando Borracha cair abaixo de X").
- O sistema deve enviar alertas quando a previsão indicar oportunidade de compra iminente.
- Os alertas devem ser entregues por: notificação na plataforma e e-mail.

### RF-05 — Relatórios Exportáveis
- O sistema deve permitir a exportação de relatórios em PDF e Excel contendo:
  - Histórico de preços filtrado
  - Previsões geradas
  - Recomendações de compra

### RF-06 — Gerenciamento de Usuários
- O sistema deve suportar múltiplos usuários com perfil de comprador.
- O sistema deve exigir autenticação para acesso.

### RF-07 — Histórico de Decisões
- O sistema deve permitir que o usuário registre compras realizadas (data, matéria-prima, preço, quantidade).
- O sistema deve comparar o preço pago com a recomendação vigente à época, gerando um relatório de aderência às recomendações.

### RF-08 — Mensageria e Processamento Assíncrono
- O sistema deve utilizar um broker de mensageria para desacoplar fluxos assíncronos entre backend, módulo de IA e serviços de notificação.
- Eventos de negócio críticos (ex.: previsão gerada, alerta disparado, compra registrada) devem ser publicados em tópicos/filas específicos.
- O consumo de mensagens deve suportar retentativas automáticas e encaminhamento para fila de erro (DLQ) em caso de falhas recorrentes.
- O sistema deve permitir rastreabilidade mínima por mensagem (id de correlação, timestamp e serviço de origem).

---

## 4. Requisitos Não Funcionais (RNF)

### RNF-01 — Desempenho
- O carregamento do dashboard principal deve ocorrer em até **3 segundos** em conexão padrão.
- O processamento de uma análise de previsão para uma matéria-prima deve ser concluído em até **15 segundos**.

### RNF-02 — Disponibilidade
- A plataforma deve ter disponibilidade mínima de **99,5%** ao mês (SLA).
- Manutenções programadas devem ocorrer fora do horário comercial e ser comunicadas com 24h de antecedência.

### RNF-03 — Segurança
- Toda comunicação entre cliente e servidor deve ser criptografada via **TLS 1.2+**.
- Senhas devem ser armazenadas com algoritmo de hash seguro (**bcrypt** ou equivalente).
- Sessões inativas por mais de 30 minutos devem ser encerradas automaticamente.
- Dados sensíveis de usuários devem estar em conformidade com a **LGPD**.

### RNF-04 — Escalabilidade
- A arquitetura deve suportar crescimento horizontal para suportar aumento de usuários e volume de dados sem refatoração.
- O módulo de IA deve ser independente e escalável separadamente da aplicação principal.

### RNF-05 — Manutenibilidade
- O código deve seguir padrões documentados e ter cobertura de testes automatizados mínima de **70%**.
- O módulo de IA deve permitir a substituição ou atualização do modelo sem afetar o restante da aplicação (interface desacoplada).

### RNF-06 — Usabilidade
- A interface deve seguir princípios de UX intuitivos, não exigindo treinamento técnico extenso.
- A aplicação **web** deve ser responsiva, funcionando adequadamente em desktop e tablet.
- A aplicação **mobile** deve seguir as diretrizes de design de cada plataforma (Material Design para Android, Human Interface Guidelines para iOS).
- Notificações push devem funcionar em dispositivos mobile mesmo com o aplicativo em segundo plano.
- Mensagens de erro devem ser claras e orientadas ao usuário (sem expor detalhes técnicos).

### RNF-09 — Suporte a Plataformas Mobile
- O aplicativo mobile deve ser compatível com **iOS 15+** e **Android 10+**.
- O aplicativo mobile deve ser distribuído via App Store (Apple) e Google Play Store.
- As funcionalidades offline essenciais (visualização do último dashboard e alertas recebidos) devem funcionar sem conexão à internet, sincronizando ao restabelecer conexão.

### RNF-07 — Auditabilidade
- O sistema deve registrar logs de ações críticas: login, exportação de relatórios, alterações de configuração e geração de recomendações.
- Logs devem ser armazenados por no mínimo **365 dias**.

### RNF-08 — Infraestrutura e Hospedagem
- O projeto será hospedado em uma **Máquina Virtual (VM)** dedicada, com sistema operacional Linux (ex.: Ubuntu Server).
- Todos os serviços da aplicação (frontend web, backend, módulo de IA e banco de dados) devem ser orquestrados via **Docker** e **Docker Compose**, garantindo isolamento, reprodutibilidade e facilidade de implantação.
- A arquitetura deve incluir um serviço de mensageria (ex.: RabbitMQ, Apache Kafka ou equivalente) conteinerizado e integrado ao ecossistema da aplicação.
- Cada componente deve ter seu próprio container (imagem Docker), com comunicação via rede interna definida no `docker-compose.yml`.
- O ambiente de execução deve ser inteiramente reproduzível a partir dos arquivos de configuração do repositório (`Dockerfile` e `docker-compose.yml`), sem dependência de configurações manuais na VM.
- Atualizações de versão devem ser realizadas via rebuild e restart dos containers, sem necessidade de reinstalação do ambiente.

### RNF-10 — Confiabilidade da Mensageria
- O mecanismo de mensageria deve garantir entrega ao menos uma vez para eventos críticos de negócio.
- Filas/tópicos críticos devem ser persistentes para evitar perda de mensagens em reinício dos serviços.
- O sistema deve monitorar volume de mensagens, taxa de erro e tempo médio de processamento por consumidor.

---

## 5. Modelagem Inicial

### 5.1 Diagrama de Casos de Uso

```
┌──────────────────────────────────────────────────────────────────────┐
│                        Sistema de Compras IA                         │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                                                             │    │
│  │   [UC01] Visualizar histórico de preços                     │    │
│  │   [UC02] Consultar previsão de preços                       │    │
│  │   [UC03] Configurar alerta de preço                         │    │
│  │   [UC04] Exportar relatório                                 │    │
│  │   [UC05] Registrar compra realizada                         │    │
│  │                                                             │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                              ▲                                       │
│                              │                                       │
│                        [Comprador]                                   │
└──────────────────────────────────────────────────────────────────────┘

    [Sistema Externo de E-mail] ←─── Notificação de Alertas (UC03)
```

#### Detalhamento dos Casos de Uso Principais

| ID | Caso de Uso | Ator | Pré-condição | Resultado Esperado |
|---|---|---|---|---|
| UC01 | Visualizar histórico de preços | Comprador | Usuário autenticado | Gráfico exibido com filtros aplicados |
| UC02 | Consultar previsão de preços | Comprador | Modelo treinado disponível | Previsão com intervalo de confiança |
| UC03 | Configurar alerta | Comprador | Usuário autenticado | Alerta salvo e ativo |
| UC04 | Exportar relatório | Comprador | Dados carregados | Arquivo PDF/Excel gerado |
| UC05 | Registrar compra realizada | Comprador | Usuário autenticado | Compra registrada e comparada à recomendação |

---

### 5.2 Diagrama de Arquitetura (Visão de Alto Nível)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     CAMADA DE APRESENTAÇÃO — WEB                        │
│                                                                         │
│   ┌──────────────────┐    ┌──────────────────┐    ┌─────────────────┐  │
│   │  Dashboard Web   │    │  Relatórios /    │    │  Configurações  │  │
│   │  (Browser)       │    │  Exportação      │    │  / Alertas      │  │
│   └────────┬─────────┘    └────────┬─────────┘    └────────┬────────┘  │
└────────────┼──────────────────────┼──────────────────────┼─────────────┘
             │                      │                      │
┌────────────┼──────────────────────┼──────────────────────┼─────────────┐
│            │   CAMADA DE APRESENTAÇÃO — MOBILE            │             │
│   ┌────────┴─────────┐            │            ┌─────────┴────────┐    │
│   │  Dashboard Mobile│            │            │  Alertas Push /  │    │
│   │  (iOS / Android) │            │            │  Configurações   │    │
│   └────────┬─────────┘            │            └────────┬─────────┘    │
└────────────┼──────────────────────┼──────────────────────┼─────────────┘
             │                      │                      │
             ▼                      ▼                      ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                          CAMADA DE API / BACKEND                        │
│                                                                         │
│   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌───────────┐ │
│   │ Auth Service │  │ Prices API   │  │ Alert Service│  │ User Mgmt │ │
│   │ (Login/JWT)  │  │ (histórico,  │  │ (config. e   │  │           │ │
│   └──────────────┘  │  filtros)    │  │  disparo)    │  └───────────┘ │
│                     └──────┬───────┘  ┌──────────────┐               │
│                            │          │ Mensageria   │               │
│                            │          │ (Broker)     │               │
│                            │          └──────────────┘               │
└────────────────────────────┼────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         MÓDULO DE IA / ML                               │
│                                                                         │
│   ┌───────────────────┐   ┌───────────────────┐   ┌─────────────────┐ │
│   │  Pré-processamento│   │  Modelo de        │   │  Motor de       │ │
│   │  & Feature Eng.   │──▶│  Previsão         │──▶│  Recomendação   │ │
│   │  (limpeza, lag    │   │  (série temporal) │   │  (regras +      │ │
│   │   features)       │   │                   │   │   ML output)    │ │
│   └───────────────────┘   └───────────────────┘   └─────────────────┘ │
└─────────────────────────────┬──────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                          CAMADA DE DADOS                                │
│                                                                         │
│   ┌──────────────────────┐        ┌──────────────────────────────────┐ │
│   │  Banco de Dados      │        │  Armazenamento de Modelos        │ │
│   │  Relacional          │        │  (modelos treinados serializados) │ │
│   │  (preços, usuários,  │        └──────────────────────────────────┘ │
│   │   alertas, compras)  │                                             │
│   └──────────────────────┘        ┌──────────────────────────────────┐ │
│                                   │  Broker de Mensagens             │ │
│                                   │  (filas, tópicos e DLQ)          │ │
│                                   └──────────────────────────────────┘ │
│                                                                        │
│                                   │  Serviço de E-mail               │ │
│   ┌──────────────────────┐        │  (notificações de alerta)        │ │
│   │  Armazenamento de    │        └──────────────────────────────────┘ │
│   │  Arquivos (CSV/PDF)  │                                             │
│   └──────────────────────┘                                             │
└─────────────────────────────────────────────────────────────────────────┘
```

---

### 5.3 Modelo de Domínio (Entidades Principais)

```
┌──────────────┐       ┌───────────────────┐       ┌───────────────────┐
│   Usuario    │       │  MateriaPrima     │       │  RegistroPreco    │
├──────────────┤       ├───────────────────┤       ├───────────────────┤
│ id           │       │ id                │       │ id                │
│ nome         │       │ nome              │       │ materia_prima_id  │
│ email        │       │ unidade_medida    │       │ data (ano/mês)    │
│ senha_hash   │       │ categoria         │       │ preco             │
│ ativo        │       └─────────┬─────────┘       │ variacao_mensal   │
└──────┬───────┘                 │                  └──────────┬────────┘
└──────┬───────┘            1 ──┤                             │
       │                        │ N                           │ N
       │ N                      ▼                             │
       ▼               ┌──────────────────┐                  ▼
┌─────────────────┐    │    Previsao      │       ┌──────────────────────┐
│     Alerta      │    ├──────────────────┤       │    Recomendacao      │
├─────────────────┤    │ id               │       ├──────────────────────┤
│ id              │    │ materia_prima_id │       │ id                   │
│ usuario_id      │    │ data_geracao     │       │ materia_prima_id     │
│ materia_prid_id │    │ horizonte_meses  │       │ data_geracao         │
│ preco_limite    │    │ preco_previsto   │       │ classificacao        │
│ tipo (max/min)  │    │ intervalo_min    │       │ (Comprar/Aguardar/   │
│ ativo           │    │ intervalo_max    │       │  Atenção)            │
│ notif_email     │    │ tendencia        │       │ justificativa        │
└─────────────────┘    └──────────────────┘       └──────────────────────┘

┌─────────────────────────────────┐
│        CompraRegistrada         │
├─────────────────────────────────┤
│ id                              │
│ usuario_id                      │
│ materia_prima_id                │
│ data_compra                     │
│ preco_pago                      │
│ quantidade                      │
│ recomendacao_vigente_id         │
│ aderiu_recomendacao (bool)      │
└─────────────────────────────────┘
```

---

### 5.4 Fluxo Principal — Recomendação de Compra

```
 Usuário                 Sistema                   Módulo de IA
    │                       │                           │
    │── Acessa dashboard ──▶│                           │
    │                       │── Busca dados históricos ─│
    │                       │                           │── Calcula sazonalidade
    │                       │                           │── Executa forecast
    │                       │                           │── Aplica regras de recomendação
    │                       │◀── Retorna previsão + recomendação ─────────────│
    │◀── Exibe painel ──────│                           │
    │                       │                           │
    │── Configura alerta ──▶│                           │
    │◀── Alerta salvo ──────│                           │
    │                       │                           │
    │  (dias depois)        │                           │
    │                       │── Verifica alertas ativos─│
    │                       │   (job agendado)          │── Atualiza previsão
    │                       │◀── Alerta disparado ──────│
    │◀── E-mail / notif. ───│                           │
    │                       │                           │
    │── Registra compra ───▶│                           │
    │◀── Confirmação ───────│                           │
```

---

## 6. Restrições e Premissas

| Tipo | Descrição |
|---|---|
| **Premissa** | Os dados históricos do Kaggle são usados como base inicial; dados futuros serão inseridos manualmente ou via integração externa |
| **Premissa** | O modelo de IA será treinado com dados mensais; a precisão pode ser menor para commodities com alta volatilidade |
| **Restrição** | A base de dados cobre apenas o período 1990–2020; previsões dependem da qualidade e atualização dos dados recentes |
| **Restrição** | O sistema não realiza compras automaticamente; serve apenas como suporte à decisão (DSS) |
| **Restrição** | Conformidade com LGPD obrigatória no armazenamento de dados de usuários |
| **Premissa** | A hospedagem será realizada em uma Máquina Virtual (VM) Linux, com todos os serviços conteinerizados via Docker e Docker Compose |
| **Restrição** | A disponibilidade e o desempenho da aplicação estarão sujeitos às especificações de CPU, memória e rede da VM contratada |

---

## 7. Fora de Escopo (v1.0)

- Integração automática com ERPs ou sistemas de compras
- Análise de fornecedores ou cotações em tempo real
- Negociação automatizada ou RPA de compras
- Suporte a idiomas além do português

---

## 8. Glossário

| Termo | Definição |
|---|---|
| **Forecast / Previsão** | Estimativa de valores futuros com base em dados históricos usando modelos estatísticos ou de ML |
| **Sazonalidade** | Padrão recorrente em determinados períodos do ano (ex.: preços mais baixos em determinados meses) |
| **Janela de compra** | Período de tempo recomendado para realizar a aquisição de determinada matéria-prima |
| **DSS** | Decision Support System — sistema de suporte à decisão |
| **LGPD** | Lei Geral de Proteção de Dados (Lei nº 13.709/2018) |
| **SLA** | Service Level Agreement — acordo de nível de serviço |

---

*Documento produzido para o Projeto Integrador — 6º Semestre*
