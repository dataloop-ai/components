<template>
    <div>
        <div class="dl-text-holder-demo">
            Label with actions
            <dl-label
                label-color="dl-color-secondary"
                text="dl-labelaaaaaaaaaaaaaa"
            >
                <template #actions>
                    <div
                        style="
                            display: flex;
                            gap: 5px;
                            align-items: center;
                            height: 100%;
                            margin-right: 5px;
                        "
                    >
                        <dl-icon icon="icon-dl-add" />
                        <dl-icon icon="icon-dl-delete" />
                    </div>
                </template>
            </dl-label>
        </div>
        <div class="dl-text-holder-demo">
            Label with hint
            <dl-label
                label-color="dl-color-secondary"
                hint="tooltip"
                text="dl-labelaaaaaaaaaaaaaa"
            />
        </div>
        <div class="dl-text-holder-demo">
            Label with and actions
            <dl-label
                label-color="dl-color-secondary"
                hint="tooltip"
                text="dl-labelaaaaaaaaaaaaaa"
            >
                <template #actions>
                    <div
                        style="
                            display: flex;
                            gap: 5px;
                            align-items: center;
                            height: 100%;
                            margin-right: 5px;
                        "
                    >
                        <dl-icon icon="icon-dl-add" />
                        <dl-icon icon="icon-dl-delete" />
                    </div>
                </template>
            </dl-label>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi'
import { DlLabel, DlIcon } from '../components'

export default defineComponent({
    components: {
        DlLabel,
        DlIcon
    }
})
</script>

<style scoped>
.dl-text-holder-demo {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    width: 200px;
    padding: 5px;
    word-wrap: break-word;
}
</style>
