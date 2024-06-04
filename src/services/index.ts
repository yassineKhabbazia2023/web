import commonApi from '../api'

export const fetchUrlTerms = async (
  lang: string = 'fr',
): Promise<string | undefined> => {
  const urlTerms = `contact/api/contacts/terms/latest/content?language=${lang}`
  try {
    const {
      data: { value },
    } = await commonApi().gateway.get(urlTerms)
    return value
  } catch (error) {
    console.error('Unable to fetch URL Terms: ', error)
  }
}
