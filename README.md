# [Dataloop Components Library](https://dataloop-ai.github.io/components/) ![components version](https://img.shields.io/npm/v/@dataloop-ai/components?label=Latest%20Library%20Version) ![release status](https://img.shields.io/badge/Relese%20Status-Beta-yellowgreen)

Welcome to the Dataloop Components Library, which contains custom-made Vue components for the Dataloop platform and apps use. The Vue components are written using the Vue3 composition API and can be used in Vue2 projects as well, as long as you install vue-demi. You can find our documentation with our Storybook link [here](https://dataloop-ai.github.io/components/).

## Release Status
The current release status is beta. You can check the latest library version by looking at the shield above or by visiting our npm page.

## Development

Working with this repository is straightforward, as it already has hooks set up to guarantee high code quality. The repository has automatic linting on staged files and runs tests. If any tests fail, the commit itself will fail too

### Using Components in other projects
Using our components is simple: just install the npm package and import them normally into your Vue app. If you're working on a Vue2 project, make sure to install @vue/composition-api.


### Adding new Components
To add new components, you are required to open a pull request. The pull request must contain the following to be approved:

- The component Vue file
- The story relating to the component (for Storybook integration)
- Tests for the component

Any pull requests with missing requirements will not be approved.

## Scripts
The work environment is set up to be used on Visual Studio Code. 

The launch.json file contains three main configurations:

1. Running a Vite server to simulate the Vue3 environment
2. Running a Storybook server to view the stories
3. Running tests

You can also access these commands by running the following:

1. npm run dev (for the Vite server)
2. npm run storybook (for the Storybook server)
3. npm run test (for running tests)