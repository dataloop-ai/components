<template>
    <div class="tabs-menu">
        <div class="tabs-menu__buttons-section">
            <dl-button
                v-for="(option, optionIndex) in options"
                :key="optionIndex"
                :flat="option.value !== selectedOption?.value"
                @click="handleSelectedOption(option)"
            >
                {{ option.label }}
            </dl-button>
        </div>
        <pre>
            {{ selectedOption }}
        </pre>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue-demi'
import DlButton from '../../../../basic/DlButton/DlButton.vue'

export default defineComponent({
    name: 'TabsMenu',
    components: {
        DlButton
    },
    props: {},
    setup() {
        const options = [
            {
                label: 'ANNOTATIONS',
                value: '1'
            },
            {
                label: 'ITEM',
                value: '2'
            },
            {
                label: 'WF',
                value: '3'
            }
        ]
        const selectedOption = ref(options[0])
        const handleSelectedOption = (option: any) => {
            selectedOption.value = option
        }

        return { options, selectedOption, handleSelectedOption }
    }
})
</script>

<style scoped lang="scss">
.tabs-menu {
    padding: 10px;

    &__buttons-section {
        display: flex;
        gap: 2px;
    }
    &__expand-icon {
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: white;
        margin-left: -18px;
        border-radius: 50%;
        margin-top: 20px;
    }
}
</style>
