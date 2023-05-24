import { describe, expect, it } from 'vitest'
import { stringStyleToRecord } from '../../src/utils/stringStyleToRecord'

describe('stringStyleToRecord', () => {
    it('should convert a string style to a record', () => {
        const input = 'color: red; background-color: blue'
        const output = {
            color: 'red',
            backgroundColor: 'blue'
        }
        expect(stringStyleToRecord(input)).toEqual(output)
    })
})
