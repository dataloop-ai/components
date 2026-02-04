export const itemHoverColor = (isActionable: boolean) =>
    isActionable ? 'var(--dell-blue-100)' : 'transparent'

export const itemActiveColor = (isActionable: boolean) =>
    isActionable ? 'var(--dell-blue-100)' : 'transparent'

export const itemCursor = (actionable: boolean, disabled: boolean) =>
    actionable ? 'pointer' : disabled ? 'not-allowed' : 'cursor'

export const itemColor = (disabled: boolean) =>
    disabled ? 'var(--dell-gray-500)' : 'var(--dell-gray-800)'
