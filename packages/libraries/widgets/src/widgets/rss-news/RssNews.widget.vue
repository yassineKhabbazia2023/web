<template>
  <div
    class="widget-rss-news height--100"
    data-testid="widget-rss-news"
  >
    <header
      class="
        widget-rss-news__header
        flex
        flex--align-items-center
        flex--justify-content-space-between
        margin-bottom--4
      "
    >
      <PTitle
        :pTitle="t('widgets.rssNews.title')"
        class="widget-rss-news__header-title"
        :pIconSize="'24'"
      />
      <a
        class="
          el-button el-button--default
          el-button--small
          p-button
          p-button--secondary
        "
        :href="RSS_NEWS_SITE_URL"
        target="_blank"
        rel="noopener"
      >
        {{ t('widgets.rssNews.seeMore') }}
      </a>
    </header>
    <main
      v-if="isLoading === false"
      class="widget-rss-news__main"
    >
      <RSSNewsItemComponent
        v-for="(item, index) in news"
        :key="index"
        :newsItem="item"
      />
    </main>
    <section
      v-if="isLoading"
      class="
        widget-rss-news__loading
        flex
        flex--align-items-center
        flex--justify-content-center
      "
    >
      <PLoader
        pType="primary"
        pSize="40"
      />
    </section>
    <section
      v-if="isLoading === false && news.length === 0"
      class="
        widget-rss-news__no-news
        flex
        flex--align-items-center
        flex--justify-content-center
        bg--neutral-gray-50
      "
    >
      {{ t('widgets.rssNews.noNews') }}
    </section>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { logger, RSS_NEWS_SITE_URL } from '@pulse/core'
import { RSSNewsService } from './services/rss-news.service'
import { RssNewsItem } from './types/rss-news.types'
import { PTitle, PLoader } from '@pulse/styleguide/components'

import RSSNewsItemComponent from './components/RSSNewsItem.component.vue'

const { t } = useI18n()

const news = ref<RssNewsItem[]>([])
const isLoading = ref(false)

const getRSSNews = async () => {
  try {
    startLoading()
    const rssNews = await RSSNewsService.getNews()
    if (rssNews && rssNews.length > 0) {
      // limit the number of news items to 4
      rssNews.length = Math.min(rssNews.length, 4)
      news.value = rssNews
    }
  } catch (error) {
    logger.error('Error fetching news:', error)
  } finally {
    stopLoading()
  }
}

const startLoading = () => {
  isLoading.value = true
}

const stopLoading = () => {
  isLoading.value = false
}

onMounted(() => {
  getRSSNews()
})
</script>

<style lang="scss" scoped>
.widget-rss-news {
  .widget-rss-news__header-title {
    font-size: 21px;
  }

  .widget-rss-news__loading,
  .widget-rss-news__no-news {
    height: 75%;
  }

  .widget-rss-news__main {
    display: grid;
    grid-template-columns: repeat(2, minmax(150px, 1fr));
    grid-gap: 16px;

    @media (max-width: 1439px) {
      // hide the last items on smaller screens
      > *:nth-child(3),
      > *:nth-child(4) {
        display: none;
      }
    }

    @media (min-width: 1440px) {
      grid-template-columns: repeat(3, minmax(150px, 1fr));
      grid-gap: 24px;
      // hide the last item on medium screens
      > *:nth-child(4) {
        display: none;
      }
    }

    @media (min-width: 1920px) {
      grid-template-columns: repeat(4, minmax(150px, 1fr));
      grid-gap: 24px;

      // un-hide the last item on big screens
      > *:nth-child(4) {
        display: initial;
      }
    }
  }
}
</style>
