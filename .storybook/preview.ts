import '@dataloop-ai/icons/style.css'
import { Preview } from '@storybook/vue3'

export const parameters: Preview = {
    parameters: {
        actions: { argTypesRegex: '^on[A-Z].*' },
        themes: {
            default: 'light',
            list: [
                { name: 'light', color: '#fff', class: 'light-mode' },
                { name: 'dark', color: '#30363d', class: 'dark-mode' }
            ]
        },
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/
            }
        }
    }
}
