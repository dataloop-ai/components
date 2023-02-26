import { DlWidgetGrid, DlButton } from '../components'
import Badge from '../demo/DlBadgeDemo.vue'
import DlDialogBox from '../components/DlDialogBox/DlDialogBox.vue'
import DlDialogBoxHeader from '../components/DlDialogBox/DlDialogBoxHeader.vue'
import DlDialogBoxFooter from '../components/DlDialogBox/DlDialogBoxFooter.vue'
import DlChip from '../components/DlChip/DlChip.vue'
import { ref } from 'vue'

const defaultValue = [
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
                'Lorem ipsum dolor sit amet consectetur. Ultricies odio sagittis bibendum tristique congue pretium ac massa proin. Leo blandit commodo sit nibh sem. dfsdfdsfsdf dfsdfsdfsdfsd'
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
]
const defaultWigetLibrary = [
    {
        title: 'Widget 1',
        subTitle: 'first widget',
        content: Badge,
        description:
            'Lorem ipsum dolor sit amet consectetur. Ultricies odio sagittis bibendum tristique congue pretium ac massa proin. Leo blandit commodo sit nibh sem. dfsdfdsfsdf dfsdfsdfsdfsd'
    }
]

export default {
    title: 'Library/Components/DlWidget',
    component: DlWidgetGrid,
    argTypes: {
        rowGap: {
            name: 'rowGap',
            defaultValue: '10px',
            control: 'text',
            description: 'Row gap',
            table: {
                type: { summary: String },
                defaultValue: { summary: String }
            }
        },
        columnGap: {
            name: 'columnGap',
            defaultValue: '10px',
            control: 'text',
            description: 'Column gap',
            table: {
                type: { summary: String },
                defaultValue: { summary: String }
            }
        },
        isEditable: {
            name: 'isEditable',
            defaultValue: false,
            control: 'boolean',
            description: 'Make the grid and the widgets inside it editable',
            table: {
                type: { summary: Boolean },
                defaultValue: { summary: Boolean }
            }
        },
        widgetLibrary: {
            name: 'widgetLibrary',
            defaultValue: defaultWigetLibrary,
            control: 'array',
            description: 'The list of widgets one can add inside the grid',
            table: {
                type: { summary: Array },
                defaultValue: { summary: Array }
            }
        },
        modelValue: {
            name: 'modelValue',
            control: 'array',
            description: `An array of widget arrays. Each nested array's number of widget objects will determine the number of the widgets fitting on the row that corresponds to its index`,
            table: {
                type: { summary: Array },
                defaultValue: { summary: Array }
            }
        }
    }
}

const Template = (args) => ({
    components: {
        DlWidgetGrid,
        DlButton,
        DlChip,
        DlDialogBox,
        DlDialogBoxFooter,
        DlDialogBoxHeader
    },
    setup() {
        const isEditable = ref(false)
        const addDialog = ref(false)
        const widgets = ref(defaultValue)

        const widgetLibrary = ref(defaultWigetLibrary)

        const addWidget = (widget) => {
            widgets.value[widgets.value.length - 1].push(widget)
            addDialog.value = false
        }

        const handleRemove = (widget) => {
            widgetLibrary.value.push(widget)
        }

        const handleEditMode = () => (isEditable.value = !isEditable.value)

        return {
            isEditable,
            widgets,
            widgetLibrary,
            addDialog,
            addWidget,
            handleRemove,
            handleEditMode,
            args
        }
    },
    template: `
    <div style="width: 900px">
    <div
        style="width: 200px; display: flex; justify-content: space-between; margin-bottom: 30px"
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
        v-bind="args"
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
  `
})

export const Preview = Template.bind({})
