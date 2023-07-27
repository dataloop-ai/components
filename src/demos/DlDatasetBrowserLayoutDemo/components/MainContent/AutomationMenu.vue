<template>
    <dl-dropdown-button
        flat
        label="Automations"
        :no-wrap="false"
        :overflow="false"
        fit-content
        size="s"
        text-color="dl-color-darker"
    >
        <dl-list
            bordered
            separator
        >
            <dl-list-item
                v-for="item in items"
                :key="item.id"
                clickable
                :bordered="item.isBordered"
                :start-icon="item.icon"
                :start-icon-color="item.iconColor"
                @click="handleOption(item)"
            >
                <dl-item-section :color="item.labelColor">
                    {{ item.label }}
                </dl-item-section>
                <dl-item-section
                    v-if="item.children"
                    side
                >
                    <dl-icon icon="icon-dl-right-chevron" />
                </dl-item-section>
                <dl-menu
                    v-if="item.children"
                    auto-close
                    anchor="top end"
                    self="top start"
                >
                    <dl-list
                        bordered
                        separator
                    >
                        <dl-list-item
                            v-for="itemChildren in item.children"
                            :key="itemChildren.id"
                            dense
                            clickable
                        >
                            <dl-item-section>
                                {{ itemChildren.label }}
                            </dl-item-section>
                            <dl-item-section
                                v-if="itemChildren.icon"
                                side
                            >
                                <dl-icon :icon="itemChildren.icon" />
                            </dl-item-section>
                        </dl-list-item>
                    </dl-list>
                </dl-menu>
            </dl-list-item>
        </dl-list>
    </dl-dropdown-button>
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi'
import {
    DlList,
    DlMenu,
    DlListItem,
    DlItemSection,
    DlIcon,
    DlDropdownButton
} from '../../../../components'
export default defineComponent({
    name: 'AutomationMenu',
    components: {
        DlDropdownButton,
        DlMenu,
        DlList,
        DlListItem,
        DlItemSection,
        DlIcon
    },
    props: {
        items: {
            type: Array,
            default: () => [] as Record<string, any>[]
        }
    },
    emits: ['onChange'],
    setup(props, context) {
        const handleOption = (event: Event) => {
            console.log('click: ', event)
            context.emit('onChange', event)
        }

        return {
            handleOption
        }
    }
})
</script>

<style scoped></style>
