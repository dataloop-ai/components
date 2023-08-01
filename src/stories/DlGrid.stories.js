import { DlBarChart, DlGrid, DlWidget, DlIcon, DlButton } from '../components'
import { ref } from 'vue-demi'

const data = {
    labels: Array.from({ length: 20 }, (_, i) => `${i}`),
    datasets: [
        {
            label: 'Data One',
            backgroundColor: '--dl-color-secondary',
            borderRadius: 4,
            data: Array.from({ length: 20 }, (_, i) => i + 1)
        },
        {
            label: 'Data Two',
            backgroundColor: '--dl-color-warning',
            borderRadius: 4,
            data: Array.from({ length: 20 }, (_, i) => i + 1)
        }
    ]
}

export default {
    title: 'Library/Components/DlGrid',
    component: DlGrid,
    argTypes: {
        modelValue: {
            name: 'modelValue',
            type: { name: 'array', required: false },
            description: 'The required grid layout model',
            defaultValue: null,
            table: {
                type: { summary: 'array' },
                defaultValue: { summary: 'null' }
            },
            control: {
                type: 'array'
            }
        },
        rowGap: {
            name: 'rowGap',
            type: { name: 'string', required: false },
            description: 'The gap between the grid rows.',
            defaultValue: '30px',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: '30px' }
            },
            control: {
                type: 'text'
            }
        },
        columnGap: {
            name: 'columnGap',
            type: { name: 'string', required: false },
            description: 'The gap between the grid columns.',
            defaultValue: '30px',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: '30px' }
            },
            control: {
                type: 'text'
            }
        },
        maxElementsPerRow: {
            name: 'maxElementsPerRow',
            type: { name: 'number', required: false },
            description: 'Sets a maximum amount of widgets on a single row.',
            defaultValue: '3',
            table: {
                type: { summary: 'number' },
                defaultValue: { summary: '3' }
            },
            control: {
                type: 'number'
            }
        },
        mode: {
            name: 'mode',
            type: { name: 'string', required: false },
            description: `Set the required grid mode.`,
            defaultValue: 'layout',
            table: {
                type: { summary: `grid | flex | layout` },
                defaultValue: { summary: 'layout' }
            },
            control: {
                type: 'string'
            }
        }
    }
}

const LayoutModeTemplate = () => ({
    components: {
        DlGrid,
        DlWidget,
        DlIcon,
        DlBarChart,
        DlButton
    },
    setup() {
        const layout = ref([
            ['a', 'b', 'c'],
            ['d', 'e']
        ])

        const maxElementsPerRow = ref(3)
        const widgets = ref([])

        const createRandomWidgets = () => {
            const numOfWidgets = layout.value.flat().length
            for (let i = 0; i < numOfWidgets; i++) {
                widgets.value.push({
                    id: layout.value.flat()[i],
                    header: `Widget ${i}`,
                    description: `I'm description`
                })
            }
        }
        createRandomWidgets()

        const deleteWidget = (id) => {
            widgets.value = widgets.value.filter((widget) => widget.id !== id)
            layout.value = buildNewLayout()
        }

        const addWidget = () => {
            widgets.value.push({
                id: (widgets.value.length + 1).toString(),
                header: `Widget ${widgets.value.length}`,
                description: `I'm description`
            })
            layout.value = buildNewLayout()
        }

        const buildNewLayout = () => {
            const template = []
            let index = 0

            while (index < widgets.value.length) {
                const row = widgets.value.slice(
                    index,
                    index + maxElementsPerRow.value
                )
                template.push(row.map((w) => w.id))
                index += maxElementsPerRow.value
            }
            return template
        }

        return {
            data,
            deleteWidget,
            addWidget,
            layout,
            widgets,
            maxElementsPerRow
        }
    },
    template: `
    <div>
        <h3>Layout mode</h3>
        <dl-button
            class="select-layout__button"
            style="width: 200px; margin-bottom: 20px;"
            @click="addWidget"
        >
            Add widget
        </dl-button>
        <dl-grid
            :key="widgets.length"
            v-model="layout"
            :max-elements-per-row="maxElementsPerRow"
            mode="layout"
        >
            <dl-widget
                v-for="widget in widgets"
                :key="widget.id"
            >
                <template #header>
                    {{ widget.header }}
                </template>
                <template #content>
                    <dl-bar-chart
                        :data="data"
                        :items-in-view="6"
                    />
                </template>
                <template #menu>
                    <div class="menu-icons">
                        <dl-icon
                            size="m"
                            icon="icon-dl-delete"
                            @click="deleteWidget(widget.id)"
                        />
                    </div>
                </template>
                <template #description>
                    {{ widget.description }}
                </template>
            </dl-widget>
        </dl-grid>
    </div>
  `
})

export const LayoutMode = LayoutModeTemplate.bind({})
LayoutMode.args = {}

// ==============================

