# DOGUP Contábil - Sistema de Conformidade Tributária

Sistema de monitoramento de conformidade fiscal para escritórios de contabilidade e departamentos fiscais.

## Stack Tecnológica

- **Frontend**: SvelteKit 2 + Svelte 5 (runes)
- **ORM**: Prisma
- **Banco de Dados**: PostgreSQL
- **Styling**: TailwindCSS
- **Deploy**: Vercel

## Funcionalidades

- **Dashboard**: Visão consolidada da conformidade fiscal
- **GOB 360°**: Gestão completa da base de clientes
- **Obrigações Acessórias**: Monitoramento DCTFWeb e outras
- **Situação Fiscal Federal**: Status de regularidade
- **Parcelamentos Federais**: Acompanhamento de débitos
- **Certificados Digitais**: Validade e gestão
- **Caixa Postal e-CAC**: Mensagens e notificações
- **Simples Nacional**: Clientes optantes
- **PER/DCOMP**: Pedidos de restituição e compensação

## Instalação

```bash
# Instalar dependências
npm install

# Configurar banco de dados
cp .env.example .env
# Edite .env com sua URL do PostgreSQL

# Gerar Prisma Client
npx prisma generate

# Aplicar migrations
npx prisma db push

# Iniciar ambiente de desenvolvimento
npm run dev
```

## Credenciais Demo

- Email: `admin@dogup.com.br`
- Senha: `admin123`

## Estrutura do Projeto

```
src/
├── lib/
│   ├── components/        # Componentes reutilizáveis
│   │   └── dashboard/     # Componentes do dashboard
│   ├── server/            # Utilitários server-side
│   └── utils/            # Funções utilitárias
├── routes/
│   ├── dashboard/        # Páginas do dashboard
│   └── login/            # Página de login
└── app.css              # Estilos globais
```

## Modelo de Dados

O sistema utiliza arquitetura multi-empresa:
- **Empresa**: Escritório de contabilidade
- **Usuario**: Funcionários da empresa
- **Cliente**: CNPJs atendidos
- **Obrigacao**: Obrigações acessórias (DCTFWeb, etc.)
- **Parcelamento**: Débitos parcelados
- **Certificado**: Certificados digitais
- **Mensagem**: Mensagens e-CAC

## Cores Semânticas

- **Verde**: Conformidade / Regular
- **Amarelo**: Atenção / Em processo
- **Vermelho**: Crítico / Irregular / Atrasado
