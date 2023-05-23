import { DlBarChart } from '..'
import { ref } from 'vue'

const labelsFn = () => {
    const a = []
    for (let i = 0; i < 20; i++) {
        a.push(`${i}`)
    }
    return a
}

const dataFn = () => {
    const a = []
    for (let i = 1; i <= 20; i++) {
        a.push(`${i}`)
    }
    return a
}

const data = {
    labels: labelsFn(),
    datasets: [
        {
            label: 'Data One',
            backgroundColor: '--dl-color-secondary',
            borderRadius: 4,
            data: dataFn()
        },
        {
            label: 'Data Two',
            backgroundColor: '--dl-color-warning',
            borderRadius: 4,
            data: dataFn()
        }
    ]
}
const options = {
    scales: {
        y: {
            afterFit: (scaleInstance) => {
                scaleInstance.width = 50
            }
        }
    }
}

const legendProps = {
    alignItems: 'center'
}

export default {
    title: 'Library/Components/DlBarChart',
    component: DlBarChart,
    argTypes: {
        data: {
            name: 'data',
            defaultValue: data,
            control: 'object',
            description: 'The data object, according to ChartJS structure',
            table: {
                type: { summary: Object },
                defaultValue: { summary: data }
            }
        },
        itemsInView: {
            name: 'itemsInView',
            defaultValue: 6,
            control: 'number',
            description: 'The number of items visible at once',
            table: {
                type: { summary: Number },
                defaultValue: { summary: 6 }
            }
        }
    }
}

const Template = (args) => ({
    components: {
        DlBarChart
    },
    setup() {
        const dataState = ref(data)
        return {
            options,
            dataState,
            data,
            legendProps,
            args
        }
    },
    template: `
    <div
           style="
               display: flex;
               width: 900px;
               flex-wrap: wrap;
               flex-direction: row;
               gap: 0px;
           "
       >
           <dl-bar-chart
               v-bind="args"
               :legend-properties="legendProps"
               :data="data"
               :options="options"
               :items-in-view="6"
           />
       </div>
    </div>
  `
})

export const Preview = Template.bind({})
