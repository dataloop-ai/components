<template>
    <div class="widgets-demo-wrapper">
        <div class="select-wrapper">
            <div style="width: 40%">
                <p>Select mode:</p>
                <dl-select
                    v-model="activeMode"
                    :options="[flex, grid, layout]"
                />
            </div>
            <div style="width: 40%">
                <p>Select content type:</p>
                <dl-select
                    v-model="activeContentType"
                    :options="[
                        { value: 'images', label: 'Images' },
                        { value: 'widgets', label: 'Widgets' },
                        {
                            value: 'prop',
                            label: 'Prop + ItemSlot + VirtualScroll'
                        }
                    ]"
                />
            </div>
        </div>

        <div v-if="activeMode === layout">
            <h3>Layout mode</h3>
            <dl-button
                v-if="activeContentType.value === 'widgets'"
                class="select-layout__button"
                style="width: 200px; margin-bottom: 20px"
                @click="addWidget(layout)"
            >
                Add widget
            </dl-button>
            <dl-grid
                v-if="activeContentType.value === 'widgets'"
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
            <dl-grid
                v-if="activeContentType.value === 'images'"
                v-model="cmLayout"
                :mode="layout"
            >
                <img
                    v-for="img in images"
                    :key="img.id"
                    :src="img.src"
                >
            </dl-grid>
        </div>
        <div v-else-if="activeMode === grid">
            <h3>Grid mode</h3>
            <dl-button
                v-if="activeContentType.value === 'widgets'"
                class="select-layout__button"
                style="width: 200px; margin-bottom: 20px"
                @click="addWidget(grid)"
            >
                Add widget
            </dl-button>
            <dl-grid
                v-if="activeContentType.value === 'widgets'"
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
            <dl-grid
                v-if="activeContentType.value === 'images'"
                v-model="dmLayout"
                :mode="layout"
            >
                <img
                    v-for="img in images"
                    :key="img.id"
                    :src="img.src"
                >
            </dl-grid>
        </div>
        <div v-else-if="activeMode === flex">
            <h3>Flex mode</h3>
            <dl-button
                v-if="activeContentType.value === 'widgets'"
                class="select-layout__button"
                style="width: 200px; margin-bottom: 20px"
                @click="addWidget(flex)"
            >
                Add widget
            </dl-button>
            <dl-grid
                v-if="activeContentType.value === 'widgets'"
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
            <dl-grid
                v-if="activeContentType.value === 'images'"
                :mode="layout"
            >
                <img
                    v-for="img in images"
                    :key="img.id"
                    :src="img.src"
                >
            </dl-grid>
        </div>
        <div v-if="activeContentType.value === 'prop'">
            <dl-grid
                :items="images"
                infinite-scroll
            >
                <template #item-slot="{ item }">
                    <img :src="item.src">
                </template>
            </dl-grid>
        </div>
    </div>
</template>

<script lang="ts">
import { v4 } from 'uuid'
import { defineComponent, Ref, ref } from 'vue-demi'
import {
    DlWidget,
    DlGrid,
    DlBarChart,
    DlIcon,
    DlButton,
    DlSelect
} from '../components'
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
        DlButton,
        DlSelect
    },
    setup() {
        const activeMode = ref('layout')
        const activeContentType = ref({
            value: 'images',
            label: 'Images'
        })

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

        const images = []
        for (let i = 0; i < 101; i++) {
            images.push({
                id: v4(),
                src: 'https://picsum.photos/200/200'
            })
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
            grid: DlGridMode.GRID,
            activeMode,
            activeContentType,
            images
        }
    }
})
</script>

<style lang="scss" scoped>
.select-wrapper {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
}
.widgets-demo-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;

    & > * {
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
