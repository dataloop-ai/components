<template>
    <div>
        <div style="display: flex; gap: 20px; flex-direction: column">
            <h2>Splitted</h2>
            <dl-dropdown-button
                auto-close
                outlined
                split
                :label="outlinedLabel"
                @handleSelectedItem="handleOutlinedSelect"
            >
                <dl-list>
                    <dl-list-item
                        v-for="val in ['Photos', 'Videos', 'Articles']"
                        :key="val"
                        clickable
                        @click="handleOutlinedSelect(val)"
                    >
                        <dl-item-section> {{ val }} </dl-item-section>
                    </dl-list-item>
                </dl-list>
            </dl-dropdown-button>

            <dl-dropdown-button
                disabled
                auto-close
                outlined
                split
                label="Dropdown Button Outlined"
            >
                <dl-list>
                    <dl-list-item clickable>
                        <dl-item-section> Photos </dl-item-section>
                    </dl-list-item>

                    <dl-list-item clickable>
                        <dl-item-section> Videos </dl-item-section>
                    </dl-list-item>

                    <dl-list-item clickable>
                        <dl-item-section> Articles </dl-item-section>
                    </dl-list-item>
                </dl-list>
            </dl-dropdown-button>

            <dl-dropdown-button
                split
                :label="containedLabel"
                auto-close
            >
                <dl-list>
                    <dl-list-item
                        v-for="val in ['Photos', 'Videos', 'Articles']"
                        :key="val"
                        clickable
                        @click="handleContainedSelect(val)"
                    >
                        <dl-item-section> {{ val }} </dl-item-section>
                    </dl-list-item>
                </dl-list>
            </dl-dropdown-button>

            <dl-dropdown-button
                v-model="showing"
                auto-close
                split
                :label="name"
                main-button-style="width: 120px"
                @click="onClick"
            >
                <dl-list>
                    <dl-list-item
                        clickable
                        @click="() => onClose('Photos')"
                    >
                        <dl-item-section> Photos </dl-item-section>
                    </dl-list-item>

                    <dl-list-item
                        clickable
                        @click="() => onClose('Videos and long text')"
                    >
                        <dl-item-section :no-wrap="true">
                            Videos and long text ideos and long text ideos and
                            long text ideos and long text ideos and long text
                        </dl-item-section>
                    </dl-list-item>

                    <dl-list-item
                        clickable
                        @click="() => onClose('Articles')"
                    >
                        <dl-item-section> Articles </dl-item-section>
                    </dl-list-item>
                </dl-list>
            </dl-dropdown-button>
        </div>

        <div style="display: flex; gap: 20px; flex-direction: column">
            <h2>One Button</h2>
            <div
                class="grid grid-cols-3"
                style="column-gap: 10px"
            >
                <dl-dropdown-button
                    auto-close
                    outlined
                    :label="outlinedLabel"
                >
                    <dl-list>
                        <dl-list-item clickable>
                            <dl-item-section> Photos </dl-item-section>
                        </dl-list-item>

                        <dl-list-item clickable>
                            <dl-item-section> Videos </dl-item-section>
                        </dl-list-item>

                        <dl-list-item clickable>
                            <dl-item-section> Articles </dl-item-section>
                        </dl-list-item>
                    </dl-list>
                </dl-dropdown-button>

                <dl-dropdown-button
                    disabled
                    auto-close
                    outlined
                    label="Dropdown Button Outlined"
                >
                    <dl-list>
                        <dl-list-item clickable>
                            <dl-item-section> Photos </dl-item-section>
                        </dl-list-item>

                        <dl-list-item clickable>
                            <dl-item-section> Videos </dl-item-section>
                        </dl-list-item>

                        <dl-list-item clickable>
                            <dl-item-section> Articles </dl-item-section>
                        </dl-list-item>
                    </dl-list>
                </dl-dropdown-button>

                <dl-dropdown-button
                    auto-close
                    :label="containedLabel"
                    max-height="210px"
                >
                    <dl-list>
                        <dl-list-item clickable>
                            <dl-item-section> Photos </dl-item-section>
                        </dl-list-item>

                        <dl-list-item clickable>
                            <dl-item-section> Videos </dl-item-section>
                        </dl-list-item>

                        <dl-list-item clickable>
                            <dl-item-section> Articles </dl-item-section>
                        </dl-list-item>
                        <dl-list-item clickable>
                            <dl-item-section> Photos </dl-item-section>
                        </dl-list-item>

                        <dl-list-item clickable>
                            <dl-item-section> Videos </dl-item-section>
                        </dl-list-item>

                        <dl-list-item clickable>
                            <dl-item-section> Articles </dl-item-section>
                        </dl-list-item>
                        <dl-list-item clickable>
                            <dl-item-section> Photos </dl-item-section>
                        </dl-list-item>

                        <dl-list-item clickable>
                            <dl-item-section> Videos </dl-item-section>
                        </dl-list-item>

                        <dl-list-item clickable>
                            <dl-item-section> Articles </dl-item-section>
                        </dl-list-item>
                    </dl-list>
                </dl-dropdown-button>
            </div>

            <div
                class="grid grid-cols-3"
                style="column-gap: 10px"
            >
                <dl-dropdown-button
                    auto-close
                    :model-value="showing"
                    :label="name"
                    main-button-style="width: 150px;"
                    @show="onOpen"
                >
                    <dl-list>
                        <dl-list-item
                            clickable
                            @click="() => onClose('Photos')"
                        >
                            <dl-item-section> Photos </dl-item-section>
                        </dl-list-item>

                        <dl-list-item
                            clickable
                            @click="() => onClose('Videos and long text')"
                        >
                            <dl-item-section>
                                Videos and long text
                            </dl-item-section>
                        </dl-list-item>
                        <dl-list-item
                            clickable
                            @click="() => onClose('Movies and long text')"
                        >
                            <dl-item-section>
                                Movies and long text
                            </dl-item-section>
                        </dl-list-item>

                        <dl-list-item
                            clickable
                            @click="() => onClose('Articles')"
                        >
                            <dl-item-section> Articles </dl-item-section>
                        </dl-list-item>
                    </dl-list>
                </dl-dropdown-button>

                <dl-dropdown-button
                    auto-close
                    :model-value="showing"
                    label="Ellipsis for very long text"
                    main-button-style="width: 150px;"
                    :overflow="true"
                    :no-wrap="true"
                    tooltip="Tooltip message"
                    @show="onOpen"
                >
                    <dl-list>
                        <dl-list-item
                            clickable
                            @click="() => onClose('Photos')"
                        >
                            <dl-item-section> Photos </dl-item-section>
                        </dl-list-item>

                        <dl-list-item
                            clickable
                            @click="() => onClose('Videos and long text')"
                        >
                            <dl-item-section :no-wrap="true">
                                <dl-ellipsis
                                    text="Very very very very long long long long text text text"
                                    split
                                />
                            </dl-item-section>
                        </dl-list-item>
                        <dl-list-item
                            clickable
                            @click="() => onClose('Movies and long text')"
                        >
                            <dl-item-section :no-wrap="true">
                                <dl-ellipsis
                                    text="Very very very very long long long long text text text"
                                />
                            </dl-item-section>
                        </dl-list-item>

                        <dl-list-item
                            clickable
                            @click="() => onClose('Articles')"
                        >
                            <dl-item-section> Articles </dl-item-section>
                        </dl-list-item>
                    </dl-list>
                </dl-dropdown-button>

                <dl-dropdown-button
                    auto-close
                    :model-value="showing"
                    :label="arrowNavigationLabel"
                    main-button-style="width: 150px;"
                    :overflow="true"
                    disabled
                    :no-wrap="true"
                    tooltip="Tooltip message"
                    :arrow-nav-items="listItems"
                    @show="onOpen"
                    @highlightedIndex="setHighlightedIndex"
                    @handleSelectedItem="handleSelectedItem"
                >
                    <dl-list>
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
                </dl-dropdown-button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue-demi'
