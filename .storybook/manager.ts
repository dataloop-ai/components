import { addons } from '@storybook/manager-api'
import { mainTheme } from './themes'

addons.setConfig({
    theme: mainTheme
})

// Import favicon
const link = document.createElement('link')
link.setAttribute('rel', 'shortcut icon')
link.setAttribute('href', '../public/favicon.ico')
document.head.appendChild(link)
