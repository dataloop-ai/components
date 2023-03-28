<template>
    <div style="width: 90%">
        <dl-kpi :items="kpiItems.slice(0, 2)" />
        <dl-kpi :items="kpiItems.slice(0, 3)" />
        <dl-kpi :items="kpiItems.slice(0, 4)" />
        <dl-kpi :items="kpiItems.slice(0, 5)" />
        <dl-kpi :items="kpiItems.slice(0, 6)" />
        <dl-kpi
            :items="kpiTimeItems"
            :counter-font-size="24"
        />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi'
import { DlKpi } from '../components'
import { DlCounterFormat, DlKpiItem } from '../components/types'

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
            value: null,
            format: DlCounterFormat.long
        },
        title: null,
        infoMessage: null,
        progress: {
            value: null,
            text: null
        }
    },
    {
        counter: {
            value: 0,
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
const kpiTimeData: DlKpiItem[] = [
    {
        counter: {
            value: '',
            format: DlCounterFormat.hms
        },
        title: 'Complete Complete Complete Complete Complete Complete Complete Complete'
    },
    {
        counter: {
            value: '35m:20s',
            format: DlCounterFormat.hm
        },
        title: 'Complete',
        progress: {
            value: 30
        }
    },
    {
        counter: {
            value: '154h:35m:20s',
            format: DlCounterFormat.h
        },
        title: 'Complete',
        progress: {
            value: 40,
            text: '75/100 Items'
        }
    },
    {
        counter: {
            value: '154h:35m:20s',
            format: DlCounterFormat.ms
        },
        title: 'Complete',
        progress: {
            value: 50,
            text: '75/100 Items'
        }
    },
    {
        counter: {
            value: '154h:35m:20s',
            format: DlCounterFormat.m
        },
        title: 'Complete',
        progress: {
            value: 60,
            text: '75/100 Items'
        }
    },
    {
        counter: {
            value: '',
            format: DlCounterFormat.s
        },
        title: '',
        progress: {
            value: 0,
            text: '75/100 Items'
        }
    }
]

export default defineComponent({
    name: 'DlKpiDemo',
    components: {
        DlKpi
    },
    setup() {
        const kpiItems: DlKpiItem[] = kpiData
        const kpiTimeItems: DlKpiItem[] = kpiTimeData

        return {
            kpiItems,
            kpiTimeItems
        }
    }
})
</script>

<style scoped></style>
