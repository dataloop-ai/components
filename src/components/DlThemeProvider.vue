<template>
    <div :id="uuid">
        <slot />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi'
import { getThemeModeAttr } from '../utils'
import '@dataloop-ai/icons/docs/style.css'
import { v4 } from 'uuid'

export default defineComponent({
    props: {
        isDark: {
            type: Boolean,
            required: true,
            default: false
        }
    },
    data() {
        return {
            uuid: `dl-theme-provider-${v4()}`
        }
    },
    watch: {
        isDark(colorMode: boolean) {
            document.documentElement.setAttribute(
                'data-theme',
                getThemeModeAttr(colorMode)
            ) // sets the dl data-theme attr
        }
    },
    created() {
        const mode = getThemeModeAttr(this.isDark)
        document.documentElement.setAttribute('data-theme', mode)
    }
})
</script>

<style src="../assets/globals.scss" lang="scss" />
