import {
    DlVirtualScroll,
    DlTr,
    DlTd,
    DlListItem,
    DlItemSection,
    DlCard
} from '..'
import { Meta, StoryObj } from '@storybook/vue3'

type Story = StoryObj<typeof DlVirtualScroll>

const meta: Meta<typeof DlVirtualScroll> = {
    title: 'Library/Components/DlVirtualScroll',
    component: DlVirtualScroll
}

export default meta

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

const heavyList = []
const basicList = []
const horizontalList = []
const customList = []

for (let i = 0; i <= 100; i++) {
    Array.prototype.push.apply(heavyList, rows)
    basicList.push({
        label: 'Option ' + (i + 1)
    })
    horizontalList.push({
        label: 'Option ' + (i + 1),
        styles:
            i % 2 === 0
                ? `padding: 10px 20px;
        display: flex;
        justify-content: center;
        background-color: rgba(0, 0, 0, 0.1);`
                : `padding: 10px 20px;
                display: flex; justify-content: center;`
    })

    customList.push({
        label: 'Option ' + (i + 1),
        inner: ['inner item 1', 'inner item 2', 'inner item 3']
    })
}

export const MarkupTableScroll: Story = {
    render: (args, { argTypes }) => {
        return {
            components: { DlVirtualScroll, DlTr, DlTd },
            props: Object.keys(argTypes),
            template: `<DlVirtualScroll v-bind="$props"
                style="height: 500px;"
                v-slot="{ item: row, index }"
                >
                  <DlTr :key="index">
                      <DlTd>#{{ index }}</DlTd>
                      <DlTd
                          v-for="col in columns"
                          :key="index + '-' + col"
                      >
                          {{ row[col] }}
                      </DlTd
                  </DlTr>
                </DlVirtualScroll`
        }
    },
    args: {
        type: 'table',
        virtualScrollItemSize: 48,
        virtualScrollStickySizeStart: 48,
        virtualScrollStickySizeEnd: 32,
        items: heavyList,
        columns
    }
}

export const HorizontalScroll: Story = {
    render: (args, { argTypes }) => {
        return {
            components: { DlVirtualScroll },
            props: Object.keys(argTypes),
            template: `<DlVirtualScroll v-bind="$props"
              style="max-width: 500px;"
              v-slot="{ item, index }"
              >
              <div
              :key="index"
              :style="item.styles"
              >
                  #{{ index }} - {{ item.label }}
              </div>
              </DlVirtualScroll`
        }
    },
    args: {
        virtualScrollItemSize: 48,
        virtualScrollStickySizeStart: 48,
        virtualScrollStickySizeEnd: 32,
        virtualScrollHorizontal: true,
        items: horizontalList
    }
}

export const ListScroll: Story = {
    render: (args, { argTypes }) => {
        return {
            components: { DlVirtualScroll, DlListItem, DlItemSection, DlCard },
            props: Object.keys(argTypes),
            template: `<DlVirtualScroll v-bind="$props"
            style="height: 400px;"
            v-slot="{ item, index }"
            >
                <DlListItem
                :key="index"
                dense
            >
                <DlItemSection>
                    #{{ index }} - {{ item.label }}
                </DlItemSection>
            </DlListItem>
            </DlVirtualScroll`
        }
    },
    args: {
        virtualScrollItemSize: 28,
        virtualScrollStickySizeStart: 28,
        virtualScrollStickySizeEnd: 20,
        items: basicList
    }
}

export const CustomElementScroll: Story = {
    render: (args, { argTypes }) => {
        return {
            components: { DlVirtualScroll, DlListItem, DlItemSection, DlCard },
            props: Object.keys(argTypes),
            template: `<DlVirtualScroll v-bind="$props"
          style="height: 400px; gap: 20px;"
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
                                src: 'https://picsum.photos/300/150'
                            }"
                        />
                    </div>
                </dl-item-section>
            </dl-list-item>
      </template>
          </DlVirtualScroll`
        }
    },
    args: {
        virtualScrollItemSize: 293,
        virtualScrollStickySizeStart: 293,
        virtualScrollStickySizeEnd: 200,
        items: customList,
        cardData
    }
}
