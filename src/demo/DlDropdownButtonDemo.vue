<template>
    <div>
        <div style="display: flex; gap: 20px; flex-direction: column">
            <h2>Splitted</h2>
            <dl-dropdown-button
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
                label="Dropdown Button Contained"
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
                v-model="showing"
                auto-close
                split
                :label="name"
                main-btn-style="width: 120px"
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
                        <dl-item-section>
                            Videos and long text
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
            <dl-dropdown-button
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
                        <dl-item-section>
                            Articles Articles Articles Articles Articles
                            Articles
                        </dl-item-section>
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
                label="Dropdown Button Contained"
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

            <dl-dropdown-button
                auto-close
                :model-value="showing"
                :label="name"
                fit-content
                main-btn-style="width: 150px;"
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
                            Videos and long text Videos and long text
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
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi'
import {
    DlListItem,
    DlItemSection,
    DlList,
    DlDropdownButton
} from '../components'

export default defineComponent({
    name: 'DlDropdownButtonDemo',
    components: {
        DlListItem,
        DlItemSection,
        DlList,
        DlDropdownButton
    },
    data() {
        return {
            name: 'Dropdown Button Controlled',
            showing: false
        }
    },
    methods: {
        onClose(name: string) {
            this.name = name
            this.showing = false
            alert(this.name)
        },
        onOpen() {
            this.showing = true
        },
        onClick() {
            alert(this.name)
        }
    }
})
</script>
