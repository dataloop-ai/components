export const initFilters = {
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
    recent: [] as string[],
    suggested: [] as string[]
}
