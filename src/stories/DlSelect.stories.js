import { DlSelect, DlChip, DlIcon } from '../'
import { action } from '@storybook/addon-actions'

export default {
    title: 'Library/Components/DlSelect',
    component: DlSelect,
    argTypes: {
        fit: {
            name: 'fit',
            defaultValue: true,
            description:
                'Allows the options to match at least the full width of its target',

            control: 'boolean',
            table: {
                type: { summary: Boolean },
                defaultValue: { summary: true }
            }
        },
        capitalizedOptions: {
            name: 'capitalizedOptions',
            defaultValue: false,
            description: 'Capitalize all options inside the select',
            control: 'boolean',
            table: {
                type: { summary: Boolean },
                defaultValue: { summary: false }
            }
        },
        alignRight: {
            name: 'alignRight',
            defaultValue: false,
            description: 'Align the text inside the select on the right side',
            control: 'boolean',
            table: {
                type: { summary: Boolean },
                defaultValue: { summary: false }
            }
        },
        search: {
            name: 'search',
            defaultValue: false,
            description: 'Have a search icon inside the select',
            control: 'boolean',
            table: {
                type: { summary: Boolean },
                defaultValue: { summary: false }
            }
        },
        multiselect: {
            name: 'multiselect',
            defaultValue: false,
            description: 'Allow the user to select multiple values',
            control: 'boolean',
            table: {
                type: { summary: Boolean },
                defaultValue: { summary: false }
            }
        },
        withoutBorders: {
            name: 'withoutBorders',
            defaultValue: false,
            description: 'The select will have no borders',
            control: 'boolean',
            table: {
                type: { summary: Boolean },
                defaultValue: { summary: false }
            }
        },
        highlightSelected: {
            name: 'highlightSelected',
            defaultValue: false,
            description: 'Highlight the selected option',
            control: 'boolean',
            table: {
                type: { summary: Boolean },
                defaultValue: { summary: false }
            }
        },
        redAsterisk: {
            name: 'redAsterisk',
            defaultValue: false,
            description: 'Show a red asterisk on the select',
            control: 'boolean',
            table: {
                type: { summary: Boolean },
                defaultValue: { summary: false }
            }
        },
        allItemsOption: {
            name: 'allItemsOption',
            defaultValue: false,
            description:
                'Shows an option to select all items when the multiselect prop is active',
            control: 'boolean',
            table: {
                type: { summary: Boolean },
                defaultValue: { summary: false }
            }
        },
        allItemsOptionLabel: {
            name: 'allItemsOptionLabel',
            defaultValue: false,
            description: 'The text to be shown as the All Items option',
            control: 'text',
            table: {
                type: { summary: String },
                defaultValue: { summary: '' }
            }
        },
        placeholder: {
            name: 'placeholder',
            defaultValue: '',
            description: 'The text to be shown as a placeholder in the select',
            control: 'text',
            table: {
                type: { summary: String },
                defaultValue: { summary: '' }
            }
        },
        dropdownIcon: {
            name: 'dropdownIcon',
            defaultValue: 'icon-dl-down-chevron',
            description:
                'The name of the DL icon to be shown as the dropdown icon',
            control: 'text',
            table: {
                type: { summary: String },
                defaultValue: { summary: '' }
            }
        },
        topMessage: {
            name: 'topMessage',
            defaultValue: '',
            description: 'A message appearing at the top of the select',
            control: 'text',
            table: {
                type: { summary: String },
                defaultValue: { summary: '' }
            }
        },
        tooltip: {
            name: 'tooltip',
            defaultValue: '',
            description:
                'The text to be shown in a tooltip when hovering over info icon',
            control: 'text',
            table: {
                type: { summary: String },
                defaultValue: { summary: '' }
            }
        },
        infoMessage: {
            name: 'infoMessage',
            defaultValue: '',
            description: 'Some text to be shown below the select',
            control: 'text',
            table: {
                type: { summary: String },
                defaultValue: { summary: '' }
            }
        },
        disabled: {
            name: 'disabled',
            defaultValue: false,
            description: 'The select will be disabled',
            control: 'boolean',
            table: {
                type: { summary: Boolean },
                defaultValue: { summary: false }
            }
        },
        optional: {
            name: 'optional',
            defaultValue: false,
            description: 'Shows the "(Optional)" string near the title',
            control: 'boolean',
            table: {
                type: { summary: Boolean },
                defaultValue: { summary: false }
            }
        },
        emitValue: {
            name: 'emitValue',
            defaultValue: false,
            description: 'The select component will emit the  selected value',
            control: 'boolean',
            table: {
                type: { summary: Boolean },
                defaultValue: { summary: false }
            }
        },
        error: {
            name: 'error',
            defaultValue: false,
            description: 'Surround the select with a red outline',
            control: 'boolean',
            table: {
                type: { summary: Boolean },
                defaultValue: { summary: false }
            }
        },
        errorMessage: {
            name: 'errorMessage',
            defaultValue: '',
            description:
                'An error text to be shown below the select, visible when the error prop is active',
            control: 'text',
            table: {
                type: { summary: String },
                defaultValue: { summary: '' }
            }
        },
        title: {
            name: 'title',
            defaultValue: '',
            description: 'A title displayed above the select',
            control: 'text',
            table: {
                type: { summary: String },
                defaultValue: { summary: '' }
            }
        },
        width: {
            name: 'width',
            defaultValue: '',
            description: 'The width of the select',
            control: 'text',
            table: {
                type: { summary: String },
                defaultValue: { summary: '' }
            }
        },
        size: {
            name: 'size',
            defaultValue: 'm',
            description: 'The size of the select',
            control: 'text',
            table: {
                type: { summary: String },
                defaultValue: { summary: '' }
            }
        },
        preserveSearch: {
            name: 'preserveSearch',
            defaultValue: false,
            description: 'Preserve the search value',
            control: 'boolean',
            table: {
                type: { summary: Boolean },
                defaultValue: { summary: false }
            }
        }
    }
}

