import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { DlKpi } from '../../src'
import { DlCounterFormat, DlKpiItem } from '../../src/components/types'

const kpiData: DlKpiItem[] = [
    {
        counter: {
            value: 200000000,
            format: DlCounterFormat.short
        },
        title: 'Complete Complete Complete Complete Complete Complete Complete Complete',
        infoMessage: 'info message'
    },
    {
        counter: {
            value: 200000000,
            format: DlCounterFormat.long
        },
        title: 'Complete',
        infoMessage: 'info message',
        progress: {
            value: 30
        }
    },
    {
        counter: {
            value: '154H:35M:20s',
            format: DlCounterFormat.hm
        },
        title: 'Complete Complete Complete Complete Complete Complete Complete Complete',
        infoMessage: 'info message',
        progress: {
            value: 40,
            text: '75/100 Items'
        }
    },
    {
        counter: {
            value: '154h:35m:20s',
            format: DlCounterFormat.hms
        },
        title: 'Complete',
        infoMessage: 'info message',
        progress: {
            value: 50,
            text: '75/100 Items'
        }
    },
    {
        counter: {
            value: 73,
            format: DlCounterFormat.short
        },
        title: 'Complete',
        infoMessage: 'info message',
        progress: {
            value: 60,
            text: '75/100 Items'
        }
    },
    {
        counter: {
            value: 73,
            format: DlCounterFormat.long
        },
        title: 'Complete',
        infoMessage: 'info message',
        progress: {
            value: 70,
            text: '75/100 Items'
        }
    },
    {
        counter: {
            value: 73,
            format: DlCounterFormat.long
        },
        title: 'Complete',
        infoMessage: 'info message',
        progress: {
            value: 80,
            text: '75/100 Items'
        }
    }
]
const kpiEmptyData: DlKpiItem[] = []

// todo: Fix this - remove the any
const kpiEmptyParams: (DlKpiItem & any)[] = [
    {
        counter: {
            value: null,
            format: null
        },
        title: null,
        infoMessage: null,
        progress: {
            text: null,
            value: null
        }
    }
]

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
            'kpi__box__counter',
            'kpi__box__title',
            'kpi__box__title__text',
            'kpi__box__progress_bar'
        ]

        const result = wrapper.classes(className)

        expected.forEach(() => {
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
            'kpi__box__counter',
            'kpi__box__title',
            'kpi__box__title__text',
            'kpi__box__progress_bar'
        ]

        const result = wrapper.classes(className)

        expected.forEach(() => {
            expect(result).toBe(false)
        })
    })
    it('should to display when it passed empty params', () => {
        const wrapper = mount(DlKpi, {
            props: {
                items: kpiEmptyParams
            }
        })

        const className = 'kpi'
        const expected = [
            'kpi',
            'kpi__box',
            'kpi__box__counter',
            'kpi__box__title',
            'kpi__box__title__text',
            'kpi__box__progress_bar'
        ]

        const result = wrapper.classes(className)

        expected.forEach(() => {
            expect(result).toBe(true)
        })
    })
})
