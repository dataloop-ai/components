// todo handle this shitshow
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

import {
    Alias as DlSmartSearchAlias,
    Schema as DlSmartSearchSchema
} from '../../../../hooks/use-suggestions'

type DlSmartSearchFilters = Filters & { [key: string]: any }

export type {
    DlSmartSearchAlias,
    DlSmartSearchSchema,
    ColorSchema as DlSmartSearchColorSchema,
    DlSmartSearchFilters
}
