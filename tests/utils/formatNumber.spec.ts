import { describe, it, expect } from 'vitest'
import {
    abbreviateBytes,
    abbreviateNumber,
    numberWithComma
} from '../../src/utils'

describe('formatNumber utils', () => {
    describe('abbreviateBytes', () => {
        it('should display a size below 1,000 as is', () => {
            expect(abbreviateBytes(123)).toBe('123B')
        })
        it('should display a size equal to or greater than 1,000 as kilobytes', () => {
            expect(abbreviateBytes(123456)).toBe('123KB')
        })
        it('should display a size equal to or greater than 999,500 as megabytes', () => {
            expect(abbreviateBytes(123456789)).toBe('123MB')
        })
    })
    describe('abbreviateNumber', () => {
        it('should display a number below 1,000 as is', () => {
            expect(abbreviateNumber(123)).toBe('123')
        })
        it('should display a number equal to or greater than 1,000 as kilos', () => {
            expect(abbreviateNumber(123456)).toBe('123.5K')
        })
        it('should display a size equal to or greater than 999,950 as megas', () => {
            expect(abbreviateNumber(123456789)).toBe('123.5M')
        })
    })
    describe('numberWithComma', () => {
        it('should display a number below 1,000 as is', () => {
            expect(numberWithComma(123)).toBe('123')
        })
        it('should display a number equal to or greater than 1,000 with one comma', () => {
            expect(numberWithComma(123456)).toBe('123,456')
        })
        it('should display a size equal to or greater than 1,000,000 with two commas', () => {
            expect(numberWithComma(123456789)).toBe('123,456,789')
        })
    })
})
