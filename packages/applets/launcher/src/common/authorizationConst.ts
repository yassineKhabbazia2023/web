import { LAUNCHER_KEY } from '@/pages/home/HomeTypes'

export const PERMISSION_CODES = {
  meg: 'CLMEG001',
  silae: 'CLSILA001',
  silaeCollab: 'COSILA001',
  pennylane: 'CLPEN001',
}

export const LAUNCHER_AUTHORIZATIONS = [{
  key: LAUNCHER_KEY.meg,
  authorizationCodes: [PERMISSION_CODES.meg],
}, {
  key: LAUNCHER_KEY.silae,
  authorizationCodes: [PERMISSION_CODES.silae, PERMISSION_CODES.silaeCollab],
}, {
  key: LAUNCHER_KEY.pennylane,
  authorizationCodes: [PERMISSION_CODES.pennylane],
}]
