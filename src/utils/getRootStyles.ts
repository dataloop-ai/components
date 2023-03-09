function getAllCSSVariableNames(styleSheets = document.styleSheets) {
    const cssVars = []
    for (let i = 0; i < styleSheets.length; i++) {
        try {
            for (let j = 0; j < styleSheets[i].cssRules.length; j++) {
                try {
                    for (
                        let k = 0;
                        k <
                        (styleSheets[i].cssRules[j] as CSSStyleRule).style
                            .length;
                        k++
                    ) {
                        const name = (
                            styleSheets[i].cssRules[j] as CSSStyleRule
                        ).style[k]
                        if (
                            name.startsWith('--') &&
                            cssVars.indexOf(name) == -1
                        ) {
                            cssVars.push(name)
                        }
                    }
                } catch (error) {}
            }
        } catch (error) {}
    }
    return cssVars
}

function getElementCSSVariables(
    allCSSVars: any,
    element = document.body,
    pseudo?: any
) {
    const elStyles = window.getComputedStyle(element, pseudo)
    const cssVars = {}
    for (let i = 0; i < allCSSVars.length; i++) {
        const key = allCSSVars[i]
        const value = elStyles.getPropertyValue(key)
        if (value) {
            //@ts-ignore
            cssVars[key] = value.trim()
        }
    }
    return cssVars
}

export function getRootStyles() {
    const cssVars = getAllCSSVariableNames()
    return getElementCSSVariables(cssVars, document.documentElement)
}
