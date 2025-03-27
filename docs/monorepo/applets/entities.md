# Entities 

Le projet `@pulse/entities` est un plugin Vue 3 qui facilite la gestion des entités au sein de l'application.

Le processus d'initialisation est géré à la racine du monorepo en utilisant la fonctionnalité `workspaces` de npm.

Comme il s'agit d'un plugin et non d'une application autonome, il ne peut pas être exécuté indépendamment. Cependant, vous pouvez le builder et le tester.

## Les scripts

Référez-vous au `package.json` pour les scripts que vous pouvez exécuter sur ce package.

@[code{10-18} json:no-line-numbers title="./packages/applets/entities/package.json"](@root/packages/applets/entities/package.json)