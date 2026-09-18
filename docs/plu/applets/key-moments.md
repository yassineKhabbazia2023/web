# Key Moments

Le projet `@pulse/key-moments` est un plugin Vue 3 qui affiche le rapport Moment Clé d'une entité : un jeu de tableaux, graphiques et commentaires construit à partir d'une clôture livrée et d'un template d'auteur.

Il expose deux surfaces. Le collaborateur, depuis la fiche d'une entité, importe les clôtures, arbitre les commentaires et publie le moment clé ; un aperçu lui montre ce que le client lit, et c'est de là qu'il dépublie. Le client, lui, ne lit que ce qui a été publié sur son dossier. Une troisième surface, dans les réglages du portefeuille, gère le référentiel d'indicateurs et les templates de rapport (éditeur, versions, visibilité). La version publiée s'exporte en PDF et en PowerPoint.

L'applet ne produit aucun chiffre : variations, pourcentages, ratios et totaux sont livrés par l'export. Il lit, met en forme et colore.

Le processus d'initialisation est géré à la racine du monorepo en utilisant la fonctionnalité `workspaces` de npm.

Comme il s'agit d'un plugin et non d'une application autonome, il ne peut pas être exécuté indépendamment. Cependant, vous pouvez le builder et le tester.

## Les scripts

Référez-vous au `package.json` pour les scripts que vous pouvez exécuter sur ce package.

<<< @/../packages/applets/key-moments/package.json
