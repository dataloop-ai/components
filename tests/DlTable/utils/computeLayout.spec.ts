import { describe, it, expect } from 'vitest'
import {
    computeLayout,
    LayoutInput
} from '../../../src/components/compound/DlTable/utils/computeLayout'

const limits = { minWidth: 64, maxWidth: Infinity }

const input = (over: Partial<LayoutInput>): LayoutInput => ({
    columns: [],
    containerWidth: 0,
    measurements: {},
    userWidths: {},
    limits,
    ...over
})

describe('computeLayout', () => {
    it('renders a numeric width as px (it used to be ignored)', () => {
        const { widths } = computeLayout(
            input({
                columns: [{ name: 'a', width: 200 }],
                containerWidth: 1000
            })
        )
        expect(widths.a).toBe(200)
    })

    it('parses px strings and resolves percentages against the container', () => {
        const { widths } = computeLayout(
            input({
                columns: [
                    { name: 'a', width: '120px' },
                    { name: 'b', width: '25%' },
                    { name: 'c', width: 'calc(10em + 4px)' }
                ],
                containerWidth: 800
            })
        )
        expect(widths).toEqual({ a: 120, b: 200, c: 'calc(10em + 4px)' })
    })

    it('starts columns at their content width, clamped to their limits', () => {
        const { widths } = computeLayout(
            input({
                columns: [
                    { name: 'a' },
                    { name: 'b', maxWidth: 150 },
                    { name: 'c', minWidth: 100 }
                ],
                measurements: { a: 30, b: 400, c: 90 }
            })
        )
        expect(widths).toEqual({ a: 64, b: 150, c: 100 })
    })

    it('clamps a user-resized width to the column limits', () => {
        const { widths } = computeLayout(
            input({
                columns: [
                    { name: 'a', minWidth: 80, maxWidth: 480 },
                    { name: 'b', minWidth: 80, maxWidth: 480 }
                ],
                userWidths: { a: 20, b: 900 }
            })
        )
        expect(widths).toEqual({ a: 80, b: 480 })
    })

    it('uses the table limits when the column has none', () => {
        const { widths } = computeLayout(
            input({
                columns: [{ name: 'a' }],
                userWidths: { a: 1000 },
                limits: { minWidth: 80, maxWidth: 480 }
            })
        )
        expect(widths.a).toBe(480)
    })

    it('fills spare space proportionally among growable columns', () => {
        const { widths, total } = computeLayout(
            input({
                columns: [
                    { name: 'a' },
                    { name: 'b' },
                    { name: 'fixed', width: 100 }
                ],
                measurements: { a: 100, b: 300 },
                containerWidth: 900
            })
        )
        expect(widths).toEqual({ a: 200, b: 600, fixed: 100 })
        expect(total).toBe(900)
    })

    it('does not grow fixed-mode or resized columns', () => {
        const { widths } = computeLayout(
            input({
                columns: [
                    { name: 'a', widthMode: 'fixed' },
                    { name: 'b' },
                    { name: 'c' }
                ],
                measurements: { a: 100, b: 100, c: 100 },
                userWidths: { c: 150 },
                containerWidth: 600
            })
        )
        expect(widths).toEqual({ a: 100, b: 350, c: 150 })
    })

    it('redistributes what a capped column cannot take, then gives the rest to the last column', () => {
        const { widths, total } = computeLayout(
            input({
                columns: [
                    { name: 'a', maxWidth: 120 },
                    { name: 'b', maxWidth: 200 }
                ],
                measurements: { a: 100, b: 100 },
                containerWidth: 1000
            })
        )
        expect(widths.a).toBe(120)
        expect(widths.b).toBe(880)
        expect(total).toBe(1000)
    })

    it('keeps the primary column at least as wide as the others when there is spare space', () => {
        const { widths } = computeLayout(
            input({
                columns: [{ name: 'p', primary: true }, { name: 'b' }],
                measurements: { p: 64, b: 300 },
                containerWidth: 700
            })
        )
        expect(widths.p).toBeGreaterThanOrEqual(widths.b as number)
        expect((widths.p as number) + (widths.b as number)).toBe(700)
    })

    it('overflows instead of squeezing when the content is wider than the container', () => {
        const { widths, total } = computeLayout(
            input({
                columns: Array.from({ length: 10 }, (_, i) => ({
                    name: `c${i}`,
                    minWidth: 100
                })),
                containerWidth: 600
            })
        )
        expect(Object.values(widths).every((w) => w === 100)).toBe(true)
        expect(total).toBe(1000)
    })

    it('leaves widths to the browser with fitAllColumns, except explicit and resized ones', () => {
        const { widths } = computeLayout(
            input({
                columns: [
                    { name: 'a' },
                    { name: 'b', width: 90 },
                    { name: 'c' }
                ],
                userWidths: { c: 120 },
                fitAllColumns: true,
                containerWidth: 900
            })
        )
        expect(widths).toEqual({ a: null, b: 90, c: 120 })
    })

    it('does not distribute when the container width is unknown', () => {
        const { widths } = computeLayout(
            input({ columns: [{ name: 'a' }], measurements: { a: 70 } })
        )
        expect(widths.a).toBe(70)
    })

    it('never sets a max below the min', () => {
        const { widths } = computeLayout(
            input({
                columns: [{ name: 'a', minWidth: 200, maxWidth: 100 }],
                measurements: { a: 50 }
            })
        )
        expect(widths.a).toBe(200)
    })
})
