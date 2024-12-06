# Introduction

Welcome to the Pulse web front repository.
This repository is structured as a monorepo and a package, encompassing several components:

- **[App](./packages/app/README.md)**
- **library**:
    - [Common](./packages/libraries/common/README.md)
    - [core](./packages/libraries/core/README.md)
    - [StyleGuide](./packages/libraries/styleguide/README.md)
- **applets**:
    - [Entities](./packages/applets/entities/README.md)
    - [Ged](./packages/applets/ged/README.md)
    - [Launcher](./packages/applets/launcher/README.md)
    - [Login](./packages/applets/login/README.md)
    - [Mandate](./packages/applets/mandate/README.md)

The application is built as a Vue 3 app, integrating the applets as [Vue Plugins](https://vuejs.org/guide/reusability/plugins) directly from the monorepo and the external package installed via private npm.

# Getting Started

## Prerequisites

1. Ensure you have the correct Node.js version (refer to the [package.json](./package.json)).

To initiate the process, run the following command:

```
npm install
```

## Let's start

Refer to the [package.json](./package.json) at the root or check the `package.json` files in each app, applet, and library for more information and scripts. This monorepo utilizes the  `workspaces` feature of npm (see [official documentation](https://docs.npmjs.com/cli/v10/using-npm/workspaces)).
