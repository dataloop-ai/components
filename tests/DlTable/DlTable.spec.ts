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
                    titleClass: 'styled'
                }
            })
        })

        it('should compute title classes', async () => {
            expect(wrapper.vm.titleClasses).toBe('dl-table__title styled')

            await wrapper.setProps({
                titleClass: undefined
            })

            expect(wrapper.vm.titleClasses.trim()).toBe('dl-table__title')
        })
        it('should compute container classes', () => {
            expect(wrapper.vm.containerClass).toBe(
                'dl-table__container dl-table--horizontal-separator column no-wrap dl-table--no-wrap dl-table--dense'
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
    })

    it('should compute the right bottom message', async () => {
        const LOADING_LABEL = 'Loading...'
        const NO_RESULTS_LABEL = 'No results.'

        const wrapper = mount(DlTable, {
            props: {
                columns: COLUMNS,
                rows: [],
                loadingLabel: LOADING_LABEL,
                loading: true
            }
        })

        expect(wrapper.vm.bottomMessage).toBe(LOADING_LABEL)

        await wrapper.setProps({
            loading: false,
            filter: 'a',
            noResultsLabel: NO_RESULTS_LABEL
        })

        expect(wrapper.vm.bottomMessage).toBe(NO_RESULTS_LABEL)
    })

    it('should emit virtual scroll event', async () => {
        const SCROLL_DETAILS = {
            scrollStart: 0,
            scrollViewSize: 300,
            scrollMaxSize: 500,
            offsetStart: 0,
            offsetEnd: 200
        }

        const wrapper = mount(DlTable, {
            props: {
                columns: COLUMNS
            }
        })

        wrapper.vm.onVScroll(SCROLL_DETAILS)

        expect(wrapper.emitted()['virtual-scroll'][0]).toBeTruthy()
        expect((wrapper.emitted()['virtual-scroll'][0] as any[])[0]).toEqual(
            SCROLL_DETAILS
        )
    })

    it('should return to page 1 after filter', async () => {
        const wrapper = mount(DlTable, {
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

        expect(wrapper.vm.marginalsScope.pagination.page).toBe(1)
    })
})
