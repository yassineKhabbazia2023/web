import type { App } from 'vue'
import digilabWidget from './widgets/digilab/digilab.widget.mts'
import pennylaneIntroWidget from './widgets/pennylane-intro/pennylane-intro.widget.mts'
import SSOWidget from './widgets/sso/sso.widget.mts'
import powerBIIntroWidget from './widgets/power-bi-intro/power-bi-intro.widget.mts'
import rssNewsWidget from './widgets/rss-news/rss-news.widget.mts'

export default {
  install(app: App, _options: any) {

    // Register all widgets here
    // Consumers will pick the widgets they want to use through the widget manager
    app.use(digilabWidget, {})
    app.use(pennylaneIntroWidget, {})
    app.use(SSOWidget, {})
    app.use(powerBIIntroWidget, {})
    app.use(rssNewsWidget, {})
  },
}
