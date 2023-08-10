<template>
    <div :id="uuid">
        <slot />
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, watch, provide, ref } from 'vue-demi'
import { getThemeModeAttr } from '../../../utils'
import '@dataloop-ai/icons/style.css'
import { v4 } from 'uuid'
import { stateManager } from '../../../StateManager'

export default defineComponent({
    props: {
        isDark: {
            type: Boolean,
            required: false,
            default: false
        }
    },
    setup(props) {
        onMounted(() => {
            const mode = getThemeModeAttr(props.isDark)
            document.documentElement.setAttribute('data-theme', mode)
        })

        const isDarkTheme = ref(props.isDark)

        stateManager.theme = props.isDark ? 'dark' : 'light'

        provide('theme', isDarkTheme)

        watch(
            () => props.isDark,
            (isDark: boolean) => {
                isDarkTheme.value = isDark
                document.documentElement.setAttribute(
                    'data-theme',
                    getThemeModeAttr(isDark)
                ) // sets the dl data-theme attr

                stateManager.theme = props.isDark ? 'dark' : 'light'
            }
        )
    },
    data() {
        return {
            uuid: `dl-theme-provider-${v4()}`
        }
    }
})
</script>

<style src="../../../assets/globals.scss" lang="scss" />
