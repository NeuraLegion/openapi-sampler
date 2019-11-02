module.exports = {
  plugins: [
    [
      '@semantic-release/commit-analyzer',
      {
        parserOpts: {
          noteKeywords: ['BREAKING CHANGE', 'BREAKING CHANGES']
        },
        releaseRules: [
          {type: 'refactor', release: 'patch'}
        ]
      }
    ],
    [
      '@semantic-release/release-notes-generator',
      {
        writerOpts: {
          commitsSort: ['subject', 'scope']
        }
      }
    ],
    '@semantic-release/npm',
    [
      '@semantic-release/git', {
        assets: ['dist/**', 'src/**', 'package.json', 'package-lock.json', 'README.md'],
        message: 'chore(release): ${nextRelease.version} [skip ci]'
      }
    ]
  ],
  branch: 'master',
  ci: true
};
