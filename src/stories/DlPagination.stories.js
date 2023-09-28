import { ref } from 'vue'
import { DlPagination } from '..'

export default {
    title: 'Library/Components/DlPagination',
    component: DlPagination,
    argTypes: {
        min: {
            name: 'min',
            type: { name: 'number', required: false, min: 1 },
            control: 'number',
            defaultValue: 1,
            description: "Minimum page (must be lower than 'max')",
            table: {
                type: { summary: 'number' },
                defaultValue: { summary: 1 }
            }
        },
        totalItems: {
            name: 'totalItems',
            type: { name: 'number', required: true },
            control: 'number',
            description: 'Total number of items (rows)',
            table: {
                type: { summary: 'number' }
            }
        },
        maxDisplayRange: {
            name: 'maxDisplayRange',
            type: { name: 'number', required: false, min: 0 },
            defaultValue: 7,
            control: 'number',
            description:
                'Maximum number of page links to display at a time; 0 means Infinite',
            table: {
                type: { summary: 'number' },
                defaultValue: { summary: 7 }
            }
        },
        rowsPerPage: {
            name: 'rowsPerPage',
            type: { name: 'number', required: false },
            defaultValue: 10,
            control: 'number',
            description: 'Number of rows displayed per page',
            table: {
                type: { summary: 'number' },
                defaultValue: { summary: 10 }
            }
        },
        rowsPerPageOptions: {
            name: 'rowsPerPageOptions',
            type: { name: 'array', required: false },
            defaultValue: [10, 25, 50, 75, 100],
            control: 'array',
            description: 'Array of rows per page options',
            table: {
                type: { summary: 'array' },
                defaultValue: { summary: [10, 25, 50, 75, 100] }
            }
        },
        disabled: {
            name: 'disabled',
            type: { name: 'boolean', required: false },
            control: 'boolean',
            defaultValue: false,
            description:
                'Specifies if the pagination should be disabled or not',
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: false }
            }
        },
        boundaryNumbers: {
            name: 'boundaryNumbers',
            type: { name: 'boolean', required: false },
            control: 'boolean',
            defaultValue: false,
            description: 'Always show first and last page buttons',
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: false }
            }
        },
        boundaryLinks: {
            name: 'boundaryLinks',
            type: { name: 'boolean', required: false },
            control: 'boolean',
            defaultValue: false,
            description: 'Show boundary button links',
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: false }
            }
        },
        directionLinks: {
            name: 'directionLinks',
            type: { name: 'boolean', required: false },
            control: 'boolean',
            defaultValue: false,
            description: 'Show direction buttons',
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: false }
            }
        },
        color: {
            name: 'color',
            type: { name: 'string', required: false },
            defaultValue: 'dl-color-bg',
            description: 'The background color of the buttons',
            control: {
                type: 'color'
            },
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'dl-color-bg' }
            }
        },
        textColor: {
            name: 'textColor',
            type: { name: 'string', required: false },
            defaultValue: 'dl-color-darker',
            description: 'The text color of the buttons',
            control: {
                type: 'color'
            },
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'dl-color-darker' }
            }
        },
        activeColor: {
            name: 'activeColor',
            type: { name: 'string', required: false },
            defaultValue: 'dl-color-secondary',
            description: 'The background color of the active button',
            control: {
                type: 'color'
            },
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'dl-color-secondary' }
            }
        },
        activeTextColor: {
            name: 'activeTextColor',
            type: { name: 'string', required: false },
            defaultValue: 'dl-color-text-buttons',
            description: 'The text color of the active button',
            control: {
                type: 'color'
            },
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'dl-color-text-buttons' }
            }
        },
        withQuickNavigation: {
            name: 'withQuickNavigation',
            type: { name: 'boolean', required: false },
            control: 'boolean',
            defaultValue: false,
            description: 'Show quick navigation',
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: false }
            }
        },
        itemsName: {
            name: 'itemsName',
            type: { name: 'string', required: false },
            defaultValue: 'Rows',
            description:
                'The name of the items shown in the Legend and rows per page selector',
            control: {
                type: 'text'
            },
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'Rows' }
            }
        },
        withRowsPerPage: {
            name: 'withRowsPerPage',
            type: { name: 'boolean', required: false },
            control: 'boolean',
            defaultValue: false,
            description: 'Show rows per page',
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: false }
            }
        },
        withLegend: {
            name: 'withLegend',
            type: { name: 'boolean', required: false },
            control: 'boolean',
            defaultValue: false,
            description: 'Show legend',
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: false }
            }
        }
    }
}

