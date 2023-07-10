<template>
    <div class="dl-stepper-footer">
        <slot name="footer">
            <div class="dl-stepper-footer__left-actions">
                <dl-button
                    :disabled="disabledPrevStep"
                    :tooltip="prevStepDisabledTooltip"
                    outlined
                    :colors-object="prevButtonColorsObject"
                    :label="prevLabel"
                    @click="$emit('prev')"
                />
                <dl-button
                    :disabled="disabledNextStep"
                    :tooltip="nextStepDisabledTooltip"
                    class="justify-end"
                    outlined
                    :label="nextLabel"
                    @click="$emit('next')"
                />
            </div>
            <div class="dl-stepper-footer__right-actions">
                <dl-button
                    filled
                    :label="doneButtonLabel"
                    :disabled="!finished"
                    @click="$emit('done')"
                />
            </div>
        </slot>
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue-demi'
import { DlButton } from '../../../basic'
import { ButtonState, ButtonPart, ButtonColors } from '../../../basic/types'

export default defineComponent({
    name: 'DlStepperFooter',
    components: {
        DlButton
    },
    props: {
        finished: Boolean,
        doneButtonLabel: {
            type: String,
            required: false,
            default: 'Done'
        },
        prevButtonLabel: {
            type: String,
            required: false,
            default: ''
        },
        nextButtonLabel: {
            type: String,
            required: false,
            default: ''
        },
        nextStepDisabledTooltip: {
            type: String,
            required: false,
            default: ''
        },
        prevStepDisabledTooltip: {
            type: String,
            required: false,
            default: ''
        },
        disabledNextStep: Boolean,
        disabledPrevStep: Boolean
    },
    emits: ['close', 'done', 'next', 'prev'],
    data(): {
        prevButtonColorsObject: ButtonColors
    } {
        return {
            prevButtonColorsObject: {
                [ButtonState.Active]: {
                    [ButtonPart.Text]: 'var(--dl-color-darker)',
                    [ButtonPart.Background]: 'var(--dl-color-transparent)',
                    [ButtonPart.Border]: 'var(--dl-color-separator)'
                },
                [ButtonState.Hover]: {
                    [ButtonPart.Text]: 'var(--dl-color-hover)',
                    [ButtonPart.Background]: 'var(--dl-color-transparent)',
                    [ButtonPart.Border]: 'var(--dl-color-hover)'
                },
                [ButtonState.Pressed]: {
                    [ButtonPart.Text]: 'var(--dl-color-secondary)',
                    [ButtonPart.Background]: 'var(--dl-color-transparent)',
                    [ButtonPart.Border]: 'var(--dl-color-secondary)'
                },
                [ButtonState.Disabled]: {
                    [ButtonPart.Text]: 'var(--dl-color-disabled)',
                    [ButtonPart.Background]: 'var(--dl-color-transparent)',
                    [ButtonPart.Border]: 'var(--dl-color-separator)'
                }
            }
        }
    },
    computed: {
        nextLabel(): string {
            let label = 'Next'
            if (this.nextButtonLabel) {
                label = label + `: ${this.nextButtonLabel}`
            }

            return label
        },
        prevLabel(): string {
            let label = 'Back'
            if (this.prevButtonLabel) {
                label = label + `: ${this.prevButtonLabel}`
            }

            return label
        }
    }
})
</script>
<style lang="scss" scoped>
.dl-stepper-footer {
    background-color: var(--dl-color-panel-background);
    display: flex;
    justify-content: space-between;
    margin-top: auto;
    position: sticky;
    z-index: 1;
    align-items: center;
    padding: 16px 50px;
    border-top: 1px solid var(--dl-color-separator);
    gap: 15px;
    right: 0;
    left: 0;
    top: 0;
    overflow: auto;

    &__left-actions,
    &__left-actions {
        display: flex;
        gap: 15px;
    }
}
</style>
