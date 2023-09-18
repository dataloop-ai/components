export interface DlInputSuggestion {
    suggestion: string
    image: string
    click: boolean
}

export interface DlInputFile {
    id: string
    name: string
    image: string
    data: ArrayBuffer
}
