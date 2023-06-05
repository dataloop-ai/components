<template>
    <div style="display: flex; flex-wrap: wrap; flex-direction: row; gap: 0">
        <div>
            <div>
                <DlDoughnutChart
                    :data="doughnutLessData"
                    :animation="doughnutAnimation"
                />
            </div>
            <div>
                <DlDoughnutChart :data="doughnutData" />
            </div>
            <div>
                <DlDoughnutChart
                    :data="doughnutData"
                    :has-summary="true"
                />
            </div>
            <div class="grid grid-cols-3">
                <div>
                    <DlDoughnutChart
                        :data="doughnutData"
                        :is-small="true"
                        :has-summary="true"
                    />
                </div>
                <div>
                    <DlDoughnutChart
                        :data="doughnutLessData"
                        :is-small="true"
                    />
                </div>
                <div>
                    <DlDoughnutChart
                        :data="doughnutData"
                        :is-small="true"
                        :has-summary="true"
                    />
                </div>
            </div>
            <div class="grid grid-cols-2">
                <div>
                    <DlDoughnutChart
                        :data="doughnutData"
                        :is-small="true"
                    />
                </div>
                <div>
                    <DlDoughnutChart
                        :data="doughnutLessData"
                        :is-small="true"
                    />
                </div>
            </div>
            <div>
                <DlDoughnutChart
                    :data="doughnutData"
                    :is-small="true"
                    :has-summary="true"
                    :animation="doughnutAnimation"
                />
            </div>

            <div>
                <DlDoughnutChart
                    :data="doughnutData"
                    :is-small="true"
                    :has-summary="true"
                    :animation="doughnutAnimation"
                    is-empty
                    :empty-state-props="{
                        responsive: true,
                        style: 'min-height: 350px;',
                        bgSize: '130px',
                        bgImage: `url(https://raw.githubusercontent.com/dataloop-ai/icons/main/assets/usage.svg)`,
                        title: 'Lorem ipsum',
                        subtitle:
                            'Lorem ipsum dolor sit amet consectetur. Senectus condimentum dolor sit',
                        info: 'To learn more about this analytics, read our documentation.'
                    }"
                >
                    <template #links="">
                        <div style="display: flex; gap: 5px; padding: 0 20px">
                            <dl-button
                                padding="0px"
                                icon="icon-dl-sdk-documentation"
                                flat
                                uppercase
                                label="SDK"
                            />
                            <div class="break" />
                            <dl-button
                                padding="0px"
                                icon="icon-dl-file"
                                flat
                                label="Documentation"
                            />
                            <div class="break" />
                            <dl-button
                                padding="0px"
                                icon="icon-dl-youtube"
                                flat
                                label="Video"
                            />
                        </div>
                    </template>
                </DlDoughnutChart>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue-demi'
import { DoughnutControllerChartOptions } from 'chart.js'
import { DlDoughnutChart, DlButton } from '../components'
import { TDoughnutChartData } from '../components/compound/DlCharts/charts/DlDoughnutChart/types'

export default defineComponent({
    name: 'DlChartDoughnutDemo',
    components: {
        DlDoughnutChart,
        DlButton
    },
    setup() {
        const doughnutAnimation = ref<
            DoughnutControllerChartOptions['animation']
        >({
            animateRotate: true,
            animateScale: true
        })

        const doughnutData: TDoughnutChartData = {
            labels: [
                'Label 1 very very very very very very very long title',
                'Label 2',
                'Label 3',
                'Label 4',
                'Label 5',
                'Label 6',
                'Label 7',
                'Label 8',
                'Label 9',
                'Label 10',
                'Label 11',
                'Label 12',
                'Label 13',
                'Label 14',
                'Label 15',
                'Label 16',
                'Label 17',
                'Label 18',
                'Label 19',
                'Label 20'
            ],
            datasets: [
                {
                    label: 'My Doughnut',
                    data: [
                        9999, 200, 300, 400, 500, 600, 700, 800, 900, 1000,
                        1100, 1200, 1000, 1400, 1500, 1600, 1700, 1800, 1900,
                        2000
                    ],
                    backgroundColor: [
                        '#3452FF',
                        '#4DB1D3',
                        '#FF2F7A',
                        '#D4E3FF',
                        '#BECB5D',
                        '#839E30',
                        '#6B5935',
                        '#752B86',
                        '#BB96A3',
                        '#870F49',
                        '#CC566C',
                        '#F0A18C',
                        '#EDAB55',
                        '#FF5934',
                        '#9CD2E3',
                        '#1481A4',
                        '#928F80',
                        '#575567',
                        '#979797',
                        '#D9D9D9'
                    ],
                    hoverBackgroundColor: [
                        '#3452FF',
                        '#4DB1D3',
                        '#FF2F7A',
                        '#D4E3FF',
                        '#BECB5D',
                        '#839E30',
                        '#6B5935',
                        '#752B86',
                        '#BB96A3',
                        '#870F49',
                        '#CC566C',
                        '#F0A18C',
                        '#EDAB55',
                        '#FF5934',
                        '#9CD2E3',
                        '#1481A4',
                        '#928F80',
                        '#575567',
                        '#979797',
                        '#D9D9D9'
                    ],
                    lightColor: [
                        '#D6DCFF',
                        '#EDF7FB',
                        '#FFCBDD',
                        '#F4F8FF',
                        '#EFF2D7',
                        '#E0E7CB',
                        '#DAD5CD',
                        '#DDCAE1',
                        '#DDCBD1',
                        '#DDCBD1',
                        '#F2D5DA',
                        '#FBE7E2',
                        '#FBEAD5',
                        '#FFD5CC',
                        '#E7F4F8',
                        '#C4DFE8',
                        '#E4E3DF',
                        '#D5D5D9',
                        '#E5E5E5',
                        '#F5F5F5'
                    ],
                    borderWidth: 0
                }
            ]
        }
        const doughnutLessData: TDoughnutChartData = {
            labels: [
                'Label 1 very very very very very very very long title',
                'Label 2',
                'Label 3',
                'Label 4'
            ],
            datasets: [
                {
                    label: 'My Doughnut',
                    data: [999, 2000, 300, 400],
                    backgroundColor: [
                        '--dl-color-secondary',
                        '#4DB1D3',
                        '#FF2F7A',
                        '#D4E3FF'
                    ],
                    hoverBackgroundColor: [
                        '--dl-color-secondary',
                        '#4DB1D3',
                        '#FF2F7A',
                        '#D4E3FF'
                    ],
                    lightColor: [
                        '--dl-color-link',
                        '#EDF7FB',
                        '#FFCBDD',
                        '#F4F8FF'
                    ],
                    borderWidth: 0
                }
            ]
        }
        return {
            doughnutData,
            doughnutLessData,
            doughnutAnimation
        }
    }
})
</script>

<style scoped lang="scss"></style>
