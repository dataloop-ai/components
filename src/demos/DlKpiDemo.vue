<template>
    <div style="width: 90%">
        <div class="inlineKpi">
            <div
                v-for="(kpi, kpiIndex) in kpiItems.slice(0, 2)"
                :key="kpiIndex"
                class="autoWidth"
            >
                <dl-kpi
                    :counter="kpi.counter"
                    :title="kpi.title"
                    :info-message="kpi.infoMessage"
                    :progress="kpi.progress"
                    :bordered="true"
                />
            </div>
        </div>
        <div class="inlineKpi">
            <div
                v-for="(kpiThree, kpiThreeIndex) in kpiItems.slice(0, 3)"
                :key="kpiThreeIndex"
                class="autoWidth"
            >
                <dl-kpi
                    :counter="kpiThree.counter"
                    :title="kpiThree.title"
                    :info-message="kpiThree.infoMessage"
                    :progress="kpiThree.progress"
                    :bordered="true"
                />
            </div>
        </div>
        <div class="inlineKpi">
            <div
                v-for="(kpiFour, kpiFourIndex) in kpiItems.slice(0, 4)"
                :key="kpiFourIndex"
                class="autoWidth"
            >
                <dl-kpi
                    :counter="kpiFour.counter"
                    :title="kpiFour.title"
                    :info-message="kpiFour.infoMessage"
                    :progress="kpiFour.progress"
                    :bordered="true"
                />
            </div>
        </div>
        <div class="inlineKpi">
            <div
                v-for="(kpiFive, kpiFiveIndex) in kpiItems.slice(0, 5)"
                :key="kpiFiveIndex"
                class="autoWidth"
            >
                <dl-kpi
                    :counter="kpiFive.counter"
                    :title="kpiFive.title"
                    :info-message="kpiFive.infoMessage"
                    :progress="kpiFive.progress"
                    :small="true"
                />
            </div>
        </div>
        <div class="inlineKpi">
            <div
                v-for="(kpiSix, kpiSixIndex) in kpiItems.slice(0, 6)"
                :key="kpiSixIndex"
                class="autoWidth"
            >
                <dl-kpi
                    :counter="kpiSix.counter"
                    :counter-font-size="'1em'"
                    :title="kpiSix.title"
                    :info-message="kpiSix.infoMessage"
                    :progress="kpiSix.progress"
                    :bordered="false"
                />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi'
import { DlKpi } from '../components'
import { DlKpiCounterFormat, DlKpiItem } from '../components/types'

const kpiData: DlKpiItem[] = [
    {
        counter: {
            value: 200000000,
            format: DlKpiCounterFormat.short
        },
        title: 'Complete Complete Complete Complete Complete Complete Complete Complete',
        infoMessage: 'info message'
    },
    {
        counter: {
            value: 200000000,
            format: DlKpiCounterFormat.long
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
            format: DlKpiCounterFormat.hm
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
            format: DlKpiCounterFormat.hms
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
            format: DlKpiCounterFormat.short
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
            format: DlKpiCounterFormat.long
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
            format: DlKpiCounterFormat.long
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
            format: DlKpiCounterFormat.hms
        },
        title: 'Complete Complete Complete Complete Complete Complete Complete Complete'
    },
    {
        counter: {
            value: '35m:20s',
            format: DlKpiCounterFormat.hm
        },
        title: 'Complete',
        progress: {
            value: 30
        }
    },
    {
        counter: {
            value: '154h:35m:20s',
            format: DlKpiCounterFormat.h
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
            format: DlKpiCounterFormat.ms
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
            format: DlKpiCounterFormat.m
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
            format: DlKpiCounterFormat.s
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

<style scoped lang="scss">
.inlineKpi {
    display: flex;
    width: 100%;
    gap: 30px;
}
.autoWidth {
    width: min(100%, 50rem);
    height: 100%;
}
</style>
