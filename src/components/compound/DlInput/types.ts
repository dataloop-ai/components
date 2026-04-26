export interface DlInputSuggestion {
    suggestion: string
    image?: string
    startIcon?:
        | {
              icon: string
              color?: string
              size?: string
          }
        | string
    click?: boolean
}

export interface DlInputFile {
    id: string
    name: string
    image: string
    data: ArrayBuffer
}
