<template>
    <DlThemeProvider :is-dark="darkMode">
        <div
            style="display: flex; width: 100%; align-items: center; align-content; center;"
        >
            <dl-typography
                color="dl-color-medium"
                variant="p"
                style="margin: 10px 0px 20px 0px; width: 90%"
            >
                <div
                    style="
                        background-image: url(https://dataloop.ai/wp-content/uploads/2020/03/logo.svg);
                        width: 160px;
                        height: 28px;
                        display: inline-block;
                    "
                />
                Components library
            </dl-typography>
            <div style="display: flex; align-items: center">
                <dl-icon
                    icon="icon-dl-light-theme"
                    size="24px"
                    :color="
                        !darkMode ? 'dl-color-secondary' : 'dl-color-darker'
                    "
                />
                <dl-switch
                    v-model="darkMode"
                    style="margin: 0 20px"
                />
                <dl-icon
                    icon="icon-dl-dark-theme"
                    size="20px"
                    :color="darkMode ? 'dl-color-secondary' : 'dl-color-darker'"
                />
            </div>
        </div>
        <div class="layout-wrapper">
            <div class="sidebar">
                <dl-search
                    v-model="filterTerm"
                    style="margin-bottom: 5px"
                />

                <dl-button
                    v-if="activeDemo"
                    outlined
                >
                    <span style="text-transform: capitalize">
                        Selected: {{ computeDemoName(activeDemo.name) }}
                    </span>
                </dl-button>
                <dl-list
                    bordered
                    clickable
                    style="
                        margin-top: 15px;
                        min-width: 200px;
                        height: 100%;
                        height: calc(100vh - 18vh);
                        overflow: auto;
                    "
                >
                    <template #default="{ clickable }">
                        <dl-list-item
                            v-for="(demo, index) in filteredDemos"
                            :key="demo.name"
                            :separator="index !== filteredDemos.length - 1"
                            :clickable="clickable"
                            :class="isSelectedDemo(demo) ? 'selected' : ''"
                            style="text-transform: capitalize"
                            @click="setActiveDemo(demo)"
                        >
                            {{ computeDemoName(demo.name) }}
                        </dl-list-item>
                    </template>
                </dl-list>
            </div>
            <div class="content">
                <div style="display: flex; justify-content: center">
                    <dl-typography
                        size="h2"
                        variant="h2"
                        style="text-transform: capitalize"
                    >
                        {{
                            activeDemo
                                ? computeDemoName(activeDemo.name)
                                : 'No selected'
                        }}
                        component
                    </dl-typography>
                </div>
                <component
                    :is="activeDemo.component"
                    v-if="activeDemo"
                    class="data-container"
                />
            </div>
        </div>
    </DlThemeProvider>
</template>

<script lang="ts">
import { defineComponent, ref, computed, shallowRef } from 'vue-demi'
import {
    DlThemeProvider,
    DlButton,
    DlListItem,
    DlList,
    DlTypography,
    DlSearch,
    DlSwitch,
    DlIcon
} from '../components'
import Demos from '.'

export default defineComponent({
    name: 'DlComponentsDemo',
    components: {
        DlThemeProvider,
        DlButton,
        DlListItem,
        DlList,
        DlTypography,
        DlSearch,
        DlSwitch,
        DlIcon
    },
    props: {
        isDark: { required: false, default: false, type: Boolean }
    },
    setup(props) {
        const darkMode = ref(props.isDark)
        const filterTerm = ref('')
        const names = Object.keys(Demos)
        const demos: {
            name: string
            component: any
        }[] = names
            .map((n: string) => ({
                name: n,
                // @ts-ignore
                component: Demos[n]
            }))
            .sort((a, b) => a.name.localeCompare(b.name))

        const filteredDemos = computed(() => {
            if (!filterTerm.value || !filterTerm.value.length) {
                return demos
            }

            return demos.filter((demo: { name: string; component: any }) => {
                return demo.name
                    .toLowerCase()
                    .includes(filterTerm.value.toLowerCase())
            })
        })

        const activeDemo = shallowRef(
            window.localStorage.getItem('dl-active-demo')
                ? demos.find(
                      (d) =>
                          d.name ===
                          window.localStorage.getItem('dl-active-demo')
                  ) ?? null
                : null
        )

        const setActiveDemo = (demo: { name: string; component: any }) => {
            activeDemo.value = demo
            window.localStorage.setItem('dl-active-demo', demo.name)
        }

        const computeDemoName = (name: string) => {
            return name.includes('Dl')
                ? name.split('Demo')[0]
                : 'Dl' + name.split('Demo')[0]
        }

        const isSelectedDemo = (demo: { name: string; component: any }) => {
            return activeDemo.value?.name === demo.name
        }

        return {
            darkMode,
            activeDemo,
            setActiveDemo,
            filterTerm,
            filteredDemos,
            computeDemoName,
            isSelectedDemo
        }
    }
})
</script>

<style scoped lang="scss">
.layout-wrapper {
    display: grid;
    grid-template-columns: 12% 85%;
}

.sidebar {
    display: flex;
    flex-direction: column;
}

.content {
    padding: 20px 30px;
    flex-grow: 1;
}

.data-container {
    display: flex;
    gap: 1rem;
    align-items: center;
    max-width: 100%;
    overflow: auto;
    padding: 20px;
    margin: 0 auto;
    flex-direction: column;
    justify-content: center;
    min-width: 950px;
    resize: both;
    box-shadow: var(--dl-menu-shadow);
}

.selected {
    ::v-deep .row {
        color: var(--dl-color-secondary) !important;
        background-color: var(--dl-color-fill);
    }
}
</style>
