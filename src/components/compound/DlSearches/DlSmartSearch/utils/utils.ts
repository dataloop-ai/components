import { ColorSchema, SyntaxColorSchema, Filters } from '../types'
import {
    operators,
    Alias,
    startDatePattern,
    endDatePattern,
    dateIntervalPattern
} from '../../../../../hooks/use-suggestions'

export function getTabItems(filters: Filters) {
    return [
        {
            label: `Saved DQL Queries (${filters.saved?.length ?? 0})`,
            name: 'saved'
        },
        {
            label: `Recent Searches (${filters.recent?.length ?? 0})`,
            name: 'recent'
        },
        {
            label: `Suggested Searches (${filters.suggested?.length ?? 0})`,
            name: 'suggested'
        }
    ]
}

export function replaceWithJsDates(str: string) {
    const intervals = str.match(dateIntervalPattern)
    const starts = str.match(startDatePattern)
    const ends = str.match(endDatePattern)

    intervals?.forEach((interval) => {
        str = str.replaceAll(interval, formatToDateObj(interval))
    })
    starts?.forEach((start) => {
        str = str.replaceAll(start, formatToDateObj(start))
    })
    ends?.forEach((end) => {
        str = str.replaceAll(end, formatToDateObj(end))
    })
    return str
}

function formatToDateObj(str: string) {
    const [day, month, year] = str.split(' ')[1].split('/')
    const date = new Date(parseInt(year), parseInt(month), parseInt(day))
    if (!isValidDate(date)) return str
    const [toDay, toMonth, toYear] = str.split(' ')[3]?.split('/') || []
    const toDate = new Date(
        parseInt(toYear),
        parseInt(toMonth),
        parseInt(toDay)
    )
    if (!isValidDate(toDate)) return date.toISOString()
    return JSON.stringify({
        from: date.toISOString(),
        to: toDate.toISOString()
    })
}

function isValidDate(d: Date) {
    return d instanceof Date && !isNaN(d as any)
}

export function replaceWithAliases(json: string, aliases: Alias[]) {
    let newJson = json
    aliases.forEach((alias) => {
        newJson = newJson.replaceAll(alias.alias, alias.key)
    })
    return newJson
}

export function revertAliases(str: string, aliases: Alias[]) {
    const words: string[] = []
    for (const alias of aliases) {
        words.push(alias.key)
    }
    const replacement = (match: string) => {
        const index = words.indexOf(match)
        return aliases[index].alias
    }

    const regex = new RegExp(words.join('|'), 'gi')
    return str.replace(regex, replacement)
}

export function createColorSchema(
    colorSchema: ColorSchema,
    aliases: Alias[]
): SyntaxColorSchema {
    const thisFields = []
    for (const key in aliases) {
        thisFields.push(aliases[key].alias)
    }

    const thisOperators = []
    for (const key in operators) {
        thisOperators.push(operators[key])
    }

    return {
        fields: {
            values: thisFields,
            color: colorSchema.fields
        },
        operators: {
            values: thisOperators,
            color: colorSchema.operators
        },
        keywords: {
            values: ['OR', 'AND'],
            color: colorSchema.keywords
        }
    }
}

export const isEligibleToChange = (target: HTMLElement, expanded: boolean) => {
    let childOffsetRight = 0
    let childOffsetBottom = 20

    if (target?.lastChild) {
        const range = document.createRange()
        range.selectNode(target?.lastChild)
        childOffsetRight =
            range.getBoundingClientRect().right -
            target.getBoundingClientRect().left
        childOffsetBottom =
            range.getBoundingClientRect().bottom -
            target.getBoundingClientRect().top +
            5
    }

    if (childOffsetRight <= target.clientWidth) {
        return [-childOffsetRight, 5]
    } else {
        return [-target.clientWidth, 5]
    }
}
