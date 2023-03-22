# [Dataloop Components Library](https://dataloop-ai.github.io/components/) ![components version](https://img.shields.io/npm/v/@dataloop-ai/components?label=Latest%20Library%20Version) ![release status](https://img.shields.io/badge/Relese%20Status-Beta-yellowgreen)

This repository contains custom made vue components for Dataloop platform and apps use

The vue components are written in vue3 composition api and can be used in vue 2 projects as well as long as you install vue-demi

You can see our documentation with our storybook link [here](https://dataloop-ai.github.io/components/)

## Development

Working on this repo is simple as it already has hooks set up to guarantee high code quality

The repository has automatic lint on staged files and run tests. if any were to fail then the commit itself will fail too.

### Using Components in other projects
using the components is as simple as installing the npm package and importing them normally into your vue app

make sure you if you are on vue2 project to install @vue/composition-api

### Adding new Components
in order to add new components you are required to open a pull request
the pull request must contain the following in order for it to be approved

- the component vue file
- the story relating to the component ( for storybook integration )
- tests for the component

any pull requests with missing requirements will not be approved.

## Scripts
the work environment is set up to be used on visual studio code. 

the launch.json file contains 3 main configs

1. running a vite server to simulate vue3 environment
2. running a storybook server to view the stories
3. running tests

you can also access these commands by running the following 

1. npm run dev ( for vite server )
2. npm run storybook ( for storybook server )
3. npm run test ( for tests )

There are automatic pipelines when working. if development gets merged into master we automatically bump version by a minor and any other fix branch to master will only bump it by patch.