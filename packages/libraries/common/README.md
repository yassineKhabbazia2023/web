# Introduction 

The `@pulse/common` project is a TypeScript library (with some Vue elements) that provides developers with various helpers, services, and common functionalities shared between the app and the plugins.
It originated from the [KPMG.Pulse.Front.Common](https://kpmgfr.visualstudio.com/Constellation/_git/KPMG.Pulse.Front.Common) project.

# Getting Started

The initialization process is managed at the root of the monorepo using npm’s `workspaces` feature. Please refer to the [root README](../../../README.md) for instructions on installing all dependencies and getting started.

As this is a library and not a standalone application, it cannot be run independently. However, you can build and test it.

# Build and Test

The application is built using [Vite](https://vitejs.dev/).
To build the application, use:

```
npm run build
```

To run tests, use:

```
npm run test
```