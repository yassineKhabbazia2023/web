# Common

Le projet `@pulse/common` est une bibliothèque TypeScript (avec quelques éléments Vue) qui fournit aux développeurs divers assistants, services et fonctionnalités communes partagées entre l'application et les plugins.

Le processus d'initialisation est géré à la racine du monorepo en utilisant la fonctionnalité `workspaces` de npm.

Comme il s'agit d'une bibliothèque et non d'une application autonome, elle ne peut pas être exécutée indépendamment. Cependant, vous pouvez la builder et la tester.

## Les scripts

Référez-vous au `package.json` pour les scripts que vous pouvez exécuter sur ce package.

@[code{16-24} json:no-line-numbers title="./packages/libraries/common/package.json"](@root/packages/libraries/common/package.json)