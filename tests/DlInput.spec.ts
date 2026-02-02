import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeAll, should, afterAll } from 'vitest'
import { DlInput } from '../src/components'
import { before } from 'lodash'

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
    describe('input with preset value', () => {
        let wrapper: any
        beforeAll(async () => {
            wrapper = mount(DlInput, {
                props: {
                    modelValue: 'text',
                    debounce: 0
                }
            })

            await wrapper.vm.$nextTick()
            // @ts-ignore
            await window.delay(100)
        })

        it('should set input value', () => {
            expect(wrapper.vm.$refs.input.innerHTML).toMatch('text')
        })
    })
    describe('when input has spaces', () => {
        let wrapper: any
        beforeAll(async () => {
            wrapper = mount(DlInput, {
                props: {
                    modelValue: 'text with spaces',
                    debounce: 0
                }
            })

            await wrapper.vm.$nextTick()
            // @ts-ignore
            await window.delay(100)
        })

        it('should change the spaces with &nbsp; in the ref', () => {
            expect(wrapper.vm.$refs.input.innerHTML).toMatch(
                'text&nbsp;with&nbsp;spaces'
            )
        })

        describe('when writing new text', () => {
            beforeAll(async () => {
                //@ts-ignore
                window.DlComponents.disableDebounce = true
                wrapper.vm.isInternalChange = false
                await wrapper.vm.onModelValueChange('text with spaces test')
                await wrapper.vm.$nextTick()
                // @ts-ignore
                await window.delay(100)
            })
            afterAll(() => {
                //@ts-ignore
                window.DlComponents.disableDebounce = false
            })

            it('should change the spaces with &nbsp; in the ref', () => {
                expect(wrapper.vm.$refs.input.innerHTML).toMatch(
                    'text&nbsp;with&nbsp;spaces&nbsp;test'
                )
            })
        })

        describe('When emitting change', () => {
            beforeAll(async () => {
                await wrapper.vm.onChange({
                    target: { innerText: 'text&nbsp;with&nbsp;spaces test' }
                })
                await wrapper.vm.$nextTick()
                // @ts-ignore
                await window.delay(100)
            })

            it('should not have &nbsp; in the modelValue', () => {
                expect(wrapper.vm.modelValue).toMatch('text with spaces')
                expect(wrapper.emitted()['update:model-value']).toEqual([
                    ['text with spaces test']
                ])
            })
        })
    })
    describe('when input contains non-breaking spaces', () => {
        let wrapper: any
        beforeAll(async () => {
            wrapper = mount(DlInput, {
                props: {
                    modelValue: 'text with spaces',
                    debounce: 0
                }
            })

            await wrapper.vm.$nextTick()
            // @ts-ignore
            await window.delay(100)
        })

        describe('When emitting change', () => {
            beforeAll(async () => {
                await wrapper.vm.onChange({
                    target: {
                        innerText: `text with space test${String.fromCharCode(
                            160
                        )}`
                    }
                })
                await wrapper.vm.$nextTick()
                // @ts-ignore
                await window.delay(100)
            })

            it('should not have last space should be modified to normal space', () => {
                const modelValue = wrapper.emitted()[
                    'update:model-value'
                ][0][0] as string
                expect(modelValue.charCodeAt(modelValue.length - 1)).toEqual(32)
            })
        })
    })

    /**
     * TODO: add tests for input type number
     */
})
