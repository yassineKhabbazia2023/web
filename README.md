# Common

## Getting Started
Please follow the instructions in the [Common wiki](https://kpmgfr.visualstudio.com/Constellation/_wiki/wikis/Constellation.wiki/16902/Common)!

## Inform yourself before contributing

- [Contributing guide](../.azuredevops/conventions/CONTRIBUTING-VUE.md)
- [Code of conduct](../.azuredevops/conventions/CODE_OF_CONDUCT.md)
- [Commit convention](../.azuredevops/conventions/COMMIT_CONVENTION.md.md)
- [Review convention](../.azuredevops/conventions/REVIEW_CONVENTION.md)

## Install
1. Clone this repository on your local environment.
2. Install dependencies: `npm i`.
4. Run `npm run dev`.
5. Refer to the [Shell: Override of mfe's wiki](https://kpmgfr.visualstudio.com/Constellation/_wiki/wikis/Constellation.wiki/16901/Shell?anchor=override-des-mfes)

## Override an environment variable
You are in the good place in order to override an environment variable as api endpoint, public token etc.
1. Open kpmg pulse from one environment as d2, recette, preprod etc.
2. Open devtools and type this instruction into the console `window.EnvVars`, and copy object's output
3. Create a file named `.env.local` in the root folder of this repo and paste it the object value as plain text, removing leading and trailing brackets
4. Begin to add/edit your variables. Be sure they begin them with the prefix `VITE_`
5. For more specifications, read the ViteJs official documentation about [environment variables and mode](https://vitejs.dev/guide/env-and-mode.html)

## License

[KPMG Pulse](https://www.kpmg-pulse.fr/)

Copyright (c) 2013-present, KPMG France