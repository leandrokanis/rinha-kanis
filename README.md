# Rinha Kanis

## Scripts Disponíveis

- `bun s` - Executa o servidor
- `bun run lint` - Executa o linter para verificar problemas de código
- `bun run lint:fix` - Executa o linter e corrige automaticamente os problemas que podem ser corrigidos

## Linter e Formatação

Este projeto usa ESLint com Stylistic para manter a qualidade e consistência do código.

### ESLint + Stylistic
- Configurado com regras específicas para TypeScript e boas práticas
- Regras de nomenclatura para interfaces (prefixo 'I') e tipos (prefixo 'T')
- Verificação de imports não utilizados
- Formatação automática com Stylistic:
  - Indentação: 2 espaços
  - Aspas simples
  - Sem ponto-e-vírgula
  - Suporte a JSX
  - Largura máxima de linha: 100 caracteres

## Desenvolvimento

1. Execute `bun run lint` para verificar problemas
2. Use `bun run lint:fix` para corrigir problemas automaticamente