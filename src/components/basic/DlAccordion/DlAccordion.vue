<template>
    <div
        :id="uuid"
        :class="identifierClass"
        class="accordion"
    >
        <dl-accordion-header
            :additional-info="additionalInfo"
            :default-opened="defaultOpened"
            :title="title"
            :font-size="fontSize"
            :title-color="titleColor"
            :right-side="rightSide"
            :is-open="isOpen"
            data-test-id="accordion-header"
            @click="handleClick"
        >
            <template #header>
                <slot name="header" />
            </template>
        </dl-accordion-header>
        <div
            ref="dlAccordionContent"
            class="accordion-content"
            :class="{ closed: !isOpen, 'right-side': rightSide }"
        >
            <slot v-if="isOpen && !isEmpty" />
            <dl-empty-state
                v-if="isOpen && isEmpty"
                v-bind="emptyStateProps"
            >
                <template
                    v-for="(_, slot) in $slots"
                    #[slot]="props"
                >
                    <slot
                        :name="slot"
                        v-bind="props"
                    />
                </template>
            </dl-empty-state>
        </div>
    </div>
</template>

<script lang="ts">
import DlAccordionHeader from './components/AccordionHeader.vue'
import DlEmptyState from '../DlEmptyState/DlEmptyState.vue'
import { DlEmptyStateProps } from '../DlEmptyState/types'
import { defineComponent, PropType } from 'vue-demi'
import { v4 } from 'uuid'

const accordionEmptyStateProps = {
    title: '',
    subtitle: 'No content to show',
    icon: '',
    align: 'left',
    subtitleSize: '12px'
}

export default defineComponent({
    name: 'DlAccordion',
    components: {
        DlAccordionHeader,
        DlEmptyState
    },
    model: {
        prop: 'modelValue',
        event: 'update:model-value'
    },
    props: {
        additionalInfo: { type: String!, default: '' },
        defaultOpened: { type: Boolean, default: false },
        title: { type: String, default: null },
        fontSize: { type: String, default: '12px' },
        titleColor: { type: String, default: 'dl-color-medium' },
        modelValue: { type: Boolean, default: null },
        rightSide: { type: Boolean, default: false },
        isEmpty: Boolean,
        emptyStateProps: {
            type: Object as PropType<DlEmptyStateProps>,
            default: () => accordionEmptyStateProps
        }
    },
    emits: ['update:model-value', 'hide', 'show'],
    data() {
        return {
            uuid: `dl-accordion-${v4()}`,
            isOpen:
                this.modelValue === null ? this.defaultOpened : this.modelValue
        }
    },
    computed: {
        identifierClass(): string {
            return `dl-accordion-${this.title ?? ''}`.replaceAll(' ', '-')
        },
        hasHeaderSlot(): boolean {
            return this.$slots.header !== undefined
        }
    },
    methods: {
        handleClick() {
            if (this.modelValue !== null) {
                this.$emit('update:model-value', !this.isOpen)
            }
            this.$emit(this.isOpen === true ? 'hide' : 'show')
            this.isOpen = !this.isOpen
        }
    }
})
</script>

<style scoped lang="scss">
.accordion {
    max-width: 100%;
}
.accordion-content {
    text-align: left;
    font-size: var(--dl-font-size-body);
    transition: all 300ms;
    line-height: 16px;
    padding: 0 16px 15px 38px;
    color: var(--dl-color-darker);
    border-bottom: 1px solid var(--dl-color-separator);
    max-height: fit-content;
    overflow: hidden;
    &.right-side {
        padding: 0 38px 16px 16px;
    }
    &.closed {
        border-color: transparent;
        padding-bottom: 0;
    }
}
</style>
