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
import { defineComponent, computed, ref, PropType, toRefs } from 'vue-demi'
import { DlTextTransformOptions } from '../../shared/types'

const separatorValues = ['horizontal', 'vertical', 'cell', 'none']

export default defineComponent({
    name: 'DlMarkupTable',
    props: {
        dense: Boolean,
        flat: Boolean,
        bordered: Boolean,
        square: Boolean,
        /** wraps the cells */
        wrap: Boolean,
        transform: {
            type: String as PropType<DlTextTransformOptions>,
            default: 'default',
            validator: (value: DlTextTransformOptions): boolean =>
                Object.values(DlTextTransformOptions).includes(value)
        },

        separator: {
            type: String,
            default: 'horizontal',
            validator: (v: (typeof separatorValues)[number]) =>
                separatorValues.includes(v)
        }
    },
    setup(props) {
        const { transform, dense, separator, flat, bordered, square, wrap } =
            toRefs(props)

        const uuid = ref(`dl-markup-table-${v4()}`)

        const classes = computed(
            () =>
                'dl-markup-table dl-table__container dl-table__card' +
                ` dl-table--${separator.value}-separator` +
                (dense.value === true ? ' dl-table--dense' : '') +
                (flat.value === true ? ' dl-table--flat' : '') +
                (bordered.value === true ? ' dl-table--bordered' : '') +
                (square.value === true ? ' dl-table--square' : '') +
                (wrap.value === false ? ' dl-table--no-wrap' : '') +
                ` dl-text-transform--${transform.value}`
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
