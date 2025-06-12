import { RSSNewsService } from './rss-news.service'
import axios from 'axios'
import { RSS_NEWS_FEED_URL } from '@pulse/core'

// Mock dependencies
vi.mock('axios')
vi.mock('@pulse/core', () => ({
  RSS_NEWS_FEED_URL: 'https://mock-rss-url.com',
}))

describe('RSSNewsService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getNews', () => {
    it('should return news items when fetch is successful', async () => {
      const mockData = `
        <rss>
          <channel>
            <item>
              <title>News 1</title>
              <link>https://example.com/news1</link>
              <description>Description 1</description>
            </item>
            <item>
              <title>News 2</title>
              <link>https://example.com/news2</link>
              <description>Description 2</description>
            </item>
          </channel>
        </rss>
      `
      const mockParsedData = {
        rss: {
          channel: {
            item: [
              {
                title: 'News 1',
                link: 'https://example.com/news1',
                description: 'Description 1',
              },
              {
                title: 'News 2',
                link: 'https://example.com/news2',
                description: 'Description 2',
              },
            ],
          },
        },
      }

      vi.mocked(axios.get).mockResolvedValueOnce({ data: mockData })
      // we need to cast as any in order to access private method parseXmlToJson
      vi.spyOn(RSSNewsService as any, 'parseXmlToJson').mockReturnValueOnce(mockParsedData)

      const result = await RSSNewsService.getNews()

      expect(axios.get).toHaveBeenCalledWith(RSS_NEWS_FEED_URL)
      expect(result).toHaveLength(2)
      expect(result![0].title).toBe('News 1')
      expect(result![1].title).toBe('News 2')
    })

    it('should return empty array when no news items are found', async () => {
      const mockData = '<rss><channel></channel></rss>'
      const mockParsedData = { rss: { channel: {} } }

      vi.mocked(axios.get).mockResolvedValueOnce({ data: mockData })
      // we need to cast as any in order to access private method parseXmlToJson
      vi.spyOn(RSSNewsService as any, 'parseXmlToJson').mockReturnValueOnce(mockParsedData)

      const result = await RSSNewsService.getNews()

      expect(result).toEqual([])
    })

    it('should throw error when fetch fails', async () => {
      const mockError = new Error('Network error')
      vi.mocked(axios.get).mockRejectedValueOnce(mockError)

      await expect(RSSNewsService.getNews()).rejects.toThrow()
    })
  })

  describe('extractImageUrl', () => {
    it('should extract image URL from description', () => {
      const description = '<p>Some text <img src="https://example.com/image.jpg" alt="Image"> more text</p>'

      const result = RSSNewsService.extractImageUrl(description)

      expect(result).toBe('https://example.com/image.jpg')
    })

    it('should return undefined when description has no image', () => {
      const description = '<p>Some text without image</p>'

      const result = RSSNewsService.extractImageUrl(description)

      expect(result).toBeUndefined()
    })

    it('should return undefined when description is undefined', () => {
      const result = RSSNewsService.extractImageUrl(undefined)

      expect(result).toBeUndefined()
    })

    it('should return undefined when description is empty', () => {
      const result = RSSNewsService.extractImageUrl('')

      expect(result).toBeUndefined()
    })
  })
})
