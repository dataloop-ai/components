export interface InputSuggestion {
    suggestion: string
    image: string
    click: boolean
}

export interface InputFile {
    id: string
    name: string
    image: string
    data: ArrayBuffer
}
