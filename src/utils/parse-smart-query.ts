/* eslint-disable no-empty */

import { isFinite } from 'lodash'

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
