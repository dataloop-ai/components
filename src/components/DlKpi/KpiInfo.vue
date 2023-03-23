<template>
    <div>
        <dl-tooltip
            v-if="isVisibleInfoMessage"
            anchor="top middle"
        >
            {{ infoMessage }}
        </dl-tooltip>
        <dl-icon
            icon="icon-dl-info"
            size="16px"
            @mouseover="isVisibleInfoMessage = true"
            @mouseleave="isVisibleInfoMessage = false"
        />
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue-demi'
import { DlTooltip, DlIcon } from '../'

export default defineComponent({
    name: 'KpiInfo',
    components: {
        DlTooltip,
        DlIcon
    },
    props: {
        infoMessage: {
            type: String,
            default: '',
            required: false
        }
    },
    setup() {
        const isVisibleInfoMessage = ref(false)

        return {
            isVisibleInfoMessage
        }
    }
})
</script>

<style scoped></style>
