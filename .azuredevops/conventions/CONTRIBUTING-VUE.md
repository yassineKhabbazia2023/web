# Contributing Guide

We are really excited that you are interested in contributing to this project. Before submitting your contribution, please make sure to take a moment and read through the following guidelines:

- [Code of Conduct](./CODE_OF_CONDUCT.md)
- [Issue Reporting Guidelines](#issue-reporting-guidelines)
- [Git Flow Guidelines](#git-flow-guidelines)
- [Pull Request Guidelines](#pull-request-guidelines)
- [Development Setup](#development-setup)

## Issue Reporting Guidelines

- Always use the [KPMG Visual Sudio online](https://kpmgfr.visualstudio.com) to create new issues.

## Git Flow Guidelines

This project use the widely used [Git Flow Convention](https://danielkummer.github.io/git-flow-cheatsheet/index.html).

However, some clarifications are needed:
- Since 2020, the `master` branch is named `main` ([Software Freedom Conservancy](https://sfconservancy.org/news/2020/jun/23/gitbranchname/)).
- Except for the `main` and `develop` branches, a branch name must be match the following pattern: `<type>/<issue ID>-<name>`.
  - `type`: is one of `feature`, `bugfix`, `hotfix`, `release` from the convention.
  - `issue ID`: is the Azure Devops backlog issue id.
  - `name`: is an arbitrary kebab-case name of the branch.
- A release branch name starts with a `v` after the `release/` directory.

Some examples:
```
feature/123-add-users-controller
hotfix/123-profile-page-error
release/v1.0.0
```

## Pull Request Guidelines

### Creating request
- Always use the PR template associated to the branch you want to merge.
- Make sure tests passes. (see [development setup](#development-setup))
- If adding a new feature, add accompanying test case.
- Use the [Commit Convention](./COMMIT_CONVENTION.md) for your submitted commits.

### Reviewing request
- Please read and respect [**Rewiew convention**](./REVIEW_CONVENTION.md)

## Development Setup

**Install**
1. Clone this repository to your local environment.
2. If you want to use NVM, start its command: `nvm use`.
3. Install the dependencies: `npm i`.
4. Lanuch `npm run dev`.
5. Refers to the wiki of [Shell: How to override](https://kpmgfr.visualstudio.com/Constellation/_wiki/wikis/Constellation.wiki/16901/Shell?anchor=override-des-mfes)

You want to contribute to this project? Nothing more easier.

1. Clone this project on your local environment.
2. Read and use the [commits convention](./COMMIT_CONVENTION.md).
3. Always update/create tests, **we try to keep the coverage to 100%**, with `npm test`.
4. Fix your linter problems with `npm run lint`.
5. Create a new branch and submit it to the `main` one.

**Create a new release**
1. Always do it to the `develop` branch.
2. Use one of the command based on the [Semver 2.0](https://semver.org) spec:
  * `npm run major` to create a new major version.
  * `npm run minor` to create a new minor version.
  * `npm run patch` to create a new patch version.
3. Push the commit and the new tag with `git push && git push --tags`
4. Merge and push the changes to the `main` branch.

### Committing Changes

Commit messages should follow the [commit message convention](./COMMIT_CONVENTION.md) so that changelogs can be automatically generated. Commit messages will be automatically validated upon commit.

_- Archytect Conventions Set 🏷️<!-- AY_Version -->**v.1.2.0**<!-- /AY_Version --> -_
