<template>
    <div
        :id="uuid"
        :class="classes"
    >
        <table class="dl-table">
            <slot />
        </table>
    </div>
</template>

<script lang="ts">
import { v4 } from 'uuid'
import { defineComponent, computed, ref } from 'vue-demi'

const separatorValues = ['horizontal', 'vertical', 'cell', 'none']

export default defineComponent({
    name: 'DlMarkupTable',
    props: {
        dense: Boolean,
        flat: Boolean,
        bordered: Boolean,
        square: Boolean,
        wrapCells: Boolean,

        separator: {
            type: String,
            default: 'horizontal',
            validator: (v: (typeof separatorValues)[number]) =>
                separatorValues.includes(v)
        }
    },
    setup(props) {
        const uuid = ref(`dl-markup-table-${v4()}`)

        const classes = computed(
            () =>
                'dl-markup-table dl-table__container dl-table__card' +
                ` dl-table--${props.separator}-separator` +
                (props.dense === true ? ' dl-table--dense' : '') +
                (props.flat === true ? ' dl-table--flat' : '') +
                (props.bordered === true ? ' dl-table--bordered' : '') +
                (props.square === true ? ' dl-table--square' : '') +
                (props.wrapCells === false ? ' dl-table--no-wrap' : '')
        )

        return {
            classes,
            uuid
        }
    }
})
</script>

<style scoped lang="scss">
@import '../../compound/DlTable/styles/dl-table-styles.scss';
</style>
