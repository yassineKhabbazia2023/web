import { syncRepoExplorers } from './commit-explorer-tab.helper'

describe('syncRepoExplorers', () => {
  it('should create an explorer entry for each selected repository', () => {
    const createExplorer = vi.fn((repository: string) => ({ repository, commits: [] }))

    const result = syncRepoExplorers(['RepoA', 'RepoB'], [], createExplorer)

    expect(result).toEqual([
      { repository: 'RepoA', explorer: { repository: 'RepoA', commits: [] } },
      { repository: 'RepoB', explorer: { repository: 'RepoB', commits: [] } },
    ])
    expect(createExplorer).toHaveBeenCalledTimes(2)
  })

  it('should reuse the existing explorer instance for a repository that is still selected', () => {
    const existingExplorer = { commits: ['abc'] }
    const createExplorer = vi.fn((repository: string) => ({ repository, commits: [] }))

    const result = syncRepoExplorers(
      ['RepoA'],
      [{ repository: 'RepoA', explorer: existingExplorer }],
      createExplorer,
    )

    expect(result).toEqual([{ repository: 'RepoA', explorer: existingExplorer }])
    expect(createExplorer).not.toHaveBeenCalled()
  })

  it('should drop explorers for repositories no longer selected', () => {
    const createExplorer = vi.fn((repository: string) => ({ repository }))

    const result = syncRepoExplorers(
      ['RepoB'],
      [{ repository: 'RepoA', explorer: { repository: 'RepoA' } }],
      createExplorer,
    )

    expect(result).toEqual([{ repository: 'RepoB', explorer: { repository: 'RepoB' } }])
  })

  it('should return an empty list when no repository is selected', () => {
    const createExplorer = vi.fn()

    const result = syncRepoExplorers([], [], createExplorer)

    expect(result).toEqual([])
    expect(createExplorer).not.toHaveBeenCalled()
  })
})
