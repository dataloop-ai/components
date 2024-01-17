<template>
    <div class="dl-mark-down" v-html="renderedMD" />
</template>

<script lang="ts">
import { defineComponent, computed, toRefs } from 'vue-demi'
import { marked } from 'marked'

export default defineComponent({
    name: 'DlMarkdown',
    props: {
        text: {
            type: String,
            default: ''
        }
    },
    setup(props) {
        const { text } = toRefs(props)

        const renderedMD = computed(() => marked(text.value))
        return {
            renderedMD
        }
    }
})
</script>

<style scoped lang="scss"></style>
