# **Dataloop Components Library**

[![Components Version](https://img.shields.io/npm/v/@dataloop-ai/components?label=Latest%20Library%20Version)](https://www.npmjs.com/package/@dataloop-ai/components)
![Release Status](https://img.shields.io/badge/Release%20Status-Beta-yellowgreen)

📚 [Storybook Documentation](https://dataloop-ai.github.io/components/)

A customizable Vue components library created specifically for the Dataloop platform and related applications. Built using the Vue3 Composition API, these components maintain compatibility with Vue2 via `vue-demi`.

---

## **Table of Contents**

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
  - [Using Components](#using-components)
  - [Adding New Components](#adding-new-components)
- [Development](#development)
  - [Project Setup](#project-setup)
  - [Available Scripts](#available-scripts)
- [Troubleshooting](#troubleshooting)
- [Security Guidelines](#security-guidelines)

---

## **Overview**

The `Dataloop Components Library` provides reusable, maintainable, and tested Vue components. Components are documented and visualized using Storybook, ensuring seamless integration and straightforward development workflows.

- **Vue3 Composition API**
- **Backward compatibility with Vue2** (requires `vue-demi`)
- **Built-in tests and linting**

---

## **Prerequisites**

- **Node.js** (v14+ recommended)
- **npm** (v6+ recommended)
- **Git**
- **Visual Studio Code** (recommended development environment)

---

## **Installation**

Install components via npm from the public registry:

```bash
npm i @dataloop-ai/components
```

**For Vue2 projects:**

```bash
npm i @vue/composition-api vue-demi
```

---

## **Usage**

### **Using Components**

Import and use components in your Vue application:

```vue
<script setup>
import { DlButton } from '@dataloop-ai/components'
</script>

<template>
  <DlButton label="Click Me" />
</template>
```

### **Adding New Components**

To add a new component, create a Pull Request (PR) with:

- Component Vue file (`ComponentName.vue`)
- Corresponding Storybook story file (`ComponentName.stories.js`)
- Comprehensive component tests

Any PR missing these elements will not be approved.

---

## **Development**

### **Project Setup**

Clone and prepare your development environment:

```bash
git clone <repository-url>
cd components
npm install
```

### **Available Scripts**

Use these scripts for local development:

| Command                | Description                                      | Usage                   |
|------------------------|--------------------------------------------------|-------------------------|
| `npm run dev`          | Runs a local Vite server for component testing   | `npm run dev`           |
| `npm run storybook`    | Runs a local Storybook server                    | `npm run storybook`     |
| `npm run test`         | Runs all component tests                         | `npm run test`          |

**Visual Studio Code configurations** (`launch.json`):

- Vite server for Vue3 environment
- Storybook server
- Tests execution

---

## **Troubleshooting**

- **Compatibility Issues with Vue2:**
  - Ensure you have installed `vue-demi` and `@vue/composition-api`.

- **Storybook Not Loading:**
  - Verify dependencies with `npm install`.
  - Restart the Storybook server.

- **Test Failures:**
  - Ensure code passes linting before committing.
  - Check detailed test output to locate issues.

---

## **Security Guidelines**

- ❌ Do not commit sensitive or secret information.
- 📌 Maintain component security best practices.
- 🔐 Regularly audit and update dependencies.

---

## **Repository Governance**

This repository is governed according to our established guidelines to ensure consistency, security, and efficiency.

#### 1. Quarterly Reviews
Regular audits to verify repository activity, permissions, compliance, and health.

#### 2. Deprecation Process
Inactive or redundant repositories (no commits for 6+ months) are proposed for archival with stakeholder notification and a feedback period.

#### 3. Public/Private Evaluation
Annual assessments or upon significant changes, evaluating security, intellectual property, and compliance implications.

For repository issues or suggestions, please use the dedicated Slack channel (`#github-repo-governance`) or raise a ticket in the Repository Governance Jira board.

For detailed information, please see the [Repository Governance Document](https://dataloop.atlassian.net/wiki/spaces/DG/pages/1342799902/Git+Repository+Governance+Process?force_transition=34c5fc5b-725f-4d3e-8687-06e76a169d5e) or contact the DevOps Team.