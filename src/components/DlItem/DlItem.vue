<template>
    <dl-list-item
        :id="uuid"
        :clickable="clickable"
    >
        <dl-item-section>
            <slot />
        </dl-item-section>
    </dl-list-item>
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi'
import { DlListItem } from '../DlListItem'
import DlItemSection from '../DlItemSection.vue'
import { v4 } from 'uuid'

export default defineComponent({
    name: 'DlItem',
    components: {
        DlListItem,
        DlItemSection
    },
    props: {
        clickable: { type: Boolean, default: true }
    },
    data() {
        return {
            uuid: `dl-item-${v4()}`
        }
    }
})
</script>

<style lang="scss" scoped></style>
