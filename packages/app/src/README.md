# Introduction 
Ce MFE permettra de gérer toutes les routes sans utiliser le router de Single SPA.
Tous les composants (pages) appelés dans les routes devront etre importés via un import dynamique a des fins d optimisation.
Ce MFE permettra aussi la création et gestion de layouts afin de ne pas dupliquer les éléments communs a toutes les pages comme par exemple le header & la navbar.

DAT: https://kpmgfr.visualstudio.com/Constellation/_wiki/wikis/Constellation.wiki/16988/Router 

# Getting Started
TODO: Guide users through getting your code up and running on their own system. In this section you can talk about:
1.	Installation process
2.	Software dependencies
3.	Latest releases
4.	API references

# Build and Test
TODO: Describe and show how to build your code and run the tests. 

# Contribute
## NOTES ABOUT vi.dynamicImportSettled()
If you use Styleguide components in your component, don't stub it in your unit test and invoke:
await flushPromises once
await vi.dynamicImportSettled() 6x or more
https://github.com/vitest-dev/vitest/issues/1328#issuecomment-1534452603

