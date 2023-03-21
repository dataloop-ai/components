<template>
    <div style="width: 100%">
        <dl-kpi
            :items="kpiItems.slice(0, 3)"
            :abbreviated-title="true"
        />
        <dl-kpi :items="kpiItems.slice(0, 4)" />
        <dl-kpi :items="kpiItems.slice(0, 5)" />
        <dl-kpi :items="kpiItems.slice(0, 6)" />
        <dl-kpi :items="kpiItems" />
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue-demi'
import { DlKpi } from '../components'
import { KpiItem } from '../components/DlKpi/types/KpiItem'

const kpiItems = [
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

export default defineComponent({
    name: 'DlKpiDemo',
    components: {
        DlKpi
    },
    data() {
        return {
            kpiItems
        }
    }
    /*setup(){
        const kpiItems: KpiItem[] = [
            {
                title: 75,
                subtitle: 'Complete',
                 ,
                progress: {
                    value: 50,
                    text: '75/100 Items'
                }
            },
            {
                title: 75,
                subtitle: 'Complete',
                 ,
                progress: {
                    value: 50,
                    text: '75/100 Items'
                }
            },
            {
                title: 75,
                subtitle: 'Complete',
                 ,
                progress: {
                    value: 50,
                    text: '75/100 Items'
                }
            }
        ];

        return {
            kpiItems
        }
    }*/
})
</script>

<style scoped></style>
