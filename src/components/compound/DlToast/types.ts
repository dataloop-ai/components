export interface Animation {
    enter: string
    leave: string
}

export enum DlToastPositions {
    TOP_RIGHT = 'top-right',
    TOP = 'top',
    TOP_LEFT = 'top-left',
    BOTTOM_RIGHT = 'bottom-right',
    BOTTOM = 'bottom',
    BOTTOM_LEFT = 'bottom-left'
}

export enum DlToastTypes {
    SUCCESS = 'success',
    WARNING = 'warning',
    ERROR = 'error',
    INFO = 'info',
    DISCOVERY = 'discovery'
}

export interface DlToastAction {
    /**
     * The label displayed on the action button
     */
    label?: string
    /**
     * The icon displayed on the action button
     */
    icon?: string
    /**
     * The text color of the action button
     */
    textColor?: string
    /**
     * Inline styles passed to DlButton `styles` prop
     */
    styles?: string | Record<string, string>
    /**
     * Called when the action button is clicked
     */
    handler: () => unknown
    /**
     * Close toast after the action is clicked
     * @default false
     */
    closeOnClick?: boolean
}

export interface DlToastProps {
    /**
     * Optional title displayed above the message
     */
    title?: string
    /**
     * The message to display in the toast
     */
    message: string
    /**
     * Optional caption displayed under the message
     */
    caption?: string
    /**
     * When false, message/caption should be treated as plain text (escaped).
     * When true, message/caption can be rendered as HTML.
     * @default false
     */
    html?: boolean
    /**
     * When true, allow wrapping into multiple lines.
     * When false, keep message in a single line (ellipsis).
     * @default true
     */
    multiLine?: boolean
    /**
     * Optional action buttons displayed inside the toast
     */
    actions?: DlToastAction[]
    /**
     * The type of the toast
     */
    type: DlToastTypes
    /**
     * The width of the toast
     * @default 'auto'
     */
    width?: string
    /**
     * The duration of the toast in seconds
     * @default 10
     */
    duration?: number
    /**
     * The position of the toast
     * @default DlToastPositions.BOTTOM
     */
    position?: DlToastPositions
    /**
     * Whether the toast is closable
     * @default true
     */
    closable?: boolean
    /**
     * The number of toasts to collapse after
     * @default 5
     */
    collapseCount?: number
}
