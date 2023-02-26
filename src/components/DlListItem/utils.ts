export const itemHoverColor = (isActionable: boolean) =>
    isActionable ? 'var(--dl-color-fill-hover)' : 'transparent'

export const itemActiveColor = (isActionable: boolean) =>
    isActionable ? 'var(--dl-color-fill)' : 'transparent'

export const itemCursor = (actionable: boolean, disabled: boolean) =>
    actionable ? 'pointer' : disabled ? 'not-allowed' : 'cursor'

export const itemBorder = (bordered: boolean) =>
    bordered ? `1px solid var(--dl-color-separator)` : '0px'

export const itemColor = (disabled: boolean) =>
    disabled ? 'var(--dl-color-disabled)' : 'var(--dl-color-darker)'
