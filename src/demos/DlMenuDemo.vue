<template>
    <div>
        <dl-button label="Basic Menu">
            <dl-menu>
                <dl-list bordered separator>
                    <dl-list-item> Default list item </dl-list-item>
                    <dl-list-item disabled> Disabled list item </dl-list-item>
                    <dl-list-item clickable> Clickable list item </dl-list-item>
                    <dl-list-item
                        clickable
                        disabled
                        start-icon="icon-dl-search"
                        end-icon="icon-dl-id"
                    >
                        <dl-item-section no-wrap>
                            with left and right side icons
                        </dl-item-section>
                    </dl-list-item>
                    <dl-list-item
                        clickable
                        start-icon="icon-dl-search"
                        end-icon="icon-dl-id"
                    >
                        <dl-item-section side> Left text </dl-item-section>
                        <dl-item-section no-wrap>
                            main content
                        </dl-item-section>
                        <dl-item-section no-wrap>
                            another main content
                        </dl-item-section>
                    </dl-list-item>
                    <dl-list-item
                        clickable
                        :start-icon="menuStartIcon"
                        :end-icon="menuEndIcon"
                    >
                        <dl-item-section no-wrap>
                            item with custom icon colors
                        </dl-item-section>
                    </dl-list-item>
                    <dl-list-item clickable bordered>
                        <dl-item-section side>
                            <dl-icon icon="icon-dl-id" />
                        </dl-item-section>
                        <dl-item-section no-wrap>
                            with left/right side icons + Submenu
                        </dl-item-section>
                        <dl-item-section side>
                            <dl-icon icon="icon-dl-id" />
                        </dl-item-section>
                        <dl-menu anchor="top end" self="top start">
                            <dl-list bordered separator>
                                <dl-list-item
                                    v-for="n in 3"
                                    :key="n"
                                    dense
                                    clickable
                                >
                                    <dl-item-section>
                                        Submenu Label
                                    </dl-item-section>
                                    <dl-item-section side>
                                        <dl-icon icon="icon-dl-id" />
                                    </dl-item-section>
                                    <dl-menu
                                        auto-close
                                        anchor="top end"
                                        self="top start"
                                    >
                                        <dl-list bordered>
                                            <dl-list-item
                                                v-for="i in 3"
                                                :key="i"
                                                dense
                                                clickable
                                            >
                                                <dl-item-section>
                                                    3rd auto-close menu
                                                </dl-item-section>
                                            </dl-list-item>
                                        </dl-list>
                                    </dl-menu>
                                </dl-list-item>
                            </dl-list>
                        </dl-menu>
                    </dl-list-item>
                </dl-list>
            </dl-menu>
        </dl-button>

        <dl-button label="Auto-opening Submenus">
            <dl-menu
                auto-close
                anchor="top end"
                self="top start"
            >
                <dl-list bordered>
                    <dl-list-item
                        v-for="i in 3"
                        :key="i"
                        clickable
                        end-icon="icon-dl-right-chevron"
                    >
                        <dl-item-section no-wrap>
                            Submenu {{ i }}
                        </dl-item-section>
                        <dl-menu
                            auto-close
                            anchor="top end"
                            self="top start"
                            hover-group="main-submenus"
                        >
                            <dl-list bordered>
                                <dl-list-item
                                    v-for="j in 3"
                                    :key="j"
                                    clickable
                                    end-icon="icon-dl-right-chevron"
                                >
                                    <dl-item-section no-wrap>
                                        Submenu {{ i }}. {{ j }}
                                    </dl-item-section>
                                    <dl-menu
                                        auto-close
                                        anchor="top end"
                                        self="top start"
                                        :hover-group="`submenus-${i}`"
                                    >
                                        <dl-list bordered>
                                            <dl-list-item
                                                v-for="k in 3"
                                                :key="k"
                                                clickable
                                                dense
                                            >
                                                <dl-item-section no-wrap>
                                                    Submenu item {{ k }}
                                                </dl-item-section>
                                            </dl-list-item>
                                        </dl-list>
                                    </dl-menu>
                                </dl-list-item>
                            </dl-list>
                        </dl-menu>
                    </dl-list-item>
                </dl-list>
            </dl-menu>
        </dl-button>

        <dl-button label="Basic Menu With SubText">
            This is a menu button
            <dl-menu>
                <dl-list bordered separator>
                    <dl-list-item> Default list item </dl-list-item>
                    <dl-list-item disabled> Disabled list item </dl-list-item>
                    <dl-list-item clickable> Clickable list item </dl-list-item>
                    <dl-list-item
                        clickable
                        disabled
                        start-icon="icon-dl-search"
                        end-icon="icon-dl-id"
                    >
                        <dl-item-section no-wrap>
                            with left and right side icons
                        </dl-item-section>
                    </dl-list-item>
                    <dl-list-item
                        clickable
                        start-icon="icon-dl-search"
                        end-icon="icon-dl-id"
                    >
                        <dl-item-section side> Left text </dl-item-section>
                        <dl-item-section no-wrap>
                            main content
                        </dl-item-section>
                        <dl-item-section no-wrap>
                            another main content
                        </dl-item-section>
                    </dl-list-item>
                    <dl-list-item
                        clickable
                        :start-icon="menuStartIcon"
                        :end-icon="menuEndIcon"
                    >
                        <dl-item-section no-wrap>
                            item with custom icon colors
                        </dl-item-section>
                    </dl-list-item>
                    <dl-list-item clickable bordered>
                        <dl-item-section side>
                            <dl-icon icon="icon-dl-id" />
                        </dl-item-section>
                        <dl-item-section no-wrap>
                            with left/right side icons + Submenu
                        </dl-item-section>
                        <dl-item-section side>
                            <dl-icon icon="icon-dl-id" />
                        </dl-item-section>
                        <dl-menu anchor="top end" self="top start">
                            <dl-list bordered separator>
                                <dl-list-item
                                    v-for="n in 3"
                                    :key="n"
                                    dense
                                    clickable
                                >
                                    <dl-item-section>
                                        Submenu Label
                                    </dl-item-section>
                                    <dl-item-section side>
                                        <dl-icon icon="icon-dl-id" />
                                    </dl-item-section>
                                    <dl-menu
                                        auto-close
                                        anchor="top end"
                                        self="top start"
                                    >
                                        <dl-list bordered>
                                            <dl-list-item
                                                v-for="i in 3"
                                                :key="i"
                                                dense
                                                clickable
                                            >
                                                <dl-item-section>
                                                    3rd auto-close menu
                                                </dl-item-section>
                                            </dl-list-item>
                                        </dl-list>
                                    </dl-menu>
                                </dl-list-item>
                            </dl-list>
                        </dl-menu>
                    </dl-list-item>
                </dl-list>
            </dl-menu>
        </dl-button>

        <div style="width: 300px; height: 50px; background-color: yellow">
            <p style="color: blue">Context-menu</p>
            <dl-menu max-height="300px" context-menu>
                <dl-list bordered separator>
                    <dl-list-item> Default list item </dl-list-item>
                    <dl-list-item disabled> Disabled list item </dl-list-item>
                    <dl-list-item clickable> Clickable list item </dl-list-item>
                    <dl-list-item
                        clickable
                        disabled
                        start-icon="icon-dl-search"
                        end-icon="icon-dl-id"
                    >
                        <dl-item-section no-wrap>
                            with left and right side icons
                        </dl-item-section>
                    </dl-list-item>
                    <dl-list-item
                        clickable
                        start-icon="icon-dl-search"
                        end-icon="icon-dl-id"
                    >
                        <dl-item-section side> Left text </dl-item-section>
                        <dl-item-section no-wrap>
                            main content
                        </dl-item-section>
                        <dl-item-section no-wrap>
                            another main content
                        </dl-item-section>
                    </dl-list-item>
                    <dl-list-item
                        clickable
                        :start-icon="menuStartIcon"
                        :end-icon="menuEndIcon"
                    >
                        <dl-item-section no-wrap>
                            item with custom icon colors
                        </dl-item-section>
                    </dl-list-item>
                    <dl-list-item clickable bordered>
                        <dl-item-section side>
                            <dl-icon icon="icon-dl-id" />
                        </dl-item-section>
                        <dl-item-section no-wrap>
                            with left/right side icons + Submenu
                        </dl-item-section>
                        <dl-item-section side>
                            <dl-icon icon="icon-dl-id" />
                        </dl-item-section>
                        <dl-menu anchor="top end" self="top start">
                            <dl-list bordered separator>
                                <dl-list-item
                                    v-for="i in 3"
                                    :key="i"
                                    dense
                                    clickable
                                >
                                    <dl-item-section>
                                        Submenu Label
                                    </dl-item-section>
                                    <dl-item-section side>
                                        <dl-icon icon="icon-dl-id" />
                                    </dl-item-section>
                                    <dl-menu
                                        auto-close
                                        anchor="top end"
                                        self="top start"
                                    >
                                        <dl-list bordered>
                                            <dl-list-item
                                                v-for="m in 3"
                                                :key="m"
                                                dense
                                                clickable
                                            >
                                                <dl-item-section>
                                                    3rd auto-close menu
                                                </dl-item-section>
                                            </dl-list-item>
                                        </dl-list>
                                    </dl-menu>
                                </dl-list-item>
                            </dl-list>
                        </dl-menu>
                    </dl-list-item>
                </dl-list>
            </dl-menu>
        </div>

        <div
            style="
                display: flex;
                width: 100%;
                align-items: center;
                flex-direction: column;
            "
        >
            With model V-model {{ showing }}
            <div>
                <dl-button
                    color="primary"
                    label="Show"
                    @click="showing = true"
                />
                <dl-button
                    color="primary"
                    label="Hide"
                    @click="showing = false"
                />
            </div>

            <div
                style="
                    width: 200px;
                    height: 70px;
                    background-color: purple;
                    color: white;
                "
            >
                Click me

                <dl-menu v-model="showing">
                    <dl-list style="min-width: 100px">
                        <dl-list-item clickable>
                            <dl-item-section>New tab</dl-item-section>
                        </dl-list-item>
                        <dl-list-item clickable>
                            <dl-item-section>New incognito tab</dl-item-section>
                        </dl-list-item>
                        <dl-list-item clickable>
                            <dl-item-section>Recent tabs</dl-item-section>
                        </dl-list-item>
                        <dl-list-item clickable>
                            <dl-item-section>History</dl-item-section>
                        </dl-list-item>
                    </dl-list>
                </dl-menu>
            </div>
        </div>

        <div>
            <h4>Sizing and styling</h4>
            <div>
                <dl-button label="Fit Menu">
                    <dl-menu fit-container>
                        <dl-list>
                            <dl-list-item clickable>
                                <dl-item-section>New tab</dl-item-section>
                            </dl-list-item>
                            <dl-list-item clickable>
                                <dl-item-section>
                                    New incognito tab
                                </dl-item-section>
                            </dl-list-item>
                            <dl-list-item clickable>
                                <dl-item-section>Recent tabs</dl-item-section>
                            </dl-list-item>
                            <dl-list-item clickable>
                                <dl-item-section>History</dl-item-section>
                            </dl-list-item>
                            <dl-list-item clickable>
                                <dl-item-section>Downloads</dl-item-section>
                            </dl-list-item>
                            <dl-list-item clickable>
                                <dl-item-section> Settings </dl-item-section>
                            </dl-list-item>
                            <dl-list-item clickable>
                                <dl-item-section>
                                    Help &amp; Feedback
                                </dl-item-section>
                            </dl-list-item>
                        </dl-list>
                    </dl-menu>
                </dl-button>

                <dl-button color="brown" label="Max Height Menu">
                    <dl-menu max-height="130px">
                        <dl-list style="min-width: 100px">
                            <dl-list-item clickable>
                                <dl-item-section>New tab</dl-item-section>
                            </dl-list-item>
                            <dl-list-item clickable>
                                <dl-item-section>
                                    New incognito tab
                                </dl-item-section>
                            </dl-list-item>
                            <dl-list-item clickable>
                                <dl-item-section>Recent tabs</dl-item-section>
                            </dl-list-item>
                            <dl-list-item clickable>
                                <dl-item-section>History</dl-item-section>
                            </dl-list-item>
                            <dl-list-item clickable>
                                <dl-item-section>Downloads</dl-item-section>
                            </dl-list-item>
                            <dl-list-item clickable>
                                <dl-item-section>Settings</dl-item-section>
                            </dl-list-item>
                            <dl-list-item clickable>
                                <dl-item-section>
                                    Help &amp; Feedback
                                </dl-item-section>
                            </dl-list-item>
                        </dl-list>
                    </dl-menu>
                </dl-button>

                <dl-button label="Max Width Menu">
                    <dl-menu max-width="80px">
                        <dl-list style="min-width: 100px">
                            <dl-list-item clickable>
                                <dl-item-section> New tab </dl-item-section>
                            </dl-list-item>
                            <dl-list-item clickable>
                                <dl-item-section>
                                    New incognito tab
                                </dl-item-section>
                            </dl-list-item>
                            <dl-list-item clickable>
                                <dl-item-section> Recent tabs </dl-item-section>
                            </dl-list-item>
                            <dl-list-item clickable>
                                <dl-item-section> History </dl-item-section>
                            </dl-list-item>
                            <dl-list-item clickable>
                                <dl-item-section> Downloads </dl-item-section>
                            </dl-list-item>
                            <dl-list-item clickable>
                                <dl-item-section> Settings </dl-item-section>
                            </dl-list-item>
                            <dl-list-item clickable>
                                <dl-item-section>
                                    Help & Feedback
                                </dl-item-section>
                            </dl-list-item>
                        </dl-list>
                    </dl-menu>
                </dl-button>

                <h4>Arrow navigation</h4>
                <dl-button :label="arrowNavigationLabel">
                    <dl-menu @show="onShow" @hide="onHide">
                        <dl-list style="min-width: 100px">
                            <dl-list-item
                                v-for="(item, index) in listItems"
                                :key="index"
                                clickable
                                :highlighted="index === highlightedIndex"
                            >
                                <dl-item-section>
                                    {{ item }}
                                </dl-item-section>
                            </dl-list-item>
                        </dl-list>
                    </dl-menu>
                </dl-button>

                <h4>With max height with alot of elements</h4>
                <dl-button :label="arrowNavigationLabel">
                    <dl-menu
                        max-height="250px"
                        self="bottom middle"
                        anchor="top middle"
                        :offset="[50, 5]"
                        @show="onShow"
                        @hide="onHide"
                    >
                        <dl-list style="min-width: 100px">
                            <dl-list-item
                                v-for="(item, index) in alotOfListItems"
                                :key="index"
                                clickable
                                :is-highlighted="index === highlightedIndex"
                            >
                                <dl-item-section>
                                    {{ item }}
                                </dl-item-section>
                            </dl-list-item>
                        </dl-list>
                    </dl-menu>
                </dl-button>
            </div>
        </div>

        <h4>With model as button: {{ isOpen }}</h4>
        <dl-button label="test">
            <dl-menu
                id="TestID"
                v-model="isOpen"
                max-height="250px"
                self="bottom middle"
                anchor="top middle"
                :offset="[50, 5]"
                @show="onShow"
                @hide="onHide"
            >
                <dl-list style="min-width: 100px">
                    <dl-list-item
                        v-for="(item, index) in alotOfListItems"
                        :key="index"
                        clickable
                        :is-highlighted="index === highlightedIndex"
                    >
                        <dl-item-section>
                            {{ item }}
                        </dl-item-section>
                    </dl-list-item>
                </dl-list>
            </dl-menu>
        </dl-button>
    </div>
