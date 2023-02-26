<template>
    <div
        :id="uuid"
        class="dl-widget"
    >
        <div class="dl-widget__header">
            <slot name="header" />
        </div>

        <div class="dl-widget__content">
            <slot name="content" />
        </div>

        <div class="dl-widget__description">
            <slot name="description" />
        </div>
    </div>
</template>
<script lang="ts">
import { v4 } from 'uuid'
import { defineComponent } from 'vue-demi'
export default defineComponent({
    name: 'DlWidget',
    data() {
        return {
            uuid: `dl-widget-${v4()}`
        }
    }
})
</script>

<style lang="scss" scoped>
.dl-widget {
    height: 100%;
    display: flex;
    flex-direction: column;
    &__header {
        padding: 10px;
        border-bottom: 1px solid var(--dl-color-separator);
    }
    &__content {
        padding: 5px;
    }
    &__description {
        margin-top: auto;
        padding: 5px;
        font-size: 10px;
    }
}
</style>
