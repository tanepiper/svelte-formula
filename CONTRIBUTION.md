# This is an ad-hoc contribution guide. 

The purpose of this document is to describe steps required to get the repo working, as well as the common command used for testing before submitting a pull request.

## Setup

- The repo uses NX and Yarn. You can install Yarn with `npm install --global yarn`
- You can install NX and other packages with `yarn`

## Once set up, there's a couple of commands:

- `npm run start formula-app --rollupConfig=apps/formula-app/rollup.config.js` - this starts the small testing app I use running, it's not very pretty but it lets me test thing (I already have a branch investigating using this app for Cypress e2e testing as well but there is an issue with the internal lib resolving)

- `npm run start svelte-formula --skip-nx-cache --watch` If you run that with the above, you get hot-reloading when you change the lib`

- `npm run build svelte-formula --skip-nx-cache` Runs build

- `npm run lint svelte-formula` Runs linter

- `npm run start docs-site` Runs the docosaurus site under packages/doc-site

- `npm run nx test svelte-formula` - Runs the unit test suite

