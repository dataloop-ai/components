/* eslint-disable no-empty */

import { isFinite, isObject, isString } from 'lodash'

export const parseSmartQuery = (query: string) => {
    const queryArr = query.split(' OR ')
    const orTerms: { [key: string]: any }[] = []

    for (const query of queryArr) {
        const andTerms = query.split(' AND ')

        const andQuery: { [key: string]: any } = {}
        let queryValue: any

        let key: string
        let value: string | number | object

        const cleanValue = (value: any) => {
            if (typeof value === 'string') {
                try {
                    const num = Number(value)
                    if (isFinite(num)) {
                        return num
                    }
                } catch (e) {}
                return value.replaceAll('"', '').replaceAll("'", '')
            }
            return value
        }

        for (const term of andTerms) {
            switch (true) {
                case term.includes('>='):
                    [key, value] = term.split('>=').map((x) => x.trim())
                    andQuery[key] = { $gte: cleanValue(value) }
                    break
                case term.includes('<='):
                    [key, value] = term.split('<=').map((x) => x.trim())
                    andQuery[key] = { $lte: cleanValue(value) }
                    break
                case term.includes('>'):
                    [key, value] = term.split('>').map((x) => x.trim())
                    andQuery[key] = { $gt: cleanValue(value) }
                    break
                case term.includes('<'):
                    [key, value] = term.split('<').map((x) => x.trim())
                    andQuery[key] = { $lt: cleanValue(value) }
                    break
                case term.includes('!='):
                    [key, value] = term.split('!=').map((x) => x.trim())
                    andQuery[key] = { $ne: cleanValue(value) }
                    break
                case term.includes('='):
                    [key, value] = term.split('=').map((x) => x.trim())
                    andQuery[key] = cleanValue(value)
                    break
                case term.includes('IN'):
                    [key, value] = term.split('IN').map((x) => x.trim())
                    if (key.includes('NOT-')) {
                        [key, value] = term
                            .split('NOT-IN')
                            .map((x) => x.trim())
                        queryValue = term
                            .split('NOT-IN')
                            .map((x) => x.trim())[1]
                            .split(',')
                            .map((x) => cleanValue(x.trim()))
                        andQuery[key] = { $nin: cleanValue(queryValue) }
                    } else {
                        queryValue = term
                            .split('IN')
                            .map((x) => x.trim())[1]
                            .split(',')
                            .map((x) => cleanValue(x.trim()))
                        andQuery[key] = { $in: cleanValue(queryValue) }
                    }
                    break
            }
        }

        orTerms.push(andQuery)
    }

    const builtQuery = orTerms.length > 1 ? { $or: orTerms } : orTerms[0]

    return builtQuery
}

export const stringifySmartQuery = (query: { [key: string]: any }) => {
    let result = ''

    for (const key in query) {
        if (query.hasOwnProperty(key)) {
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

            if (result.length) {
                result += ' AND '
            }

            if (isObject(value)) {
                for (const operator in value) {
                    if (value.hasOwnProperty(operator)) {
                        let operatorValue = (
                            value as {
                                [key: string]:
                                    | string
                                    | number
                                    | string[]
                                    | number[]
                            }
                        )[operator]
                        switch (operator) {
                            case '$eq':
                                result += `${key} = ${
                                    isString(operatorValue)
                                        ? `'${operatorValue}'`
                                        : operatorValue
                                }`
                                break
                            case '$ne':
                                result += `${key} != ${
                                    isString(operatorValue)
                                        ? `'${operatorValue}'`
                                        : operatorValue
                                }`
                                break
                            case '$gt':
                                result += `${key} > ${operatorValue}`
                                break
                            case '$gte':
                                result += `${key} >= ${operatorValue}`
                                break
                            case '$lt':
                                result += `${key} < ${operatorValue}`
                                break
                            case '$lte':
                                result += `${key} <= ${operatorValue}`
                                break
                            case '$in':
                                if (!Array.isArray(operatorValue)) {
                                    operatorValue = [operatorValue] as
                                        | string[]
                                        | number[]
                                }

                                const inValues: string = (
                                    operatorValue as any[]
                                )
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

                                const ninValues: string = (
                                    operatorValue as any[]
                                )
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
            } else {
                result += `${key} = '${value}'`
            }
        }
    }

    return result
}
