<template>
    <tr
        :class="trClasses"
        v-bind="$attrs"
        v-on="$listeners"
    >
        <slot />
    </tr>
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi'

export default defineComponent({
    name: 'DlTr',
    props: {
        props: { type: Object, default: () => {} },
        noHover: Boolean
    },
    computed: {
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
    }
})
</script>

<style scoped src="../styles/dl-table-styles.scss" lang="scss" />
