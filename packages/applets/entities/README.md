# Introduction
The goal of this repository is to serve a mfe in Single Spa for switching between entities on KPMG Pulse.

# Setup
This repository uses two npm packages (eslint config & vite config) that are on the kpmg repository, so updating the .npmrc user is mandatory if it s not already done, (link)[https://kpmgfr.visualstudio.com/Constellation/_artifacts/feed/PlateformePulse/connect/npm]

## For development
* Clone this repository
* Update the shell
```js
// KPMG.Pulse.Front.Shell/src/manifest.js
// ...
im.textContent = JSON.stringify({
  imports: {
    (...)
    '@kpmg/entities'      : 'http://localhost:8084/src/main.ts'
  }
})
```
