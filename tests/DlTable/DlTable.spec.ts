import { mount } from '@vue/test-utils'
import { DlTable } from '../../src/components'
import { describe, it, expect, beforeAll } from 'vitest'

const COLUMNS = [
    {
        name: 'name',
        required: true,
        label: 'Dessert (100g serving)',
        align: 'left',
        field: 'name',
        sortable: true
    },
    {
        name: 'calories',
        align: 'center',
        label: 'Calories',
        field: 'calories',
        sortable: true
    },
    { name: 'fat', label: 'Fat (g)', field: 'fat', sortable: true },
    { name: 'carbs', label: 'Carbs (g)', field: 'carbs' },
    { name: 'protein', label: 'Protein (g)', field: 'protein' },
    { name: 'sodium', label: 'Sodium (mg)', field: 'sodium' },
    {
        name: 'calcium',
        label: 'Calcium (%)',
        field: 'calcium',
        sortable: true,
        sort: (a: string | number, b: string | number) =>
            parseInt(a as string, 10) - parseInt(b as string, 10)
    },
    {
        name: 'iron',
        label: 'Iron (%)',
        field: 'iron',
        sortable: true,
        sort: (a: string | number, b: string | number) =>
            parseInt(a as string, 10) - parseInt(b as string, 10)
    }
]

describe('DlTable', () => {
    describe('When mounting', () => {
        let wrapper: any

        beforeAll(() => {
            wrapper = mount(DlTable, {
                props: {
                    columns: COLUMNS,
                    draggable: 'rows',
                    dense: true,
                    separator: 'horizontal',
                    titleClass: 'styled',
                    loadingLabel: 'Loading...',
                    loading: true
                }
            })
        })

        it('should mount the component', async () => {
            expect(wrapper.exists()).toBe(true)
        })

        describe('Test computed props', () => {
            it('should compute title classes', async () => {
                expect(wrapper.vm.titleClasses).toBe('dl-table__title styled')

                await wrapper.setProps({
                    titleClass: undefined
                })

                expect(wrapper.vm.titleClasses.trim()).toBe('dl-table__title')
            })
            it('should compute container classes', () => {
                expect(wrapper.vm.containerClass).toBe(
                    'dl-table__container dl-table--horizontal-separator column no-wrap dl-table--no-wrap dl-table--dense dl-table--loading'
                )
            })
            it('should compute proper draggable values', async () => {
                expect(wrapper.vm.hasDraggableRows).toBe(true)
                expect(wrapper.vm.hasDraggableColumns).toBe(false)

                await wrapper.setProps({
                    draggable: 'both'
                })

                expect(wrapper.vm.hasDraggableRows).toBe(true)
                expect(wrapper.vm.hasDraggableColumns).toBe(true)
            })
            it('should compute the right bottom message', async () => {
                const LOADING_LABEL = 'Loading...'
                const NO_RESULTS_LABEL = 'No results.'

                expect(wrapper.vm.noDataMessage).toBe(LOADING_LABEL)

                await wrapper.setProps({
                    loading: false,
                    filter: 'a',
                    noResultsLabel: NO_RESULTS_LABEL
                })

                expect(wrapper.vm.noDataMessage).toBe(NO_RESULTS_LABEL)
            })
        })
    })
    describe('When emit virtual scroll', () => {
        let wrapper: any
        const SCROLL_DETAILS = {
            scrollStart: 0,
            scrollViewSize: 300,
            scrollMaxSize: 500,
            offsetStart: 0,
            offsetEnd: 200
        }

        beforeAll(() => {
            wrapper = mount(DlTable, {
                props: {
                    columns: COLUMNS
                }
            })

            wrapper.vm.onVScroll(SCROLL_DETAILS)
        })

        it('should emitted virtual-scroll', () => {
            expect(wrapper.emitted()['virtual-scroll'][0]).toBeTruthy()
        })
        it('should emitted virtual scroll with scroll details', () => {
            expect(
                (wrapper.emitted()['virtual-scroll'][0] as any[])[0]
            ).toEqual(SCROLL_DETAILS)
        })
    })
    describe('When return to page 1 after filter', () => {
        let wrapper: any

        beforeAll(async () => {
            wrapper = mount(DlTable, {
                props: {
                    columns: COLUMNS,
                    filter: 'y',
                    pagination: {
                        page: 2
                    }
                }
            })
            await wrapper.setProps({ filter: 'yo' })
            await wrapper.vm.$nextTick()
        })

        it('should have the right pagination page', () => {
            expect(wrapper.vm.marginalsScope.pagination.page).toBe(1)
        })
    })
})
