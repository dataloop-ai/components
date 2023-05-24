<template>
    <div>
        <div class="options">
            <div class="select-layout">
                <select
                    class="select-layout__input"
                    @change="selectLayout"
                >
                    <option
                        v-for="(layout, index) in layouts"
                        :key="index"
                        :value="index"
                    >
                        {{ layout.name }}
                    </option>
                </select>
                <button
                    class="select-layout__button"
                    @mousedown="saveLayout"
                >
                    Save
                </button>
                <span class="select-layout__info">{{ hasBeenSaved }}</span>
            </div>
            <div class="widgets-per-row">
                <span class="widgets-per-row__label"> Widgets per row: </span>
                <input
                    v-model="widgetsPerRow"
                    class="widgets-per-row__input"
                    type="number"
                >
            </div>
        </div>
        <dl-grid
            v-model="layout"
            :max-elements-per-row="widgetsPerRow"
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
                <template #menu>
                    <div class="menu-icons">
                        <dl-icon
                            size="m"
                            icon="icon-dl-settings"
                        />
                        <dl-icon
                            size="m"
                            icon="icon-dl-download"
                        />
                    </div>
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
import {
    DlWidget,
    DlGrid,
    DlBarChart,
    DlGridLayout,
    DlIcon
} from '../components'

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

const matrix: number[][] = []
const labels: string[] = []
const size: number = 10

for (let i = 0; i < size; i++) {
    const row = []
    for (let j = 0; j < size; j++) {
        row.push(Math.floor(Math.random() * 10))
    }
    matrix.push(row)
}

const items = ['Van', 'Truck', 'Motorcycle', 'Car', 'Bus']

for (let i = 0; i < size; i++) {
    labels.push(items[Math.floor(Math.random() * items.length)])
}

export default defineComponent({
    components: {
        DlGrid,
        DlWidget,
        DlBarChart,
        DlIcon
    },
    setup() {
        const layout = ref([
            [1, 5, 2],
            [3, 4]
        ])

        const layouts = ref<DlGridLayout[]>([
            {
                name: 'Layout 1',
                value: layout.value
            }
        ])

        const widgetsPerRow = ref(3)
        const hasBeenSaved = ref('')

        const saveLayout = () => {
            const newLayout = {
                name: `Layout ${layouts.value.length + 1}`,
                value: layout.value
            }
            layouts.value.push(newLayout)
            hasBeenSaved.value = `${newLayout.name} has been saved.`
            setTimeout(() => {
                hasBeenSaved.value = ''
            }, 2000)
        }

        const selectLayout = (e: InputEvent) => {
            const index = parseInt((e.target as HTMLInputElement).value)
            layout.value = layouts.value[index].value
        }

        return {
            data,
            layout,
            layouts,
            widgetsPerRow,
            hasBeenSaved,
            saveLayout,
            selectLayout
        }
    }
})
</script>

<style lang="scss" scoped>
.options {
    width: 100%;
    display: flex;
    justify-content: space-between;
}
.widgets-per-row {
    &__input {
        padding: 5px;
        border-radius: 5px;
        width: 50px;
    }
}
.select-layout {
    &__input,
    &__button {
        padding: 5px;
        border-radius: 5px;
        margin: 0px 2px;
    }
    &__info {
        font-size: 0.8em;
        margin-left: 10px;
    }
}
.menu-icons {
    display: flex;
    align-items: center;
    & > * {
        cursor: pointer;
        margin: 0px 5px;
    }
}
</style>
