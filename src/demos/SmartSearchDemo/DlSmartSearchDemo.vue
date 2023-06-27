<template>
    <div style="width: 900px">
        <div style="margin: 40px 0">
            <dl-checkbox
                v-model="switchState"
                dense
                label="Disabled"
            />
            <dl-checkbox
                v-model="strictState"
                dense
                label="Strict"
            />
        </div>
        <dl-input
            v-model="textQuery"
            style="width: 220px"
            placeholder="Select option"
            size="m"
        />
        <div
            style="width: 100px"
            class="props"
        />
        createdAt = (26/05/2023) OR dir = 'test AND test OR me Test' AND hidden
        = true
        <br>
        createdAt = (26/05/2023) AND dir = 'test AND test OR me Test' AND hidden
        = true
        <br>
        createdAt = (26/05/2023) AND dir = 'testANDtestORmeTest' AND hidden =
        true
        <dl-smart-search
            v-model="queryObject"
            :aliases="aliases"
            :schema="schema"
            :color-schema="colorSchema"
            :filters="filters"
            :disabled="switchState"
            :is-loading="isLoading"
            :strict="strictState"
            @remove-query="handleRemoveQuery"
            @save-query="handleSaveQuery"
            @search-query="handleSearchQuery"
        />
        {{ queryObject }}
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi'
import { DlSmartSearch, DlCheckbox, DlInput } from '../../components'
import { Query } from '../../components/types'
import { parseSmartQuery } from '../../utils'

export default defineComponent({
    name: 'DlSmartSearchDemo',
    components: {
        DlSmartSearch,
        DlCheckbox,
        DlInput
    },
    data() {
        const schema: any = {
            id: ['string', 'number'],
            filename: 'string',
            name: 'string',
            url: 'string',
            type: 'string',
            dataset: 'string',
            datasetId: 'string',
            dir: 'string',
            thumbnail: 'string',
            createdAt: 'date',
            annotated: 'boolean',
            hidden: 'boolean',
            metadata: {
                system: {
                    width: 'number',
                    height: 'number',
                    '*': 'any'
                },
                test: 'any',
                '*': 'any'
            }
        }

        const colorSchema: any = {
            fields: 'var(--dl-color-secondary)',
            operators: 'var(--dl-color-positive)',
            keywords: 'var(--dl-color-medium)'
        }

        const aliases: any = [
            {
                alias: 'ItemID',
                key: 'id'
            },
            {
                alias: 'ItemHeight',
                key: 'metadata.system.height'
            },
            {
                alias: 'ItemWidth',
                key: 'metadata.system.width'
            }
        ]

        return {
            schema,
            aliases,
            colorSchema,
            switchState: false,
            strictState: false,
            isLoading: false,
            queryObject: {},
            textQuery: '',
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
                        query: '{"age": 12, "name": "john"}'
                    }
                ],
                recent: [],
                suggested: []
            } as { [key: string]: Query[] }
        }
    },
    watch: {
        textQuery(query: string) {
            this.queryObject = parseSmartQuery(query)
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

            if (this.filters.recent[-1]?.name !== queryString) {
                this.filters.recent.push({
                    name: queryString || query.name,
                    query: query.query
                })
            }
        },
        handleSaveQuery(query: Query, type: string) {
            const saveQueryIndex = this.filters[type].findIndex(
                (q: Query) => q.name === query.name || q.query === query.query
            )
            if (saveQueryIndex !== -1) {
                this.filters[type][saveQueryIndex] = query
            } else {
                this.filters[type].push(query)
            }
        },

        handleRemoveQuery(query: Query, type: string) {
            this.filters[type] = this.filters[type].filter(
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
