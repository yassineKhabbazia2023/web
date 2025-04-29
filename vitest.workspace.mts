import { defineWorkspace } from 'vitest/config'

// L'intégralité de la refonte du routing n'ayant pas encore été profondément testée,
// il n'est pas pertinent, pour le moment, de consacrer du temps à la rédaction de tests, pour plusieurs raisons :
// - Nous testions auparavant des composants en entrée-sortie, indépendamment de leur contenu.
//   Désormais, à la fois le résultat attendu et l'implémentation ont radicalement changé.
// - Nous testons désormais principalement des fonctions réalisant des manipulations précises.
//   Ces nombreuses fonctions étant encore susceptibles d'évoluer avant stabilisation,
//   il est préférable de repousser la rédaction des tests jusqu'à validation complète de la refonte du routing.
export default defineWorkspace([
  'packages/libraries/core',
  // 'packages/libraries/*',
  // 'packages/applets/*',
  // 'packages/app',
])