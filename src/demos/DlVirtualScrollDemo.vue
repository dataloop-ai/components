<template>
    <div>
        <div style="display: flex">
            <dl-virtual-scroll
                v-slot="{ item: row, index }"
                type="table"
                :virtual-scroll-item-size="48"
                :virtual-scroll-sticky-size-start="48"
                :virtual-scroll-sticky-size-end="32"
                :items="heavyList"
                style="height: 500px"
                @virtual-scroll="log"
            >
                <dl-tr :key="index">
                    <dl-td>#{{ index }}</dl-td>
                    <dl-td
                        v-for="col in columns"
                        :key="index + '-' + col"
                    >
                        {{ row[col] }}
                    </dl-td>
                </dl-tr>
            </dl-virtual-scroll>
        </div>
        <div style="margin-top: 100px">
            <h3>Horizontal</h3>
            <dl-virtual-scroll
                v-slot="{ item, index }"
                style="max-width: 500px"
                :virtual-scroll-item-size="48"
                :virtual-scroll-sticky-size-start="48"
                :virtual-scroll-sticky-size-end="32"
                :items="horizontalList"
                virtual-scroll-horizontal
            >
                <div
                    :key="index"
                    :class="item.class"
                >
                    #{{ index }} - {{ item.label }}
                </div>
            </dl-virtual-scroll>
        </div>
        <div style="margin-top: 100px">
            <h3>List</h3>
            <dl-virtual-scroll
                v-slot="{ item, index }"
                style="height: 300px"
                :items="basicList"
                :virtual-scroll-item-size="28"
                :virtual-scroll-sticky-size-start="28"
                :virtual-scroll-sticky-size-end="20"
                separator
                @virtual-scroll="log"
            >
                <dl-list-item
                    :key="index"
                    dense
                >
                    <dl-item-section>
                        #{{ index }} - {{ item.label }}
                    </dl-item-section>
                </dl-list-item>
            </dl-virtual-scroll>
        </div>

        <div style="margin-top: 100px">
            <h3>Custom Elements</h3>
            <dl-virtual-scroll
                style="height: 300px; gap: 20px"
                :items="customList"
                :virtual-scroll-item-size="293"
                :virtual-scroll-sticky-size-start="293"
                :virtual-scroll-sticky-size-end="200"
                separator
                @virtual-scroll="log"
            >
                <template #default="{ item, index }">
                    <dl-list-item
                        :key="index"
                        style="margin-bottom: 20px"
                        dense
                    >
                        <dl-item-section>
                            <div class="row custom-element">
                                <DlCard
                                    v-for="i in item.inner"
                                    v-bind="cardData"
                                    :key="i"
                                    :image="{
                                        src: `https://picsum.photos/300/150?random=${
                                            i + index
                                        }`
                                    }"
                                />
                            </div>
                        </dl-item-section>
                    </dl-list-item>
                </template>
            </dl-virtual-scroll>
        </div>
    </div>
</template>

<script lang="ts">
const rows = [
    {
        name: 'Frozen Yogurt',
        calories: 159,
        fat: 6.0,
        carbs: 24,
        protein: 4.0,
        sodium: 87,
        calcium: '14%',
        iron: '1%'
    },
    {
        name: 'Ice cream sandwich',
        calories: 237,
        fat: 9.0,
        carbs: 37,
        protein: 4.3,
        sodium: 129,
        calcium: '8%',
        iron: '1%'
    },
    {
        name: 'Eclair',
        calories: 262,
        fat: 16.0,
        carbs: 23,
        protein: 6.0,
        sodium: 337,
        calcium: '6%',
        iron: '7%'
    },
    {
        name: 'Cupcake',
        calories: 305,
        fat: 3.7,
        carbs: 67,
        protein: 4.3,
        sodium: 413,
        calcium: '3%',
        iron: '8%'
    },
    {
        name: 'Gingerbread',
        calories: 356,
        fat: 16.0,
        carbs: 49,
        protein: 3.9,
        sodium: 327,
        calcium: '7%',
        iron: '16%'
    },
    {
        name: 'Jelly bean',
        calories: 375,
        fat: 0.0,
        carbs: 94,
        protein: 0.0,
        sodium: 50,
        calcium: '0%',
        iron: '0%'
    },
    {
        name: 'Lollipop',
        calories: 392,
        fat: 0.2,
        carbs: 98,
        protein: 0,
        sodium: 38,
        calcium: '0%',
        iron: '2%'
    },
    {
        name: 'Honeycomb',
        calories: 408,
        fat: 3.2,
        carbs: 87,
        protein: 6.5,
        sodium: 562,
        calcium: '0%',
        iron: '45%'
    },
    {
        name: 'Donut',
        calories: 452,
        fat: 25.0,
        carbs: 51,
        protein: 4.9,
        sodium: 326,
        calcium: '2%',
        iron: '22%'
    },
    {
        name: 'KitKat',
        calories: 518,
        fat: 26.0,
        carbs: 65,
        protein: 7,
        sodium: 54,
        calcium: '12%',
        iron: '6%'
    }
]

const columns = [
    'name',
    'calories',
    'fat',
    'carbs',
    'protein',
    'sodium',
    'calcium',
    'iron'
]

import DlVirtualScroll from '../components/shared/DlVirtualScroll/DlVirtualScroll.vue'
import { DlTr, DlTd, DlListItem, DlItemSection, DlCard } from '../components'
import { defineComponent, ref } from 'vue-demi'

export default defineComponent({
    components: {
        DlVirtualScroll,
        DlTd,
        DlTr,
        DlListItem,
        DlItemSection,
        DlCard
    },
    setup() {
        const heavyList = ref([])
        const basicList = ref([])
        const horizontalList = ref([])
        const customList = ref([])

        // adding same data multiple times to
        // create a huge list
        for (let i = 0; i <= 1000; i++) {
            Array.prototype.push.apply(heavyList.value, rows)
            basicList.value.push({
                label: 'Option ' + (i + 1)
            })
            horizontalList.value.push({
                label: 'Option ' + (i + 1),
                class: i % 2 === 0 ? 'item item--odd' : 'item'
            })

            customList.value.push({
                label: 'Option ' + (i + 1),
                inner: ['inner item 1', 'inner item 2', 'inner item 3']
            })
        }

        const cardData = {
            text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Egestas volutpat quam blandit integer mattis. consectetur adipiscing elit. Egestas volutpat quam blandit integer mattis. ',
            title: 'Lorem ipsum',
            keyboardShortcut: 'Shift + E',
            links: [
                {
                    icon: 'icon-dl-list-view',
                    href: 'https://www.google.md/?hl=ru',
                    title: 'Lorem',
                    newtab: true,
                    external: true
                },
                {
                    href: '#test',
                    title: 'Developers',
                    icon: 'icon-dl-code'
                }
            ]
        }

        const log = console.log

        return {
            heavyList,
            basicList,
            horizontalList,
            customList,
            columns,
            cardData,
            log
        }
    }
})
</script>

<style scoped lang="scss">
.item {
    padding: 10px 20px;
    display: flex;
    justify-content: center;
    &--odd {
        background-color: rgba(0, 0, 0, 0.1);
    }
}

.custom-element {
    gap: 20px;
}
</style>
