# 🔐 tlAuth — Autenticação e Controle de Acesso Multi-Tenant com RBAC

Sistema robusto e escalável de autenticação e controle de acesso, projetado para ambientes SaaS multi-tenant. O `tlAuth` centraliza a gestão de usuários, empresas (companies), sistemas e permissões com base no modelo **RBAC (Role-Based Access Control)**.

---

## 🚀 Visão Geral

O `tlAuth` é uma solução de identidade inspirada em arquiteturas modernas de SSO e gestão de acesso, permitindo:

- Cadastro único de usuário, com reutilização entre sistemas.
- Suporte a múltiplos sistemas (ex: `webEditor`, `tlMail`, etc).
- Vários clientes/empresas com usuários distintos e permissões isoladas.
- Controle granular por sistema e empresa com roles e permissões.
- Extensível para uso como **Identity Server com JWT/SSO**.

---

## 🧰 Tecnologias Utilizadas

- **Node.js** + **TypeScript**
- **Express** (framework web)
- **PostgreSQL** (acesso via driver `pg`)
- **node-pg-migrate** (migrations com SQL puro)
- **JWT** para autenticação
- **Docker** e **Docker Compose**
- **ESLint**, **Prettier**, **Husky**, **ts-node-dev**
- **Swagger (OpenAPI)** para documentação automática
- **Arquitetura modular com repositórios manuais**

---

## 🧠 Principais Conceitos

### Cadastro Único de Usuário

- Usuários são globais, identificados por e-mail.
- Associados a uma ou mais empresas (companies).
- Cada associação pode ter diferentes permissões e status.

### Company

- Representa um cliente no ecossistema.
- Contém seus próprios usuários e acessos por sistema.

### Sistema (Service)

- Aplicações como `webEditor`, `tlMail`, `tlDrive`, etc.
- Cada sistema define seus módulos, roles e permissões.

### RBAC - Role-Based Access Control

- Permissões são atribuídas por módulo e agrupadas em roles.
- Cada usuário recebe uma ou mais roles em cada sistema/company.

---

## 🗃️ Estrutura do Banco (resumo conceitual)

| Entidade             | Descrição                                          |
| -------------------- | -------------------------------------------------- |
| `users`              | Cadastro global de usuários                        |
| `companies`          | Empresas (clientes) do sistema                     |
| `company_user`       | Associação entre usuários e companies              |
| `systems`            | Aplicações independentes (webEditor, etc)          |
| `system_modules`     | Módulos de funcionalidades por sistema             |
| `system_roles`       | Grupos de permissões (Admin, Viewer...)            |
| `system_permissions` | Permissões específicas por sistema                 |
| `role_permissions`   | Associação entre roles e permissões                |
| `user_system_access` | Acesso do usuário a um sistema dentro da empresa   |
| `user_system_roles`  | Roles atribuídas ao usuário em determinado sistema |

---

## ✍️ Autor

Desenvolvido por **Luciano Zangeronimo**
🔗 [linkedin.com/in/zangeronimo](https://linkedin.com/in/zangeronimo)
📧 zangeronimo@gmail.com
