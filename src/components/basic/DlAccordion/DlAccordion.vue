<template>
    <div
        :id="uuid"
        :class="identifierClass"
        class="accordion"
        :style="accordionContentStyles"
    >
        <dl-accordion-header
            :additional-info="additionalInfo"
            :default-opened="defaultOpened"
            :title="title"
            :font-size="fontSize"
            :font-weight="fontWeight"
            :title-color="titleColor"
            :right-side="rightSide"
            :is-open="isOpen"
            :closed-icon="closedIcon"
            :opened-icon="openedIcon"
            data-test-id="accordion-header"
            :background-color="backgroundColor"
            :with-background="withBackground"
            @click="handleClick"
        >
            <template #header>
                <slot name="header" />
            </template>
        </dl-accordion-header>
        <div
            ref="dlAccordionContent"
            class="accordion-content"
            :class="{
                closed: !isOpen,
                'right-side': rightSide,
                'accordion-content__border': separator
            }"
        >
            <slot v-if="isOpen && !isEmpty" />
            <dl-empty-state v-if="isOpen && isEmpty" v-bind="emptyStateProps">
                <template v-for="(_, slot) in $slots" #[slot]="props">
                    <slot :name="slot" v-bind="props" />
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
import { getColor } from '../../../../utils'

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
        fontWeight: { type: String, default: '400' },
        titleColor: { type: String, default: 'dell-gray-600' },
        modelValue: { type: Boolean, default: null },
        rightSide: { type: Boolean, default: false },
        isEmpty: Boolean,
        emptyStateProps: {
            type: Object as PropType<DlEmptyStateProps>,
            default: () => accordionEmptyStateProps
        },
        separator: { type: Boolean, default: false },
        closedIcon: { type: String, default: 'icon-dl-right-chevron' },
        openedIcon: { type: String, default: 'icon-dl-down-chevron' },
        backgroundColor: { type: String, default: 'dl-color-fill' },
        withBackground: { type: Boolean, default: false },
        iconHoverColor: { type: String, default: 'dl-color-primary' }
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
        },
        accordionContentStyles(): Record<string, string> {
            return {
                '--dl-color-accordion-content-background':
                    this.withBackground && this.isOpen
                        ? getColor(this.backgroundColor)
                        : '',
                '--dl-accordion-content-padding': this.withBackground
                    ? '16px'
                    : '0 16px 15px 38px',
                '--dl-accordion-content-border-radius': this.withBackground
                    ? '4px'
                    : '',
                '--dl-accordion-margin-left': this.withBackground
                    ? '12px'
                    : '0px'
            }
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
    margin-left: var(--dl-accordion-margin-left);
}
.accordion-content {
    text-align: left;
    font-size: var(--dl-font-size-body);
    transition: all 300ms;
    line-height: 16px;
    padding: var(--dl-accordion-content-padding, 0 16px 15px 38px);
    color: var(--dell-gray-800);
    max-height: fit-content;
    overflow: hidden;
    &__border {
        border-bottom: 1px solid var(--dell-gray-300);
    }
    &.right-side {
        padding: 0 38px 16px 16px;
    }
    &.closed {
        border-color: transparent;
        padding-bottom: 0;
    }
    background-color: var(--dl-color-accordion-content-background);
    border-radius: var(--dl-accordion-content-border-radius);
}
</style>
