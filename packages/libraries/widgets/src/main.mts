import type { App } from 'vue'
import { commoni18n } from '@pulse/common'
import digilabWidget from './widgets/digilab/digilab.widget.mts'
import pennylaneIntroWidget from './widgets/pennylane-intro/pennylane-intro.widget.mts'
import powerBIIntroWidget from './widgets/power-bi-intro/power-bi-intro.widget.mts'
import rssNewsWidget from './widgets/rss-news/rss-news.widget.mts'
import frFR from './i18n/fr-FR.json'
import enUS from './i18n/en-US.json'

export default {
  install(app: App, _options: any) {

    // Register i18n
    commoni18n.value.global.mergeLocaleMessage('fr-FR', frFR)
    commoni18n.value.global.mergeLocaleMessage('en-US', enUS)

    // Register all widgets here
    // Consumers will pick the widgets they want to use through the widget manager
    app.use(digilabWidget, {})
    app.use(pennylaneIntroWidget, {})
    app.use(powerBIIntroWidget, {})
    app.use(rssNewsWidget, {})
  },
}
