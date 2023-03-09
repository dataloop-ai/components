import { getThemeModeAttr } from '../../src/utils/theme'
import { describe, it, expect } from 'vitest'

describe('getThemeModeAttr', () => {
    it('should return "dark-mode" if dark value is true, and empty string if false value is given', () => {
        const isDarkFalseResponse = ''
        const isDarkTrueResponse = 'dark-mode'

        const darkThemeTrueResult = getThemeModeAttr(true)

        expect(darkThemeTrueResult).toEqual(isDarkTrueResponse)

        const darkThemeFalseResult = getThemeModeAttr(false)

        expect(darkThemeFalseResult).toEqual(isDarkFalseResponse)
    })
})
