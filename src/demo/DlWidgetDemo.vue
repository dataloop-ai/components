<script lang="ts">
import { defineComponent, ref } from 'vue-demi'
import DlBarChart from '../components/DlChart/DlBarChart.vue'
import DlGrid from '../components/DlWidget/DlGrid.vue'
import DlWidget from '../components/DlWidget/DlWidget.vue'

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
            gap="20px"
            :layout="[3, 2]"
        >
            <dl-widget>
                <template #header>
                    <span>Widget 1</span>
                    <span style="font-size: 12px; color: gray">Subtitle</span>
                </template>
                <template #menu>
                    <div>
                        Menu
                        <div />
                    </div>
                </template>
                <template #content>
                    <dl-bar-chart
                        :data="data"
                        :items-in-view="6"
                    />
                </template>
                <template #description>
                    <span>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Libero eligendi dolore, similique possimus veritatis in
                        vitae quia praesentium fuga quibusdam autem. Doloremque
                        tenetur repudiandae a cupiditate modi dicta eveniet
                        veritatis?
                    </span>
                </template>
            </dl-widget>
            <dl-widget>
                <template #header>
                    <span>Widget 2</span>
                </template>
                <template #content>
                    <dl-bar-chart
                        :data="data"
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
                        :data="data"
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
                        :data="data"
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
                        :data="data"
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
                        :data="data"
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
                        :data="data"
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
                        :data="data"
                        :items-in-view="6"
                    />
                </template>
            </dl-widget>
        </dl-grid>
        <dl-grid gap="20px">
            <dl-widget>
                <template #header>
                    <span>Widget 1</span>
                    <span style="font-size: 12px; color: gray">Subtitle</span>
                </template>
                <template #menu>
                    <div>
                        Menu
                        <div />
                    </div>
                </template>
                <template #content>
                    <dl-bar-chart
                        :data="data"
                        :items-in-view="6"
                    />
                </template>
                <template #description>
                    <span>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Libero eligendi dolore, similique possimus veritatis in
                        vitae quia praesentium fuga quibusdam autem. Doloremque
                        tenetur repudiandae a cupiditate modi dicta eveniet
                        veritatis?
                    </span>
                </template>
            </dl-widget>
            <dl-widget>
                <template #header>
                    <span>Widget 2</span>
                </template>
                <template #content>
                    <dl-bar-chart
                        :data="data"
                        :items-in-view="6"
                    />
                </template>
            </dl-widget>
        </dl-grid>
    </div>
</template>

<style lang="scss"></style>
