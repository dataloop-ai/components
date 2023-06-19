<template>
    <div class="dl-layout-upload-data">
        <dl-empty-state
            icon-size="100px"
            class="dl-layout-upload-data__empty-state"
            icon=""
            title=""
        >
            <template #cta="">
                <div
                    style="
                        display: flex;
                        align-items: center;
                        gap: 10px;
                        padding-bottom: 20px;
                    "
                >
                    <dl-icon
                        icon="icon-dl-upload"
                        size="20px"
                        color="dl-color-darker"
                    />
                    <dl-typography
                        size="20px"
                        color="dl-color-darker"
                    >
                        Upload data (files, folders & annotations)
                    </dl-typography>
                </div>
                <dl-typography
                    size="12px"
                    color="dl-color-medium"
                >
                    Models can be trained, evaluated with data (and if there's
                    ground-truth, you'll have precision-recall and confusion
                    matrix), and deployed as a service in the Dataloop platform,
                    with an endpoint for use from outside.
                </dl-typography>
                <div style="padding-top: 20px">
                    <dl-button label="Upload Data" />
                </div>
            </template>

            <template #links>
                <div style="display: flex; gap: 15px">
                    <dl-button
                        padding="0px"
                        icon="icon-dl-sdk-documentation"
                        flat
                        uppercase
                        label="SDK"
                        size="s"
                        color="secondary"
                    />
                    <dl-button
                        padding="0px"
                        icon="icon-dl-file"
                        flat
                        label="Documentation"
                        size="s"
                        color="secondary"
                    />
                    <dl-button
                        padding="0px"
                        icon="icon-dl-youtube"
                        flat
                        label="Video"
                        size="s"
                        color="secondary"
                    />
                </div>
            </template>
        </dl-empty-state>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi'
import {
    DlEmptyState,
    DlButton,
    DlTypography,
    DlIcon
} from '../../../../../components'

export default defineComponent({
    name: 'UploadData',
    components: {
        DlEmptyState,
        DlButton,
        DlTypography,
        DlIcon
    }
})
</script>

<style scoped lang="scss">
.dl-layout-upload-data {
    &__empty-state {
        min-width: 400px;
        min-height: 300px;
        max-width: 400px;
        padding-top: 100px;
    }
}
</style>
