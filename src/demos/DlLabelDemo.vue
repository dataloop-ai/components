<template>
    <div>
        <div class="dl-text-holder-demo">
            Label with suffix
            <dl-label
                label-color="dl-color-secondary"
                hint="tooltip"
                text="dl-labelaaaaaaaaaaaaaa"
            >
                <template #suffix>
                    <div style="display: flex; gap: 5px">
                        <dl-icon icon="icon-dl-info" />
                        <dl-icon icon="icon-dl-info" />
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
