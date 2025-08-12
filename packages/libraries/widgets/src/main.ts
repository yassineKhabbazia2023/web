import type { App } from 'vue'
import { i18n } from '@pulse/common/i18n'
import digilabWidget from './widgets/grid/digi-lab/digi-lab.widget'
import pennylaneIntroWidget from './widgets/grid/pennylane-intro/pennylane-intro.widget'
import powerBIIntroWidget from './widgets/grid/power-bi-intro/power-bi-intro.widget'
import rssNewsWidget from './widgets/grid/rss-news/rss-news.widget'
import frFR from './i18n/fr-FR.json'
import enUS from './i18n/en-US.json'

// Register i18n
i18n.global.mergeLocaleMessage('fr-FR', frFR)
i18n.global.mergeLocaleMessage('en-US', enUS)

export default {
  install(app: App, _options: any) {

    // Register all widgets here
    // Consumers will pick the widgets they want to use through the widget grid manager
    app.use(digilabWidget, {})
    app.use(pennylaneIntroWidget, {})
    app.use(powerBIIntroWidget, {})
    app.use(rssNewsWidget, {})
  },
}
