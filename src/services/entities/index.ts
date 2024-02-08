import { commonApi, commonStore as store } from '@kpmg/common'
import type { Entity } from '@kpmg/common'

const COLORS = ['orange', 'persian', 'cyan', 'amethyste']
export const getEntities = async (): Promise<any> => {
  try {
    const response = await commonApi().wallet.get('display')

    if (response?.data) {
      return response.data
    }
  } catch (error) {
    console.error('Error fetching entities :', error)
  }

  return []
}

export const getFavoriteEntities = async (): Promise<Entity[]> => {
  try {
    const response = await commonApi().wallet.get('favorites')

    if (response?.data?.length) {
      // The code below is provisional as we intend to retrieve this information (IBS, COLOR) from the API later
      const favoriteEntities = response.data.map(
        ({ name, id: idAccount }: any) => ({
          name,
          idAccount,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          ibs: 'IBS93781560ZE19'
        })
      )
      store().$patch({
        user: {
          entities: {
            favorites: favoriteEntities,
            default: favoriteEntities.at(0)
          }
        }
      })

      return response.data
    }
  } catch (error) {
    console.error('Error fetching favorites entities :', error)
  }

  return []
}
