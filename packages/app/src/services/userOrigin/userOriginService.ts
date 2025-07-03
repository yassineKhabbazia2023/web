import { commonApi } from '@pulse/common'

export const isUserOriginCollab = async () => {
  const { data: userOrigin } = await commonApi().gateway.get('userorigin')
  return userOrigin === 'COLLAB'
}
