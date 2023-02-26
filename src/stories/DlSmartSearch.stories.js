import { ref } from 'vue-demi'
import { DlSmartSearch } from '../'
import {
    aliases,
    schema,
    colorSchema,
    status
} from './mocks/DlSmartSearch/schema'
import { initFilters } from './mocks/DlSmartSearch/filters'

export default {
    title: 'Library/Components/DlSmartSearch',
    component: DlSmartSearch,
    argTypes: {
        aliases: {
            name: 'aliases',
            type: { name: 'array', required: true },
            defaultValue: aliases,
            description: 'The array of aliases',
            table: {
                type: { summary: 'array' },
                defaultValue: { summary: aliases }
            }
        },
        schema: {
            name: 'schema',
            type: { name: 'object', required: true },
            defaultValue: schema,
            description: 'The schema object',
            table: {
                type: { summary: 'object' },
                defaultValue: { summary: schema }
            }
        },
        colorSchema: {
            name: 'colorSchema',
            type: { name: 'object', required: true },
            defaultValue: colorSchema,
            description: 'The color schema object',
            table: {
                type: { summary: 'object' },
                defaultValue: { summary: colorSchema }
            }
        },
        status: {
            name: 'status',
            type: { name: 'object', required: true },
            defaultValue: status,
            description: 'The schema object',
            table: {
                type: { summary: 'object' },
                defaultValue: { summary: status }
            }
        }
    }
}

const Template = (args) => ({
    components: { DlSmartSearch },
    setup() {
        const smartSearch = ref(0)
        const isLoading = ref(false)
        const filters = ref(initFilters)

        const handleSearchQuery = ({ query }) => {
            isLoading.value = true
            console.log(`Searching for: ${query}...`)
            const search = setTimeout(() => {
                console.log(`Results: ${query}`)
                isLoading.value = false
            }, 2000)
        }

        const handleSaveQuery = (query) => {
            const saveQueryIndex = filters.value[0].queries.findIndex(
                (q) => q.name === query.name || q.query === query.query
            )
            if (saveQueryIndex !== -1) {
                filters.value[0].queries[saveQueryIndex] = query
            } else {
                filters.value[0].queries.push(query)
            }
        }

        const handleRemoveQuery = (query) => {
            filters.value[0].queries = filters.value[0].queries.filter(
                (q) => q.name !== query.name
            )
        }

        return {
            args,
            smartSearch,
            isLoading,
            filters,
            handleSearchQuery,
            handleSaveQuery,
            handleRemoveQuery
        }
    },
    template: `
         <dl-smart-search
         v-bind="args"
         :filters="filters"
         :isLoading="isLoading"
         :disabled="switchState"
         @remove-query="handleRemoveQuery"
         @save-query="handleSaveQuery"
         @search-query="handleSearchQuery"
        />
    `
})

export const Preview = Template.bind({})
