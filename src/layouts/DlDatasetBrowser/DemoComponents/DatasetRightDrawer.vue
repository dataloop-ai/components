<template>
    <div
        class="right-drawer-content"
        :style="cssVars"
    >
        <div class="right-drawer-content__toggle-icon">
            <dl-button
                flat
                :icon="expandIcon"
                color="secondary"
                @click="onToggle"
            />
        </div>
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
import { computed, defineComponent, ref } from 'vue-demi'
import { DlTypography, DlIcon, DlButton } from '../../../components'

export default defineComponent({
    name: 'DatasetRightDrawer',
    components: {
        DlTypography,
        DlIcon,
        DlButton
    },
    setup() {
        const LARGE_WIDTH = '300px'
        const SMALL_WIDTH = '30px'
        const rightDrawerContentWidth = ref(LARGE_WIDTH)
        const isExpanded = ref(true)

        const onToggle = () => {
            isExpanded.value = !isExpanded.value
            rightDrawerContentWidth.value = isExpanded.value
                ? LARGE_WIDTH
                : SMALL_WIDTH
        }
        const expandIcon = computed(() =>
            isExpanded.value ? 'icon-dl-collapse' : 'icon-dl-expand'
        )
        const cssVars = computed(() => {
            return {
                '--right-drawer-content-width': rightDrawerContentWidth.value
            }
        })

        return {
            onToggle,
            expandIcon,
            cssVars
        }
    }
})
</script>

<style scoped lang="scss">
.right-drawer-content {
    width: var(--right-drawer-content-width);
    transition: all 350ms;

    &__toggle-icon {
        left: 0;
    }
}
</style>
