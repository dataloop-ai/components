import { DlBarChart, DlGrid, DlWidget } from '../components'
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
    argTypes: {
        rowGap: {
            name: 'rowGap',
            type: { name: 'string', required: false },
            description: 'The gap between the grid rows',
            defaultValue: '10px',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: '10px' }
            },
            control: {
                type: 'text'
            }
        },
        columnGap: {
            name: 'columnGap',
            type: { name: 'string', required: false },
            description: 'The gap between the grid columns',
            defaultValue: '10px',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: '10px' }
            },
            control: {
                type: 'text'
            }
        },
        maxElementsPerRow: {
            name: 'maxElementsPerRow',
            type: { name: 'number', required: false },
            description: 'Sets a maximum amount of widgets on a single row',
            defaultValue: '3',
            table: {
                type: { summary: 'number' },
                defaultValue: { summary: '3' }
            },
            control: {
                type: 'number'
            }
        }
    }
}

const Template = (args) => ({
    components: {
        DlGrid,
        DlWidget,
        DlBarChart
    },
    setup() {
        const layout = ref([
            [1, 5, 2],
            [3, 4]
        ])

        const layouts = ref([
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

        const selectLayout = (e) => {
            const index = parseInt(e.target.value)
            layout.value = layouts.value[index].value
        }

        return {
            data,
            layout,
            layouts,
            widgetsPerRow,
            hasBeenSaved,
            saveLayout,
            selectLayout,
            args
        }
    },
    template: `
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
        </div>
        <dl-grid
            v-bind="args"
            v-model="layout"
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
                    <span style="color: var(--dl-color-medium)">Lorem ipsum dolor sit amet consectetur adipisicing
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
                    <span style="color: var(--dl-color-medium)">Lorem ipsum dolor sit amet consectetur adipisicing
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
  `
})

export const Preview = Template.bind({})
Preview.args = {
    rowGap: '10px',
    columnGap: '10px',
    maxElementsPerRow: 3
}
