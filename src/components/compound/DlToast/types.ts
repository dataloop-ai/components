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
    INFO = 'info'
}

export interface DlToastProps {
    /**
     * The message to display in the toast
     */
    message: string
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