const totalItems = 375
const maxDisplayRange = 6

const Template = (args) => ({
    components: { DlPagination },
    setup() {
        const value = ref(14)

        return {
            args,
            value
        }
    },
    template: `
    <div style="padding: 50px">
      <dl-pagination v-model="value" v-bind="args" />
    </div>
    `
})

export const Preview = Template.bind({})
Preview.args = {
    totalItems,
    maxDisplayRange,
    boundaryNumbers: true,
    boundaryLinks: true,
    directionLinks: true,
    disabled: false
}

const DefaultTemplate = (args) => ({
    components: { DlPagination },
    setup() {
        const value = ref(14)

        return {
            args,
            value
        }
    },
    template: `
    <div style="padding: 50px">
      <dl-pagination
          v-model="value" 
          v-bind="args" 
      />
    </div>
    `
})

export const Default = DefaultTemplate.bind({})
Default.args = {
    totalItems,
    maxDisplayRange
}

const DisabledTemplate = (args) => ({
    components: { DlPagination },
    setup() {
        const value = ref(14)

        return {
            args,
            value
        }
    },
    template: `
    <div style="padding: 50px">
      <dl-pagination
          disabled
          v-model="value" 
          v-bind="args" 
      />
    </div>
    `
})

export const Disabled = DisabledTemplate.bind({})
Disabled.args = {
    totalItems,
    maxDisplayRange,
    disabled: true
}

const BoundaryNumbersTemplate = (args) => ({
    components: { DlPagination },
    setup() {
        const value = ref(14)

        return {
            args,
            value
        }
    },
    template: `
    <div style="padding: 50px">
      <dl-pagination
          boundaryNumbers
          v-model="value" 
          v-bind="args" 
      />
    </div>
    `
})

export const BoundaryNumbers = BoundaryNumbersTemplate.bind({})
BoundaryNumbers.args = {
    totalItems,
    maxDisplayRange,
    boundaryNumbers: true
}

const BoundaryLinksTemplate = (args) => ({
    components: { DlPagination },
    setup() {
        const value = ref(14)

        return {
            args,
            value
        }
    },
    template: `
    <div style="padding: 50px">
      <dl-pagination
          boundaryLinks
          v-model="value" 
          v-bind="args" 
      />
    </div>
    `
})

export const BoundaryLinks = BoundaryLinksTemplate.bind({})
BoundaryLinks.args = {
    totalItems,
    maxDisplayRange,
    boundaryLinks: true
}

const DirectionLinksTemplate = (args) => ({
    components: { DlPagination },
    setup() {
        const value = ref(14)

        return {
            args,
            value
        }
    },
    template: `
    <div style="padding: 50px">
      <dl-pagination
          directionLinks
          v-model="value" 
          v-bind="args" 
      />
    </div>
    `
})

export const DirectionLinks = DirectionLinksTemplate.bind({})
DirectionLinks.args = {
    totalItems,
    maxDisplayRange,
    directionLinks: true
}

const WithQuickNavigationTemplate = (args) => ({
    components: { DlPagination },
    setup() {
        const value = ref(14)

        return {
            args,
            value
        }
    },
    template: `
    <div style="padding: 50px">
      <dl-pagination
          withQuickNavigation
          v-model="value" 
          v-bind="args" 
      />
    </div>
    `
})

export const WithQuickNavigation = WithQuickNavigationTemplate.bind({})
WithQuickNavigation.args = {
    totalItems,
    maxDisplayRange,
    withQuickNavigation: true
}

const WithRowsPerPageTemplate = (args) => ({
    components: { DlPagination },
    setup() {
        const value = ref(14)

        return {
            args,
            value
        }
    },
    template: `
    <div style="padding: 50px">
      <dl-pagination
          withRowsPerPage
          v-model="value" 
          v-bind="args" 
      />
    </div>
    `
})

export const WithRowsPerPage = WithRowsPerPageTemplate.bind({})
WithRowsPerPage.args = {
    totalItems,
    maxDisplayRange,
    withRowsPerPage: true
}

const WithLegendTemplate = (args) => ({
    components: { DlPagination },
    setup() {
        const value = ref(14)

        return {
            args,
            value
        }
    },
    template: `
    <div style="padding: 50px">
      <dl-pagination
          withLegend
          v-model="value" 
          v-bind="args" 
      />
    </div>
    `
})

export const WithLegend = WithLegendTemplate.bind({})
WithLegend.args = {
    totalItems,
    maxDisplayRange,
    withLegend: true
}
