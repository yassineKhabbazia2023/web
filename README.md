# Introduction

Welcome to the Pulse web front repository.
This repository is structured as a monorepo and a package, encompassing several components:

- **[App](./packages/app/README.md)**
- **library**:
    - [Common](./packages/libraries/common/README.md)
- **applets**:
    - [Entities](./packages/applets/entities/README.md)
    - [Ged](./packages/applets/ged/README.md)
    - [Launcher](./packages/applets/launcher/README.md)
    - [Login](./packages/applets/login/README.md)
    - [Mandate](./packages/applets/mandate/README.md)
- **External Package** (installed via private npm):
    - [StyleGuide](https://kpmgfr.visualstudio.com/Constellation/_git/KPMG.Pulse.Front.Styleguide)

The application is built as a Vue 3 app, integrating the applets as [Vue Plugins](https://vuejs.org/guide/reusability/plugins) directly from the monorepo and the external package installed via private npm.

# Getting Started

## Prerequisites

1. Ensure you have the correct Node.js version (refer to the [package.json](./package.json)).
2. Place the `.npmrc` file at the root and complete the [registration setup](https://kpmgfr.visualstudio.com/Constellation/_artifacts/feed/PlateformePulse/connect/npm)

To initiate the process, run the following command:

```
npm install
```

## Let's start

Refer to the `package.json` at the root or check the `package.json` files in each app, applet, and library for more information and scripts. This monorepo utilizes the  `workspaces` feature of npm (see [official documentation](https://docs.npmjs.com/cli/v10/using-npm/workspaces)).

# Build and Test

To start the app in development mode from the root directory:

```
npm run app:dev
```

Alternatively, navigate to the app directory `./packages/app` and run:

```
npm run dev
```


To build or test every package in the monorepo from the root directory:

```
npm run build
```

```
npm run test
```
