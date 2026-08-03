export interface UseInviteUserOptions {
  // Called after a user has been invited to refresh the users table
  refreshUsers: () => Promise<void>
}
