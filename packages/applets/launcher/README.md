# Introduction 

The `@pulse/launcher` project is a Vue 3 Plugin allowing a user to launch external and partners apps. 
It originated from the [KPMG.Pulse.Front.Launcher](https://kpmgfr.visualstudio.com/Constellation/_git/KPMG.Pulse.Front.Launcher) project.

# Getting Started

The initialization process is managed at the root of the monorepo using npm’s `workspaces` feature. Please refer to the [root README](../../../README.md) for instructions on installing all dependencies and getting started.

As this is a plugin and not a standalone application, it cannot be run independently. However, you can build and test it.

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