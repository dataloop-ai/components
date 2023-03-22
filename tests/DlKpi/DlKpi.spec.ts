import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { DlKpi } from '../../src'
import { KpiItem } from '../../src/components/DlKpi/types/KpiItem'

const kpiData: KpiItem[] = [
    {
        title: {
            value: 200000000,
            isAbbreviated: true
        },
        subtitle:
            'Complete Complete Complete Complete Complete Complete Complete Complete'
    },
    {
        title: {
            value: 200000000,
            isAbbreviated: false
        },
        subtitle: 'Complete',
        progress: {
            value: 30
        }
    },
    {
        title: {
            value: '154h:35m:20s',
            isAbbreviated: false
        },
        subtitle: 'Complete',
        progress: {
            value: 40,
            text: '75/100 Items'
        }
    },
    {
        title: {
            value: '154h:35m:20s',
            isAbbreviated: true
        },
        subtitle: 'Complete',
        progress: {
            value: 50,
            text: '75/100 Items'
        }
    },
    {
        title: {
            value: 73,
            isAbbreviated: true
        },
        subtitle: 'Complete',
        progress: {
            value: 60,
            text: '75/100 Items'
        }
    },
    {
        title: {
            value: 73,
            isAbbreviated: true
        },
        subtitle: 'Complete',
        progress: {
            value: 70,
            text: '75/100 Items'
        }
    },
    {
        title: {
            value: 73,
            isAbbreviated: true
        },
        subtitle: 'Complete',
        progress: {
            value: 80,
            text: '75/100 Items'
        }
    }
]
const kpiEmptyData: KpiItem[] = []

describe('DlKpi', () => {
    it('should render kpi box', () => {
        const wrapper = mount(DlKpi, {
            props: {
                items: kpiData
            }
        })

        expect(wrapper.exists()).toBe(true)
    })

    it('should compute the correct classes when calling computeClass', () => {
        const wrapper = mount(DlKpi, {
            props: {
                items: kpiData
            }
        })

        const className = 'kpi'
        const expected = [
            'kpi',
            'kpi__box',
            'kpi__box__title',
            'kpi__box__subtitle',
            'kpi__box__subtitle__text',
            'kpi__box__progress_bar'
        ]

        const result = wrapper.classes(className)

        expected.forEach((item) => {
            expect(result).toBe(true)
        })
    })

    it('should not to display when it passed empty data', () => {
        const wrapper = mount(DlKpi, {
            props: {
                items: kpiEmptyData
            }
        })

        const className = 'kpi'
        const expected = [
            'kpi',
            'kpi__box',
            'kpi__box__title',
            'kpi__box__subtitle',
            'kpi__box__subtitle__text',
            'kpi__box__progress_bar'
        ]

        const result = wrapper.classes(className)

        expected.forEach((item) => {
            expect(result).toBe(false)
        })
    })
})
