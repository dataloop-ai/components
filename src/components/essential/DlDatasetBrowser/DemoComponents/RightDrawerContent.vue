<template>
    <div class="left-drawer-content">
        <div
            style="
                padding-bottom: 10px;
                display: flex;
                flex-direction: column;
                align-items: center;
                padding-top: 300px;
            "
        >
            <dl-icon
                icon="icon-dl-item-outline"
                size="30px"
                color="dl-color-darker"
            />
            <dl-typography
                size="12px"
                color="secondary"
            >
                Select an item from the left to get more item details.
            </dl-typography>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue-demi'
import DlTypography from '../../../essential/DlTypography/DlTypography.vue'
import DlIcon from '../../../essential/DlIcon/DlIcon.vue'

export default defineComponent({
    name: 'RightDrawerContent',
    components: {
        DlTypography,
        DlIcon
    },
    setup() {
        const checkModel = ref('')

        return {
            checkModel
        }
    }
})
</script>

<style scoped lang="scss">
.left-drawer-content {
    padding: 10px;
    height: 100%;
}
</style>
