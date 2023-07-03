# Introduction 
This Styleguide (Pégase) is meant to handle all the styles and nearly all the components of our apps (MFEs).\
It is then distributed as a NPM package. 

# Getting Started
Before you try to install anything, make sure your root .npmrc file (not the one in this repository) is configured as we're using a private NPM repository.\
Otherwise, check [this](https://kpmgfr.visualstudio.com/Constellation/_artifacts/feed/PlateformePulse/connect/npm).

Then make sure you're using the same node version as the one specified in the "engine" section of the package.json.\
To make things easier, you can use [NVM](https://kpmgfr.visualstudio.com/Constellation/_artifacts/feed/PlateformePulse/connect/npm) to manages multiple node versions.

Then, you just have to do
```bash
  npm i
```

Then start the project
```bash
  npm run dev
```

If you tried to install the dependencies before configuring your NPM authentication you might get a 401 error.\
If that's the case just try to delete your package.lock file and the redo
```bash
  npm i
```

# Tests
To run all the unit tests, you just have to run
```bash
  npm test
```
