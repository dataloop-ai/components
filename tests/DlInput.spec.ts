import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeAll, should } from 'vitest'
import { DlInput } from '../src/components'

describe('DlInput component', () => {
    describe('small input', () => {
        let wrapper: any
        beforeAll(() => {
            wrapper = mount(DlInput, {
                props: {
                    size: 's'
                }
            })
        })
        it('should determine whether the input is small', () => {
            expect(wrapper.vm.isSmall).toBe(true)
        })
        it('should set small class', () => {
            expect(wrapper.vm.rootContainerClasses).toEqual([
                'dl-input',
                'dl-input--s'
            ])
        })
    })
    describe('dense input', () => {
        let wrapper: any
        beforeAll(() => {
            wrapper = mount(DlInput, {
                props: {
                    dense: true
                }
            })
        })
        it('should set dense class', () => {
            expect(wrapper.vm.rootContainerClasses).toEqual([
                'dl-input',
                'dl-input--dense'
            ])
        })
    })
    describe('error input', () => {
        let wrapper: any
        beforeAll(() => {
            wrapper = mount(DlInput, {
                props: {
                    error: true
                }
            })
        })
        it('should set error border color', () => {
            expect(wrapper.vm.getBorderColor).toMatch(
                'var(--dl-color-negative)'
            )
        })
    })
    describe('warning input', () => {
        let wrapper: any
        beforeAll(() => {
            wrapper = mount(DlInput, {
                props: {
                    warning: true
                }
            })
        })
        it('should set error border color', () => {
            expect(wrapper.vm.getBorderColor).toMatch('var(--dl-color-warning)')
        })
    })
    describe('expandable input', () => {
        let wrapper: any
        beforeAll(() => {
            wrapper = mount(DlInput, {
                props: {
                    expandable: true
                }
            })
        })
        it('should set white space to normal', () => {
            expect(wrapper.vm.cssVars['--dl-input-white-space']).toMatch(
                'normal'
            )
        })
        it('should align append items to the start', () => {
            expect(wrapper.vm.cssVars['--dl-input-align-items']).toMatch(
                'flex-start'
            )
        })
    })
    describe('fixed height input', () => {
        let wrapper: any
        const height = '100px'
        beforeAll(() => {
            wrapper = mount(DlInput, {
                props: {
                    height
                }
            })
        })
        it('should set a specific height', () => {
            expect(wrapper.vm.cssVars['--dl-input-height']).toMatch(height)
        })
    })
    describe('password type input', () => {
        let wrapper: any
        const height = '100px'
        beforeAll(() => {
            wrapper = mount(DlInput, {
                props: {
                    type: 'password'
                }
            })
        })
        it('should set a password class', () => {
            expect(
                wrapper.vm.inputClasses.includes('dl-input__input--password')
            ).toBe(true)
        })
    })
    describe('input with slots', () => {
        let wrapper: any
        beforeAll(() => {
            wrapper = mount(DlInput, {
                slots: {
                    prepend: '<span>Slot</span>',
                    append: '<span>Slot</span>'
                }
            })
        })
        it('should set a prepend class', () => {
            expect(
                wrapper.vm.inputClasses.includes('dl-input__input--prepend')
            ).toBe(true)
        })
        it('should set an append class', () => {
            expect(
                wrapper.vm.inputClasses.includes('dl-input__input--append')
            ).toBe(true)
        })
    })
    describe('limiting input length', () => {
        let wrapper: any
        beforeAll(() => {
            wrapper = mount(DlInput, {
                props: {
                    maxLength: 5,
                    modelValue: '12345'
                }
            })
        })
        it('should prevent typing in more characters', () => {
            let prevent = false
            const preventDefault = () => (prevent = true)
            wrapper.vm.onKeydown({ preventDefault })
            expect(prevent).toBe(true)
        })
    })
    describe('onchange event', () => {
        let wrapper: any
        beforeAll(() => {
            wrapper = mount(DlInput, {
                props: {
                    modelValue: 'text'
                }
            })
        })
        it('should emit update model with new text', () => {
            const differentText = 'different text'
            wrapper.vm.onChange({ target: { innerText: differentText } })
            expect(wrapper.emitted()['update:model-value']).toEqual([
                [differentText]
            ])
        })
        it('should emit enter event', () => {
            wrapper.vm.onEnterPress({ target: { innerText: 'a' } })
            expect(wrapper.emitted().enter[0][0]).toMatch('a')
        })
    })
    describe('receiving suggestions', () => {
        let wrapper: any
        const suggestions = [{ suggestion: 'suggestion1' }]
        beforeAll(() => {
            wrapper = mount(DlInput, {
                props: {
                    autoSuggestItems: suggestions,
                    modelValue: 'su'
                }
            })
        })
        it('should suggest words based on input', () => {
            expect(wrapper.vm.suggestItems).toEqual(suggestions)
        })
        it('should complete text when clicking on suggestion', () => {
            const newSuggestion = 'suggestion1'
            wrapper.vm.onAutoSuggestClick({ target: null }, newSuggestion)
            expect(wrapper.emitted()['update:model-value']).toEqual([
                [' ' + newSuggestion]
            ])
        })
    })
    describe('file events', () => {
        let wrapper: any
        const mockFile = { id: 1, name: 'file_1', data: [], image: '' }
        beforeAll(() => {
            wrapper = mount(DlInput, {
                props: {
                    modelValue: 'text',
                    files: [mockFile]
                },
                data() {
                    return {
                        newFileName: 'new',
                        currentFile: { id: 1 }
                    }
                }
            })
        })
        it('should open zoom modal on zoom', () => {
            wrapper.vm.handleZoomImage({ image: 'img' })
            expect(wrapper.vm.zoomImageModel).toBe(true)
            expect(wrapper.vm.currentZoomImage).toMatch('img')
        })
        it('should rename a specific file', () => {
            wrapper.vm.handleRenameFile()
            expect(wrapper.emitted('file-update')[0][0][0].name).toMatch('new')
        })
        it('should open rename modal', () => {
            const file = { file: 'file' }
            wrapper.vm.handleRenameFileModal(file)
            expect(wrapper.vm.renameFileModel).toBe(true)
            expect(wrapper.vm.currentFile).toEqual(file)
        })
        it('should emit adding a new file', () => {
            wrapper.vm.emitAddFile(mockFile)
            const emitted = wrapper.emitted()['file-update']
            expect(emitted[emitted.length - 1][0].length).toBeGreaterThan(1)
        })
        it('should emit removing a file', () => {
            wrapper.vm.emitRemoveFile(mockFile.id)
            const emitted = wrapper.emitted()['file-update']
            expect(emitted[emitted.length - 1][0].length).toBe(0)
        })
    })
    describe('triggering events', () => {
        let wrapper: any
        beforeAll(() => {
            wrapper = mount(DlInput)
        })
        it('should set state on focus', () => {
            wrapper.vm.onFocus({ target: { scroll: () => {} } })
            expect(wrapper.vm.focused).toBe(true)
        })
        it('should set state on blur', () => {
            wrapper.vm.onBlur({ target: { scroll: () => {} } })
            expect(wrapper.vm.focused).toBe(false)
        })
        it('should emit clear event', () => {
            const mockEvent = { a: 'a' }
            wrapper.vm.onClear(mockEvent)
            expect(wrapper.emitted().clear).toBeTruthy()
            expect(wrapper.emitted()['update:model-value']).toEqual([['']])
        })
        it('should set showpass to true', () => {
            wrapper.setData({ showPass: false })
            wrapper.vm.onPassShowClick()
            expect(wrapper.vm.showPass).toBe(true)
        })
    })
    describe.only('input with preset value', () => {
        let wrapper: any
        beforeAll(async () => {
            wrapper = mount(DlInput, {
                props: {
                    modelValue: 'text',
                    debounce: 0
                }
            })

            await wrapper.vm.$nextTick()
        })

        it('should set input value', () => {
            expect(wrapper.vm.$refs.input.innerHTML).toMatch('text')
        })
    })
})
