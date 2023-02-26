import { Schema, Alias } from '../../../hooks/use-suggestions'

export const schema: Schema = {
    name: 'string',
    level: ['high', 'medium', 'low', 30],
    metadata: {
        nesting: {
            age: 'number',
            valid: 'boolean'
        },
        date: 'date',
        start: 'datetime',
        classTime: 'time'
    }
}

export const aliases: Alias[] = [
    {
        alias: 'Name',
        key: 'name'
    },
    {
        alias: 'Age',
        key: 'metadata.nesting.age'
    },
    {
        alias: 'StartTime',
        key: 'metadata.start'
    },
    {
        alias: 'Level',
        key: 'level'
    }
]

export const colorSchema: object = {
    fields: 'blue',
    operators: 'green',
    keywords: 'bold'
}
export const status: object = {
    type: 'info',
    message: ''
}
