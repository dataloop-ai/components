<template>
    <div class="widgets-demo-wrapper">
        <div>
            <h3>Layout mode</h3>
            <dl-button
                class="select-layout__button"
                style="width: 200px; margin-bottom: 20px"
                @click="addWidget(layout)"
            >
                Add widget
            </dl-button>
            <dl-grid
                :key="cmWidgets.length"
                v-model="cmLayout"
                :max-elements-per-row="cmMaxWidgetsPerRow"
                :mode="layout"
            >
                <dl-widget
                    v-for="widget in cmWidgets"
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
                                icon="icon-dl-edit"
                            />
                            <dl-icon
                                size="m"
                                icon="icon-dl-delete"
                                @click="deleteWidget(layout, widget.id)"
                            />
                        </div>
                    </template>
                    <template #description>
                        {{ widget.description }}
                    </template>
                </dl-widget>
            </dl-grid>
        </div>
        <div>
            <h3>Grid mode</h3>
            <dl-button
                class="select-layout__button"
                style="width: 200px; margin-bottom: 20px"
                @click="addWidget(grid)"
            >
                Add widget
            </dl-button>
            <dl-grid
                :key="dmWidgets.length"
                v-model="dmLayout"
                :max-elements-per-row="dmMaxWidgetsPerRow"
                :mode="grid"
            >
                <dl-widget
                    v-for="widget in dmWidgets"
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
                                icon="icon-dl-edit"
                            />
                            <dl-icon
                                size="m"
                                icon="icon-dl-delete"
                                @click="deleteWidget(grid, widget.id)"
                            />
                        </div>
                    </template>
                    <template #description>
                        {{ widget.description }}
                    </template>
                </dl-widget>
            </dl-grid>
        </div>
        <div>
            <h3>Flex mode</h3>
            <dl-button
                class="select-layout__button"
                style="width: 200px; margin-bottom: 20px"
                @click="addWidget(flex)"
            >
                Add widget
            </dl-button>
            <dl-grid
                :key="fmWidgets.length"
                :mode="flex"
            >
                <dl-widget
                    v-for="widget in fmWidgets"
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
                                icon="icon-dl-edit"
                            />
                            <dl-icon
                                size="m"
                                icon="icon-dl-delete"
                                @click="deleteWidget(flex, widget.id)"
                            />
                        </div>
                    </template>
                    <template #description>
                        {{ widget.description }}
                    </template>
                </dl-widget>
            </dl-grid>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, Ref, ref } from 'vue-demi'
import { DlWidget, DlGrid, DlBarChart, DlIcon, DlButton } from '../components'
import { DlGridMode } from '../types'

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

export default defineComponent({
    components: {
        DlGrid,
        DlWidget,
        DlBarChart,
        DlIcon,
        DlButton
    },
    setup() {
        const cmLayout: Ref<string[][]> = ref([
            ['a', 'b', 'c'],
            ['d', 'e']
        ])
        const dmLayout: Ref<string[][]> = ref([
            ['a', 'b', 'c'],
            ['d', 'e']
        ])
        const fmLayout: Ref<string[][]> = ref([
            ['a', 'b', 'c'],
            ['d', 'e', 'f']
        ])

        const cmMaxWidgetsPerRow = ref(3)
        const dmMaxWidgetsPerRow = ref(3)
        const fmMaxWidgetsPerRow = ref(3)

        const cmWidgets = ref([])
        const dmWidgets = ref([])
        const fmWidgets = ref([])

        const createRandomWidgets = (
            layout: Ref<string[][]>,
            widgets: Ref<any[]>,
            numOfWidgets: number
        ) => {
            for (let i = 0; i < numOfWidgets; i++) {
                widgets.value.push({
                    id: layout.value.flat()[i],
                    header: `Widget ${i}`,
                    description: `I'm description`
                })
            }
        }
        createRandomWidgets(cmLayout, cmWidgets, cmLayout.value.flat().length)
        createRandomWidgets(dmLayout, dmWidgets, dmLayout.value.flat().length)
        createRandomWidgets(fmLayout, fmWidgets, fmLayout.value.flat().length)

        const deleteWidget = (mode: string, id: string) => {
            const { widgets, layout, widgetsPerRow } = modeScope(mode)
            widgets.value = widgets.value.filter((widget) => widget.id !== id)
            layout.value = buildNewLayout(widgets.value, widgetsPerRow)
        }

        const addWidget = (mode: string) => {
            const { widgets, layout, widgetsPerRow } = modeScope(mode)
            widgets.value.push({
                id: (widgets.value.length + 1).toString(),
                header: `Widget ${widgets.value.length}`,
                description: `I'm description`
            })
            layout.value = buildNewLayout(widgets.value, widgetsPerRow)
        }

        const modeScope = (mode: string) => {
            let widgets
            let layout
            let widgetsPerRow
            switch (mode) {
                case DlGridMode.LAYOUT:
                    widgets = cmWidgets
                    layout = cmLayout
                    widgetsPerRow = cmMaxWidgetsPerRow.value
                    break
                case DlGridMode.GRID:
                    widgets = dmWidgets
                    layout = dmLayout
                    widgetsPerRow = dmMaxWidgetsPerRow.value
                    break
                case DlGridMode.FLEX:
                    widgets = fmWidgets
                    layout = fmLayout
                    widgetsPerRow = fmMaxWidgetsPerRow.value
                    break
            }
            return { widgets, layout, widgetsPerRow }
        }

        const buildNewLayout = (widgets: any[], widgetsPerRow: number) => {
            const template: string[][] = []
            let index = 0

            while (index < widgets.length) {
                const row = widgets.slice(index, index + widgetsPerRow)
                template.push(row.map((w) => w.id))
                index += widgetsPerRow
            }
            return template
        }

        return {
            data,
            deleteWidget,
            addWidget,
            cmLayout,
            cmWidgets,
            cmMaxWidgetsPerRow,
            fmLayout,
            fmWidgets,
            fmMaxWidgetsPerRow,
            dmLayout,
            dmWidgets,
            dmMaxWidgetsPerRow,
            layout: DlGridMode.LAYOUT,
            flex: DlGridMode.FLEX,
            grid: DlGridMode.GRID
        }
    }
})
</script>

<style lang="scss" scoped>
.widgets-demo-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;

    & > * {
        display: flex;
        flex-direction: column;
        gap: 10px;
        border: 1px solid var(--dl-color-separator);
        padding: 10px;
    }
}
.widgets-per-row {
    &__input {
        padding: 5px;
        border-radius: 5px;
        width: 50px;
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
