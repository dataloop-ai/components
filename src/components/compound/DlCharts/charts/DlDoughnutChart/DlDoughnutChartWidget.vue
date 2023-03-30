<template>
    <div>
        <dl-grid gap="20px">
            <dl-grid-row>
                <dl-widget>
                    <template #header>
                        <span>{{ title }}</span>
                        <span style="font-size: 12px; color: gray">{{
                            subTitle
                        }}</span>
                    </template>
                    <template #content>
                        <DlDoughnutChart
                            :data="data"
                            :is-small="isSmall"
                            :has-summary="hasSummary"
                        />
                    </template>
                </dl-widget>
            </dl-grid-row>
        </dl-grid>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue-demi'
import DlDoughnutChart from './DlDoughnutChart.vue'
import { TDoughnutChartData } from './types/TDoughnutChartData'
import { DlWidget, DlGridRow, DlGrid } from '../../../../basic'

export default defineComponent({
    name: 'DlDoughnutChartWidget',
    components: {
        DlDoughnutChart,
        DlGrid,
        DlGridRow,
        DlWidget
    },
    props: {
        data: {
            type: Object as PropType<TDoughnutChartData>,
            required: true
        },
        isSmall: {
            type: Boolean,
            default: false
        },
        hasSummary: {
            type: Boolean,
            default: false
        },
        title: {
            type: String,
            default: ''
        },
        subTitle: {
            type: String,
            default: ''
        }
    }
})
</script>
