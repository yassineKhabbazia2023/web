# Introduction
The goal of this repository is to serve as boilerplate / base for all others MFE.
By doing this, all the repositories will have the same base & arbo.

[DAT](https://kpmgfr.visualstudio.com/Constellation/_wiki/wikis/Constellation.wiki/16910/Boilerplate)

# TODO
- clean warnings in browser's devtools console

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
    '@kpmg/aMfeAlreadySet': 'http://localhost:8082/src/main.ts',
    '@kpmg/myNewMfe'      : 'http://localhost:8083/src/main.ts', // here we increment the port compare to the last one on the previous line (aMfeAlreadySet = 8082, so myNewMfe = 8083)
  }
})
```

Lauch the command `tools/New-Mfe.ps1` (see commmand documentation, available with `Get-Help tools/New-Mfe.ps1` for details).

Note: you must be able to create repositories and pipelines in the Constellation project using the provided PAT.

# Add routes

Routes are located in ``main.ts`` file.<br/>
Our MFE routes are injected inside the ``routes`` object coming from the ``common`` dependency.<br/>
So if needed, you simply have to push the needed routes to the ``routes`` object
You can see that the component related to the requested page is loaded thanks to a function.
This means that we're lazily loading the related component.<br/>
If you want to know more about this, [read this section about lazy route loading](https://router.vuejs.org/guide/advanced/lazy-loading.html).
