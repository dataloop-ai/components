<template>
    <div>
        <dl-button label="Basic Menu">
            <dl-menu>
                <dl-list
                    bordered
                    separator
                >
                    <dl-list-item> Default list item </dl-list-item>
                    <dl-list-item disabled>
                        Disabled list item
                    </dl-list-item>
                    <dl-list-item clickable>
                        Clickable list item
                    </dl-list-item>
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
                        <dl-item-section side>
                            Left text
                        </dl-item-section>
                        <dl-item-section no-wrap>
                            main content
                        </dl-item-section>
                        <dl-item-section no-wrap>
                            another main content
                        </dl-item-section>
                    </dl-list-item>
                    <dl-list-item
                        clickable
                        start-icon="icon-dl-search"
                        end-icon="icon-dl-id"
                        start-icon-color="dl-color-positive"
                        end-icon-color="dl-color-secondary"
                    >
                        <dl-item-section no-wrap>
                            item with custom icon colors
                        </dl-item-section>
                    </dl-list-item>
                    <dl-list-item
                        clickable
                        bordered
                    >
                        <dl-item-section side>
                            <dl-icon icon="icon-dl-id" />
                        </dl-item-section>
                        <dl-item-section no-wrap>
                            with left/right side icons + Submenu
                        </dl-item-section>
                        <dl-item-section side>
                            <dl-icon icon="icon-dl-id" />
                        </dl-item-section>
                        <dl-menu
                            anchor="top end"
                            self="top start"
                        >
                            <dl-list
                                bordered
                                separator
                            >
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

        <dl-button label="Basic Menu With SubText">
            This is a menu button
            <dl-menu>
                <dl-list
                    bordered
                    separator
                >
                    <dl-list-item> Default list item </dl-list-item>
                    <dl-list-item disabled>
                        Disabled list item
                    </dl-list-item>
                    <dl-list-item clickable>
                        Clickable list item
                    </dl-list-item>
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
                        <dl-item-section side>
                            Left text
                        </dl-item-section>
                        <dl-item-section no-wrap>
                            main content
                        </dl-item-section>
                        <dl-item-section no-wrap>
                            another main content
                        </dl-item-section>
                    </dl-list-item>
                    <dl-list-item
                        clickable
                        start-icon="icon-dl-search"
                        end-icon="icon-dl-id"
                        start-icon-color="dl-color-positive"
                        end-icon-color="dl-color-secondary"
                    >
                        <dl-item-section no-wrap>
                            item with custom icon colors
                        </dl-item-section>
                    </dl-list-item>
                    <dl-list-item
                        clickable
                        bordered
                    >
                        <dl-item-section side>
                            <dl-icon icon="icon-dl-id" />
                        </dl-item-section>
                        <dl-item-section no-wrap>
                            with left/right side icons + Submenu
                        </dl-item-section>
                        <dl-item-section side>
                            <dl-icon icon="icon-dl-id" />
                        </dl-item-section>
                        <dl-menu
                            anchor="top end"
                            self="top start"
                        >
                            <dl-list
                                bordered
                                separator
                            >
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
            <p style="color: blue">
                Context-menu
            </p>
            <dl-menu
                max-height="300px"
                context-menu
            >
                <dl-list
                    bordered
                    separator
                >
                    <dl-list-item> Default list item </dl-list-item>
                    <dl-list-item disabled>
                        Disabled list item
                    </dl-list-item>
                    <dl-list-item clickable>
                        Clickable list item
                    </dl-list-item>
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
                        <dl-item-section side>
                            Left text
                        </dl-item-section>
                        <dl-item-section no-wrap>
                            main content
                        </dl-item-section>
                        <dl-item-section no-wrap>
                            another main content
                        </dl-item-section>
                    </dl-list-item>
                    <dl-list-item
                        clickable
                        start-icon="icon-dl-search"
                        end-icon="icon-dl-id"
                        start-icon-color="dl-color-positive"
                        end-icon-color="dl-color-secondary"
                    >
                        <dl-item-section no-wrap>
                            item with custom icon colors
                        </dl-item-section>
                    </dl-list-item>
                    <dl-list-item
                        clickable
                        bordered
                    >
                        <dl-item-section side>
                            <dl-icon icon="icon-dl-id" />
                        </dl-item-section>
                        <dl-item-section no-wrap>
                            with left/right side icons + Submenu
                        </dl-item-section>
                        <dl-item-section side>
                            <dl-icon icon="icon-dl-id" />
                        </dl-item-section>
                        <dl-menu
                            anchor="top end"
                            self="top start"
                        >
                            <dl-list
                                bordered
                                separator
                            >
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
            V-model {{ showing }}
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

                <dl-menu
                    v-model="showing"
                    :value="false"
                >
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

                <dl-button
                    color="brown"
                    label="Max Height Menu"
                >
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
                    <dl-menu
                        @show="onShow"
                        @hide="onHide"
                    >
                        <dl-list style="min-width: 100px">
                            <dl-list-item
                                v-for="(item, index) in listItems"
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
        const arrowNavigationLabel = ref('Arrow Navigation Label')

        const listItems = ref([
            'New tab',
            'New incognito tab',
            'Recent tabs',
            'History',
            'Downloads',
            'Settings',
            'Help & Feedback'
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

        watch(selectedItem, (value: string) => {
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
            isMenuOpen,
            selectedItem,
            highlightedIndex,
            arrowNavigationLabel
        }
    }
})
</script>
