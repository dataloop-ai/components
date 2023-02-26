module.exports = {
    stories: [
        '../src/**/*.stories.mdx',
        '../src/**/*.stories.@(js|jsx|ts|tsx)'
    ],
    addons: [
        '@storybook/addon-links',
        '@storybook/addon-essentials',
        'storybook-addon-themes'
    ],
    framework: '@storybook/vue3',
    core: {
        builder: '@storybook/builder-vite'
    },
    viteFinal: (config) => {
        return {
            ...config,
            build: {
                ...config.build,
                minify: false,
                sourcemap: false
            }
        }
    },
    env: (config) => ({ ...config }),
    rollupOptions: {
        external: ['@storybook/client-api']
    }
}
