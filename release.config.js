module.exports = {
  plugins: [
    [
      '@semantic-release/commit-analyzer',
      {
        parserOpts: {
          noteKeywords: ['BREAKING CHANGE', 'BREAKING CHANGES']
        }
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
    [
      '@semantic-release/npm',
      {
        npmPublish: false
      }
    ],
    [
      '@semantic-release/git', {
        assets: ['dist/**', 'src/**', 'package.json', 'package-lock.json', 'README.md'],
        message: 'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}'
      }
    ]
  ],
  branch: 'master',
  ci: true
};
