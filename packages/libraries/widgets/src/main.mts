import type { App } from 'vue'
import { commoni18n } from '@pulse/common'
import digilabWidget from './widgets/grid/digilab/digilab.widget.mts'
import pennylaneIntroWidget from './widgets/grid/pennylane-intro/pennylane-intro.widget.mts'
import powerBIIntroWidget from './widgets/grid/power-bi-intro/power-bi-intro.widget.mts'
import rssNewsWidget from './widgets/grid/rss-news/rss-news.widget.mts'
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
