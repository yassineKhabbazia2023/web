import axios from 'axios'
import { XMLParser } from 'fast-xml-parser'
import { RSS_NEWS_FEED_URL } from '@pulse/common/constants'
import { RssNewsItem } from '../types/rss-news.types'

const RSS_NEWS_XML_PARSER_OPTIONS = {
  processEntities: {
    allowedTags: ['title', 'guid', 'pubDate'],
  },
}

export class RSSNewsService {
  static async getNews(): Promise<RssNewsItem[]> {
    try {
      const response = await axios.get(RSS_NEWS_FEED_URL)
      const jsonData = RSSNewsService.parseXmlToJson(response.data)
      const newsItems = RSSNewsService.getNewsItems(jsonData)

      return newsItems
    } catch (error) {
      throw new Error(`RSSNewsWidget - Failed to fetch news: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  static extractImageUrl(description?: string): string | undefined {
    if (!description) {
      return undefined
    }

    const decodedDescription = RSSNewsService.decodeEscapedHtml(description)
    const imgRegex = /<img[^>]+src="([^">]+)"/
    const match = new RegExp(imgRegex).exec(decodedDescription)

    if (match?.[1]) {
      return match[1]
    }

    return undefined
  }

  private static parseXmlToJson(xmlData: string): any {
    const parser = new XMLParser(RSS_NEWS_XML_PARSER_OPTIONS)
    const jsonObj = parser.parse(xmlData)

    return jsonObj
  }

  private static getNewsItems(jsonData: any): RssNewsItem[] {
    if (jsonData?.rss?.channel?.item === undefined) {
      return []
    }

    const items = jsonData.rss.channel.item
    return Array.isArray(items) ? items : [items]
  }

  private static decodeEscapedHtml(content: string): string {
    return content
      .replaceAll('&lt;', '<')
      .replaceAll('&gt;', '>')
      .replaceAll('&quot;', '"')
      .replaceAll('&apos;', '\'')
      .replaceAll('&#39;', '\'')
      .replaceAll('&amp;', '&')
  }
}
