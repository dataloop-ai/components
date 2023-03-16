import { getRootStyles } from '../utils/getRootStyles'
import { inject, watch, reactive } from 'vue-demi'

export const useThemeVariables = () => {
    const isDark = inject('theme')

    const variables = reactive(getRootStyles())

    watch(
        () => isDark,
        () => {
            Object.assign(variables, getRootStyles())
        },
        { deep: true }
    )

    if (variables) return { variables }
    return
}
