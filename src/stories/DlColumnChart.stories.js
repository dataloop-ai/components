import DlColumnChart from '../components/DlChart/DlColumnChart.vue'
import { ref } from 'vue'
import DlAvatar from '../components/DlAvatar.vue'
import { orderBy } from 'lodash'

import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const data = [
    {
        labels: ['January', 'February', 'March', 'April', 'May', 'June'],
        datasets: [
            {
                label: 'Data One 1',
                backgroundColor: '--dl-color-secondary',
                borderRadius: 4,
                data: [35, 30, 25, 20, 15, 5]
            },
            {
                label: 'Data Two 2',
                backgroundColor: '--dl-color-warning',
                borderRadius: 4,
                data: [15, 20, 15, 30, 25, 10]
            },
            {
                label: 'Data One 3',
                backgroundColor: '--dl-color-negative',
                borderRadius: 4,
                data: [35, 30, 25, 20, 15, 5]
            },
            {
                label: 'Data Two 4',
                backgroundColor: '--dl-color-positive',
                borderRadius: 4,
                data: [15, 20, 15, 30, 25, 10]
            },
            {
                label: 'Data One 5',
                backgroundColor: '--dl-color-secondary',
                borderRadius: 4,
                data: [35, 30, 25, 20, 15, 5]
            },
            {
                label: 'Data Two 6',
                backgroundColor: '--dl-color-warning',
                borderRadius: 4,
                data: [15, 20, 15, 30, 25, 10]
            },
            {
                label: 'Data One 7',
                backgroundColor: '--dl-color-secondary',
                borderRadius: 4,
                data: [35, 30, 25, 20, 15, 5]
            },
            {
                label: 'Data Two 8',
                backgroundColor: '--dl-color-warning',
                borderRadius: 4,
                data: [15, 20, 15, 30, 25, 10]
            }
        ]
    },

    {
        labels: [
            'https://picsum.photos/200/200',
            'https://picsum.photos/200/200',
            'https://picsum.photos/200/200',
            'https://picsum.photos/200/200',
            'https://picsum.photos/200/200',
            'https://picsum.photos/200/200'
        ],
        datasets: [
            {
                label: 'Data One',
                backgroundColor: '--dl-color-secondary',
                borderRadius: 4,
                data: [35, 30, 25, 20, 15, 5]
            },
            {
                label: 'Data Two',
                backgroundColor: '--dl-color-warning',
                borderRadius: 4,
                data: [15, 20, 15, 30, 25, 10]
            }
        ]
    }
]

const brushProps = {
    min: 0,
    max: orderBy(data[0].datasets, (o) => o.data.length)[0].data.length - 1
}

const legendProps = {
    alignItems: 'center'
}

export default {
    title: 'Library/Components/DlColumnChart',
    component: DlColumnChart,
    argTypes: {
        data: {
            name: 'data',
            defaultValue: data[0],
            control: 'object',
            description: 'The data object, according to ChartJS structure',
            table: {
                type: { summary: Object },
                defaultValue: { summary: data[0] }
            }
        }
    }
}

const Template = (args) => ({
    components: {
        DlColumnChart,
        DlAvatar
    },
    setup() {
        const dataState = ref(args.data)
        return {
            dataState,
            brushProps,
            legendProps,
            args
        }
    },
    template: `
        <dl-column-chart
         :brush-props="brushProps"
         :legend-props="legendProps"
         :data="dataState"
         style="width: 700px"
       />
  `
})

const TemplateWithAvatar = (args) => ({
    components: {
        DlColumnChart,
        DlAvatar
    },
    setup() {
        const dataState = ref(args.data)
        return {
            dataState,
            brushProps,
            legendProps,
            args
        }
    },
    template: `
        <dl-column-chart
         :brush-props="brushProps"
         :legend-props="legendProps"
         :data="dataState"
         style="width: 700px"
       >
       <template #axe-x-labels="{ labels, chartWidth }">
                <div
                    :style="\`display: flex; width: \${chartWidth}; align-self: flex-end; justify-content: space-between;\`"
                >
                    <div
                        v-for="(url, key) in labels"
                        :key="key"
                        style="
                            display: flex;
                            width: 100%;
                            justify-content: center;
                        "
                    >
                        <dl-avatar size="24px">
                            <img :src="url">
                        </dl-avatar>
                        <div />
                    </div>
                </div>
            </template>
       </dl-column-chart>
  `
})

export const Preview = Template.bind({})
Preview.args = {
    data: data[0]
}
export const PreviewAvatar = TemplateWithAvatar.bind({})
PreviewAvatar.args = {
    data: data[1]
}
