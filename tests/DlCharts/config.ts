export const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [
        {
            label: 'Data One',
            backgroundColor: '--dl-color-secondary',
            borderRadius: 4,
            data: [35, 30, 25, 20, 15, 5]
        },
        {
            label: 'Data Two',
            backgroundColor: '--dl-color-warning',
            borderRadius: 4,
            data: [15, 20, 15, 30, 25, 10]
        }
    ]
}

export const options = {
    responsive: true,
    maintainAspectRatio: false
}

export const config = {
    data,
    options
}
