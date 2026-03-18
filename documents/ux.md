# Instruções de UX (versão resumida)

## Objetivo
Definir diretrizes de UX para a plataforma de Inteligência de Compras, com base no `PRD.md`, cobrindo web e mobile para garantir decisão de compra mais rápida, redução de custo e uso confiável da recomendação de IA.

## Princípios
- Decisão em poucos cliques: reduzir o caminho entre análise e ação.
- Clareza visual: histórico, previsão e recomendação devem ser entendidos sem conhecimento técnico de ML.
- Consistência: mesma lógica de navegação entre web e mobile.
- Transparência: sempre mostrar data da base, horizonte da previsão e justificativa da recomendação.
- Segurança perceptível: permissões por perfil, sessão e ações sensíveis com confirmação.

## Perfis
- Comprador: acompanha alertas, consulta oportunidades de compra e registra compras.

## Estrutura de navegação
Web: Dashboard, Histórico, Previsões, Alertas, Compras, Perfil.

Mobile: Início, Alertas, Preços, Compras, Perfil.

## Mapeamento dos requisitos funcionais
`RF-01` Importação: fluxo em 4 etapas (upload, validação, resumo, confirmação), com feedback por erro e relatório de inconsistências.

`RF-02` Histórico: gráfico de linha com filtros (matéria-prima, período, variação), destaque de mínima e máxima, cards de resumo (preço atual, variação mensal, média 12 meses).

`RF-03` Forecast: resultados para 1, 3 e 6 meses, banda de confiança, tendência (Alta/Estável/Queda) e recomendação textual com motivo.

`RF-04` Alertas: criação simples (item, condição, limite, canal), lista com status (ativo/pausado/disparado) e feed cronológico no mobile com CTA para detalhe.

`RF-05` Histórico de decisões: registro de compra com validação instantânea e comparação com recomendação vigente na data.

## Jornadas críticas
1. Consultar recomendação e agir:
login -> filtro da matéria-prima -> leitura de previsão/recomendação -> configurar alerta ou registrar compra.

2. Reagir a oportunidade no mobile:
receber push/e-mail -> abrir alerta -> validar tendência -> registrar compra.

## Regras de usabilidade
- Dashboard web em até 3s; processamento de previsão em até 15s.
- Exibir `skeleton loading` em cards, gráficos e tabelas.
- Mensagens de erro orientadas à ação, sem termos técnicos internos.
- Não depender apenas de cor para tendência/risco.
- Web acessível por teclado, com labels e contraste adequado.

## Estados obrigatórios
- Carregando
- Sem dados no período
- Falha de importação/integração
- Sem permissão por perfil
- Offline no mobile com último dashboard sincronizado

## UX writing
- Linguagem direta e de negócio.
- Exemplo de recomendação: "Recomendação: Comprar agora".
- Exemplo de motivo: "Tendência de alta para os próximos 3 meses".
- Exemplo de alerta: "Borracha abaixo do limite definido. Janela favorável".

## Segurança na experiência
- Sessão com timeout de 30 minutos de inatividade.
- Confirmação para ações críticas (registrar compra, configurar alertas).
- Comunicação de privacidade e conformidade LGPD nos fluxos de conta.

## Entregáveis de UX
- Mapa de navegação web/mobile.
- Wireframes de baixa fidelidade para jornadas críticas.
- Protótipo navegável de alta fidelidade (Dashboard, Histórico, Previsões, Alertas, Compras, Perfil).
- Design system inicial com componentes, tokens e estados.
- Guia de handoff com regras responsivas.

## Critérios de aceite
- Toda RF mapeada em tela e fluxo.
- Comprador conclui fluxo alerta -> registro de compra sem suporte.
- Fluxos principais consistentes em web e mobile.
- Acesso sem barreiras do comprador às funcionalidades de consulta e compra.

## Priorização MVP
P1: Login, Dashboard+Histórico, Forecast+Recomendação.
P2: Alertas, Registro de compras.
P3: Histórico e análise de compras realizadas.

## Métricas de validação UX
- Taxa de sucesso nas tarefas críticas >= 90%.
- Tempo para configurar alerta <= 2 minutos.
- Tempo para registrar compra <= 90 segundos.
- CSAT do piloto >= 4,0/5 para Comprador.

Este guia deve orientar discovery, wireframes, protótipo e validação com usuários. Aplicavel ao ciclo do semestre
