<template>
    <div style="width: 900px">
        <div style="margin: 40px 0">
            <dl-checkbox v-model="switchState" dense label="Disabled" />
            <dl-checkbox v-model="strictState" dense label="Strict" />
        </div>
        <dl-input
            v-model="textQuery"
            style="width: 220px"
            placeholder="Select option"
            size="m"
        />
        <div style="width: 100px" class="props" />
        <div>
            Template searches<br />

            dir IN 'test', 'test2'<br />
            type = 'dir'<br />
            { "metadata.system.width": 5 }<br />
        </div>
        <dl-smart-search
            v-model="queryObject"
            :aliases="aliases"
            :schema="schema2"
            :color-schema="colorSchema"
            :filters="filters"
            :disabled="switchState"
            :is-loading="isLoading"
            :strict="strictState"
            style="width: 600px"
            @remove-query="handleRemoveQuery"
            @save-query="handleSaveQuery"
            @search-query="handleSearchQuery"
        />
        {{ queryObject }}

        <br />
        <br />
        <br />
        <br />
        Only the search

        <dl-smart-search-input
            v-model="queryObject"
            no-tooltip
            :aliases="aliases"
            :schema="schema"
            :color-schema="colorSchema"
            :strict="strictState"
            :disabled="switchState"
            placeholder="THIS IS A PLACEHOOOOOOOOLDER"
            @search="onSearchEmitted"
        />

        <div>
            <div>EMITED SEARCH:</div>
            <div>count {{ searchEmitted }} last: {{ lastSearch }}</div>
        </div>

        <dl-smart-search-input
            v-model="queryObject2"
            :aliases="aliases"
            :schema="schema2"
            :color-schema="colorSchema"
            :strict="strictState"
            :disabled="switchState"
        />
        {{ queryObject }}
        {{ queryObject2 }}

        <br />
        <br />
        With placeholder and [OR, true] suggestions omitted
        <dl-smart-search-input
            v-model="queryObject"
            :aliases="aliases"
            :schema="schema"
            :color-schema="colorSchema"
            :strict="strictState"
            :disabled="switchState"
            :omit-suggestions="['OR', 'true']"
            placeholder="I am a placeholder"
        />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi'
import {
    DlSmartSearch,
    DlSmartSearchInput,
    DlCheckbox,
    DlInput
} from '../../components'
import { DlSmartSearchFilter, Query } from '../../components/types'
import { parseSmartQuery } from '../../utils'