import {
    DlListItem,
    DlItemSection,
    DlList,
    DlDropdownButton,
    DlEllipsis
} from '../components'

export default defineComponent({
    name: 'DlDropdownButtonDemo',
    components: {
        DlListItem,
        DlItemSection,
        DlList,
        DlDropdownButton,
        DlEllipsis
    },
    setup() {
        const highlightedIndex = ref(-1)
        const name = ref('Dropdown Button Controlled')
        const showing = ref(false)
        const arrowNavigationLabel = ref('Arrow Navigation Label')
        const outlinedLabel = ref('Outlined Label')
        const containedLabel = ref('Contained Label')

        const listItems = ref([
            'New tab',
            'New incognito tab',
            'Recent tabs',
            'History',
            'Downloads',
            'Settings',
            'Help & Feedback'
        ])

        const handleSelectedItem = (value: any) => {
            arrowNavigationLabel.value = value
            showing.value = false
        }
        const handleOutlinedSelect = (value: string) =>
            (outlinedLabel.value = value)

        const handleContainedSelect = (value: string) =>
            (containedLabel.value = value)

        const onClose = (newName: string) => {
            name.value = newName
            showing.value = false
            alert(name.value)
        }
        const onOpen = () => {
            showing.value = true
        }
        const onClick = () => {
            alert(name.value)
        }
        const setHighlightedIndex = (value: number) => {
            highlightedIndex.value = value
        }

        return {
            listItems,
            onClose,
            onOpen,
            onClick,
            name,
            showing,
            setHighlightedIndex,
            handleSelectedItem,
            handleOutlinedSelect,
            handleContainedSelect,
            highlightedIndex,
            arrowNavigationLabel,
            outlinedLabel,
            containedLabel
        }
    }
})
</script>
