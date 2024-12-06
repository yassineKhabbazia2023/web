# Introduction 

The `@pulse/styleguide` project is a Vue Components library. It contains the Design System of Pulse.

# Getting Started

The initialization process is managed at the root of the monorepo using npm’s `workspaces` feature. Please refer to the [root README](../../../README.md) for instructions on installing all dependencies and getting started.

You can see the components in action in a separate build of the library :

```
npm run story:dev
```

# Adding new pictures or icons

After adding pictures (in `packages\libraries\styleguide\src\assets\images-origin`) or icons (in `packages\libraries\styleguide\src\assets\icons`) you need to generate them with the following script:

```
npm run generate
```

# Other scripts

Refer to the [package.json](./package.json) for the scripts you can execute on this package.