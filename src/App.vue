<template>
    <DlThemeProvider :is-dark="isDarkMode">
        <div style="display: flex">
            <dl-typography
                color="dl-color-medium"
                size="h1"
                variant="h1"
            >
                Dataloop AI UI Library
            </dl-typography>
            <dl-button
                v-if="!hasProps"
                style="margin: 0 20px"
                @click="toggleColorMode"
            >
                {{ (isDarkMode ? 'Light' : 'Dark') + ' theme' }}
            </dl-button>
        </div>
        <div class="layout-wrapper">
            <div class="sidebar">
                <dl-search
                    v-model="activeDemo"
                    style="margin-bottom: 5px"
                />
                <dl-list
                    bordered
                    clickable
                    style="
                        min-width: 200px;
                        height: 100%;
                        height: calc(100vh - 60px);
                        overflow: auto;
                    "
                >
                    <template #default="{ clickable }">
                        <dl-list-item
                            v-for="(componentName, index) in Object.keys(
                                demoState
                            )"
                            :key="componentName"
                            :bordered="index !== 0"
                            :clickable="clickable"
                            :class="
                                componentName === activeDemo ? 'selected' : ''
                            "
                            style="text-transform: capitalize"
                            @click="setActiveDemo(componentName)"
                        >
                            {{ parseName(componentName) }}
                        </dl-list-item>
                    </template>
                </dl-list>
            </div>
            <div
                v-if="activeDemo !== 'stepper'"
                class="content"
            >
                <div style="display: flex; justify-content: center">
                    <dl-typography
                        size="h2"
                        variant="h2"
                        style="text-transform: capitalize"
                    >
                        {{ parseName(activeDemo) }} component
                    </dl-typography>
                </div>

                <component
                    :is="demoState[activeDemo]"
                    class="data-container"
                />
            </div>
            <div
                v-else
                class="content"
            >
                <SimpleStepper />
                <div style="height: 10px" />
                <StepperInDialogBox />
                <div style="height: 10px" />
                <CenteredStepperInDialogBox />
            </div>
        </div>
    </DlThemeProvider>
</template>

<script lang="ts">
// @ts-nocheck
import { defineComponent, ref, computed } from 'vue-demi'
import {
    DlThemeProvider,
    DlButton,
    DlListItem,
    DlList,
    DlTypography,
    DlSearch
} from './components'
import {
    demoState,
    SimpleStepper,
    StepperInDialogBox,
    CenteredStepperInDialogBox
} from './demo'
import { parseName } from './utils'

export default defineComponent({
    name: 'DlComponentsDemo',
    components: {
        DlThemeProvider,
        DlButton,
        DlListItem,
        DlList,
        DlTypography,
        DlSearch,
        SimpleStepper,
        StepperInDialogBox,
        CenteredStepperInDialogBox
    },
    props: {
        isDark: { required: false, default: null, type: Boolean }
    },
    setup(props) {
        const hasProps = computed(() => props.isDark !== null)
        const darkMode = ref(false)
        const demos = Object.keys(demoState)
        const activeDemo = ref(
            window.localStorage.getItem('dl-active-demo') ?? demos[0] ?? ''
        )
        const setActiveDemo = (demo: string) => {
            activeDemo.value = demo

            if (demos.includes(demo)) {
                window.localStorage.setItem('dl-active-demo', demo)
            }
        }
        const toggleColorMode = () => {
            darkMode.value = !darkMode.value
        }

        const isDarkMode = computed(() => {
            if (hasProps.value) {
                return props.isDark
            }
            return darkMode.value
        })

        return {
            hasProps,
            isDarkMode,
            activeDemo,
            setActiveDemo,
            toggleColorMode,
            demoState,
            parseName
        }
    }
})
</script>

<style scoped lang="scss">
#app {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
}

.layout-wrapper {
    display: flex;
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
    width: 950px;
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
