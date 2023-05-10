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
            filters: {
                saved: [
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
                ],
                recent: [],
                suggested: []
            }
        }
    },
    methods: {
        handleSearchQuery(query: Query, queryString: string) {
            this.isLoading = true
            console.log(`Searching for: ${query.query}...`)
            const search = setTimeout(() => {
                console.log(`Results: ${query.query}`)
                this.isLoading = false
            }, 2000)

            if (this.filters.recent.at(-1)?.name !== queryString) {
                this.filters.recent.push({
                    name: queryString || query.name,
                    query: query.query
                })
            }
        },
        handleSaveQuery(query: Query, type: string) {
            const saveQueryIndex = this.filters[
                type as keyof typeof this.filters
            ].findIndex(
                (q: Query) => q.name === query.name || q.query === query.query
            )
            if (saveQueryIndex !== -1) {
                this.filters[type as keyof typeof this.filters][
                    saveQueryIndex
                ] = query
            } else {
                this.filters[type as keyof typeof this.filters].push(query)
            }
        },

        handleRemoveQuery(query: Query, type: string) {
            this.filters[type as keyof typeof this.filters] = this.filters[
                type as keyof typeof this.filters
            ].filter((q: Query) => q.name !== query.name)
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
