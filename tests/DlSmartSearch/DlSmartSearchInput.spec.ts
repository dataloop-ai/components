import { mount } from '@vue/test-utils'
import DlSmartSearchInput from '../../src/components/compound/DlSearches/DlSmartSearch/components/DlSmartSearchInput.vue'
import {
    describe,
    it,
    expect,
    vi,
    beforeAll,
    beforeEach,
    afterAll
} from 'vitest'
import { stateManager } from '../../src/StateManager'

window.ResizeObserver =
    window.ResizeObserver ||
    vi.fn().mockImplementation(() => ({
        disconnect: vi.fn(),
        observe: vi.fn(),
        unobserve: vi.fn()
    }))

const schema = {
    name: ['string', { Voltaire: 'Arouet' }],
    level: ['high', 'medium', 'low', 30],
    completed: 'boolean',
    metadata: {
        nesting: {
            age: 'number',
            valid: 'boolean'
        },
        date: 'date',
        start: 'datetime',
        classTime: 'time',
        '*': 'any'
    }
}

const schema2 = {
    name: ['string', { Voltaire: 'Arouet' }],
    level: ['high', 'medium', 'low', 30],
    completed: 'boolean',
    metadata: {
        nesting: {
            age: ['number', { 21: 'twentyone' }],
            valid: 'boolean'
        },
        date: 'date',
        start: 'datetime',
        classTime: 'time',
        '*': 'any'
    }
}

const aliases = [
    {
        alias: 'Name',
        key: 'name'
    },
    {
        alias: 'Age',
        key: 'metadata.nesting.age'
    },
    {
        alias: 'StartTime',
        key: 'metadata.start'
    },
    {
        alias: 'Level',
        key: 'level'
    }
]

