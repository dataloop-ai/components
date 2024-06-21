/* eslint-disable no-empty */

import { isBoolean, isFinite, isNumber, isObject, isString } from 'lodash'

export function isDatePattern(str: string) {
    const datePattern = new RegExp(
        /([\(']?\d{2}\/\d{2}\/\d{4}[\)']?\s?|\s?\(dd\/mm\/yyyy\)\s?)/,
        'gi'
    )
    const dates = str.match(datePattern) ?? []
    return dates.length > 0
}

const GeneratePureValue = (value: any) => {
    if (value === '') {
        return null
    }

    if (typeof value === 'string') {
        if (value === 'true') {
            return true
        }
        if (value === 'false') {
            return false
        }

        try {
            const num = Number(value)
            if (isFinite(num)) {
                return num
            }

            let unquoted = value.replace(/^[^']*'(.*)'[^']*$/, '$1')
            if (unquoted !== value) {
                return unquoted.replace(/\\'/g, "'")
            }

            unquoted = value.replace(/^[^"]*"(.*)"[^"]*$/, '$1')
            if (unquoted !== value) {
                return unquoted.replace(/\\"/g, '"')
            }

            return value.replaceAll('"', '').replaceAll("'", '')
        } catch (e) {}
    }
    return value
}

const Operators: string[] = [
    '>=',
    '<=',
    '!=',
    '=',
    '>',
    '<',
    'IN',
    'NOT-IN',
    'EXISTS',
    'DOESNT-EXIST'
]

const SplitFirst = (what: string, by: string): string[] => {
    const result = what.split(by)
    if (result.length > 2) {
        return [result.shift(), result.join(by)]
    }
    return result
}

/**
 * Method to convert a DlSmartSearch query string to Mongo based JSON query
 *
 * @param { string } query DlSmartSearch query string
 * @returns Mongo based JSON
 */
export const parseSmartQuery = (
    query: string
): {
    [key: string]: any
} => {
    const queryArr = query.split(' OR ')
    for (let i = 0; i < queryArr.length; i++) {
        const term: string = queryArr[i]
        let withOperator = false
        if (Operators.includes(term.split(' ')[1])) {
            withOperator = true
        }

        if (!withOperator) {
            if (i > 0) {
                queryArr[i - 1] += ` OR ${term}`
                queryArr.splice(i, 1)
            }
        }
    }
    const orTerms: { [key: string]: any }[] = []

    for (const query of queryArr) {
        const andTerms = query.split(' AND ').filter((q) => !!q.length)
        for (let i = 0; i < andTerms.length; i++) {
            const term: string = andTerms[i]
            let withOperator = false
            for (const op of Operators) {
                if (term.includes(op)) {
                    withOperator = true
                    break
                }
            }

            if (!withOperator) {
                if (i > 0) {
                    andTerms[i - 1] += ` AND ${term}`
                    andTerms.splice(i, 1)
                }
            }
        }

        const andQuery: { [key: string]: any }[] = []
        let queryValue: any

        let key: string
        let value: string | number | object
        let pureValue:
            | string
            | number
            | object
            | boolean
            | null
            | (string | number | object | boolean)[]

        for (const term of andTerms) {
            pureValue = null

            const termUpToQuote = term.replace(/^([^'"]+)['"].*$/, '$1')

            switch (true) {
                case termUpToQuote.includes('>='):
                    ;[key, value] = SplitFirst(term, '>=').map((x) => x.trim())
                    pureValue = GeneratePureValue(value)
                    if (pureValue !== null) {
                        andQuery.push({ [key]: { $gte: pureValue } })
                    }
                    break
                case termUpToQuote.includes('<='):
                    ;[key, value] = SplitFirst(term, '<=').map((x) => x.trim())
                    pureValue = GeneratePureValue(value)
                    if (pureValue !== null) {
                        andQuery.push({ [key]: { $lte: pureValue } })
                    }
                    break
                case termUpToQuote.includes('>'):
                    ;[key, value] = SplitFirst(term, '>').map((x) => x.trim())
                    pureValue = GeneratePureValue(value)
                    if (pureValue !== null) {
                        andQuery.push({ [key]: { $gt: pureValue } })
                    }
                    break
                case termUpToQuote.includes('<'):
                    ;[key, value] = SplitFirst(term, '<').map((x) => x.trim())
                    pureValue = GeneratePureValue(value)
                    if (pureValue !== null) {
                        andQuery.push({ [key]: { $lt: pureValue } })
                    }
                    break
                case termUpToQuote.includes('!='):
                    ;[key, value] = SplitFirst(term, '!=').map((x) => x.trim())
                    pureValue = GeneratePureValue(value)
                    if (pureValue !== null) {
                        andQuery.push({ [key]: { $ne: pureValue } })
                    }
                    break
                case termUpToQuote.includes('='):
                    ;[key, value] = SplitFirst(term, '=').map((x) => x.trim())
                    pureValue = GeneratePureValue(value)
                    if (pureValue !== null) {
                        andQuery.push({ [key]: pureValue })
                    }
                    break
                case termUpToQuote.includes('EXISTS'):
                    key = term.split('EXISTS')[0].trim()
                    andQuery.push({ [key]: { $exists: true } })
                    break
                case termUpToQuote.includes('DOESNT-EXIST'):
                    key = term.split('DOESNT-EXIST')[0].trim()
                    andQuery.push({ [key]: { $exists: false } })
                    break
                case termUpToQuote.includes('IN'):
                    ;[key, value] = SplitFirst(term, 'IN').map((x) => x.trim())
                    if (key.includes('NOT-')) {
                        ;[key, value] = SplitFirst(term, 'NOT-IN').map((x) =>
                            x.trim()
                        )
                        // TODO make , inside quotes work
                        queryValue = value
                            .split(',')
                            .map((x) => GeneratePureValue(x.trim()))
                            .filter((x) => x)

                        pureValue = GeneratePureValue(queryValue)
                        if (pureValue !== null && Array.isArray(pureValue)) {
                            andQuery.push({ [key]: { $nin: pureValue } })
                        }
                    } else {
                        // TODO make , inside quotes work
                        queryValue = value
                            .split(',')
                            .map((x) => GeneratePureValue(x.trim()))
                            .filter((x) => x)

                        pureValue = GeneratePureValue(queryValue)
                        if (pureValue !== null && Array.isArray(pureValue)) {
                            andQuery.push({ [key]: { $in: pureValue } })
                        }
                    }
                    break
            }
        }

        const simlifiedAndQuery: { [key: string]: any } = {}
        for (const term of andQuery) {
            const key = Object.keys(term)[0]
            simlifiedAndQuery[key] = term[key]
        }

        orTerms.push(
            andQuery.length > Object.keys(simlifiedAndQuery).length
                ? { $and: andQuery }
                : simlifiedAndQuery
        )
    }

    const builtQuery = orTerms.length > 1 ? { $or: orTerms } : orTerms[0]

    return builtQuery
}

/**
 * Method to convert a Mongo based JSON query to a DlSmartSearch query string
 *
 * @param { { [key: string]: any } } query Mongo based JSON that represents a query
 * @returns DlSmartSearch query string
 */
export const stringifySmartQuery = (query: { [key: string]: any }): string => {
    let result = ''

    for (const key in query) {
        const value = query[key]

        if (key === '$or') {
            if (Array.isArray(value)) {
                const subQueries = value.map(
                    (subQuery: { [key: string]: any }) =>
                        stringifySmartQuery(subQuery)
                )
                result += subQueries.join(' OR ')
            }
            continue
        }

        if (key === '$and') {
            if (Array.isArray(value)) {
                const subQueries = value.map(
                    (subQuery: { [key: string]: any }) =>
                        stringifySmartQuery(subQuery)
                )
                result += subQueries.join(' AND ')
            }
            continue
        }

        if (result.length) {
            result += ' AND '
        }

        if (isObject(value)) {
            for (const operator in value) {
                if (value.hasOwnProperty(operator)) {
                    let operatorValue = (
                        value as {
                            [key: string]: string | number | string[] | number[]
                        }
                    )[operator]

                    let stringValue = ''
                    if (
                        ['$eq', '$ne', '$gt', '$gte', '$lt', '$lte'].includes(
                            operator
                        )
                    ) {
                        if (isNumber(operatorValue)) {
                            stringValue = `${operatorValue}`
                        } else if (isBoolean(operatorValue)) {
                            stringValue = `${operatorValue}`
                        } else if (isDatePattern(`${operatorValue}`)) {
                            stringValue = `(${operatorValue})`
                        } else {
                            stringValue = `'${operatorValue}'`
                        }
                    }

                    switch (operator) {
                        case '$eq':
                            result += `${key} = ${stringValue}`
                            break
                        case '$ne':
                            result += `${key} != ${stringValue}`
                            break
                        case '$gt':
                            result += `${key} > ${stringValue}`
                            break
                        case '$gte':
                            result += `${key} >= ${stringValue}`
                            break
                        case '$lt':
                            result += `${key} < ${stringValue}`
                            break
                        case '$lte':
                            result += `${key} <= ${stringValue}`
                            break
                        case '$exists':
                            result += `${key} ${
                                operatorValue ? 'EXISTS' : 'DOESNT-EXIST'
                            }`
                            break
                        case '$in':
                            if (!Array.isArray(operatorValue)) {
                                operatorValue = [operatorValue] as
                                    | string[]
                                    | number[]
                            }

                            const inValues: string = (operatorValue as any[])
                                .map((x: string | number) =>
                                    isString(x) ? `'${x}'` : x
                                )
                                .join(', ')
                            result += `${key} IN ${inValues} `
                            break
                        case '$nin':
                            if (!Array.isArray(operatorValue)) {
                                operatorValue = [operatorValue] as
                                    | string[]
                                    | number[]
                            }

                            const ninValues: string = (operatorValue as any[])
                                .map((x: string | number) =>
                                    isString(x) ? `'${x}'` : x
                                )
                                .join(', ')

                            result += `${key} NOT-IN ${ninValues}`
                            break
                        default:
                            throw new Error(`Invalid operator: ${operator}`)
                    }
                }
            }
        } else if (isNumber(value)) {
            result += `${key} = ${value}`
        } else if (isBoolean(value)) {
            result += `${key} = ${value}`
        } else if (isDatePattern(value)) {
            result += `${key} = (${value})`
        } else {
            result += `${key} = '${value.toString().replace(/'/g, "\\'")}'`
        }
    }

    return result
}
