<template>
    <div>
        <ul class="colors">
            <li
                v-for="item in defaultColors"
                :key="`${item}`"
                class="item"
                @click="selectColor(`${item}`)"
            >
                <div
                    :style="{ background: `url(${imgAlphaBase64})` }"
                    class="alpha"
                />
                <div
                    :style="{ background: `${item}` }"
                    class="color"
                />
            </li>
        </ul>
        <ul
            v-if="colorsHistory.length"
            class="colors history"
        >
            <li
                v-for="(item, i) in colorsHistory"
                :key="`${item}_${i}`"
                class="item"
                @click="selectColor(`${item}`)"
            >
                <div
                    :style="{ background: `url(${imgAlphaBase64})` }"
                    class="alpha"
                />
                <div
                    :style="{ background: `${item}` }"
                    class="color"
                />
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi'
import { createAlphaSquare } from '../utils'

export default defineComponent({
    name: 'DlColors',
    props: {
        color: {
            type: String,
            default: '#000000'
        },
        defaultColors: {
            type: Array,

            //@ts-ignore
            default: () => []
        },
        colorsHistoryKey: {
            type: String,
            default: ''
        },
        colorsHistory: {
            type: Array,
            //@ts-ignore
            default: () => []
        }
    },
    data() {
        return {
            imgAlphaBase64: ''
        }
    },
    created() {
        this.imgAlphaBase64 = createAlphaSquare(4).toDataURL()
    },
    methods: {
        selectColor(color: string) {
            this.$emit('selectColor', color)
        },
        getColorClasses(color: string) {
            const classes = ['color']
            if (color.includes('#F') || color.includes('#f')) {
                classes.push('color-white')
            }
            return classes
        }
    }
})
</script>

<style scoped lang="scss">
.colors {
    padding: 0;
    margin: 5px 0px 0px 0px;
    &.history {
        margin-top: 15px;
        padding-top: 5px;
        margin-bottom: 5px;
        border-top: 1px solid var(--dl-color-separator);
    }
    .item {
        position: relative;
        width: 16px;
        height: 16px;
        margin: 10px 0 0 11px;
        border-radius: 3px;
        box-sizing: border-box;
        vertical-align: top;
        display: inline-block;
        transition: all 0.1s;
        cursor: pointer;
        &:nth-child(7n + 1) {
            margin-left: 0;
        }
        &:hover {
            transform: scale(1.2);
        }
        .alpha {
            height: 100%;
            border-radius: 4px;
        }
        .color {
            position: absolute;
            left: 0;
            top: 0;
            border-radius: 3px;
            border: 1px solid var(--dl-color-separator);
            width: calc(100% - 2px);
            height: calc(100% - 2px);
        }
    }
}
</style>
