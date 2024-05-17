import { LAUNCHER_KEY } from '@/pages/home/HomeTypes'

export const PERMISSION_CODES = {
  meg: 'CLMEG001',
  silae: 'CLSILA001',
  pennylane: 'CLPEN001',
}

export const LAUNCHER_AUTHORIZATIONS = [{
  key: LAUNCHER_KEY.meg,
  authorizationCode: PERMISSION_CODES.meg,
}, {
  key: LAUNCHER_KEY.silae,
  authorizationCode: PERMISSION_CODES.silae,
}, {
  key: LAUNCHER_KEY.pennylane,
  authorizationCode: PERMISSION_CODES.pennylane,
}]
