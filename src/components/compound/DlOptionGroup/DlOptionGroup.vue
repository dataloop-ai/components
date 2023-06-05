<template>
    <div
        :id="uuid"
        :class="{ 'option-group-wrapper': true, column: !inline }"
        :style="cssVars"
    >
        <component
            :is="wrappers[isInMenu ? 'menuItem' : 'label']"
            v-for="(option, index) in options"
            :key="option.value"
            class="option"
            :left-label="leftLabel"
            :for="individualProps[index].id"
            data-test="item-wrapper"
            :class="{ disabled: individualProps[index].disabled || disabled }"
        >
            <div
                :for="individualProps[index].id"
                style="display: inline-flex; gap: 5px"
            >
                <span>{{ option.label }}</span>
                <span
                    v-if="!!option.tooltip && !!option.tooltip.length"
                    style="display: flex; align-items: center"
                >
                    <dl-icon
                        icon="icon-dl-info"
                        class="tooltip-icon"
                        size="12px"
                    />
                    <dl-tooltip>
                        {{ option.tooltip }}
                    </dl-tooltip>
                </span>
            </div>
            <component
                :is="components[type]"
                :id="individualProps[index].id"
                v-bind="individualProps[index]"
                :ref="`control-item-${index}`"
                data-test="item-control-element"
                :model-value="modelValue"
                class="control-element"
                :color="individualProps[index].color || color"
                :disabled="individualProps[index].disabled || disabled"
                :label="null"
                @update:model-value="handleUpdate"
            />
        </component>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue-demi'
import { components, typeValidator, optionsValidator, wrappers } from './utils'
import {
    DlOptionGroupOptions,
    DlOptionProps,
    DlSelectedValueType
} from './types'
import { loggerFactory } from '../../../utils'
import { v4 } from 'uuid'
import { DlIcon, DlTooltip } from '../../essential'

export default defineComponent({
    name: 'DlOptionGroup',
    components: {
        DlIcon,
        DlTooltip
    },
    model: {
        prop: 'modelValue',
        event: 'update:model-value'
    },
    props: {
        color: { type: String, default: 'dl-color-secondary' },
        disabled: { type: Boolean, default: false },
        inline: { type: Boolean, default: false },
        leftLabel: { type: Boolean, default: false },
        maxWidth: { type: String, default: '100%' },
        options: {
            type: Array as PropType<DlOptionGroupOptions>,
            required: true,
            validator: optionsValidator
        },
        type: { type: String, default: 'radio', validator: typeValidator },
        modelValue: { type: [Array, String, Number, Boolean], required: true }
    },
    data() {
        const logger = loggerFactory('DlOptionGroup')
        return {
            uuid: `dl-option-group-${v4()}`,
            logger,
            components,
            wrappers
        }
    },
    computed: {
        individualProps(): (DlOptionProps & { id: string })[] {
            return this.options.map((option) => {
                const { value, label, ...rest } = option
                return {
                    value,
                    id: `${v4()}`,
                    ...rest
                }
            })
        },
        isInMenu(): boolean {
            return (
                this.$parent?.$parent?.$options.name === 'DlMenu' ||
                this.$parent?.$options.name === 'DlList'
            )
        },
        cssVars(): Record<string, string> {
            return {
                '--option-flex-direction': this.leftLabel
                    ? 'row'
                    : 'row-reverse',
                '--option-justify-content':
                    this.leftLabel && !this.inline
                        ? 'space-between'
                        : 'flex-end',
                '--option-group-width':
                    this.leftLabel && !this.inline ? '100%' : 'auto',
                '--option-group-max-width': this.maxWidth
            }
        }
    },
    watch: {
        $props: {
            immediate: true,
            handler() {
                this.validateProps()
            }
        }
    },
    methods: {
        validateProps() {
            if (this.type !== 'radio' && !Array.isArray(this.modelValue)) {
                this.logger.error(
                    'Option group with multiple choices should have an array of options as modelValue.'
                )
            }
        },
        handleUpdate(newValue: DlSelectedValueType, e: Event) {
            this.$emit('update:model-value', newValue, e)
        }
    },
    template: 'dl-option-group'
})
</script>

<style scoped lang="scss">
.control-element {
    display: flex;
    align-items: center;
}

.tooltip-icon {
    color: var(--dl-color-medium);
    display: flex !important;
    align-self: center;
}
.option-group-wrapper {
    display: inline-flex;
    width: var(--option-group-width);
    max-width: var(--option-group-max-width);
    gap: 20px;
}
.option-group-wrapper.column {
    flex-direction: column;
    gap: 10px;
}

.option {
    display: flex;
    align-items: center;
    flex-direction: var(--option-flex-direction);
    justify-content: var(--option-justify-content);
    font-size: var(--dl-font-size-body);
    user-select: none;
    color: var(--dl-color-darker);
    gap: 10px;
}

.disabled {
    cursor: not-allowed;
    & label {
        cursor: not-allowed;
    }
    color: var(--dl-color-disabled);
}
</style>
