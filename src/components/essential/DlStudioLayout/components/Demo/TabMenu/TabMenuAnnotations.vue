<template>
    <div>
        <dl-separator />
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
                v-for="(buttonItem, buttonIndex) in disabledButtons"
                :key="buttonIndex"
                flat
                dense
                disabled
            >
                <dl-icon
                    size="16px"
                    :icon="buttonItem.icon"
                    color="dl-color-disabled"
                />
            </dl-button>
        </div>
        <div class="tab-menu-annotations__autocomplete">
            <div>
                <dl-input
                    v-model="searchAnnotation"
                    placeholder="Search Annotations"
                    size="l"
                    has-prepend
                    padding-prop="0px 0px 0px 0px"
                >
                    <template #prepend>
                        <dl-icon
                            style="margin-bottom: 5px"
                            icon="icon-dl-search"
                            size="12px"
                        />
                    </template>
                </dl-input>
            </div>
            <div>
                <filter-menu />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue-demi'
import DlSeparator from '../../../../../essential/DlSeparator/DlSeparator.vue'
import DlButton from '../../../../../basic/DlButton/DlButton.vue'
import DlIcon from '../../../../../essential/DlIcon/DlIcon.vue'
import DlInput from '../../../../../compound/DlInput/DlInput.vue'
import FilterMenu from './FilterMenu.vue'

export default defineComponent({
    name: 'TabMenuAnnotations',
    components: {
        DlSeparator,
        DlButton,
        DlIcon,
        DlInput,
        FilterMenu
    },
    setup() {
        const name = ref('Annotations tab')
        const searchAnnotation = ref('')

        const disabledButtons = [
            { icon: 'icon-dl-clone' },
            { icon: 'icon-dl-label' },
            { icon: 'icon-dl-hide' },
            { icon: 'icon-dl-delete' }
        ]

        return {
            name,
            disabledButtons,
            searchAnnotation
        }
    }
})
</script>

<style scoped lang="scss">
.tab-menu-annotations {
    &__autocomplete {
        display: flex;
    }
}
</style>