</template>

<script lang="ts">
import {
    DlIcon,
    DlButton,
    DlListItem,
    DlItemSection,
    DlList,
    DlMenu
} from '../components'
import { defineComponent, onMounted, ref, watch } from 'vue-demi'
import { useArrowNavigation } from '../hooks/use-arrow-navigation'

type ItemType = Record<string, any> | string

export default defineComponent({
    name: 'DlMenuDemo',
    components: {
        DlIcon,
        DlButton,
        DlListItem,
        DlItemSection,
        DlList,
        DlMenu
    },
    setup() {
        const showing = ref(false)
        const isMenuOpen = ref(false)
        const arrowNavigationLabel = ref<ItemType>('Arrow Navigation Label')
        const isOpen = ref(false)

        const listItems = ref([
            'New tab',
            'New incognito tab',
            'Recent tabs',
            'History',
            'Downloads',
            'Settings',
            'Help & Feedback'
        ])

        const alotOfListItems = ref([
            'New tab0',
            'New incognito tab1',
            'Recent tabs2',
            'History3',
            'Downloads4',
            'Settings5',
            'Help & Feedback6',
            'New tab7',
            'New incognito tab8',
            'Recent tabs9',
            'History10',
            'Downloads11',
            'Settings12',
            'Help & Feedback13',
            'New tab14',
            'New incognito tab15',
            'Recent tabs16',
            'History17',
            'Downloads18',
            'Settings19',
            'Help & Feedback20',
            'New tab21',
            'New incognito tab22',
            'Recent tabs23',
            'History24',
            'Downloads25',
            'Settings26',
            'Help & Feedback27',
            'New tab28',
            'New incognito tab29',
            'Recent tabs30',
            'History31',
            'Downloads32',
            'Settings33',
            'Help & Feedback34',
            'New tab35',
            'New incognito tab36',
            'Recent tabs37',
            'History38',
            'Downloads39',
            'Settings40',
            'Help & Feedback41',
            'New tab42',
            'New incognito tab43',
            'Recent tabs44',
            'History45',
            'Downloads46',
            'Settings47',
            'Help & Feedback48',
            'New tab49',
            'New incognito tab50',
            'Recent tabs51',
            'History52',
            'Downloads53',
            'Settings54',
            'Help & Feedback55',
            'New tab56',
            'New incognito tab57',
            'Recent tabs58',
            'History59',
            'Downloads60',
            'Settings61',
            'Help & Feedback62',
            'New tab63',
            'New incognito tab64',
            'Recent tabs65',
            'History66',
            'Downloads67',
            'Settings68',
            'Help & Feedback69',
            'New tab70',
            'New incognito tab71',
            'Recent tabs72',
            'History73',
            'Downloads74',
            'Settings75',
            'Help & Feedback76',
            'New tab77',
            'New incognito tab78',
            'Recent tabs79',
            'History80',
            'Downloads81',
            'Settings82',
            'Help & Feedback83',
            'New tab84',
            'New incognito tab85',
            'Recent tabs86',
            'History87',
            'Downloads88',
            'Settings89',
            'Help & Feedback90',
            'New tab91',
            'New incognito tab92',
            'Recent tabs93',
            'History94',
            'Downloads95',
            'Settings96',
            'Help & Feedback97',
            'New tab98',
            'New incognito tab99'
        ])

        const onShow = (value: any) => {
            isMenuOpen.value = !!value
        }
        const onHide = (value: any) => {
            isMenuOpen.value = !value
        }
        const { selectedItem, highlightedIndex } = useArrowNavigation(
            listItems,
            isMenuOpen
        )

        watch(selectedItem, (value: ItemType | string) => {
            arrowNavigationLabel.value = value
        })

        onMounted(() => {
            // @ts-ignore
            window.menuDemo = { showing }
        })
        return {
            showing,
            listItems,
            onShow,
            onHide,
            isOpen,
            isMenuOpen,
            selectedItem,
            highlightedIndex,
            arrowNavigationLabel,
            alotOfListItems,
            menuStartIcon: {
                icon: 'icon-dl-search',
                color: 'dl-color-positive'
            },
            menuEndIcon: { icon: 'icon-dl-id', color: 'dl-color-secondary' }
        }
    }
})
</script>
<style>
#TestID {
    background-color: red;
}
</style>
