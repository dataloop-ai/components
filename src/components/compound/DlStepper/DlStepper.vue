<template>
    <dl-stepper-container
        v-if="isOpen"
        :id="uuid"
        class="dl-stepper-container"
        :style="cssVars"
        :transition="withTransition"
        :duration="transitionDuration"
    >
        <dl-stepper-header
            :header-title="headerTitle"
            :hide-close-btn="hideCloseBtn"
            @close="closeStepper"
        />
        <div class="dl-stepper-content">
            <dl-stepper-sidebar
                :steps="steps"
                :bg-color="bgColor"
                :sidebar-navigation="sidebarNavigation"
                @step-click="$emit('set-step', $event)"
            />
            <div class="dl-stepper-content dl-stepper-content--slot">
                <dl-stepper-content
                    v-if="state"
                    :title="contentTitle"
                    :error="state.error"
                    :completed="state.completed"
                >
                    <template #header>
                        <slot
                            name="content-header"
                            :state="state"
                        />
                    </template>
                    <slot
                        :name="state.value"
                        :state="state"
                    />
                </dl-stepper-content>
                <dl-stepper-footer
                    :finished="isDone"
                    :done-button-label="doneButtonLabel"
                    :next-button-label="nextButtonLabel"
                    :prev-button-label="prevButtonLabel"
                    :disabled-next-step="disabledNextStep"
                    :disabled-prev-step="disabledPrevStep"
                    @next="$emit('next')"
                    @prev="$emit('prev')"
                    @done="$emit('done')"
                    @close="closeStepper"
                />
            </div>
        </div>
    </dl-stepper-container>
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue-demi'
import DlStepperContainer from './components/DlStepperContainer.vue'
import DlStepperHeader from './components/DlStepperHeader.vue'
import DlStepperFooter from './components/DlStepperFooter.vue'
import DlStepperSidebar from './components/DlStepperSidebar.vue'
import DlStepperContent from './components/DlStepperContent.vue'
import { StepState } from './models/interfaces'
import { Step } from './models'
import { getColor } from '../../../utils'
import { v4 } from 'uuid'

export default defineComponent({
    components: {
        DlStepperHeader,
        DlStepperFooter,
        DlStepperSidebar,
        DlStepperContent,
        DlStepperContainer
    },
    model: {
        prop: 'modelValue',
        event: 'update:modelValue'
    },
    props: {
        steps: {
            type: Array as PropType<Step[]>,
            default: () => [] as Step[]
        },
        nextStep: {
            type: Object as PropType<StepState | null>,
            default: () => null as StepState | null
        },
        prevStep: {
            type: Object as PropType<StepState | null>,
            default: () => null as StepState | null
        },
        state: {
            type: Object as PropType<StepState>,
            default: () => {}
        },
        modelValue: {
            type: Boolean,
            default: false
        },
        headerTitle: {
            type: String,
            required: false,
            default: ''
        },
        contentTitle: {
            type: String,
            default: ''
        },
        doneButtonLabel: {
            type: String,
            required: false,
            default: 'Done'
        },
        width: {
            type: String,
            required: false,
            default: '700px'
        },
        bgColor: {
            type: String,
            required: false,
            default: 'dl-color-fill-third'
        },
        withTransition: Boolean,
        transitionDuration: {
            type: Number,
            required: false,
            default: 0.3
        },
        disabledNextStep: Boolean,
        disabledPrevStep: Boolean,
        isDone: Boolean,
        hideCloseBtn: Boolean,
        sidebarNavigation: { type: Boolean, default: true }
    },
    emits: ['update:modelValue', 'done', 'next', 'prev', 'set-step', 'close'],
    data() {
        return {
            uuid: `dl-stepper-${v4()}`,
            isOpen: this.modelValue
        }
    },
    computed: {
        nextButtonLabel(): string {
            return this.nextStep?.title ?? null
        },
        prevButtonLabel(): string {
            return this.prevStep?.title ?? null
        },
        cssVars(): Record<string, string | number> {
            return {
                '--dl-stepper-width': this.width,
                '--dl-stepper-bg': getColor(this.bgColor, 'dl-color-fill-third')
            }
        }
    },
    watch: {
        modelValue(newVal: boolean) {
            this.isOpen = newVal
            if (newVal) document.documentElement.style.overflow = 'hidden'
            else document.documentElement.style.overflow = 'auto'
        }
    },
    methods: {
        closeStepper() {
            this.$emit('close')
            this.$emit('update:modelValue', false)
        }
    }
})
</script>
<style lang="scss" scoped>
.dl-stepper-container {
    height: 100%;
    overflow: auto;
    width: var(--dl-stepper-width);
    display: flex;
    flex-direction: column;
    background-color: var(--dl-color-panel-background);
    border: 1px solid var(--dl-color-separator);
    border-radius: 2px;
}

.dl-stepper-content {
    display: flex;
    flex-grow: 1;
    position: relative;

    &--slot {
        display: flex;
        flex-direction: column;
        overflow: auto;
    }
}
</style>
