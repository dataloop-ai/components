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

export type DLSmartSearchOperators =
    | '>='
    | '<='
    | '!='
    | '='
    | '>'
    | '<'
    | 'IN'
    | 'NOT-IN'

import {
    Alias as DlSmartSearchAlias,
    Schema as DlSmartSearchSchema
} from '../../../../hooks/use-suggestions'
import { DlSelectOption } from '../../types'

// type DlSmartSearchFilters = Filters & { [key: string]: any }
type DlSmartSearchFilter = DlSelectOption

export type {
    DlSmartSearchAlias,
    DlSmartSearchSchema,
    ColorSchema as DlSmartSearchColorSchema,
    DlSmartSearchFilter
}
