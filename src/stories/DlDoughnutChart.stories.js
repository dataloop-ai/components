import { DlDoughnutChart } from '../components'

import {
    Chart as ChartJS,
    Tooltip,
    Legend,
    DoughnutController,
    ArcElement
} from 'chart.js'

ChartJS.register(Tooltip, Legend, DoughnutController, ArcElement)

const doughnutData = {
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
                9999, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200,
                1000, 1400, 1500, 1600, 1700, 1800, 1900, 2000
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
const doughnutAnimation = {
    animateRotate: true,
    animateScale: false
}
export default {
    title: 'Library/Components/DlDoughnutChart',
    component: DlDoughnutChart,
    argTypes: {
        data: {
            name: 'data',
            defaultValue: doughnutData,
            control: 'object',
            description: 'The data object, according to ChartJS structure',
            table: {
                type: { summary: Object },
                defaultValue: { summary: doughnutData }
            }
        },
        isSmall: {
            name: 'isSmall',
            defaultValue: false,
            control: 'boolean',
            description: 'is small prop',
            table: {
                type: { summary: Boolean },
                defaultValue: { summary: false }
            }
        },
        hasSummary: {
            name: 'hasSummary',
            defaultValue: false,
            control: 'boolean',
            description: 'has summary prop',
            table: {
                type: { summary: Boolean },
                defaultValue: { summary: false }
            }
        },
        animation: {
            name: 'animation',
            defaultValue: doughnutAnimation,
            control: 'object',
            description: 'animation prop',
            table: {
                type: { summary: Object },
                defaultValue: {
                    summary: doughnutAnimation
                }
            }
        }
    }
}

const Template = (args) => ({
    components: {
        DlDoughnutChart
    },
    setup() {
        return {
            args
        }
    },
    template: `
        <DlDoughnutChart
            v-bind="args"
        />
    `
})

export const Preview = Template.bind({})
Preview.args = {
    data: doughnutData
}