const GridModeTemplate = () => ({
    components: {
        DlGrid,
        DlWidget,
        DlButton,
        DlIcon,
        DlBarChart
    },
    setup() {
        const layout = ref([
            ['a', 'b', 'c'],
            ['d', 'e'],
            ['f', 'g', 'h']
        ])

        const maxElementsPerRow = ref(3)
        const widgets = ref([])

        const createRandomWidgets = () => {
            const numOfWidgets = layout.value.flat().length
            for (let i = 0; i < numOfWidgets; i++) {
                widgets.value.push({
                    id: layout.value.flat()[i],
                    header: `Widget ${i}`,
                    description: `I'm description`
                })
            }
        }
        createRandomWidgets()

        const deleteWidget = (id) => {
            widgets.value = widgets.value.filter((widget) => widget.id !== id)
            layout.value = buildNewLayout()
        }

        const addWidget = () => {
            widgets.value.push({
                id: (widgets.value.length + 1).toString(),
                header: `Widget ${widgets.value.length}`,
                description: `I'm description`
            })
            layout.value = buildNewLayout()
        }

        const buildNewLayout = () => {
            const template = []
            let index = 0

            while (index < widgets.value.length) {
                const row = widgets.value.slice(
                    index,
                    index + maxElementsPerRow.value
                )
                template.push(row.map((w) => w.id))
                index += maxElementsPerRow.value
            }
            return template
        }

        return {
            data,
            deleteWidget,
            addWidget,
            layout,
            widgets,
            maxElementsPerRow
        }
    },
    template: `
    <div>
        <h3>Grid mode</h3>
        <dl-button
            class="select-layout__button"
            style="width: 200px; margin-bottom: 20px;"
            @click="addWidget"
        >
            Add widget
        </dl-button>
        <dl-grid
            :key="widgets.length"
            v-model="layout"
            :max-elements-per-row="maxElementsPerRow"
            mode="grid"
        >
            <dl-widget
                v-for="widget in widgets"
                :key="widget.id"
            >
                <template #header>
                    {{ widget.header }}
                </template>
                <template #content>
                    <dl-bar-chart
                        :data="data"
                        :items-in-view="6"
                    />
                </template>
                <template #menu>
                    <div style="display: flex; gap: 10px;">
                        <dl-icon
                            size="m"
                            icon="icon-dl-edit"
                        />
                        <dl-icon
                            size="m"
                            icon="icon-dl-delete"
                            @click="deleteWidget(widget.id)"
                        />
                    </div>
                </template>
                <template #description>
                    {{ widget.description }}
                </template>
            </dl-widget>
        </dl-grid>
    </div>
  `
})

export const GridMode = GridModeTemplate.bind({})
GridMode.args = {}

// ==============================

const FlexModeTemplate = () => ({
    components: {
        DlGrid,
        DlWidget,
        DlIcon,
        DlBarChart,
        DlButton
    },
    setup() {
        const layout = ref([
            ['a', 'b', 'c'],
            ['d', 'e', 'f']
        ])

        const maxElementsPerRow = ref(3)
        const widgets = ref([])

        const createRandomWidgets = () => {
            const numOfWidgets = layout.value.flat().length
            for (let i = 0; i < numOfWidgets; i++) {
                widgets.value.push({
                    id: layout.value.flat()[i],
                    header: `Widget ${i}`,
                    description: `I'm description`
                })
            }
        }
        createRandomWidgets()

        const deleteWidget = (id) => {
            widgets.value = widgets.value.filter((widget) => widget.id !== id)
            layout.value = buildNewLayout()
        }

        const addWidget = () => {
            widgets.value.push({
                id: (widgets.value.length + 1).toString(),
                header: `Widget ${widgets.value.length}`,
                description: `I'm description`
            })
            layout.value = buildNewLayout()
        }

        const buildNewLayout = () => {
            const template = []
            let index = 0

            while (index < widgets.value.length) {
                const row = widgets.value.slice(
                    index,
                    index + maxElementsPerRow.value
                )
                template.push(row.map((w) => w.id))
                index += maxElementsPerRow.value
            }
            return template
        }

        return {
            data,
            deleteWidget,
            addWidget,
            layout,
            widgets,
            maxElementsPerRow
        }
    },
    template: `
    <div>
        <h3>Flex mode</h3>
        <dl-button
            class="select-layout__button"
            style="width: 200px; margin-bottom: 20px;"
            @click="addWidget"
        >
            Add widget
        </dl-button>
        <dl-grid
            :key="widgets.length"
            mode="flex"
        >
            <dl-widget
                v-for="widget in widgets"
                :key="widget.id"
                :draggable="false"
                style="max-width: 15vw"
            >
                <template #header>
                    {{ widget.header }}
                </template>
                <template #content>
                    <dl-bar-chart
                        :data="data"
                        :items-in-view="6"
                    />
                </template>
                <template #menu>
                    <div class="menu-icons">
                        <dl-icon
                            size="m"
                            icon="icon-dl-delete"
                            @click="deleteWidget(widget.id)"
                        />
                    </div>
                </template>
                <template #description>
                    {{ widget.description }}
                </template>
            </dl-widget>
        </dl-grid>
    </div>
  `
})

export const FlexMode = FlexModeTemplate.bind({})
FlexMode.args = {}