describe('DlSmartSearchInput', () => {
    it('should assign classes to component according to the props', async () => {
        const wrapper = mount(DlSmartSearchInput, {
            props: {
                status: { type: 'error', message: 'error label' }
            }
        })
        expect(wrapper.vm.searchBarClasses.includes('--error')).toBeTruthy()

        await wrapper.setProps({
            status: { type: 'info', message: 'info label' }
        })

        wrapper.vm.focused = true
        await wrapper.vm.$nextTick()
        expect(wrapper.vm.searchBarClasses.includes('--focused')).toBeTruthy()

        await wrapper.setProps({ disabled: true })
        expect(wrapper.vm.searchBarClasses.includes('--disabled')).toBeTruthy()

        await wrapper.setProps({ placeholder: 'text' })
    })

    it('Will update the v-model', async () => {
        const wrapper = mount(DlSmartSearchInput as any, {
            props: {
                modelValue: { a: true },
                styleModel: { fields: { values: '', color: 'red' } }
            }
        })
        await wrapper.setProps({ modelValue: { a: false } })
        // @ts-ignore // handled in jest setup
        await window.delay(500)
        await wrapper.vm.$nextTick()
        const inputRef = wrapper.vm.$refs.input as HTMLInputElement
        let innerHTML = ''
        for (const child of inputRef.children) {
            innerHTML += child.innerHTML
        }

        expect(innerHTML.trim()).toBe('a = false')
    })

    it('will show focus on click', async () => {
        const wrapper = mount(DlSmartSearchInput, {
            props: {
                schema,
                aliases,
                modelValue: {}
            }
        })

        await wrapper.vm.input.click()
        // @ts-ignore // handled in jest setup
        await window.delay(500)
        await wrapper.vm.$nextTick()
        expect(wrapper.vm.focused).toBe(true)
    })

    describe('focus and blur behavior', () => {
        const wrapper = mount(DlSmartSearchInput, {
            props: {
                disabled: false
            },
            mounted() {
                this.$refs.input.scrollTo = vi.fn()
            }
        })

        it('should focus', () => {
            wrapper.vm.focus()
            expect(wrapper.emitted().focus).toBeTruthy()
        })

        it('should handle blur', async () => {
            wrapper.vm.onEscapeKey()
            wrapper.vm.blur()
            expect(wrapper.emitted().blur).toBeDefined()
            expect(wrapper.vm.focused).toBe(false)
        })
    })

    it('should clear the value', () => {
        const wrapper = mount(DlSmartSearchInput, {
            mounted() {
                this.$refs.input.scrollTo = vi.fn()
            }
        })
        wrapper.vm.onClear()
        expect(wrapper.emitted()['update:model-value']).toEqual([[{}]])
    })

    it('should handle keyboard input', async () => {
        const wrapper = mount(DlSmartSearchInput, {
            props: {}
        })
        await wrapper.setProps({ modelValue: { a: false } })

        //@ts-ignore
        await window.delay(500)
        await wrapper.vm.$nextTick()

        wrapper.vm.onKeyPress({
            key: 'backspace',
            preventDefault: vi.fn(),
            stopPropagation: vi.fn()
        } as any as KeyboardEvent)
        wrapper.vm.onKeyPress({
            key: 'Enter',
            preventDefault: vi.fn(),
            stopPropagation: vi.fn()
        } as any as KeyboardEvent)

        const inputRef = wrapper.vm.$refs.input as HTMLInputElement
        let innerHTML = ''
        for (const child of inputRef.children) {
            innerHTML += child.innerHTML
        }
        expect(innerHTML.trim()).toBe('a = false')
    })

    it('should handle value change', async () => {
        const wrapper = mount(DlSmartSearchInput)
        wrapper.vm.debouncedSetInputValue('text')
        //@ts-ignore
        await window.delay(500)
        await wrapper.vm.$nextTick()
        expect(wrapper.emitted()['input']).toEqual([['text']])
    })

    it('should handle selection update', () => {
        const wrapper = mount(DlSmartSearchInput)
        const interval = { from: new Date(), to: new Date() }
        wrapper.vm.onDateSelection(interval)
        expect(wrapper.vm.datePickerSelection).toEqual(interval)
    })

    describe('DlSmartSearchInput Search behavior', () => {
        let wrapper: any
        beforeAll(() => {
            wrapper = mount(DlSmartSearchInput, {
                props: {
                    schema,
                    aliases
                }
            })
        })

        describe('when mounting', () => {
            it('should mount the component', () => {
                const component = wrapper.find('div.dl-smart-search-input')
                expect(component.exists()).toBe(true)
            })
        })

        describe('when using placeholder', () => {
            beforeAll(() => {
                wrapper = mount(DlSmartSearchInput, {
                    props: {
                        schema,
                        aliases,
                        placeholder: 'placeholder'
                    }
                })
            })

            describe('when the input is focused', () => {
                it('should not have a placeholder', () => {
                    wrapper.vm.focused = true
                    expect(wrapper.vm.placeholder).toBe('placeholder')
                    expect(wrapper.vm.inputPlaceholder).toBe('')
                })
            })

            describe('when the input is not focused', () => {
                it('should have a placeholder', () => {
                    wrapper.vm.focused = false
                    expect(wrapper.vm.placeholder).toBe('placeholder')
                    expect(wrapper.vm.inputPlaceholder).toBe('placeholder')
                })
            })
        })

        describe('when changing status when typing a query', () => {
            it('should have status info by default', () => {
                expect(wrapper.vm.computedStatus.type).toMatch('info')
            })
            it('should change status to success when typing a valid query', async () => {
                await wrapper.vm.debouncedSetInputValue(`name = 'test'`)
                // @ts-ignore
                await window.delay(500)
                await wrapper.vm.$nextTick()
                expect(wrapper.vm.computedStatus.type).toMatch('success')
            })
            it('should change status to warning when the error state is set to warning', async () => {
                await wrapper.vm.debouncedSetInputValue(`age = 'test'`)
                // @ts-ignore
                await window.delay(500)
                await wrapper.vm.$nextTick()
                expect(wrapper.vm.computedStatus.type).toMatch('warning')
            })
            it('should change status to error when error state is error', async () => {
                await wrapper.vm.debouncedSetInputValue(`name = '5'0`)
                // @ts-ignore
                await window.delay(500)
                await wrapper.vm.$nextTick()
                expect(wrapper.vm.computedStatus.type).toMatch('error')
            })
        })

        describe('when typing inside the input', () => {
            it('should set input model and active query when typing in the smart search input component', async () => {
                const testString = 'Age = 21'
                wrapper.vm.focused = true
                wrapper.vm.debouncedSetInputValue(testString)
                // @ts-ignore
                await window.delay(500)
                await wrapper.vm.$nextTick()
                expect(wrapper.emitted().input).toBeDefined()
                expect(
                    wrapper.emitted().input.filter((o) => o[0] === testString)
                ).toBeDefined()
                wrapper.vm.blur()
                // @ts-ignore
                await window.delay(500)
                await wrapper.vm.$nextTick()
                expect(wrapper.emitted()['update:model-value']).toEqual([
                    [{ 'metadata.nesting.age': 21 }]
                ])
            })

            it('should keep the brackets between quotes in string values', async () => {
                wrapper.vm.focused = true
                wrapper.vm.debouncedSetInputValue(`name = '(test).*.(b)'`)
                // @ts-ignore
                await window.delay(500)
                await wrapper.vm.$nextTick()
                wrapper.vm.blur()
                // @ts-ignore
                await window.delay(500)
                await wrapper.vm.$nextTick()
                expect(
                    wrapper.emitted()['update:model-value'].slice(-1)
                ).toEqual([[{ name: '(test).*.(b)' }]])
            })

            it('should open date picker after typing a date patten, and append a space after selecting a date there', async () => {
                wrapper.vm.focused = true
                wrapper.vm.debouncedSetInputValue('StartTime = (dd/mm/yyyy)')
                // @ts-ignore
                await window.delay(500)
                await wrapper.vm.$nextTick()

                expect(wrapper.vm.showDatePicker).toBeTruthy()

                wrapper.vm.onDateSelection({ from: new Date(), to: new Date() })
                wrapper.vm.onDateSelectionApply()
                //@ts-ignore
                await window.delay(500)
                await wrapper.vm.$nextTick()

                expect(wrapper.vm.showDatePicker).toBeFalsy()
                expect(wrapper.vm.searchQuery.endsWith(' ')).toBeTruthy()
            })

            describe('when moving the caret back in the entered text', async () => {
                const testString = `level = low AND metadata.test = 'ok'`
                const resultString1 = `completed = low AND metadata.test = 'ok'`
                const resultString2 = `level != = low AND metadata.test = 'ok'`
                const resultString3 = `level = low OR AND metadata.test = 'ok'`
                const resultString4 = `level = 'high' low AND metadata.test = 'ok'`
                const resultString5 = `level = low AND metadata.nesting test = 'ok'`
                beforeAll(async () => {
                    wrapper.vm.focused = true
                    wrapper.vm.debouncedSetInputValue(testString)
                    // @ts-ignore
                    await window.delay(500)
                    await wrapper.vm.$nextTick()
                })
                const testReplacingWithSuggestion =
                    (at, suggestion, result) => async () => {
                        wrapper.vm.debouncedSetInputValue(testString, {
                            testCaret: at
                        })
                        // @ts-ignore
                        await window.delay(500)
                        await wrapper.vm.$nextTick()
                        expect(wrapper.vm.showSuggestions).toBeTruthy()
                        //console.log('suggestions:', wrapper.vm.suggestions)
                        wrapper.vm.setInputFromSuggestion(
                            wrapper.vm.suggestions[suggestion]
                        )
                        // @ts-ignore
                        await window.delay(500)
                        await wrapper.vm.$nextTick()
                        expect(wrapper.vm.searchQuery).toBe(result)
                    }
                it(
                    'should be able to replace first key (0)',
                    testReplacingWithSuggestion(0, 1, resultString1)
                )
                it(
                    'should be able to replace first key (1)',
                    testReplacingWithSuggestion(1, 0, resultString1)
                )
                it(
                    'should not be able to replace comparison operator',
                    testReplacingWithSuggestion(6, 1, resultString2)
                )
                it(
                    'should not be able to replace logical operator',
                    testReplacingWithSuggestion(12, 1, resultString3)
                )
                it(
                    'should not be able to replace the value',
                    testReplacingWithSuggestion(8, 0, resultString4)
                )
                it(
                    'should not be able to replace nested key',
                    testReplacingWithSuggestion(25, 0, resultString5)
                )
            })
        })

        describe('when querying with a set scheme', () => {
            describe('when using an alias', () => {
                beforeAll(async () => {
                    wrapper.vm.debouncedSetInputValue(`Age = 25`)
                    // @ts-ignore
                    await window.delay(500)
                    await wrapper.vm.$nextTick()
                })
                it('should have not have errors', () => {
                    expect(wrapper.vm.error).to.be.null
                })
            })
            describe('when having a supported anykey field', () => {
                beforeAll(async () => {
                    wrapper.vm.debouncedSetInputValue(`metadata.test = 'bla'`)
                    // @ts-ignore
                    await window.delay(500)
                    await wrapper.vm.$nextTick()
                })
                it('should have not have errors', () => {
                    expect(wrapper.vm.error).to.be.null
                })
            })
            describe('when having a supported nested anykey field', () => {
                beforeAll(async () => {
                    wrapper.vm.debouncedSetInputValue(`metadata.test.a = 'bla'`)
                    // @ts-ignore
                    await window.delay(500)
                    await wrapper.vm.$nextTick()
                })
                it('should have not have errors', () => {
                    expect(wrapper.vm.error).to.be.null
                })
            })
            describe('when having a nested unsupported key', () => {
                beforeAll(async () => {
                    wrapper.vm.debouncedSetInputValue(
                        `metadata.nesting.a = 'bla'`
                    )
                    // @ts-ignore
                    await window.delay(500)
                    await wrapper.vm.$nextTick()
                })
                it('should have have errors', () => {
                    expect(wrapper.vm.error).to.be.equal(
                        'Invalid value for "metadata.nesting.a" field'
                    )
                })
            })
            describe('when having a non supported field in the schema', () => {
                beforeAll(async () => {
                    wrapper.vm.debouncedSetInputValue(
                        `metadata.nesting.a = 'bla'`
                    )
                    // @ts-ignore
                    await window.delay(500)
                    await wrapper.vm.$nextTick()
                })
                it('should have have errors', () => {
                    expect(wrapper.vm.error).to.be.equal(
                        'Invalid value for "metadata.nesting.a" field'
                    )
                })

                describe('When using non strict mode', () => {
                    beforeAll(async () => {
                        await wrapper.setProps({
                            strict: false
                        })
                        wrapper.vm.debouncedSetInputValue(
                            `nonexistingfield = 'bla'`
                        )
                        // @ts-ignore
                        await window.delay(500)
                        await wrapper.vm.$nextTick()
                    })
                    it('should not give an error', () => {
                        expect(wrapper.vm.error).to.be.equal('warning')
                    })
                })
                describe('When using strict mode', () => {
                    beforeAll(async () => {
                        await wrapper.setProps({
                            strict: true
                        })
                        wrapper.vm.debouncedSetInputValue(
                            `nonexistingfield = 'bla'`
                        )
                        // @ts-ignore
                        await window.delay(500)
                        await wrapper.vm.$nextTick()
                    })
                    it('should give an error', () => {
                        expect(wrapper.vm.error).to.be.equal(
                            'Invalid Expression'
                        )
                    })
                })
            })
        })
    })

    describe('SmartSearch emit on enter', () => {
        let wrapper: any

        beforeAll(async () => {
            wrapper = mount(DlSmartSearchInput, {
                props: {
                    schema,
                    aliases
                }
            })
            await wrapper.setProps({ modelValue: { name: 'test' } })
            // @ts-ignore // handled in jest setup
            await window.delay(500)
            await wrapper.vm.$nextTick()
        })

        beforeEach(async () => {
            wrapper.vm.onKeyPress({
                key: 'Enter',
                preventDefault: vi.fn(),
                stopPropagation: vi.fn()
            } as any as KeyboardEvent)

            //@ts-ignore
            await window.delay(500)
            await wrapper.vm.$nextTick()
        })

        it('will emit search with model value', () => {
            expect(wrapper.emitted().search).toEqual([[{ name: 'test' }]])
        })

        it('will not emit search when the query did not change', () => {
            expect(wrapper.emitted().search.length).toBe(1)
        })
    })

    describe('On JSON with nested aliased value', () => {
        let wrapper: any
        const modelValue = { $and: [{ 'metadata.nesting.age': 21 }] }

        beforeAll(async () => {
            wrapper = mount(DlSmartSearchInput, {
                props: {
                    schema: schema2,
                    aliases
                }
            })
            console.log(wrapper.vm.schema)
            await wrapper.setProps({
                modelValue
            })
        })

        it('will have value alias in a query', async () => {
            // @ts-ignore // handled in jest setup
            await window.delay(500)
            await wrapper.vm.$nextTick()
            wrapper.vm.blur()
            // @ts-ignore
            await window.delay(500)
            await wrapper.vm.$nextTick()
            expect(wrapper.vm.searchQuery).toEqual('Age = 21 ')
        })
    })

    describe('On JSON with aliased value', () => {
        let wrapper: any

        beforeAll(async () => {
            wrapper = mount(DlSmartSearchInput, {
                props: {
                    schema,
                    aliases
                }
            })
            await wrapper.setProps({
                modelValue: { $and: [{ name: 'Arouet' }] }
            })
        })

        it('will have value alias in a query', async () => {
            // @ts-ignore // handled in jest setup
            await window.delay(500)
            await wrapper.vm.$nextTick()

            expect(wrapper.vm.searchQuery).toEqual("Name = 'Voltaire' ")
        })
    })

    describe('On complex JSON', () => {
        const complex = {
            filter: {
                $and: [
                    {
                        hidden: false
                    },
                    {
                        annotated: true
                    },
                    {
                        type: 'file'
                    }
                ]
            },
            join: {
                filter: {
                    $and: [
                        {
                            label: {
                                $in: ['b', 'test']
                            }
                        },
                        {
                            type: {
                                $in: ['pose', 'note', 'binary']
                            }
                        }
                    ]
                },
                on: {
                    resource: 'annotations',
                    local: 'itemId',
                    forigen: 'id'
                }
            }
        }

        let wrapper: any

        beforeAll(async () => {
            wrapper = mount(DlSmartSearchInput, {
                props: {
                    schema,
                    aliases
                }
            })
            await wrapper.setProps({ modelValue: complex })
        })

        it('will emit an error', () => {
            const emittedErrors = wrapper.emitted()?.error
            expect(emittedErrors?.length).toBeGreaterThan(0)
            const message = wrapper.emitted()?.error[0][0]?.message
            expect(message).toEqual(
                'Could not translate given JSON to a valid Scheme'
            )
        })
    })

    describe('When using arrow navigation', () => {
        let wrapper: any
        beforeAll(() => {
            stateManager.disableDebounce = true
            wrapper = mount(DlSmartSearchInput, {
                props: {
                    schema,
                    aliases
                }
            })
        })

        afterAll(() => {
            stateManager.disableDebounce = false
        })

        describe('when clicking enter while suggestion is visible', () => {
            beforeAll(async () => {
                await wrapper.vm.focus()
                wrapper.vm.debouncedSetInputValue(`level = 'low'`)
            })

            it('should show suggestions', async () => {
                console.log(wrapper.vm.showSuggestions)
                expect(wrapper.vm.showSuggestions).toBeTruthy()
            })

            it('should handle keyboard input', async () => {
                wrapper.vm.suggestionsDropdown.handleSelectedItem(null)
                await wrapper.vm.$nextTick()

                const emittedModelValue =
                    wrapper.emitted()['update:model-value']
                expect(emittedModelValue).toEqual([[{ level: 'low' }]])
            })
        })
    })
})
