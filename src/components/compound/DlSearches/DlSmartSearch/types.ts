export interface Query {
    name: string
    query: string | null
}

export interface Filters {
    saved: Query[]
    recent: Query[]
    suggested: Query[]
}

export interface ColorSchema {
    fields: string
    operators: string
    keywords: string
}

export interface SearchStatus {
    type: string
    message: string
}

export type SyntaxColorSchema = {
    fields: {
        values: string[]
        color: string
    }
    operators: {
        values: string[]
        color: string
    }
    keywords: {
        values: string[]
        color: string
    }
}
