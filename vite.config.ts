/// <reference types="vitest" />
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    test: {
        environment: 'jsdom',
        setupFiles: ['tests/setup.js'],
        deps: {
            inline: ['vitest-canvas-mock']
        },
        coverage: {
            reporter: ['lcovonly', 'text']
        },
        exclude: [
            'node_modules/**/*.spec.js',
            'node_modules/**/*.spec.ts',
            'node_modules/**/*.test.js',
            'node_modules/**/*.test.ts',
            'misc'
        ]
    },
    optimizeDeps: {
        include: ['lodash', 'flat', 'highlight.js', 'sortablejs', 'marked'],
        exclude: ['vue-demi']
    },
    define: {
        'process.env': process.env
    },
    server: { port: 3000 },
    resolve: {
        alias: {
            vue: 'vue/dist/vue.esm-bundler.js'
        }
    }
})
