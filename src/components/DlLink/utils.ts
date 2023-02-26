export const getLinkTarget = (openOnNewTab: boolean) =>
    openOnNewTab ? '_blank' : null
export const getLinkRel = (openOnNewTab: boolean) =>
    openOnNewTab ? 'noopener noreferrer' : null
