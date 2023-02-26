<template>
    <div>
        <div
            style="
                display: flex;
                justify-content: center;
                width: 100%;
                margin-top: 50px;
                flex-wrap: wrap;
                max-width: 300px;
                margin: 0 auto;
            "
        >
            <h4>List item and item section</h4>
            <dl-list-item @click="log">
                Default list item
            </dl-list-item>
            <dl-list-item
                disabled
                @click="log"
            >
                Disabled list item
            </dl-list-item>
            <dl-list-item
                clickable
                @click="log"
            >
                Clickable list item
            </dl-list-item>
            <dl-list-item
                clickable
                disabled
                start-icon="icon-dl-search"
                end-icon="icon-dl-id"
                @click="log"
            >
                <dl-item-section no-wrap>
                    with left and right side icons
                </dl-item-section>
            </dl-list-item>
            <dl-list-item
                clickable
                start-icon="icon-dl-search"
                end-icon="icon-dl-id"
                @click="log"
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
                @click="log"
            >
                <dl-item-section no-wrap>
                    item with custom icon colors
                </dl-item-section>
            </dl-list-item>
            <dl-list-item
                clickable
                bordered
                start-icon="icon-dl-search"
                end-icon="icon-dl-id"
                @click="log"
            >
                <dl-item-section no-wrap>
                    with left and right side icons
                </dl-item-section>
            </dl-list-item>
            <h4>List + List item + item section</h4>
            <dl-list
                bordered
                separator
                clickable
            >
                <template #default="{ clickable }">
                    <dl-list-item
                        :clickable="clickable"
                        @click="log"
                    >
                        Default list item
                    </dl-list-item>
                    <dl-list-item
                        :clickable="clickable"
                        disabled
                        @click="log"
                    >
                        Disabled list item
                    </dl-list-item>
                    <dl-list-item
                        :clickable="clickable"
                        @click="log"
                    >
                        Clickable list item
                    </dl-list-item>
                    <dl-list-item
                        :clickable="clickable"
                        disabled
                        start-icon="icon-dl-search"
                        end-icon="icon-dl-id"
                        @click="log"
                    >
                        <dl-item-section no-wrap>
                            with left and right side icons
                        </dl-item-section>
                    </dl-list-item>
                    <dl-list-item
                        clickable
                        start-icon="icon-dl-search"
                        end-icon="icon-dl-id"
                        @click="log"
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
                        @click="log"
                    >
                        <dl-item-section no-wrap>
                            item with custom icon colors
                        </dl-item-section>
                    </dl-list-item>
                    <dl-list-item
                        clickable
                        bordered
                        start-icon="icon-dl-search"
                        end-icon="icon-dl-id"
                        @click="log"
                    >
                        <dl-item-section no-wrap>
                            with left and right side icons
                        </dl-item-section>
                    </dl-list-item>
                </template>
            </dl-list>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi'
import { DlListItem, DlItemSection, DlList } from '../components'
export default defineComponent({
    name: 'DlListDemo',
    components: {
        DlListItem,
        DlItemSection,
        DlList
    },
    setup() {
        const log = (e: Event) => console.log(e)
        return { log }
    }
})
</script>
