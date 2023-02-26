import { clearSelection } from '../../src/utils'

describe('Selection utils', () => {
    describe('clearSelection', () => {
        let spy: jest.SpyInstance

        beforeEach(() => {
            spy = jest.spyOn(window, 'getSelection')
        })

        afterEach(() => {
            spy.mockRestore()
        })

        describe('when getSelection is defined', () => {
            it('should try and get the selection', () => {
                spy.mockImplementation(() => ({}))

                clearSelection()
                expect(window.getSelection).toHaveBeenCalled()
            })

            describe('when selection is undefined', () => {
                it('should interrupt function execution', () => {
                    spy.mockImplementation(() => undefined)
                    clearSelection()
                    expect(window.getSelection()).toBeUndefined()
                })
            })

            describe('when selection has "empty" method', () => {
                it('should call it', () => {
                    spy.mockImplementation(() => ({
                        empty: jest.fn()
                    }))
                    clearSelection()
                    expect(window.getSelection()!.empty).toBeDefined()
                })
            })

            describe('otherwise, if "remooveAllRanges" is defined', () => {
                it('should call it', () => {
                    spy.mockImplementation(() => ({
                        removeAllRanges: jest.fn()
                    }))
                    clearSelection()
                    expect(window.getSelection()!.removeAllRanges).toBeDefined()
                })

                describe('if the window has "ontouchstart" method', () => {
                    it('should call the "addRange" method', () => {
                        window.ontouchstart = jest.fn()
                        const docSpy = jest.spyOn(
                            document,
                            'createRange'
                        ) as jest.SpyInstance

                        spy.mockImplementation(() => ({
                            removeAllRanges: jest.fn(),
                            addRange: jest.fn()
                        }))

                        docSpy.mockImplementation(() => ({
                            startOffset: 0,
                            endOffset: 0
                        }))

                        clearSelection()
                        expect(window.getSelection()!.addRange).toBeDefined()
                        expect(docSpy).toHaveBeenCalled()
                    })
                })
            })
        })
    })
})
