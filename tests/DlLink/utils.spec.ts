import { getLinkRel, getLinkTarget } from '../../src/components/DlLink'

describe('DlLink getLinkTarget util', () => {
    it('should return "_blank" if given value is true and "null" if false value is given', () => {
        const trueValueResponse: string = '_blank'
        const falseValueResponse: null = null

        const trueResp = getLinkTarget(true)

        expect(trueResp).toEqual(trueValueResponse)

        const falseResp = getLinkTarget(false)

        expect(falseResp).toEqual(falseValueResponse)
    })
})

describe('DlLink getLinkRel util', () => {
    it('should return "noopener" if given value is true and "null" if false value is given', () => {
        const trueValueResponse: string = 'noopener noreferrer'
        const falseValueResponse: null = null

        const trueResp = getLinkRel(true)

        expect(trueResp).toEqual(trueValueResponse)

        const falseResp = getLinkRel(false)

        expect(falseResp).toEqual(falseValueResponse)
    })
})
