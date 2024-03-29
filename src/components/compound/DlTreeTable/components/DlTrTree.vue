<template>
    <tr
        ref="dlTrTreeRef"
        :data-level="props.row.level"
        :data-id="props.row.id"
        :class="trClasses"
        v-bind="$attrs"
        v-on="listeners"
    >
        <slot />
    </tr>
</template>

<script lang="ts">
import { defineComponent, isVue2 } from 'vue-demi'
import { DlTableRow } from '../../types'

export default defineComponent({
    name: 'DlTrTree',
    props: {
        props: { type: Object, default: () => {} },
        noHover: Boolean,
        children: {
            type: Number,
            default: null
        }
    },
    computed: {
        childrenComputed(): number | null {
            return this.children
        },
        listeners(): any {
            if (isVue2) {
                // @ts-ignore
                return this.$listeners
            } else {
                return this.$attrs
            }
        },
        trClasses(): string {
            let classes = 'dl-tr'

            if (
                this.$props.props?.header // header slot
            ) {
                return classes
            }

            if (this.$props.props?._trClass) {
                classes = classes.concat(' ' + this.$props.props._trClass)
            }

            if (this.$props.props?.noHover || this.$props.noHover) {
                classes = classes.concat(' dl-tr--no-hover')
            }

            return classes
        }
    },

    watch: {
        'props.row': {
            handler(row: DlTableRow) {
                if (!this.$refs.dlTrTreeRef) {
                    return
                }
                (this.$refs.dlTrTreeRef as any).setAttribute(
                    'data-is-visible',
                    row.isExpandedParent || row.level === 1
                )
            },
            deep: true
        },
        childrenComputed(value) {
            (this.$refs.dlTrTreeRef as any).setAttribute(
                'data-children',
                value
            )
        }
    },
    mounted(): void {
        this.setAttributeChildren()
    },
    methods: {
        setAttributeChildren() {
            (this.$refs.dlTrTreeRef as any).setAttribute(
                'data-children',
                this.children
            )
        }
    }
})
</script>

<style scoped src="../../DlTable/styles/dl-table-styles.scss" lang="scss" />
