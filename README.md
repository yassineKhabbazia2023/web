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

# Icons
A script located at `scripts/pulse-icon-gen.js` permits the generation of the icons components.
This script is launched in each npm scripts:
- predev
- prebuild
- prestory:dev
- prestory:build
Its job is to scan the folder `src/assets/icons` and extracts the svg, grouped by categories, in order to generate Vue components for each icons in the folder `src/atoms/PIcon/components`. It also generates an `index.ts` file in this repository for typings and finally a `constants.ts` for list of icons grouped by categories in order to be used in the story of histoire.

### Icons story
In Histoire, the story allows to simply search (grouped by categories) and copies the component in you clipboard.
Simply one click on the icon in Histoire Icon Story copies the name of the Icon in your clipboard (ex. `PIClipboardData` )
A double click copies the component PIcon and the related icon in the correct format to use:
```ts
  <PIcon color="#00FF00" size="20px">
    <PIClipboardData />
  </PIcon>
```
Just don't forget to change the props color and size accordingly.

## Images url
Images domain name is set by setAssetsBaseUrl()

When Histoire starts, it loads env-vars.json file that is supposed to contain
`VITE_ASSETS_BASE_URL` variable.

`env-vars.json` is written by a script for each environment on Server side

_example, when Histoire is running locally:_

    # env-vars.json
    {
      "VITE_ASSETS_BASE_URL": "http://localhost:6007/src/assets/images/"
    }

_example, when Histoire is running on ITG:_

    # env-vars.json
    {
      "VITE_ASSETS_BASE_URL": "https://assets-itg01.itg.kpmg-pulse.fr"
    }

