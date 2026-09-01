import type { App } from 'vue'
import { i18n } from '@pulse/common/i18n'
import { DelegationRedirectActionManager } from './managers/redirect-action/delegation-redirect-action.manager'
import type { EntitiesAppletOptions } from './types'
import frFR from './i18n/fr-FR.json'
import enUS from './i18n/en-US.json'

export default {
  install(_app: App, options: EntitiesAppletOptions) {
    i18n.global.mergeLocaleMessage('fr-FR', frFR)
    i18n.global.mergeLocaleMessage('en-US', enUS)

    if (options.isCollaboratorApp === true) {
      DelegationRedirectActionManager.registerResolvers()
    }
  },
}
