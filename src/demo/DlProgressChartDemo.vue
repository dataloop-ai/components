<template>
    <div>
        <dl-progress-chart :options="options" />
        <dl-progress-chart
            :options="options"
            width="400px"
        />
        <dl-progress-chart
            :options="options.slice(3)"
            width="500px"
        />
        <dl-progress-chart
            :options="options.slice(2)"
            text-color="blue"
            counter-color="green"
        />
    </div>
</template>

<script lang="ts">
import { DlProgressChart } from '../components'
import { defineComponent } from 'vue-demi'

export default defineComponent({
    name: 'DlProgressChartDemo',
    components: {
        DlProgressChart
    },
    data() {
        return {
            options: [
                {
                    name: 'To Do',
                    value: 17,
                    color: 'red',
                    link: 'https://opentech.dev/'
                },
                {
                    name: 'In Progresss',
                    value: 25,
                    color: 'blue',
                    link: 'https://opentech.dev/'
                },
                {
                    name: 'Lorem ipsum dolor sit',
                    value: 9,
                    color: 'brown'
                },
                {
                    name: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. ',
                    value: 11,
                    color: 'green'
                },
                {
                    name: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Cum vero totam fuga sed obcaecati in iusto recusandae adipisci labore minus architecto quod cupiditate repellendus, id, quidem quaerat voluptatibus deleniti. Sequi?',
                    value: 44,
                    color: 'purple',
                    link: 'https://opentech.dev/'
                },

                {
                    name: 'Done',
                    value: 13,
                    color: 'yellow'
                }
            ]
        }
    },
    template: 'dl-progress-chart-demo'
})
</script>
