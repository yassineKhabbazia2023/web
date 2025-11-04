export enum PermissionScope {
  CURRENT_ENTITY = 'current-entity', // user permissions for the selected entity only
  GLOBAL = 'global', // user permissions globally
  ALL = 'all', // user permissions for both selected entity and globally
}
