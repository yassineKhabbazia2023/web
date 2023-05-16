module.exports = {
  branches: [
    'develop',
    'release/*', // release branches
    { 'name': 'beta', 'channel': 'beta', 'prerelease': true }
  ],
  plugins: [
    [
      '@semantic-release/commit-analyzer',
      {
        'releaseRules': [
          {
            'scope': "no-release",
            'release': false
          }
        ],
        'parserOpts': {
          'noteKeywords': ['BREAKING CHANGE', 'BREAKING CHANGES']
        }
      }
    ],
    '@semantic-release/release-notes-generator',
    [
      '@semantic-release/changelog',
      {
        changelogFile: 'CHANGELOG.md'
      }
    ],
    [
      '@semantic-release/git',
      {
        assets: ['CHANGELOG.md'],
        message: 'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}',
      },
    ],
     'semantic-release-ado'
  ]
}