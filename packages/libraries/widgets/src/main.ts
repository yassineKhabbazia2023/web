import type { App } from 'vue'
import { i18n } from '@pulse/common/i18n'
import contactsWidget from './widgets/grid/contacts/contacts.widget'
import digilabWidget from './widgets/grid/digi-lab/digi-lab.widget'
import keyMomentsWidget from './widgets/grid/key-moments/key-moments.widget'
import pennylaneIntroWidget from './widgets/grid/pennylane-intro/pennylane-intro.widget'
import smartIntroWidget from './widgets/grid/smart-intro/smart-intro.widget'
import powerBIIntroWidget from './widgets/grid/power-bi-intro/power-bi-intro.widget'
import rssNewsWidget from './widgets/grid/rss-news/rss-news.widget'
import workspaceIntroWidget from './widgets/grid/workspace-intro/workspace-intro.widget'
import frFR from './i18n/fr-FR.json'
import enUS from './i18n/en-US.json'

export default {
  install(app: App, _options: any) {
    i18n.global.mergeLocaleMessage('fr-FR', frFR)
    i18n.global.mergeLocaleMessage('en-US', enUS)

    // Register all widgets here
    // Consumers will pick the widgets they want to use through the widget grid manager
    app.use(contactsWidget, {})
    app.use(digilabWidget, {})
    app.use(keyMomentsWidget, {})
    app.use(pennylaneIntroWidget, {})
    app.use(powerBIIntroWidget, {})
    app.use(rssNewsWidget, {})
    app.use(smartIntroWidget, {})
    app.use(workspaceIntroWidget, {})
  },
}
