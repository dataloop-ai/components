<template>
    <div>
        <div
            style="
                display: flex;
                height: 100%;
                align-items: center;
                justify-content: start;
                padding-right: 10px;
                gap: 5px;
            "
        >
            <dl-button
                v-for="(itemButton, buttonIndex) in itemsButton"
                :key="buttonIndex"
                flat
                dense
            >
                <dl-icon
                    size="16px"
                    :icon="itemButton.icon"
                    color="dl-color-darker"
                />
                <dl-tooltip>
                    {{ itemButton.tooltip }}
                </dl-tooltip>
            </dl-button>
        </div>
        <dl-separator />
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue-demi'
import DlSeparator from '../../../../../essential/DlSeparator/DlSeparator.vue'
import DlButton from '../../../../../basic/DlButton/DlButton.vue'
import DlIcon from '../../../../../essential/DlIcon/DlIcon.vue'
import DlTooltip from '../../../../../essential/DlTooltip/DlTooltip.vue'

export default defineComponent({
    name: 'TabMenuItem',
    components: {
        DlSeparator,
        DlButton,
        DlIcon,
        DlTooltip
    },
    setup() {
        const name = ref('Item tab')
        const itemsButton = [
            { icon: 'icon-dl-import', tooltip: 'Import Annotations' },
            { icon: 'icon-dl-export', tooltip: 'Export' },
            { icon: 'icon-dl-recipe', tooltip: 'Recipe' }
        ]

        return {
            name,
            itemsButton
        }
    }
})
</script>

<style scoped></style>