const defaultOptions = [
    { label: 'Contributor 1', value: 'c1' },
    { label: 'Contributor 2', value: 'c2' },
    { label: 'Contributor 3', value: 'c3' }
]

const SimpleTemplate = (args) => ({
    components: { DlSelect },
    setup() {
        return { args }
    },
    props: {},
    data() {
        return {
            data: [],
            options: [
                { label: 'Option 1', value: 1 },
                { label: 'Option 2', value: 2 },
                { label: 'Option 3', value: 3 }
            ]
        }
    },
    methods: {
        show: action('show'),
        hide: action('hide'),
        beforeShow: action('before-show'),
        beforeHide: action('before-hide'),
        updateModelValue: action('update:model-value')
    },
    template: `
    <div style='padding: 50px'>
      <dl-select
        :options="options"
        v-model="data"
        v-bind="args"
        @show="show"
        @before-show="beforeShow"
        @hide="hide"
        @before-hide="beforeHide"
        @update:model-value="updateModelValue"
      />
    </div>
  `
})

const CustomContentTemplate = (args) => ({
    components: { DlSelect, DlChip },
    setup() {
        return { args }
    },
    props: {},
    methods: {
        show: action('show'),
        hide: action('hide'),
        beforeShow: action('before-show'),
        beforeHide: action('before-hide'),
        updateModelValue: action('update:model-value')
    },
    data() {
        return {
            options: [
                { label: 'High', value: 'high', bgColor: 'dl-color-negative' },
                {
                    label: 'Medium',
                    value: 'medium',
                    bgColor: 'dl-color-warning',
                    textColor: 'dl-color-darker'
                },
                {
                    label: 'Low',
                    value: 'low',
                    bgColor: 'dl-color-positive',
                    textColor: 'dl-color-darker'
                }
            ],
            selectedOption: {
                label: 'Low',
                value: 'low',
                bgColor: 'dl-color-positive',
                textColor: 'dl-color-darker'
            }
        }
    },
    template: `
    <div style='padding: 50px'>
      <dl-select
        v-model="selectedOption"
        :options="[
            { label: 'High', value: 'high', bgColor: 'dl-color-negative' },
            { label: 'Medium', value: 'medium', bgColor: 'dl-color-warning', textColor: 'dl-color-darker' },
            { label: 'Low', value: 'low', bgColor: 'dl-color-positive', textColor: 'dl-color-darker' },
        ]"
        v-bind="args"
        @show="show"
        @before-show="beforeShow"
        @hide="hide"
        @before-hide="beforeHide"
        @update:model-value="updateModelValue"
      >
        <template #selected="scope">
            <dl-chip
                :text-color="scope.opt.textColor"
                :color="scope.opt.bgColor"
            >
                {{ scope.opt.label }}
            </dl-chip>
        </template>
        <template #option="scope">
            <dl-chip
                :text-color="scope.opt.textColor"
                :color="scope.opt.bgColor"
            >
                {{ scope.opt.label }}
            </dl-chip>
        </template>
      </dl-select>
    </div>
  `
})

