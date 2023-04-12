<script lang="ts">
import { defineComponent } from 'vue-demi'
import { DlWidget, DlGridRow, DlGrid, DlBarChart } from '../components'

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

export default defineComponent({
    components: {
        DlGrid,
        DlWidget,
        DlBarChart
    },
    setup() {
        return { data }
    }
})
</script>

<template>
    <div>
        <dl-grid
            :layout="[3, 2]"
            :order="[5, 4, 3, 2, 1]"
        >
            <dl-widget>
                <template #header>
                    <span>Widget 1</span>
                    <span style="font-size: 12px; color: gray">Subtitle</span>
                </template>
                <template #content>
                    <dl-bar-chart
                        :legend-props="legendProps"
                        :data="data"
                        :options="options"
                        :items-in-view="8"
                    />
                </template>
                <template #description>
                    <span>Lorem ipsum dolor sit amet consectetur adipisicing
                        elit. Libero eligendi dolore, similique possimus
                        veritatis in vitae quia praesentium fuga quibusdam
                        autem. Doloremque tenetur repudiandae a cupiditate modi
                        dicta eveniet veritatis?</span>
                </template>
            </dl-widget>

            <dl-widget>
                <template #header>
                    <span>Widget 2</span>
                </template>
                <template #content>
                    <dl-bar-chart
                        :legend-props="legendProps"
                        :data="data"
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
                        :data="data"
                        :options="options"
                        :items-in-view="6"
                    />
                </template>
            </dl-widget>

            <dl-widget>
                <template #header>
                    <span>Widget 4</span>
                    <span style="font-size: 12px; color: gray">Subtitle</span>
                </template>
                <template #content>
                    <dl-bar-chart
                        :legend-props="legendProps"
                        :data="data"
                        :options="options"
                        :items-in-view="8"
                    />
                </template>
                <template #description>
                    <span>Lorem ipsum dolor sit amet consectetur adipisicing
                        elit. Libero eligendi dolore, similique possimus
                        veritatis in vitae quia praesentium fuga quibusdam
                        autem. Doloremque tenetur repudiandae a cupiditate modi
                        dicta eveniet veritatis?</span>
                </template>
            </dl-widget>

            <dl-widget>
                <template #header>
                    <span>Widget 5</span>
                </template>
                <template #content>
                    <dl-bar-chart
                        :legend-props="legendProps"
                        :data="data"
                        :options="options"
                        :items-in-view="6"
                    />
                </template>
            </dl-widget>
        </dl-grid>
    </div>
</template>
