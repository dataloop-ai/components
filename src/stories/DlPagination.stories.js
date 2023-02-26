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
        maxPages: {
            name: 'maxPages',
            type: { name: 'number', required: false, min: 0 },
            defaultValue: 0,
            control: 'number',
            description:
                'Maximum number of page links to display at a time; 0 means Infinite',
            table: {
                type: { summary: 'number' },
                defaultValue: { summary: 0 }
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
    totalItems: 375,
    maxPages: 6,
    boundaryNumbers: true,
    boundaryLinks: true,
    directionLinks: true,
    disabled: false
}