const SearchTemplate = (args) => ({
    components: { DlSelect, DlChip },
    setup() {
        return { args }
    },
    props: {},
    data() {
        return {
            searchOptions: defaultOptions,
            selectedBySearch: ''
        }
    },
    methods: {
        filterFn(val) {
            this.searchOptions = defaultOptions.filter(
                (v) => v.label.toLowerCase().indexOf(val.toLowerCase()) > -1
            )
            this.showAllOption =
                this.searchOptions.length === defaultOptions.length
        },
        searchFocus: action('search-focus'),
        searchBlur: action('search-blur'),
        searchInput: action('search-input'),
        show: action('show'),
        hide: action('hide'),
        beforeShow: action('before-show'),
        beforeHide: action('before-hide'),
        updateModelValue: action('update:model-value')
    },
    template: `
    <div style='padding: 50px'>
      <dl-select
          v-model="selectedBySearch"
          :options="searchOptions"
          @filter="filterFn"
          @search-focus="searchFocus"
          @search-blur="searchBlur"
          @search-input="searchInput"
          @show="show"
          @before-show="beforeShow"
          @hide="hide"
          @before-hide="beforeHide"
          @update:model-value="updateModelValue"
          v-bind="args"
      />
    </div>
  `
})

const FilterTemplate = (args) => ({
    components: { DlSelect, DlChip, DlIcon },
    setup() {
        return { args }
    },
    props: {},
    data() {
        return {
            tasksFilter: [],
            selectedByFilteringSearch: []
        }
    },
    methods: {
        show: action('show'),
        hide: action('hide'),
        beforeShow: action('before-show'),
        beforeHide: action('before-hide'),
        updateModelValue: action('update:model-value')
    },
    template: `
    <div style='padding: 50px'>
    <dl-select
        v-model="tasksFilter"
        :options="[{ label: 'Hard', value: 'hard', count: 20 }, { label: 'Medium', value: 'medium', count: 40 }, { label: 'Easy', value: 'easy', count: 50 }]"
        v-bind="args"
        @show="show"
        @before-show="beforeShow"
        @hide="hide"
        @before-hide="beforeHide"
        @update:model-value="updateModelValue"
    >
        <template #prepend>
            <dl-icon
                size="12px"
                icon="icon-dl-filter"
                color="dl-color-lighter"
            />
        </template>
    </dl-select>
    </div>
  `
})

const ChildrenTemplate = (args) => ({
    components: { DlSelect, DlIcon },
    setup() {
        return { args }
    },
    props: {},
    data() {
        return {
            treeOptions: ['hard', 'easy'],
            treeSelectedOptions: []
        }
    },
    methods: {
        show: action('show'),
        hide: action('hide'),
        beforeShow: action('before-show'),
        beforeHide: action('before-hide'),
        updateModelValue: action('update:model-value')
    },
    template: `
    <div style='padding: 50px'>
    <dl-select
        v-model="treeSelectedOptions"
        :options="[{
        label: 'root',
        value: 'root',
        children: [
            { label: 'child 1', value: 'c6' },
            { label: 'child 2', value: 'c7' },
            {
                label: 'child 3',
                value: 'c8',
                children: [
                    { label: 'child 4', value: 'c9' },
                    { label: 'child 5', value: 'c10' }
                ]
            }
        ]
     }]"
        @show="show"
        @before-show="beforeShow"
        @hide="hide"
        @before-hide="beforeHide"
        @update:model-value="updateModelValue"
        v-bind="args"
    >
        <template #prepend>
            <dl-icon
                size="12px"
                icon="icon-dl-filter"
                color="dl-color-lighter"
            />
        </template>
    </dl-select>
    </div>
  `
})

export const SimpleSelect = SimpleTemplate.bind({})
SimpleSelect.args = {
    placeholder: 'Select An Option',
    width: '300px'
}

export const SelectWithoutBorders = CustomContentTemplate.bind({})
SelectWithoutBorders.args = {
    withoutBorders: true,
    width: '84px',
    alignRight: true
}

export const SelectWithSearch = SearchTemplate.bind({})
SelectWithSearch.args = {
    size: 'm',
    search: true,
    emitVal: true,
    width: '300px'
}

export const SelectWithFilter = FilterTemplate.bind({})
SelectWithFilter.args = {
    size: 'm',
    multiselect: true,
    hasPrepend: true,
    allItemsOption: true,
    clickable: false
}

export const SelectWithChildren = ChildrenTemplate.bind({})
SelectWithChildren.args = {
    size: 'm',
    multiselect: true,
    hasPrepend: true
}

export const SelectWithoutFit = ChildrenTemplate.bind({})
SelectWithoutFit.args = {
    size: 'm',
    multiselect: true,
    hasPrepend: true,
    fit: false
}
