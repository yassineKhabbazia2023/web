import { type RouteRecordNameGeneric } from 'vue-router'

export function getIllustration(routeName: RouteRecordNameGeneric) {
  return routeName === 'validationCGU'
    ? 'document-authentification'
    : 'connection-default'
}
