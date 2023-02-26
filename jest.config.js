/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    transform: {
        '^.+\\.vue$': 'vue3-jest',
        '.(css|less|scss)$': '<rootDir>/tests/mock/style-mock.js'
    },
    moduleFileExtensions: ['json', 'js', 'jsx', 'ts', 'tsx', 'vue', '.css'],
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    moduleNameMapper: {
        '\\.(css|less|sass|scss)$': '<rootDir>/tests/__mocks__/styleMock.js',
        '\\.(gif|ttf|eot|svg)$': '<rootDir>/tests/__mocks__/fileMock.js',
        'vanilla-jsoneditor': '<rootDir>/tests/mock/style-mock.js'
    }
}
