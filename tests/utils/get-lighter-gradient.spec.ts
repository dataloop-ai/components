import { getLighterGradient } from '../../src/utils/getLighterGradient'

describe('when passing a css color name', () => {
    it('should return a lighter hex value', () => {
        expect(getLighterGradient('red', 30)).toMatch('#ff1e1e')
    })
})
describe('when passing a css hex value', () => {
    it('should return a lighter hex value', () => {
        expect(getLighterGradient('#0000FF', 30)).toMatch('#1e1eff')
    })
})
