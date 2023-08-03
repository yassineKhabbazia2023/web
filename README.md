# Introduction 
This Styleguide (Pégase) is meant to handle all the styles and nearly all the components of our apps (MFEs).<br/>
It is then distributed as a NPM package. 

# Getting Started

## Private NPM authentication
To set up the configuration, define a global **.npmrc** file instead of using one in this repository.<br/>
If you're using windows, you should create an empty file called **.npmrc** in *C:\Users\yourUsername*.<br/>
Next check [this](https://kpmgfr.visualstudio.com/Constellation/_artifacts/feed/PlateformePulse/connect/npm) and go to the "Other" section.<br/>
From there, **proceed directly to step 1** and follow all the specified instructions.
## Node version
Make sure you're using the same node version as the one specified in the "engine" section of the package.json.<br/>
To make things easier, you can use [NVM](https://github.com/coreybutler/nvm-windows) to manage multiple node versions.

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
