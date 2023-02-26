<template>
    <div>
        <dl-option-group
            v-model="optionValue"
            :options="options"
            inline
        />
        <h1>The chosen option is {{ optionValue }}</h1>
        <dl-option-group
            v-model="switchValue"
            :options="options"
            type="switch"
        />
        <h1>The choosen option is {{ switchValue }}</h1>
        <dl-option-group
            v-model="switchValue"
            left-label
            max-width="150px"
            :options="options"
            type="switch"
        />
        <h1>The choosen option is {{ switchValue }}</h1>

        <h1>The chosen options are {{ switchValue }}</h1>
        <dl-option-group
            v-model="switchValue"
            type="checkbox"
            :options="options"
        />

        <h1>in menu : The chosen options are {{ switchValue }}</h1>
        <dl-button
            label="Menu"
            @click="$refs.menu.show()"
        >
            <dl-menu
                ref="menu"
                fit
            >
                <dl-option-group
                    v-model="switchValue"
                    type="checkbox"
                    :options="options"
                />
            </dl-menu>
        </dl-button>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue-demi'
import { DlOptionGroup, DlMenu, DlButton } from '../components'
import { OptionGroupOptions } from '../components/DlOptionGroup'
export default defineComponent({
    name: 'DlOptionGroupDemo',
    components: {
        DlOptionGroup,
        DlMenu,
        DlButton
    },
    setup() {
        const optionValue = ref<number>(1)
        const switchValue = ref<number[]>([1, 3])

        const options = ref<OptionGroupOptions>([
            { label: 'Option 1', value: 1, color: 'dl-color-positive' },
            { label: 'Option 2', value: 2 },
            { label: 'Option 3', value: 3, tooltip: 'Option tooltip' },
            { label: 'Option 4', value: 4, disabled: true }
        ])

        return {
            optionValue,
            switchValue,
            options
        }
    }
})
</script>
