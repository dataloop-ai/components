export const initFilters = [
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
                query: ''
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
