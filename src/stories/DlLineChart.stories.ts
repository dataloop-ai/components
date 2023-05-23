import { DlLineChart } from '../components'
import { orderBy } from 'lodash'
import { Meta, StoryObj } from '@storybook/vue3'

type Story = StoryObj<typeof DlLineChart>

const meta: Meta<typeof DlLineChart> = {
    title: 'Library/Components/DlLineChart',
    component: DlLineChart
}

export default meta

function randomIntFromInterval(min, max) {
    return new Array(18)
        .fill('')
        .map(() => Math.floor(Math.random() * (max - min + 1) + min))
}

const resolutionLabels = {
    hour: [
        {
            title: '8:00',
            subtitle: 'Feb 27'
        },
        {
            title: '8:00',
            subtitle: 'Feb 28'
        },
        {
            title: '8:00',
            subtitle: 'Mar 1'
        },
        {
            title: '8:00',
            subtitle: 'Mar 2'
        },
        {
            title: '8:00',
            subtitle: 'Mar 3'
        },
        {
            title: '8:00',
            subtitle: 'Mar 4'
        },
        {
            title: '8:00',
            subtitle: 'Mar 5'
        },
        {
            title: '8:00',
            subtitle: 'Mar 6'
        },
        {
            title: '8:00',
            subtitle: 'Mar 7'
        },
        {
            title: '8:00',
            subtitle: 'Mar 8'
        },
        {
            title: '8:00',
            subtitle: 'Mar 9'
        },
        {
            title: '8:00 long title',
            subtitle: 'Mar 10 long title'
        },
        {
            title: '8:00',
            subtitle: 'Mar 11'
        },
        {
            title: '8:00',
            subtitle: 'Mar 12'
        },
        {
            title: '8:00',
            subtitle: 'Mar 13'
        },
        {
            title: '8:00',
            subtitle: 'Mar 14'
        },
        {
            title: '8:00',
            subtitle: 'Mar 15'
        },
        {
            title: '8:00',
            subtitle: 'Mar 16'
        }
    ],
    day: [
        'Jan 1',
        'Jan 2',
        'Jan 3',
        'Jan 4',
        'Jan 5',
        'Jan 6',
        'Jan 7',
        'Jan 8',
        'Jan 9',
        'Jan 10',
        'Jan 11',
        'Jan 12',
        'Jan 13',
        'Jan 14',
        'Jan 15',
        'Jan 16',
        'Jan 17',
        'Jan 18'
    ],
    week: [
        'Week 1',
        'Week 2',
        'Week 3',
        'Week 4',
        'Week 5',
        'Week 6',
        'Week 7',
        'Week 8',
        'Week 9',
        'Week 10',
        'Week 11',
        'Week 12',
        'Week 13',
        'Week 14',
        'Week 15',
        'Week 16',
        'Week 17',
        'Week 18'
    ],
    month: [
        {
            title: 'Ian',
            subtitle: '2022'
        },
        {
            title: 'Feb',
            subtitle: ''
        },
        {
            title: 'Mar',
            subtitle: ''
        },
        {
            title: 'Apr',
            subtitle: ''
        },
        {
            title: 'May',
            subtitle: ''
        },
        {
            title: 'Jun',
            subtitle: ''
        },
        {
            title: 'Jul',
            subtitle: ''
        },
        {
            title: 'Aug',
            subtitle: ''
        },
        {
            title: 'Sep',
            subtitle: ''
        },
        {
            title: 'Oct',
            subtitle: ''
        },
        {
            title: 'Nov',
            subtitle: ''
        },
        {
            title: 'Dec',
            subtitle: ''
        },
        {
            title: 'Ian',
            subtitle: '2023'
        },
        {
            title: 'Feb',
            subtitle: ''
        },
        {
            title: 'Mar',
            subtitle: ''
        },
        {
            title: 'Apr',
            subtitle: ''
        },
        {
            title: 'May',
            subtitle: ''
        },
        {
            title: 'Jun',
            subtitle: ''
        }
    ],
    year: [
        '1998',
        '1999',
        '2000',
        '2001',
        '2002',
        '2003',
        '2004',
        '2005',
        '2006',
        '2007',
        '2008',
        '2009',
        '2010',
        '2011',
        '2012',
        '2013',
        '2014',
        '2015'
    ]
}

const data = {
    labels: resolutionLabels['hour'],
    datasets: [
        {
            label: 'Discarded',
            backgroundColor: '--dl-color-chart-7',
            borderColor: '--dl-color-chart-7',
            pointRadius: 4,
            data: randomIntFromInterval(0, 4)
        },
        {
            label: 'Undiscarded',
            backgroundColor: '--dl-color-chart-1',
            borderColor: '--dl-color-chart-1',
            pointRadius: 4,
            data: randomIntFromInterval(2, 6)
        },
        {
            label: 'Completed',
            backgroundColor: '--dl-color-chart-14',
            borderColor: '--dl-color-chart-14',
            pointRadius: 4,
            data: randomIntFromInterval(1, 5)
        },
        {
            label: 'Uncompleted',
            backgroundColor: '--dl-color-secondary',
            borderColor: '--dl-color-secondary',
            pointRadius: 4,
            data: randomIntFromInterval(0, 5)
        }
    ]
}

const brushProps = {
    min: 0,
    max: orderBy(data.datasets, (o) => o.data.length)[0].data.length - 1
}

const options = {
    plugins: {
        legend: {
            display: false
        }
    },
    scales: {
        y: {
            suggestedMax: 9,
            suggestedMin: 0
        }
    }
}

const legendProps = {
    alignItems: 'center'
}

export const DeafultWithBrush: Story = {
    args: {
        brushProps,
        legendProps,
        options,
        data,
        style: 'width: 100%'
    }
}

export const NoPoint: Story = {
    args: {
        brushProps,
        legendProps,
        options,
        data: {
            ...data,
            datasets: [{ ...data.datasets[0], pointRadius: 0, borderWidth: 1 }]
        },
        style: 'width: 100%'
    }
}

export const TensionLine: Story = {
    args: {
        brushProps,
        legendProps,
        options: { ...options, tension: 0.5 },
        data: {
            ...data,
            datasets: [{ ...data.datasets[1], pointRadius: 0 }]
        },
        style: 'width: 100%'
    }
}
