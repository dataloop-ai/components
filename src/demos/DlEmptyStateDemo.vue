<template>
    <div>
        <dl-empty-state
            :bg-image="`url('./src/demo/assets/agenda.svg')`"
            style="min-width: 400px; min-height: 300px"
            title="This analytics will populate with data when relevant information will be available."
            subtitle="This analytics will populate with data when relevant information will be available."
            info="To learn more about this analytics, read our documentation."
        />

        <dl-empty-state
            icon-color="dl-color-negative"
            icon-size="100px"
            :bg-image="`url('./src/demo/assets/agenda.svg')`"
            style="min-width: 400px; min-height: 300px; max-width: 400px"
            subtitle="This analytics will populate with data when relevant information will be available."
            info="To learn more about this analytics, read our documentation"
        >
            <template #cta="">
                <div style="display: flex; gap: 15px">
                    <dl-button label="Create Pipeline" />
                    <dl-button
                        outlined
                        label="Create With Template"
                    />
                </div>
            </template>

            <template #links="">
                <div style="display: flex; gap: 15px">
                    <dl-button
                        padding="0px"
                        icon="icon-dl-sdk-documentation"
                        flat
                        uppercase
                        label="SDK"
                    />
                    <dl-button
                        padding="0px"
                        icon="icon-dl-file"
                        flat
                        label="Documentation"
                    />
                    <dl-button
                        padding="0px"
                        icon="icon-dl-youtube"
                        flat
                        label="Video"
                    />
                </div>
            </template>
        </dl-empty-state>

        <dl-empty-state
            :bg-image="`url(./src/demos/assets/agenda.svg)`"
            style="width: 400px; min-height: 300px; resize: both"
            title="This analytics will populate with data when relevant information will be available."
            subtitle="This analytics will populate with data when relevant information will be available."
            info="To learn more about this analytics, read our documentation."
            title-class="dl-eta-title"
        />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi'
import { DlEmptyState, DlButton } from '../components/basic'
export default defineComponent({
    name: 'DlEmptyStateDemo',
    components: {
        DlEmptyState,
        DlButton
    }
})
</script>

<style scoped lang="scss">
.dl-eta-title {
    font-size: 10vw;
}
</style>
