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

        const handleSearchQuery = (query, queryString) => {
            isLoading.value = true
            console.log(`Searching for: ${query.query}...`)
            const search = setTimeout(() => {
                console.log(`Results: ${query.query}`)
                isLoading.value = false
            }, 2000)

            if (filters.value.recent.at(-1)?.name !== queryString) {
                filters.value.recent.push({
                    name: queryString || query.name,
                    query: query.query
                })
            }
        }

        const handleSaveQuery = (query, type) => {
            const saveQueryIndex = filters.value[type].findIndex(
                (q) => q.name === query.name || q.query === query.query
            )
            if (saveQueryIndex !== -1) {
                filters.value[type][saveQueryIndex] = query
            } else {
                filters.value[type].push(query)
            }
        }

        const handleRemoveQuery = (query, type) => {
            this.filters[type] = this.filters[type].filter(
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
    <div style="width: 900px">
    <div style="margin: 40px 0">
        <dl-checkbox
            v-model="switchState"
            dense
            label="Disabled"
        />
    </div>
    <div
        style="width: 100px"
        class="props"
    />
    <dl-smart-search
        :aliases="aliases"
        :schema="schema"
        :color-schema="{
            fields: 'blue',
            operators: 'green',
            keywords: 'bold'
        }"
        :filters="filters"
        :disabled="switchState"
        :is-loading="isLoading"
        @remove-query="handleRemoveQuery"
        @save-query="handleSaveQuery"
        @search-query="handleSearchQuery"
    />
    </div>
    `
})

export const Preview = Template.bind({})
