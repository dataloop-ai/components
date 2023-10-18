import { mount } from '@vue/test-utils'
import { DlTreeTable } from '../../src/components'
import { describe, it, expect, beforeAll } from 'vitest'
import { v4 } from 'uuid'

const columns = [
    {
        name: 'name',
        required: true,
        label: 'Dessert (100g serving)',
        align: 'left',
        field: 'name',
        sortable: true,
        width: 100
    },
    {
        name: 'calories',
        align: 'center',
        label: 'Calories',
        field: 'calories',
        sortable: true,
        width: 100
    }
]

const rows = [
    {
        id: v4(),
        name: 'Frozen Yogurt',
        calories: 159,
        isExpanded: false,
        children: [
            {
                id: v4(),
                name: 'Eclair1',
                calories: 262,

                isExpanded: false
            }
        ]
    }
]

describe('DlTreeTable', () => {
    describe('When mounting', () => {
        let wrapper: any

        beforeAll(() => {
            wrapper = mount(DlTreeTable, {
                props: {
                    columns,
                    rows,
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
                expect(wrapper.vm.dlTableRef.titleClasses).toBe(
                    'dl-table__title '
                )

                await wrapper.setProps({
                    titleClass: undefined
                })

                expect(wrapper.vm.dlTableRef.titleClasses.trim()).toBe(
                    'dl-table__title'
                )
            })
            it('should compute container classes', () => {
                expect(wrapper.vm.containerClass).toBe(
                    'dl-table__container dl-table--horizontal-separator column no-wrap dl-table--no-wrap dl-table--dense dl-table--loading'
                )
            })
            it('should compute proper draggable values', async () => {
                expect(wrapper.vm.dlTableRef.hasDraggableRows).toBe(true)
                expect(wrapper.vm.dlTableRef.hasDraggableColumns).toBe(false)

                await wrapper.setProps({
                    draggable: 'both'
                })

                expect(wrapper.vm.dlTableRef.hasDraggableRows).toBe(true)
                expect(wrapper.vm.dlTableRef.hasDraggableColumns).toBe(true)
            })
            it('should compute the right bottom message', async () => {
                const LOADING_LABEL = 'Loading...'
                const NO_RESULTS_LABEL = 'There are no results to display'

                expect(wrapper.vm.dlTableRef.noDataMessage).toBe(LOADING_LABEL)

                await wrapper.setProps({
                    loading: false,
                    filter: 'a',
                    noResultsLabel: NO_RESULTS_LABEL
                })

                expect(wrapper.vm.dlTableRef.noDataMessage).toBe(
                    NO_RESULTS_LABEL
                )
            })
        })
    })
})
