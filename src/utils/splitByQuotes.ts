import Tokenizr from 'tokenizr/src/tokenizr.js'

export enum TokenType {
    NUMBER = 'number',
    DATETIME = 'datetime',
    OPERATOR = 'operator',
    LOGICAL = 'logical',
    BOOLEAN = 'boolean',
    FIELD = 'field',
    COMMA = 'comma',
    STRING = 'string',
    PARTIAL_VALUE = 'partial-string',
    WHITESPACE = 'whitespace'
}

enum Tags {
    HAD_FIELD = 'had-field',
    HAD_VALUE = 'had-value'
}

const tokenizer = new Tokenizr()

tokenizer.rule(/[+-]?[0-9\.]+/, (ctx, match) => {
    ctx.accept(TokenType.NUMBER, parseFloat(match[0])).tag(Tags.HAD_VALUE)
})

tokenizer.rule(
    /\((\d{2}\/\d{2}\/\d{4}[\)']?\s?|\s?DD\/MM\/YYYY)\s?(\d{2}:\d{2}:\d{2}|\s?HH:mm:ss)?\)/,
    (ctx, match) => {
        ctx.accept(TokenType.DATETIME, parseFloat(match[0])).tag(Tags.HAD_VALUE)
    }
)
;[
    /<=?/,
    />=?/,
    /!=?/,
    /=/,
    /in?(?![^\s'"])/i,
    /n(o(t(-(in?)?)?)?)?(?![^\s'"])/i,
    /e(x(i(s(ts?)?)?)?)?(?!\S)/i,
    /d(o(e(s(n(t(-(e(x(i(st?)?)?)?)?)?)?)?)?)?)?(?!\S)/i
].forEach((re) =>
    tokenizer.rule(re, (ctx, match) => {
        if (!ctx.tagged(Tags.HAD_FIELD) && /^[a-z]/i.test(match[0])) {
            ctx.accept(TokenType.FIELD).tag(Tags.HAD_FIELD)
        } else {
            ctx.accept(TokenType.OPERATOR, match[0].toUpperCase())
        }
    })
)

tokenizer.rule(/[a-z][a-z\.\d\-_]*/i, (ctx, match) => {
    const upper = match[0].toUpperCase()
    if (ctx.tagged(Tags.HAD_VALUE)) {
        // we just had a value - it would be followed by AND or OR
        ctx.untag(Tags.HAD_FIELD)
            .untag(Tags.HAD_VALUE)
            .accept(TokenType.LOGICAL, upper)
    } else if (ctx.tagged(Tags.HAD_FIELD)) {
        // we had a field but no value yet - this must be either a boolean or an unquoted string
        if (['TRUE', 'FALSE'].includes(upper)) {
            ctx.accept(TokenType.BOOLEAN, upper === 'TRUE').tag(Tags.HAD_VALUE)
        } else {
            ctx.accept(TokenType.PARTIAL_VALUE).tag(Tags.HAD_VALUE)
        }
    } else {
        ctx.accept(TokenType.FIELD).tag(Tags.HAD_FIELD)
    }
})

tokenizer.rule(/,/, (ctx) => {
    // untag HAD_VALUE because a comma cannot be followed by AND or OR - but by another value
    ctx.untag(Tags.HAD_VALUE).accept(TokenType.COMMA)
})

tokenizer.rule(/(?<!\\)"(.*?)(?<!\\)"/, (ctx, match) => {
    ctx.accept(TokenType.STRING, match[1].replace(/\\"/g, '"')).tag(
        Tags.HAD_VALUE
    )
})

tokenizer.rule(/(?<!\\)'(.*?)(?<!\\)'/, (ctx, match) => {
    ctx.accept(TokenType.STRING, match[1].replace(/\\'/g, "'")).tag(
        Tags.HAD_VALUE
    )
})

tokenizer.rule(/(?<!\\)['"](.*)/, (ctx, match) => {
    // partial string
    ctx.accept(TokenType.PARTIAL_VALUE, match[1].replace(/\\'/g, "'")).tag(
        Tags.HAD_VALUE
    )
})

tokenizer.rule(/\s+/, (ctx) => {
    ctx.accept(TokenType.WHITESPACE)
})

tokenizer.rule(/[a-z*]*/i, (ctx, match) => {
    if (
        ctx.tagged(Tags.HAD_FIELD) &&
        !ctx.tagged(Tags.HAD_VALUE) &&
        !['TRUE', 'FALSE'].includes(match[0].toUpperCase())
    ) {
        // an unquoted string with an asterisk
        ctx.accept(TokenType.PARTIAL_VALUE).tag(Tags.HAD_VALUE)
    }
})

tokenizer.rule(/.+/, (ctx, match) => {
    // unrecognized token
    ctx.accept(TokenType.WHITESPACE, match[0].replaceAll(/./g, ' '))
})

export function tokenize(input: string) {
    tokenizer.reset()
    tokenizer.input(input)
    return tokenizer.tokens()
}

export function splitByQuotes(input: string, ignore?: string) {
    const parts = tokenize(input)
        .filter((token) => token.type !== 'whitespace')
        .map((token) => token.text)
        .map((text, index, array) => {
            if (array[index + 1] === ',') {
                return text + ','
            } else {
                return text === ',' ? '' : text
            }
        })
        .filter((text) => text !== '')

    if (/\s$/.test(input)) {
        parts.push('')
    }
    return parts
}
