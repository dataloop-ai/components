export const globalConfig: Record<string, any> = {}
export let globalConfigIsFrozen = false

export function freezeGlobalConfig() {
    globalConfigIsFrozen = true
}
