export function between(v: any, min: number, max: number): number {
    return max <= min ? min : Math.min(max, Math.max(min, v))
}
