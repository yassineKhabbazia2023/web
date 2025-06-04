# Monorepo

## Qu'est-ce qu'un monorepo ?

Un monorepo est une stratégie de gestion de code source où plusieurs projets liés sont stockés dans un unique dépôt, plutôt que dans des dépôts séparés.

### Avantages pour le développement

* Partage de code facilité : on peut aisément retrouver les composants UI, utilitaires et configurations à travers différentes applications (via la recherche ou la navigation vers l'implémentation)

* Cohérence technique : les versions de dépendances et d'outils de build sont de facto harmonisées

* Refactoring simplifié : on modifie dans la même PR les API partagées et on visualise immédiatement l'impact sur l'application en local

### Caractéristiques principales

* Structure organisée : Un monorepo contient typiquement plusieurs packages, applications ou bibliothèques dans des sous-répertoires bien définis (souvent dans un dossier `packages`)

* Histoire de commits unifiée : Toutes les modifications apportées aux différents projets sont tracées dans une chronologie commune, facilitant la compréhension de l'évolution globale