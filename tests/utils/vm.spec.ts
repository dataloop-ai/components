import { getParentVm } from '../../src/utils/vm'

describe('vm', () => {
    describe('getParentVm', () => {
        it('should return undefined', () => {
            expect(getParentVm({})).toBe(undefined)
        })

        it('should return {}', () => {
            expect(
                getParentVm({
                    $parent: {}
                })
            ).toStrictEqual({})
        })

        it('should return undefined', () => {
            expect(
                getParentVm({
                    proxy: {}
                })
            ).toBe(undefined)
        })
    })
})
