import type { RepoExplorerEntry } from './commit-explorer-tab.types'

/**
 * Builds the list of explorer entries to display, one per currently selected repository.
 * Reuses the existing explorer instance for a repository that's still selected (so its loaded
 * commits and pagination state aren't lost), and creates a fresh one for newly selected repositories.
 */
export const syncRepoExplorers = <T>(
  effectiveRepositories: string[],
  previousEntries: RepoExplorerEntry<T>[],
  createExplorer: (repository: string) => T,
): RepoExplorerEntry<T>[] => {
  const previousExplorerByRepo = new Map(
    previousEntries.map((entry) => [entry.repository, entry.explorer]),
  )

  return effectiveRepositories.map((repository) => ({
    repository,
    explorer: previousExplorerByRepo.get(repository) ?? createExplorer(repository),
  }))
}
