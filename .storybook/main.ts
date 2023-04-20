import { mergeConfig } from 'vite'

module.exports = {
    stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
    addons: [
        '@storybook/addon-links',
        '@storybook/addon-essentials',
        'storybook-addon-themes',
        '@storybook/addon-mdx-gfm'
    ],
    framework: {
        name: '@storybook/vue3-vite',
        options: {}
    },
    viteFinal: (config) => {
        return mergeConfig(config, {
            base: '/components/',
            build: {
                minify: false,
                sourcemap: false
            }
        })
    },
    env: (config) => ({
        ...config
    }),
    rollupOptions: {
        external: ['@storybook/client-api']
    },
    docs: {
        autodocs: true
    }
}
