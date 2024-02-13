<template>
    <div class="dl-mark-down" v-html="renderedMD" />
</template>

<script lang="ts">
import { defineComponent, ref, VNode, isVNode } from 'vue-demi'
import type { VNodeArrayChildren } from 'vue-demi'
import { Marked } from 'marked'
import { markedHighlight } from 'marked-highlight'
import hljs from 'highlight.js'
import './styles/markdown.scss'
import { flattedChildren } from '../../../utils/vue'

export default defineComponent({
    name: 'DlMarkdown',
    setup(props, { slots }) {
        const defaultSlots: VNodeArrayChildren = slots.default?.() ?? []
        const flatSlots = flattedChildren(defaultSlots) as VNodeArrayChildren
        const renderedMD = ref(null)

        const rawMD: string | null = isVNode(flatSlots[0])
            ? ((flatSlots[0] as VNode).children as string)
            : null

        const marked = new Marked(
            markedHighlight({
                langPrefix: 'hljs language-',
                highlight(code, lang, info) {
                    const language = hljs.getLanguage(lang) ? lang : 'plaintext'
                    return hljs.highlight(code, { language }).value
                }
            })
        )

        marked.use({
            gfm: true
        })
        renderedMD.value = marked.parse(rawMD)

        return {
            renderedMD
        }
    }
})
</script>

<style scoped lang="scss"></style>
