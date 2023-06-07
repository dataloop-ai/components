/* eslint-disable no-empty */

import { isBoolean, isFinite, isNumber, isObject, isString } from 'lodash'

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
            return value.replaceAll('"', '').replaceAll("'", '')
        } catch (e) {}
    }
    return value
}

/**
 * Method to convert a DlSmartSearch query string to Mongo based JSON query
 *
 * @param { string } query DlSmartSearch query string
 * @returns Mongo based JSON
 */
export const parseSmartQuery = (query: string) => {
    const queryArr = query.split(' OR ')
    const orTerms: { [key: string]: any }[] = []

    for (const query of queryArr) {
        const andTerms = query.split(' AND ')

        const andQuery: { [key: string]: any } = {}
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

            switch (true) {
                case term.includes('>='):
                    [key, value] = term.split('>=').map((x) => x.trim())
                    pureValue = GeneratePureValue(value)
                    if (pureValue) {
                        andQuery[key] = { $gte: pureValue }
                    }
                    break
                case term.includes('<='):
                    [key, value] = term.split('<=').map((x) => x.trim())
                    pureValue = GeneratePureValue(value)
                    if (pureValue) {
                        andQuery[key] = { $lte: pureValue }
                    }
                    break
                case term.includes('>'):
                    [key, value] = term.split('>').map((x) => x.trim())
                    pureValue = GeneratePureValue(value)
                    if (pureValue) {
                        andQuery[key] = { $gt: pureValue }
                    }
                    break
                case term.includes('<'):
                    [key, value] = term.split('<').map((x) => x.trim())
                    pureValue = GeneratePureValue(value)
                    if (pureValue) {
                        andQuery[key] = { $lt: pureValue }
                    }
                    break
                case term.includes('!='):
                    [key, value] = term.split('!=').map((x) => x.trim())
                    pureValue = GeneratePureValue(value)
                    if (pureValue) {
                        andQuery[key] = { $ne: pureValue }
                    }
                    break
                case term.includes('='):
                    [key, value] = term.split('=').map((x) => x.trim())
                    pureValue = GeneratePureValue(value)
                    if (pureValue) {
                        andQuery[key] = pureValue
                    }
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
                            .map((x) => GeneratePureValue(x.trim()))
                            .filter((x) => x)

                        pureValue = GeneratePureValue(queryValue)
                        if (pureValue && Array.isArray(pureValue)) {
                            andQuery[key] = { $nin: pureValue }
                        }
                    } else {
                        queryValue = term
                            .split('IN')
                            .map((x) => x.trim())[1]
                            .split(',')
                            .map((x) => GeneratePureValue(x.trim()))
                            .filter((x) => x)

                        pureValue = GeneratePureValue(queryValue)
                        if (pureValue && Array.isArray(pureValue)) {
                            andQuery[key] = { $in: pureValue }
                        }
                    }
                    break
            }
        }

        orTerms.push(andQuery)
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
export const stringifySmartQuery = (query: { [key: string]: any }) => {
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
        } else {
            result += `${key} = '${value}'`
        }
    }

    return result
}
