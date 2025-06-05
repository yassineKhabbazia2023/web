<template>
  <a
    :href="sanitizedUrl"
    target="_blank"
    rel="noopener"
    class="rss-news-item height--100"
    data-testid="rss-news-item"
  >
    <img
      v-if="imgSrc"
      :src="imgSrc"
      class="rss-news-item__image"
      alt="News Image"
    >
    <section class="rss-news-item__content padding--2">
      <p class="rss-news-item__pub-date margin-bottom--2">{{ newsPubDate }}</p>
      <h4 class="rss-news-item__title h4 font-semibold">{{ newsItem.title }}</h4>
    </section>
  </a>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs'
import { sanitizeUrl } from '@braintree/sanitize-url'
import { RssNewsItem } from '../types/rss-news.types'
import { RSSNewsService } from '../services/rss-news.service'
import { computed } from 'vue'

const props = defineProps<{
  newsItem: RssNewsItem
}>()

const imgSrc = computed(() => RSSNewsService.extractImageUrl(props.newsItem?.description))
const sanitizedUrl = computed(() => sanitizeUrl(props.newsItem.guid))

const newsPubDate = computed(() => {
  if(!props.newsItem?.pubDate) {
    return ''
  }

  return dayjs(props.newsItem?.pubDate).format('DD/MM/YYYY')
})
</script>

<style lang="scss" scoped>
.rss-news-item {
  // restyle the anchor
  display: block;
  text-decoration: none;
  color: inherit;

  transition: background-color 0.25s ease;
  .rss-news-item__pub-date,
  .rss-news-item__title {
    transition: color 0.25s ease;
  }

  .rss-news-item__image {
    height: 150px;
    width: 100%;
    object-fit: cover;

    @media (min-width: 1440px) {
      height: 175px;
    }
    @media (min-width: 1920px) {
      height: 225px;
    }
  }

  .rss-news-item__pub-date {
    font-size: 12px;
    color: var(--el-color-neutral-gray-500);
  }

  .rss-news-item__title {
    $fontSize: 14px;
    $lineClamp: 2;

    font-size: $fontSize;
    // line-clamp needs a fixed height to work properly
    // the height must be relative to the number of lines to clamp
    // height = font-size x line-height (120% by default) x line-clamp
    height: calc($fontSize * 1.2 * $lineClamp);
    overflow: hidden;

    display: -webkit-box;
    -webkit-line-clamp: $lineClamp;
    line-clamp: $lineClamp;
    -webkit-box-orient: vertical;
    box-orient: vertical;
    padding-right: 8px; // leave space for the ellipsis
  }

  &:hover {
    background-color: var(--el-color-base-blue-pulse);
    color: white;

    .rss-news-item__pub-date {
      color: white;
    }
    .rss-news-item__title {
      color: white;
    }
  }
}
</style>
