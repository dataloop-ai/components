<template>
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
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi'
import { DlSmartSearch, DlCheckbox } from '../../components'
import { Query } from '../../components/types'
import { aliases, schema } from './schema'

export default defineComponent({
    name: 'DlSmartSearchDemo',
    components: {
        DlSmartSearch,
        DlCheckbox
    },
    setup() {
        return { aliases, schema }
    },
    data() {
        return {
            switchState: false,
            isLoading: false,
            filters: [
                {
                    label: 'Saved DQL Queries',
                    name: 'saved',
                    queries: [
                        {
                            name: 'Query 1',
                            query: '{"q": 1}'
                        },
                        {
                            name: 'Query 2',
                            query: '{"query2": "query2"}'
                        },
                        {
                            name: 'Query 3',
                            query: '{"query3": "query3"}'
                        },
                        {
                            name: 'Query 4',
                            query: JSON.stringify({
                                aa: 'bb',
                                no: [{ as: 'sa' }, { zz: 'ss' }]
                            })
                        }
                    ]
                },
                {
                    label: 'Recent Searches',
                    name: 'recent',
                    queries: [
                        {
                            name: 'Query 4',
                            query: ''
                        },
                        {
                            name: 'Query 5',
                            query: ''
                        },
                        {
                            name: 'Query 6',
                            query: ''
                        }
                    ]
                },
                {
                    label: 'Suggested Searches',
                    name: 'suggested',
                    queries: [
                        {
                            name: 'Query 7',
                            query: ''
                        },
                        {
                            name: 'Query 8',
                            query: ''
                        },
                        {
                            name: 'Query 9',
                            query: ''
                        }
                    ]
                }
            ]
        }
    },
    methods: {
        handleSearchQuery({ query }: { query: string }) {
            this.isLoading = true
            console.log(`Searching for: ${query}...`)
            const search = setTimeout(() => {
                console.log(`Results: ${query}`)
                this.isLoading = false
            }, 2000)
        },
        handleSaveQuery(query: Query) {
            const saveQueryIndex = this.filters[0].queries.findIndex(
                (q: Query) => q.name === query.name || q.query === query.query
            )
            if (saveQueryIndex !== -1) {
                this.filters[0].queries[saveQueryIndex] = query
            } else {
                this.filters[0].queries.push(query)
            }
        },

        handleRemoveQuery(query: Query) {
            this.filters[0].queries = this.filters[0].queries.filter(
                (q: Query) => q.name !== query.name
            )
        }
    }
})
</script>

<style scoped>
.prop {
    font-size: 12px;
    width: 80px;
    margin: 30px 0px;
}
.props {
    display: flex;
}
</style>
