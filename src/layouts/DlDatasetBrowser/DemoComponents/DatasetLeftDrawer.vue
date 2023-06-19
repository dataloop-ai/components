<template>
    <div
        class="left-drawer-content"
        :style="cssVars"
    >
        <div style="padding: 10px">
            <div class="left-drawer-content__toggle-icon">
                <dl-button
                    flat
                    color="secondary"
                    :icon="expandIcon"
                    @click="onToggle"
                />
            </div>
            <div style="padding: 40px 0 10px">
                <dl-typography
                    size="12px"
                    color="dl-color-dark"
                >
                    Search in:
                </dl-typography>
            </div>
            <dl-radio
                v-model="checkModel"
                label="All Dataset items"
                :value="1"
            />
            <dl-radio
                v-model="checkModel"
                label="Folders"
                :value="2"
            />
            <dl-radio
                v-model="checkModel"
                label="Tasks"
                :value="3"
            />
        </div>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue-demi'
import DlRadio from '../../../essential/DlRadio/DlRadio.vue'
import DlTypography from '../../../essential/DlTypography/DlTypography.vue'
import DlButton from '../../../basic/DlButton/DlButton.vue'

export default defineComponent({
    name: 'DatasetLeftDrawer',
    components: {
        DlRadio,
        DlTypography,
        DlButton
    },
    setup() {
        const LARGE_WIDTH = '300px'
        const SMALL_WIDTH = '50px'
        const leftDrawerContentWidth = ref(LARGE_WIDTH)
        const isExpanded = ref(true)
        const checkModel = ref('')

        const onToggle = () => {
            isExpanded.value = !isExpanded.value
            leftDrawerContentWidth.value = isExpanded.value
                ? LARGE_WIDTH
                : SMALL_WIDTH
        }
        const expandIcon = computed(() =>
            isExpanded.value ? 'icon-dl-expand' : 'icon-dl-collapse'
        )
        const cssVars = computed(() => {
            return {
                '--left-drawer-content-width': leftDrawerContentWidth.value
            }
        })

        return {
            checkModel,
            onToggle,
            expandIcon,
            cssVars
        }
    }
})
</script>

<style scoped lang="scss">
.left-drawer-content {
    width: var(--left-drawer-content-width);
    position: relative;
    transition: all 300ms;

    &__toggle-icon {
        position: absolute;
        right: 0;
    }
}
</style>
