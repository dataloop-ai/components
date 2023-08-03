<template>
    <div
        ref="wrapper"
        class="container-wrapper"
    >
        <div
            :id="uuid"
            ref="container"
            :class="containerStyles"
        >
            <div
                v-if="hasHeaderSlot"
                class="dl-container__header"
            >
                <slot name="header" />
            </div>

            <div class="dl-container__content">
                <slot />
            </div>

            <div
                v-if="hasFooterSlot"
                class="dl-container__footer"
            >
                <slot name="footer" />
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { v4 } from 'uuid'
import { defineComponent } from 'vue-demi'

export default defineComponent({
    name: 'DlContainer',
    data() {
        return {
            uuid: `dl-container-${v4()}`
        }
    },
    computed: {
        containerStyles() {
            return 'dl-container'
        },
        hasHeaderSlot(): boolean {
            return this.$slots.header !== undefined
        },
        hasFooterSlot(): boolean {
            return this.$slots.footer !== undefined
        }
    }
})
</script>

<style lang="scss" scoped>
.dl-container {
    border: 1px solid var(--dl-color-separator);
    user-select: none;
    height: 100%;
    display: flex;
    flex-direction: column;
    &__header {
        display: flex;
        padding: 10px;
        border-bottom: 1px solid var(--dl-color-separator);
    }
    &__content {
        padding: 10px;
        height: 100%;
        overflow-y: auto;
    }
    &__footer {
        display: flex;
        padding: 10px;
        border-top: 1px solid var(--dl-color-separator);
    }
}

.container-wrapper {
    flex-basis: var(--container-flex-basis);
    margin: var(--row-gap) var(--column-gap);
    height: 100%;
}
</style>
