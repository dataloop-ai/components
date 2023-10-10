export function splitByQuotes(input: string, split: string): string[] {
    const stack: string[] = [];
    let buffer: string = '';
    let escapeNext = false;
    const results: string[] = [];

    for (let char of input) {
        // Handle escaped characters
        if (escapeNext) {
            buffer += char;
            escapeNext = false;
            continue;
        }
        if (char === '\\') {
            buffer += char;
            escapeNext = true;
            continue;
        }
        // Handle quotes (both double and single)
        if (char === '"' || char === "'") {
            if (stack.length === 0) {
                stack.push(char);
            } else if (stack[stack.length - 1] === char) {
                stack.pop();
            } else {
                stack.push(char);
            }
        }

        // Handle the split character
        if (char === split && stack.length === 0) {
            results.push(buffer.trim());
            buffer = '';
        } else {
            buffer += char;
        }
    }

    if (buffer.trim()) {
        results.push(buffer.trim());
    }

    return results;
}
