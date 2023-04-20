import { useArgs } from '@storybook/client-api'
import { computed, ref } from 'vue'
import { DlDateTimeRange, DlSwitch } from '../'

export default {
    title: 'Library/Components/DlDateTimeRange',
    component: DlDateTimeRange,
    argTypes: {
        modelValue: {
            name: 'modelValue',
            defaultValue: null,
            control: 'object',
            description: 'A DateInterval object',
            table: {
                type: { summary: Object },
                defaultValue: { summary: null }
            }
        },
        showTime: {
            name: 'showTime',
            defaultValue: false,
            description: 'Triggers the Time Picker',
            control: 'boolean',
            table: {
                type: { summary: Boolean },
                defaultValue: { summary: false }
            }
        },
        mode: {
            name: 'mode',
            defaultValue: 'single',
            description: 'Date & Time Range mode',
            options: ['single', 'multi'],
            control: {
                type: 'radio'
            },
            table: {
                type: { summary: ['single', 'multi'] },
                defaultValue: { summary: 'single' }
            }
        },
        type: {
            name: 'type',
            defaultValue: 'single',
            description: 'Date & Time Range type',
            options: ['day', 'month'],
            control: {
                type: 'radio'
            },
            table: {
                type: { summary: ['day', 'month'] },
                defaultValue: { summary: 'day' }
            }
        },
        datePickerCardWidth: {
            name: 'datePickerCardWidth',
            type: { name: 'string', required: false },
            defaultValue: '590px',
            description: 'Specifies the width of the date picker card',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: '590px' }
            },
            control: 'text'
        },
        withSelectedOption: {
            name: 'withSelectedOption',
            defaultValue: false,
            description:
                'Used with mode = "multi". Shows the selected option in the text box',
            control: 'boolean',
            table: {
                type: { summary: Boolean },
                defaultValue: { summary: false }
            }
        },
        disabled: {
            name: 'disabled',
            defaultValue: false,
            description: 'disabled',
            control: 'boolean',
            table: {
                type: { summary: Boolean },
                defaultValue: { summary: false }
            }
        },
        autoClose: {
            name: 'autoClose',
            defaultValue: false,
            description:
                'Close the component after a date or a range of dates is selected',
            control: 'boolean',
            table: {
                type: { summary: Boolean },
                defaultValue: { summary: false }
            }
        },
        availableRange: {
            name: 'availableRange',
            defaultValue: null,
            description:
                'An object with the keys "from" and "to" (with JS Date objects as values) setting a specific range within which the user will be able to select.',
            control: 'object',
            table: {
                type: { summary: Object },
                defaultValue: { summary: null }
            }
        },
        placeholder: {
            name: 'placeholder',
            type: { name: 'string', required: false },
            defaultValue: 'Set Due Date',
            description: 'Specifies the placeholder for the input',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'Set Due Date' }
            },
            control: 'text'
        }
    }
}

const Template = (args) => {
    const [_, setArgs] = useArgs()

    return {
        components: { DlDateTimeRange, DlSwitch },
        setup() {
            const availableRange = ref({
                from: new Date('2023-01-01T12:39:55.854Z'),
                to: new Date('2023-03-15T12:39:55.854Z')
            })

            const handleSetType = (value) => {
                setArgs({ type: value })
            }

            const setRangeFrom = ({ target }) => {
                availableRange.value = {
                    from: target.value ? new Date(target.value) : null,
                    to: availableRange.value?.to
                }
            }

            const setRangeTo = ({ target }) => {
                availableRange.value = {
                    to: target.value ? new Date(target.value) : null,
                    from: availableRange.value?.from
                }
            }

            const updateModelValue = (value) => {
                console.log(value)
            }

            return {
                args,
                availableRange,
                setRangeFrom,
                setRangeTo,
                handleSetType,
                updateModelValue
            }
        },
        template: `
        <div class="dl-dtr">
        <div class="dl-dtr--options">
            
            <div style="margin-top: 10px" class="dl-dtr--option__range">
                <span class="dl-dtr--option_title">Available Range: </span>
                <br />
                <span>From</span>
                <input
                    type="date"
                    :value="availableRange.from?.toISOString()?.split('T')[0]"
                    class="dl-dtr--range-input"
                    placeholder="from"
                    @input="setRangeFrom"
                />
                <span style="margin-left: 5px">To</span>
                <input
                    type="date"
                    :value="availableRange.to?.toISOString()?.split('T')[0]"
                    class="dl-dtr--range-input"
                    placeholder="to"
                    @input="setRangeTo"
                />
            </div>
        </div>
        <div class="dl-dtr--input">
            <dl-date-time-range
                v-bind="args"
                :available-range="availableRange"
                @set-type="handleSetType"
                @update:modelValue="updateModelValue"
            />
        </div>
    </div>
      `
    }
}

export const Preview = Template.bind({})
Preview.args = {
    type: 'day',
    mode: 'single',
    showTime: false,
    autoClose: false
}
