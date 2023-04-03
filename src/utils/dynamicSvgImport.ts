export function dynamicSvgImport(iconName: string) {
    return import(
        `../../node_modules/@dataloop-ai/icons/assets/${iconName}.svg`
    ).then((d) => d.default)
}
