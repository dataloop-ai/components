<template>
    <div
        ref="slotRef"
        class="dl-grid-main"
    >
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
                // this.applyInlineGrid()
                return
            }

            // this.applyGrid()
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

<style lang="scss" scoped>
/*
    columns in each row from grid-template-areas = max number from array: Math.max(...array)
    grid-template-columns: totalColumns = result of multiplying all numbers from array = array.reduce((item, acc) => item * acc, 0)
    grid-column: totalColumns / number of columns in row:

    let areasNumber = 0
    let templateArea = ""
    grid-template-areas: array.forEach((item, index) => {

        for(let i = 1; i <= item; i++ ){
            templateArea += "element"+i
            areasNumber ++
        }
    })
    */
.dl-grid-main {
    display: grid;
    width: 100%;
    height: 100%;
    grid-template-areas:
        'element1 element2 element3'
        'element4 element5 element6'
        'element7 element7 element8';
    grid-template-columns: repeat(18, 1fr);
    gap: 10px;
}
.dl-grid-main > :nth-child(1) {
    grid-area: element1;
    grid-column: span 6;
    background-color: #8ca0ff;
}
.dl-grid-main > :nth-child(2) {
    grid-area: element2;
    grid-column: span 6;
    background-color: #ffa08c;
}
.dl-grid-main > :nth-child(3) {
    grid-area: element3;
    grid-column: span 6;
    background-color: #ffff64;
}
.dl-grid-main > :nth-child(4) {
    grid-area: element4;
    grid-column: span 6;
    background-color: #8cffa0;
}
.dl-grid-main > :nth-child(5) {
    grid-area: element5;
    grid-column: span 6;
    background-color: darkred;
}
.dl-grid-main > :nth-child(6) {
    grid-area: element6;
    grid-column: span 6;
    background-color: #bb96a3;
}
.dl-grid-main > :nth-child(7) {
    grid-area: element7;
    grid-column: span 9;
    background-color: #bb96a3;
}
.dl-grid-main > :nth-child(8) {
    grid-area: element8;
    grid-column: span 9;
    background-color: #bb96a3;
}
</style>
