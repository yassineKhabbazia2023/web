import { commonApi, commonStore as store } from '@kpmg/common'
import type { Entity } from '@kpmg/common'
import { API_PREFIXES } from '../config'
import { getRandomColor } from '@/helper'

export const getEntities = async (): Promise<any> => {
  try {
    const response = await commonApi().gateway.get(
      `${API_PREFIXES.ACCOUNT}/accounts/currentuser`,
    )

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
          color: getRandomColor(),
          ibs: 'IBS93781560ZE19',
        }),
      )
      store().$patch({
        user: {
          entities: {
            favorites: favoriteEntities,
          },
        },
      })

      return response.data
    }
  } catch (error) {
    console.error('Error fetching favorites entities :', error)
  }

  return []
}
