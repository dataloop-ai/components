import { isVue3 } from 'vue-demi'

export function dynamicSvgImport(iconName: string) {
    const prefixVue3 = `../../`
    const prefixVue2 = `../../../../../`
    const path = `${
        isVue3 ? prefixVue3 : prefixVue2
    }node_modules/@dataloop-ai/icons/assets/${iconName}.svg`
    return import(path).then((d) => d.default)
}

/** Another way */
/**
export function dynamicSvgImport(iconName: string) {
    import.meta.glob(`/node_modules/@dataloop-ai/icons/assets/*.svg`)
    const path  = `/node_modules/@dataloop-ai/icons/assets/${iconName}.svg`
    return import(path).then((d) => d.default)
}*/
