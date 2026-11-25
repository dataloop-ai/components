<template>
    <tr :class="trClasses" v-bind="$attrs" v-on="listeners">
        <slot />
    </tr>
</template>

<script lang="ts">
import { defineComponent, isVue2 } from 'vue-demi'

export default defineComponent({
    name: 'DlTr',
    props: {
        props: { type: Object, default: () => {} },
        noHover: Boolean
    },
    computed: {
        listeners(): any {
            // Vue 3: listeners are part of $attrs (onX) and already bound with
            // v-bind; passing $attrs to v-on too turned every attribute
            // (class, aria-*) into an invalid "event handler" with a warning
            // on each row render
            // @ts-ignore
            return isVue2 ? this.$listeners : {}
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
    }
})
</script>

<style scoped src="../styles/dl-table-styles.scss" lang="scss" />
