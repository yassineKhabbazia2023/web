export interface UseAccountSignatoriesOptions {
  // Called after a signatory has been assigned/unassigned to refresh the users table
  refreshUsers: () => Promise<void>
}
