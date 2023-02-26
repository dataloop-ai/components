<script lang="ts">
import { defineComponent, ref } from 'vue-demi'
import DlWidgetGrid from '../components/DlWidget/DlWidgetGrid.vue'
import { DlButton } from '../components'
import BadgeDemo from './DlBadgeDemo.vue'
import { Widget } from '../components/DlWidget/types'
import DlDialogBox from '../components/DlDialogBox/DlDialogBox.vue'
import DlDialogBoxHeader from '../components/DlDialogBox/DlDialogBoxHeader.vue'
import DlDialogBoxFooter from '../components/DlDialogBox/DlDialogBoxFooter.vue'
import DlChip from '../components/DlChip/DlChip.vue'

export default defineComponent({
    components: {
        DlWidgetGrid,
        DlButton,
        DlDialogBox,
        DlDialogBoxHeader,
        DlDialogBoxFooter,
        DlChip
    },
    setup() {
        const isEditable = ref(false)
        const addDialog = ref(false)
        const handleEditMode = () => (isEditable.value = !isEditable.value)

        const widgetLibrary = ref([
            {
                title: 'Widget 1',
                subTitle: 'first widget',
                content: BadgeDemo,
                description:
                    'Lorem ipsum dolor sit amet consectetur. Ultricies odio sagittis bibendum tristique congue pretium ac massa proin. Leo blandit commodo sit nibh sem. dfsdfdsfsdf dfsdfsdfsdfsd'
            }
        ] as Widget[])

        const widgets = ref([
            [
                {
                    title: 'Widget 8',
                    subTitle: 'eighth widget',
                    content: `Do I contradict myself?
                              Very well then I contradict myself,
                              (I am large, I contain multitudes.)
                              I concentrate toward them that are nigh, I wait on the door-slab.
                              Who has done his day's work? who will soonest be through with his supper?
                              Who wishes to walk with me?`,
                    description:
                        'Lorem dolor sit amet consectetur. Ultricies odio sagittis bibendum tristique congue pretium ac massa proin. Leo blandit commodo sit nibh sem. dfsdfdsfsdf dfsdfsdfsdfsd'
                }
            ],
            [
                {
                    title: 'Widget 2',
                    subTitle: 'second widget',
                    content: `“Later she remembered all the hours of the afternoon as happy -- one of those uneventful times that seem at the moment only a link between past and future pleasure, but turn out to have been the pleasure itself.”`,
                    description:
                        'Lorem ipsum dolor sit amet consectetur. Ultricies odio sagittis bibendum tristique congue pretium ac massa proin. Leo blandit commodo sit nibh sem. dfsdfdsfsdf dfsdfsdfsdfsd'
                },
                {
                    title: 'Widget 3',
                    subTitle: 'third widget',
                    content: `The Bat that flits at close of Eve
                          Has left the Brain that wont Believe
                          The Owl that calls upon the Night
                          Speaks the Unbelievers fright`,
                    description:
                        'Lorem ipsum dolor sit amet consectetur. Ultricies odio sagittis bibendum tristique congue pretium ac massa proin. Leo blandit commodo sit nibh sem. dfsdfdsfsdf dfsdfsdfsdfsd'
                }
            ],
            [
                {
                    title: 'Widget 4',
                    subTitle: 'fourth widget',
                    content: `That motley drama—oh, be sure   
                             It shall not be forgot!
                          With its Phantom chased for evermore   
                             By a crowd that seize it not,`,
                    description:
                        'Lorem ipsum dolor sit amet consectetur. Ultricies odio sagittis bibendum tristique congue pretium ac massa proin. Leo blandit commodo sit nibh sem. dfsdfdsfsdf dfsdfsdfsdfsd'
                }
            ]
        ] as Widget[][])

        const addWidget = (widget: Widget) => {
            widgets.value[widgets.value.length - 1].push(widget)
            addDialog.value = false
        }

        const handleRemove = (widget: Widget) => {
            widgetLibrary.value.push(widget)
        }

        return {
            widgets,
            widgetLibrary,
            isEditable,
            addDialog,
            handleEditMode,
            addWidget,
            handleRemove
        }
    }
})
</script>

<template>
    <div style="width: 900px">
        <div
            style="width: 200px; display: flex; justify-content: space-between"
        >
            <dl-button
                :label="isEditable ? 'Done' : 'Edit'"
                @click="handleEditMode"
            />
            <dl-button
                label="Add"
                @click="addDialog = true"
            />
        </div>
        <dl-widget-grid
            v-model="widgets"
            :is-editable="isEditable"
            @remove="handleRemove"
        />

        <dl-dialog-box v-model="addDialog">
            <template #header>
                <dl-dialog-box-header
                    title="Add new widget"
                    @on-close="addDialog = false"
                />
            </template>
            <template #body>
                <div
                    class="flex"
                    style="gap: 10px"
                >
                    <dl-chip
                        v-for="(widget, index) in widgetLibrary"
                        :key="index"
                        style="cursor: pointer"
                        @click="addWidget(widget)"
                    >
                        {{ widget.title }}
                    </dl-chip>
                </div>
            </template>
            <template #footer>
                <dl-dialog-box-footer>
                    <dl-button @click="addDialog = false">
                        Close
                    </dl-button>
                </dl-dialog-box-footer>
            </template>
        </dl-dialog-box>
    </div>
</template>
