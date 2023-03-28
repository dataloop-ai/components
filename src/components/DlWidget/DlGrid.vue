<template>
    <div ref="slotRef">
        <slot />
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue-demi'
export default defineComponent({
    props: {
        layout: {
            type: Array as PropType<number[] | null>,
            default: null
        },
        gap: {
            type: String,
            default: '30px'
        }
    },
    computed: {
        rowGap(): Record<string, string> {
            return { '--row-gap': this.gap }
        },
        hasRows() {
            return !!this.layout?.length
        }
    },
    mounted() {
        this.$nextTick(function () {
            if (!this.layout) {
                this.applyInlineGrid()
                return
            }

            this.applyGrid()
        })
    },
    methods: {
        applyGrid() {
            let divPosition = 0
            let restructuredLayout = ''
            const slotRef = this.$refs.slotRef as HTMLDivElement
            this.layout.forEach((row, index) => {
                if (index > slotRef.children.length) {
                    return
                }
                restructuredLayout += `
                    <div
                        style="
                            display: grid;
                            grid-template-columns: repeat(${row}, 1fr);
                            gap: ${this.gap};
                            "
                    >`
                for (let i = 0; i < row; i++) {
                    if (!slotRef.children[divPosition]) {
                        break
                    }

                    /** Draw canvas */
                    const sourceCanvas =
                        slotRef.children[divPosition]?.querySelector('canvas')
                    if (sourceCanvas) {
                        const targetCanvasCtx = (
                            slotRef.children[divPosition] as HTMLElement
                        )
                            .querySelector('canvas')
                            .getContext('2d')

                        targetCanvasCtx.drawImage(sourceCanvas, 0, 0)
                    }
                    /** Draw canvas */

                    restructuredLayout +=
                        slotRef.children[divPosition].outerHTML
                    divPosition += 1
                }
                restructuredLayout += '</div>'
            })
            restructuredLayout += '</div>'
            slotRef.innerHTML = `<div>${restructuredLayout}</div>`
        },
        applyInlineGrid() {
            const slotRef = this.$refs.slotRef as HTMLDivElement
            if (!slotRef.children.length) {
                return
            }
            slotRef.style.setProperty('display', 'grid')
            slotRef.style.setProperty(
                'grid-template-columns',
                `repeat(${slotRef.children.length}, 1fr)`
            )
            slotRef.style.setProperty('gap', this.gap)
        }
    }
})
</script>

<style lang="scss" scoped></style>
