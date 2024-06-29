<template>
    <div>
        <dl-counters
            :title-number-of-lines="2"
            :items="[
                {
                    value: 123,
                    text: 'lorem ipsum'
                },
                {
                    value: 45,
                    text: 'ipsum lorem',
                    subtext:
                        'Cupidatat est labore et nisi do culpa veniam reprehenderit anim consectetur dolor mollit.'
                },
                {
                    value: 6789,
                    text: 'lorem lorem ipsum',
                    subtext: 'Minim exercitation ipsum elit cillum magna.'
                }
            ]"
        />
        <dl-counters
            :title-number-of-lines="1"
            small
            :items="[
                {
                    text: 'lorem'
                },
                {
                    value: null,
                    text: 'ipsum lorem',
                    subtext:
                        'Cupidatat est labore et nisi do culpa veniam reprehenderit anim consectetur dolor mollit.'
                },
                {
                    value: 6789,
                    text: 'lorem lorem ipsum',
                    subtext: 'Minim exercitation ipsum elit cillum magna.'
                }
            ]"
        />
        <dl-counters
            small
            :items="[
                {
                    value: 100000000,
                    text: 'lorem',
                    format: 'short',
                    infoMessage:
                        'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
                },
                {
                    value: '154h:35m:20s',
                    text: 'ipsum lorem',
                    subtext:
                        'Cupidatat est labore et nisi do culpa veniam reprehenderit anim consectetur dolor mollit.',
                    format: 'hms',
                    infoMessage: '154h:35m:20s'
                },
                {
                    value: 6789,
                    text: 'lorem lorem ipsum',
                    subtext: 'Minim exercitation ipsum elit cillum magna.',
                    format: 'short',
                    infoMessage: '6789'
                }
            ]"
        />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi'
import { DlCounters } from '../components'
export default defineComponent({
    name: 'DlCounterDemo',
    components: {
        DlCounters
    }
})
</script>
