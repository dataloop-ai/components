# Contributing Guidelines
Thank you for your interest in contributing to our project! We welcome contributions from everyone. Please take a moment to review these guidelines before submitting a pull request or issue.

## Code of Conduct
Our project has a [Code of Conduct](./CODE_OF_CONDUCT.md) that we expect all contributors to follow. Please read it before making any contribution.

## Issues
If you find any issues or bugs, please search the existing issues to see if the issue has already been reported. If it hasn't, please create a new issue with a clear and concise title and description. Be sure to include any relevant information, such as error messages or steps to reproduce the issue.

The repository provides base templates for create a bug/feature request type of issues. please fill the relevant information there.

If the issue is related to a specific component then please have in the title of the issue the name of the component and then a short description of the issue. Example: ``` DlButton > 'description of issue' ```

## Pull Requests
We welcome contributions in the form of pull requests. Before submitting a pull request, please make sure that your code:

- Is well-tested
- Conforms to our coding style guidelines (see below)
- Includes any necessary documentation

### Naming Convention
Each pull request should reflect the issue it is trying to close or have a short descriptive title.

If the pull request is working on a specific component please start the pull request title with the components name. Example: ``` DlButton > 'description of issue' ```

If a component / module or type that is being developed or introduced will not be exported it should not have the ```Dl``` prefix. 
If it is being exported it is required for it to have the ```Dl``` prefix. 

### Coding Style Guidelines
Please follow these coding style guidelines when submitting a pull request:
- Use consistent indentation
- Use descriptive variable names
- Use comments to explain non-obvious code behavior
- Follow the provided linter configuration
    - Please note that any build that does not pass the linter will fail. as part of our CI/CD
- When developing a component it should be assigned to the correct scope and have its own aligned code structure
    - if the component has inner components they should be in the components directory under ```/components```
    - every component should export index.ts and types.ts


Steps to submit a pull request:
1. Fork the repository
2. Clone the forked repository to your local machine
3. Create a new branch for your changes
4. Make your changes and commit them
5. Push the changes to your forked repository
6. Submit a pull request to the original repository
7. Please make sure that your pull request clearly explains the problem you are trying to solve, the solution you have implemented, and any potential side effects of your changes.

## License
By contributing to our project, you agree that your contributions will be licensed under the [project's license](./LICENSE.md).

Thank you for your contributions!