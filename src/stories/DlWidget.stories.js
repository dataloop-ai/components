import { DlBarChart, DlGrid, DlGridRow, DlWidget } from '../components'
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
        a.push(i)
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

export default {
    title: 'Library/Components/DlWidget',
    component: DlGrid,
    argTypes: {}
}

const Template = (args) => ({
    components: {
        DlGrid,
        DlWidget,
        DlBarChart
    },
    setup() {
        const stateData = ref(data)
        console.log(stateData)
        return {
            args,
            stateData
        }
    },
    template: `
    <div style="width: 1000px">
    <dl-grid gap="20px">
        <dl-grid-row>
            <dl-widget>
                <template #header>
                    <span>Widget 1</span>
                    <span style="font-size: 12px; color: gray">Subtitle</span>
                </template>
                <template #content>
                    <dl-bar-chart
                        :legend-props="legendProps"
                        :data="stateData"
                        :options="options"
                        :items-in-view="8"
                    />
                </template>
                <template #description>
                    <span>Lorem ipsum dolor sit amet consectetur adipisicing
                        elit. Libero eligendi dolore, similique possimus
                        veritatis in vitae quia praesentium fuga quibusdam
                        autem. Doloremque tenetur repudiandae a cupiditate
                        modi dicta eveniet veritatis?</span>
                </template>
            </dl-widget>
        </dl-grid-row>

        <dl-grid-row gap="20px">
            <dl-widget>
                <template #header>
                    <span>Widget 2</span>
                </template>
                <template #content>
                    <dl-bar-chart
                        :legend-props="legendProps"
                        :data="stateData"
                        :options="options"
                        :items-in-view="6"
                    />
                </template>
            </dl-widget>

            <dl-widget>
                <template #header>
                    <span>Widget 3</span>
                </template>
                <template #content>
                    <dl-bar-chart
                        :legend-props="legendProps"
                        :data="stateData"
                        :options="options"
                        :items-in-view="6"
                    />
                </template>
            </dl-widget>
        </dl-grid-row>
    </dl-grid>
</div>
  `
})

export const Preview = Template.bind({})
