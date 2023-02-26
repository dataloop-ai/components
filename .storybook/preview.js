import '@dataloop-ai/icons/docs/style.css'
import { themes } from '@storybook/theming'

export const parameters = {
    actions: { argTypesRegex: '^on[A-Z].*' },
    themes: {
        default: 'light',
        list: [
            { name: 'light', color: '#fff' },
            { name: 'dark', color: '#30363d' }
        ],
        onChange: (theme) => {
            document
                .getElementById('storybook-preview-iframe')
                .contentWindow.document.getElementsByTagName('html')[0]
                .setAttribute(
                    'data-theme',
                    theme.name === 'light' ? '' : 'dark-mode'
                )
        }
    },
    controls: {
        matchers: {
            color: /(background|color)$/i,
            date: /Date$/
        }
    },
    options: {
        theme: {
            ...themes.light,
            fontBase: 'Roboto, sans-serif',
            fontCode: 'Roboto',
            brandTitle: 'Dataloop Components Library',
            brandUrl: 'https://dataloop.ai/',
            brandImage:
                'https://dataloop.ai/wp-content/uploads/2020/03/logo.svg',
            brandTarget: '_self'
        }
    }
}