export default defineComponent({
    name: 'DlSmartSearchDemo',
    components: {
        DlSmartSearch,
        DlSmartSearchInput,
        DlCheckbox,
        DlInput
    },
    data() {
        const numbersArr: string[] = []
        for (let i = 0; i < 1000; i++) {
            numbersArr.push('' + i)
        }
        const schema: any = {
            'very very very very very very long key': 'string',
            'very very very very very very long key  very very very very very very long key very very very very very very long key very very very very very very long key very very very very very very long key':
                'string',
            'very very very very very very long key  very very very very very very long key very very very very very very long key very very very very very very long key very very very very very very long keyvery very very very very very long key very very very very very very long key very very very very very very long key very very very very very very long keyvery very very very very very long key very very very very very very long key very very very very very very long key very very very very very very long keyvery very very very very very long key very very very very very very long key very very very very very very long key very very very very very very long keyvery very very very very very long key very very very very very very long key very very very very very very long key very very very very very very long keyvery very very very very very long key very very very very very very long key very very very very very very long key very very very very very very long key very very very very very very long key very very very very very very long key very very very very very very long key very very very very very very long key':
                'string',
            id: ['string', 'number'],
            filename: 'string',
            name: ['string', { Voltaire: 'Arouet' }],
            url: 'string',
            dataset: 'string',
            datasetId: 'string',
            dir: 'string',
            thumbnail: 'string',
            createdAt: 'date',
            date2: 'date',
            annotated: 'boolean',
            hidden: 'boolean',
            metadata: {
                name: ['string', { Voltaire: 'Arouet' }],
                system: {
                    width: 'number',
                    height: 'number',
                    '*': 'any'
                },
                test: 'any',
                '*': 'any'
            },
            type: ['dir', 'file'],
            test0: ['why wont', 'this work', 123, '1\' = 12"'],
            test1: [...numbersArr, 'number'],
            test2: ['true', 'false']
        }
        const schema2: any = {
            value: [
                'string',
                {
                    John: 'AB34',
                    Connor: '42'
                }
            ],
            nested: {
                value: [
                    'string',
                    {
                        John: 'AB34',
                        Connor: '42'
                    }
                ]
            },
            only_va: [
                {
                    'String Value': '12345',
                    'Numeric Value': 12345
                }
            ],
            type: [
                'class',
                'point',
                'line',
                'box',
                'cube',
                'segment',
                'ellipse',
                'binary',
                'note',
                'polyline',
                'comparison',
                'recording',
                'subtitle',
                'item_description',
                'text_mark',
                'pose',
                'cube_3d',
                'semantic_3d',
                'polyline_3d',
                'string'
            ],
            label: 'string',
            itemId: 'string',
            creator: 'string',
            parentId: ['null', 'string'],
            attributes: ['string', 'number', 'object', 'boolean'],
            metadata: {
                system: {
                    attributes: ['string', 'number', 'object', 'boolean'],
                    status: 'string',
                    '*': 'any'
                },
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
                alias: 'Item.Height',
                key: 'metadata.system.height'
            },
            {
                alias: 'ItemWidth',
                key: 'metadata.system.width'
            }
        ]
        const filters: DlSmartSearchFilter[] = [
            {
                label: 'Query 1',
                value: { q: 1 }
            },
            {
                label: 'Query 2',
                value: { query2: 'query2' }
            },
            {
                label: 'Query 3 with an incredibly long query name to test the text overflow in the menu',
                value: { query3: 'query3' }
            },
            {
                label: 'Query 4',
                value: { age: 12, name: 'john' }
            }
        ]

        // const filters: DlSmartSearchFilters = {
        //     saved: [
        //         {
        //             name: 'Query 1',
        //             query: {"q": 1}
        //         },
        //         {
        //             name: 'Query 2',
        //             query: {"query2": "query2"}
        //         },
        //         {
        //             name: 'Query 3',
        //             query: {"query3": "query3"}
        //         },
        //         {
        //             name: 'Query 4',
        //             query: {"age": 12, "name": "john"}
        //         }
        //     ],
        //     recent: [],
        //     suggested: []
        // }

        return {
            schema,
            schema2,
            aliases,
            colorSchema,
            switchState: false,
            strictState: false,
            isLoading: false,
            queryObject: {},
            queryObject2: {},
            textQuery: '',
            filters,
            lastSearch: null,
            searchEmitted: 0
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

            // if (this.filters.recent[-1]?.name !== queryString) {
            //     this.filters.recent.push({
            //         name: queryString || query.name,
            //         query: query.query
            //     })
            // }
        },
        // handleSaveQuery(query: Query, type: string) {
        //     const saveQueryIndex = this.filters[type].findIndex(
        //         (q: Query) => q.name === query.name || q.query === query.query
        //     )
        //     if (saveQueryIndex !== -1) {
        //         this.filters[type][saveQueryIndex] = query
        //     } else {
        //         this.filters[type].push(query)
        //     }
        // },
        // handleRemoveQuery(query: Query, type: string) {
        //     this.filters[type] = this.filters[type].filter(
        //         (q: Query) => q.name !== query.name
        //     )
        // },
        handleSaveQuery(query: DlSmartSearchFilter) {
            this.filters.push(query)
        },
        handleRemoveQuery(query: DlSmartSearchFilter) {
            this.filters = this.filters.filter((q) => q.label !== q.label)
        },
        onSearchEmitted(query: Query) {
            this.searchEmitted++
            this.lastSearch = query
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
