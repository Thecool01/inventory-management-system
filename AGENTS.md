# AGENTS.md — Inventory Management System

## 1. Purpose and scope
This repository is a small React-based inventory management dashboard for viewing products, stock, orders, customers, and business charts. The goal of an AI coding assistant is to make small, reviewable changes while preserving existing user-facing behavior. All changes require human inspection and approval.

## 2. Architecture and important files
- `index.html`: HTML entry point.
- `src/main.jsx`: React application bootstrap.
- `src/App.jsx`: application routes and Material UI theme.
- `src/components/RootComponent.jsx`: shared page layout and navigation.
- `src/components/bodyComponents/inventory/`: inventory UI; `Products.jsx` renders products from `productList.js`.
- `src/components/bodyComponents/order/`: orders UI; `OrderList.jsx` and `OrderModal.jsx` consume data from `listOrders.js`.
- `src/components/bodyComponents/customer/`: customer UI and sample data.
- `src/components/bodyComponents/Home/`, `revenue/`, `growth/`: dashboard and charts.
- `package.json` and `package-lock.json`: npm scripts and dependency definitions.
- `vite.config.js` and `.eslintrc.cjs`: build and lint configuration.
- `src/test/` contains demonstration components, not an established automated test suite.

The project uses JavaScript/JSX, React, Vite, React Router, Material UI, MUI Data Grid, and ApexCharts. Some data is defined in local JavaScript modules; do not assume the presence of a backend or persistent database.

## 3. Local setup
1. Use a supported Node.js and npm installation and work in a separate, non-production copy of the repository.
2. Run `npm ci` to install dependencies from the committed lockfile after reviewing the repository and with human approval for installation.
3. Run `npm run dev` for the local development server.
4. Use `npm run` to inspect scripts if needed.

## 4. Safe commands and boundaries
Read-only inspection commands: `git status --short`, `git diff`, `git log -1 --oneline`, `npm run`.
Allowed local checks after approval: `npm run lint`, `npm run build`, and manual checking through `npm run dev`.
`npm test` is **not configured in the inspected baseline**. Report this limitation accurately; never claim tests passed or invent test counts. Do not add a testing framework without explicit human approval.

Baseline observations from the assignment's local verification: `npm run lint` reported 80 errors; `npm run build` passed with warnings; `npm test` reported a missing script. These observations describe the baseline only and must be rechecked after changes.

## 5. Coding conventions
- Follow the existing JavaScript/JSX and React style. Avoid broad rewrites or converting the entire project to TypeScript.
- Prefer minimal, focused changes with a clear reason and reviewable diff.
- Preserve existing routes, component interfaces, and locally stored sample data unless a specific approved change requires otherwise.
- Use exact path capitalization; the repository contains a `Home` directory with uppercase `H`.
- Keep UI code understandable, and extract reusable logic only when a concrete duplication or coupling problem justifies it.
- Follow Material UI component conventions and use stable React keys for rendered lists.
- Avoid unnecessary console logs and never log private customer or credential information.
- Do not hide lint errors by disabling rules or editing configuration unless the reviewer explicitly approves.

## 6. Test and verification expectations
Before editing: record the baseline commit/hash, working-tree status, relevant files, and existing check results.
For each proposed change: explain the issue, identify the smallest affected file set, show a diff, and explain how the change preserves existing behavior.
After an approved change: rerun all available checks and record exact commands, exit statuses, and outputs; manually check the affected UI path.
At minimum, preserve these acceptance criteria:
- AC1: Inventory, Orders, and Customers navigation remains available.
- AC2: Inventory displays product names, categories, and stock quantities from the provided dataset.
- AC3: The Orders page displays available orders in a table.
- AC4: Order Details opens the selected order's product information.
- AC5: Closing the order details modal does not mutate the underlying order data.
Do not call an acceptance criterion verified unless its corresponding behavior has actually been checked. Describe untested behavior and residual risk explicitly.

## 7. Forbidden actions
Unless explicitly reviewed and approved by the human owner, NEVER:
- Read, print, copy, commit, or expose secrets, credentials, tokens, `.env` files, or confidential/personal data.
- Deploy to production, change live environments, publish a release, push changes, merge branches, or approve your own pull request.
- Execute destructive commands such as `git reset --hard`, `git clean -fd`, `rm -rf`, recursive deletion, or force-push.
- Add, remove, or upgrade dependencies, run `npm audit fix`, or modify `package-lock.json`.
- Change CI/CD, deployment settings, access permissions, security settings, or repository-wide lint rules.
- Modify unrelated files or perform a large-scale refactor outside the approved scope.

## 8. AI work process and human review gates
1. Start with a read-only assessment; separate observed facts from hypotheses and unverified suggestions.
2. Request explicit human approval before any edit, installation, or change in scope.
3. Work only in an approved branch or isolated working copy; keep the original baseline available.
4. Provide a change summary, list of touched files, unified diff, command outputs, manual verification notes, and remaining limitations.
5. A human must inspect and approve the diff and evidence before any merge or deployment. The agent must never auto-merge or auto-deploy.

## 9. Instruction loading disclosure
Do not assume a chat-based coding assistant automatically reads this file. If automatic loading is unavailable or unconfirmed, the human operator must paste the relevant sections into the AI prompt and record that step in the assignment's AI-use evidence.
