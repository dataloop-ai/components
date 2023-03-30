<template>
    <div
        @mouseover="setIsVisibleInfoMessage(true)"
        @mouseleave="setIsVisibleInfoMessage(false)"
    >
        <dl-tooltip
            v-if="isVisibleInfoMessage"
            anchor="top middle"
        >
            {{ message }}
        </dl-tooltip>
        <dl-icon
            icon="icon-dl-info"
            size="16px"
        />
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue-demi'
import { DlTooltip, DlIcon } from '../../../essential'

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
    setup(props) {
        const isVisibleInfoMessage = ref(false)
        const setIsVisibleInfoMessage = (value: boolean): void => {
            isVisibleInfoMessage.value = value
        }
        const message = computed(() =>
            props.infoMessage ? props.infoMessage : 'no data'
        )

        return {
            isVisibleInfoMessage,
            setIsVisibleInfoMessage,
            message
        }
    }
})
</script>

<style scoped></style>
