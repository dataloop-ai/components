export const itemHoverColor = (isActionable: boolean) =>
    isActionable ? 'var(--dl-color-fill-hover)' : 'transparent'

export const itemActiveColor = (isActionable: boolean) =>
    isActionable ? 'var(--dl-color-fill)' : 'transparent'

export const itemCursor = (actionable: boolean, disabled: boolean) =>
    actionable ? 'pointer' : disabled ? 'not-allowed' : 'cursor'

export const itemColor = (disabled: boolean) =>
    disabled ? 'var(--dell-gray-500)' : 'var(--dell-gray-800)'
