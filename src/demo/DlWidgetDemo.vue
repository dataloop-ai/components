<template>
    <div>
        <div class="select-layout">
            <select @change="selectLayout">
                <option
                    v-for="(layout, index) in layouts"
                    :key="index"
                    :value="index"
                >
                    {{ layout.name }}
                </option>
            </select>
            <button @mousedown="saveLayout">
                Save
            </button>
        </div>
        <dl-grid v-model="layout.value">
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

<script lang="ts">
import { defineComponent, ref } from 'vue-demi'
import { DlWidget, DlGrid, DlBarChart, DlGridLayout } from '../components'

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
        const layout = ref({
            name: 'Layout 1',
            value: [
                [1, 5, 2],
                [3, 4]
            ]
        })

        const layouts = ref<DlGridLayout[]>([])

        const saveLayout = () => {
            layouts.value.push({
                name: `Layout ${layouts.value.length + 1}`,
                value: layout.value.value
            })
        }

        const selectLayout = (e: InputEvent) => {
            const index = parseInt((e.target as HTMLInputElement).value)
            layout.value = layouts.value[index]
        }

        return { data, layout, layouts, saveLayout, selectLayout }
    }
})
</script>
