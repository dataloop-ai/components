export function splitByQuotes(input: string, split: string) {
    const pattern = '([\\s\\S]*?)(e)?(?:(o)|(c)|(t)|(sp)|$)'
        .replace('sp', split)
        .replace('o', '[\\(\\{\\[]')
        .replace('c', '[\\)\\}\\]]')
        .replace('t', '[\'"]')
        .replace('e', '[\\)\\]]')
    const r = new RegExp(pattern, 'gi')
    const stack: string[] = []
    let buffer: string[] = []
    const results: string[] = []
    input.replace(r, ($0, $1, $e, $o, $c, $t, $s, i): any => {
        if ($e) {
            buffer.push($1, $s || $o || $c || $t)
            return
        } else if ($o) stack.push($o)
        else if ($c) stack.pop()
        else if ($t) {
            if (stack[stack.length - 1] !== $t) stack.push($t)
            else stack.pop()
        } else {
            if ($s ? !stack.length : !$1) {
                buffer.push($1)
                results.push(buffer.join(''))
                buffer = []
                return
            }
        }
        buffer.push($0)
    })
    return results
}
