import { computed, install, reactive } from 'vue-demi'

install()

// @ts-ignore
window.DlComponents = window.DlComponents || {
    state: reactive({}),
    setTheme: (theme: 'light' | 'dark') => {
        // @ts-ignore
        window.DlComponents.state.theme = theme
    },
    get theme(): 'light' | 'dark' {
        // @ts-ignore
        return window.DlComponents.state.theme
    },
    isDark: computed(() => {
        // @ts-ignore
        return window.DlComponents.state.theme === 'dark'
    }),
    isLight: computed(() => {
        // @ts-ignore
        return window.DlComponents.state.theme === 'light'
    })
}

export * from './components'
import DlComponentsDemo from './App.vue'
export { DlComponentsDemo }
