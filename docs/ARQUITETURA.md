# Arquitetura do Projeto

Este projeto segue os princípios de Clean Architecture, SOLID, Aggregate e Domain-Driven Design (DDD) para garantir escalabilidade, manutenibilidade e testabilidade.

## Estrutura de Pastas

- **/src/domain**: Entidades, agregados, interfaces de repositório, regras de negócio (core domain)
- **/src/application**: Casos de uso, serviços de aplicação, portas de entrada/saída
- **/src/infrastructure**: Implementações concretas de repositórios, integrações externas (ex: Web3, MetaMask)
- **/src/presentation**: Componentes React, hooks, providers, UI
- **/docs**: Documentação de arquitetura, decisões e diagramas

## Princípios

- **Clean Architecture**: Separação clara entre camadas, dependências direcionadas para o domínio
- **SOLID**: Classes e funções coesas, abertas para extensão e fechadas para modificação, injeção de dependências
- **DDD**: Foco no domínio, uso de entidades, agregados, serviços de domínio e casos de uso
- **Aggregate**: Entidades agrupadas para consistência transacional

## Fluxo de Integração MetaMask

1. Usuário acessa a UI (presentation)
2. UI aciona caso de uso de conexão de carteira (application)
3. Caso de uso interage com serviço Web3 (infrastructure)
4. Serviço Web3 utiliza MetaMask (infrastructure)
5. Resultado retorna para UI

Veja o diagrama em docs/diagramas.md para detalhes visuais.