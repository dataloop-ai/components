import {
    DlButton,
    DlDialogBox,
    DlAlert,
    DlInput,
    DlTypography,
    DlIcon,
    DlTooltip,
    DlDialogBoxHeader,
    DlDialogBoxFooter
} from '../'
import { ref } from 'vue-demi'

export default {
    title: 'Library/Components/DlDialogBox',
    component: DlDialogBox,
    argTypes: {
        width: {
            name: 'width',
            defaultValue: 400,
            control: 'string',
            description: 'The width of the dialog'
        },
        height: {
            name: 'height',
            defaultValue: 'fit-content',
            control: 'string',
            description: 'The height of the dialog'
        },
        fullscreen: {
            name: 'fullscreen',
            defaultValue: false,
            control: 'boolean',
            description: 'The dialog will be fullscreen'
        },
        open: {
            name: 'open',
            defaultValue: false,
            control: 'boolean',
            description: 'The dialog will be open by default'
        },
        volatile: {
            name: 'volatile',
            defaultValue: false,
            control: 'boolean',
            description: 'The dialog will close when the user clicks outside it'
        },
        header: {
            description:
                "The content that will be passed in the dialog's header slot",
            defaultValue: 'Dialog Box Title',
            control: {
                type: 'text'
            },
            table: {
                category: 'Header text',
                type: {
                    summary: 'html'
                }
            }
        },
        headerSubtitle: {
            description: 'Dialog header subtitle slot',
            defaultValue: 'Dialog Box Subtitle',
            control: {
                type: 'text'
            },
            table: {
                category: 'Header text',
                type: {
                    summary: 'html'
                }
            }
        }
    }
}

const Template = (args) => ({
    components: {
        DlButton,
        DlDialogBox,
        DlDialogBoxHeader,
        DlDialogBoxFooter
    },
    setup() {
        return { args }
    },
    data() {
        return {
            open: ref(false)
        }
    },
    template: `
    <dl-dialog-box ref="modalName" v-bind="args" v-model="open">
        <template #header>
            <dl-dialog-box-header
                title="Header Title"
                @on-close="open = false"
            >
            </dl-dialog-box-header>
        </template>
        <template #body>
            <p
                style="
                    margin: 0;
                    color: var(--dl-color-medium);
                    font-size: 10px;
                "
            >
                Updated by rotemshaham@dataloop.ai
            </p>
            <p
                style="
                    margin: 0;
                    color: var(--dl-color-medium);
                    font-size: 10px;
                    margin-bottom: 20px;
                "
            >
                Dec 1, 2020, 12:21pm
            </p>
            <p
                style="
                    margin: 0;
                    color: var(--dl-color-darker);
                    font-size: 12px;
                "
            >
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Erat ac duis sed ullamcorper sagittis, sed. Tempus ac
                pellentesque dignissim lobortis.
            </p>
        </template>
        <template #footer>
            <dl-dialog-box-footer>
                <dl-button @click="open = false">
                    Close
                </dl-button>
            </dl-dialog-box-footer>
        </template>
    </dl-dialog-box>
    <dl-button @click="open = true">
        Open Dialog Box
    </dl-button>
    `
})

export const Preview = Template.bind({})
Preview.args = {}

const CustomDialogBox = (args) => ({
    components: {
        DlButton,
        DlDialogBox,
        DlDialogBoxHeader,
        DlDialogBoxFooter,
        DlAlert,
        DlInput,
        DlTypography,
        DlIcon,
        DlTooltip
    },
    setup() {
        return { args }
    },
    data() {
        return {
            open: ref(false)
        }
    },
    template: `
    <dl-dialog-box ref="modalName" v-bind="args" v-model="open">
        <template #header>
            <dl-dialog-box-header
                title="Header Title"
                @on-close="open = false"
            >
            <div>
                <div style="display: flex; margin-bottom: 10px; cursor: pointer; user-select: none">
                    <dl-icon icon="icon-dl-arrow-left" color="dl-color-medium" />
                    <span style="padding-left: 10px;">
                        <dl-typography uppercase color="dl-color-medium">back</dl-typography>
                        <dl-tooltip>Back to dialog box 1</dl-tooltip>
                    </span>
                </div>
                <dl-typography size="h2">Add Option</dl-typography>
            </div>
            </dl-dialog-box-header>
        </template>
        <template #body>
            <dl-alert type="info">
                failed to create new driver, failed to initialize a S3integrationstoragedriver. {“config: Accumsan augue vitae morbi arcu est. Nisi, nulla pretium et ultricies facilisis sollicitudin nunc urna.
            </dl-alert>
            <dl-input title="Title" :required="true" />
            <dl-input title="Title" :required="true" />
            <dl-input title="Title" :required="false" placeholder="Type your title" />
            <dl-typography>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis quis dictum massa. Cras in massa in justo sodales consequat quis a metus. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Duis in neque quam. Fusce aliquam finibus efficitur. Proin elementum ipsum massa, at gravida lectus suscipit et. Mauris id imperdiet ex, eget condimentum massa. Duis bibendum diam vitae lobortis semper. Curabitur placerat at enim at iaculis. Ut eget nisl magna. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Duis placerat purus in est sagittis, ac eleifend neque semper.

            Phasellus vel risus sit amet libero volutpat tempor. Vestibulum dapibus lectus est, eu molestie elit congue a. Quisque pharetra, nisl sit amet pellentesque accumsan, est ante bibendum nulla, eu vehicula tellus odio quis est. Donec et nulla ante. Integer bibendum augue elit, pellentesque fermentum tellus volutpat dapibus. Maecenas vel molestie turpis, vehicula varius diam. Cras eu lacinia arcu, id convallis metus. Nullam condimentum molestie enim, non fringilla metus posuere at. Etiam venenatis congue mi id pretium. Fusce eget consequat eros. Donec at elit feugiat, tincidunt erat nec, tincidunt orci.</dl-typography>
        </template>
        <template #footer>
            <dl-dialog-box-footer>
                <dl-button @click="open = false">
                    Close
                </dl-button>
            </dl-dialog-box-footer>
        </template>
    </dl-dialog-box>
    <dl-button @click="open = true">
        Open Dialog Box
    </dl-button>
    `
})

export const CustomDialogBoxPreview = CustomDialogBox.bind({})
CustomDialogBox.args = {}

const DialogBoxWithCustomHeader = (args) => ({
    components: {
        DlButton,
        DlDialogBox,
        DlDialogBoxHeader,
        DlDialogBoxFooter,
        DlAlert,
        DlInput,
        DlTypography,
        DlIcon,
        DlTooltip
    },
    setup() {
        return { args }
    },
    data() {
        return {
            open: ref(false)
        }
    },
    template: `
    <dl-dialog-box ref="modalName" v-bind="args" v-model="open">
        <template #header>
            <dl-dialog-box-header
                :title="args.header"
                :subtitle="args.headerSubtitle"
                @on-close="open = false"
            >
            <div>
                <div style="display: flex; margin-bottom: 10px; cursor: pointer; user-select: none">
                    <dl-icon icon="icon-dl-arrow-left" color="dl-color-medium" />
                    <span style="padding-left: 10px;">
                        <dl-typography uppercase color="dl-color-medium">back</dl-typography>
                        <dl-tooltip>Back to dialog box 1</dl-tooltip>
                    </span>
                </div>
                <dl-typography size="h2">Add Option</dl-typography>
            </div>
            </dl-dialog-box-header>
        </template>
        <template #body>
            <dl-alert type="info">
                failed to create new driver, failed to initialize a S3integrationstoragedriver. {“config: Accumsan augue vitae morbi arcu est. Nisi, nulla pretium et ultricies facilisis sollicitudin nunc urna.
            </dl-alert>
            <dl-input title="Title" :required="true" />
            <dl-input title="Title" :required="true" />
            <dl-input title="Title" :required="false" placeholder="Type your title" />
            <dl-typography>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis quis dictum massa. Cras in massa in justo sodales consequat quis a metus. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Duis in neque quam. Fusce aliquam finibus efficitur. Proin elementum ipsum massa, at gravida lectus suscipit et. Mauris id imperdiet ex, eget condimentum massa. Duis bibendum diam vitae lobortis semper. Curabitur placerat at enim at iaculis. Ut eget nisl magna. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Duis placerat purus in est sagittis, ac eleifend neque semper.

            Phasellus vel risus sit amet libero volutpat tempor. Vestibulum dapibus lectus est, eu molestie elit congue a. Quisque pharetra, nisl sit amet pellentesque accumsan, est ante bibendum nulla, eu vehicula tellus odio quis est. Donec et nulla ante. Integer bibendum augue elit, pellentesque fermentum tellus volutpat dapibus. Maecenas vel molestie turpis, vehicula varius diam. Cras eu lacinia arcu, id convallis metus. Nullam condimentum molestie enim, non fringilla metus posuere at. Etiam venenatis congue mi id pretium. Fusce eget consequat eros. Donec at elit feugiat, tincidunt erat nec, tincidunt orci.</dl-typography>
        </template>
        <template #footer>
            <dl-dialog-box-footer>
                <dl-button @click="open = false">
                    Close
                </dl-button>
            </dl-dialog-box-footer>
        </template>
    </dl-dialog-box>
    <dl-button @click="open = true">
        Open Dialog Box
    </dl-button>
    `
})

export const DialogBoxWithCustomHeaderPreview = DialogBoxWithCustomHeader.bind(
    {}
)
DialogBoxWithCustomHeader.args = {}

const DialogBoxInsideDialogBox = (args) => ({
    components: {
        DlButton,
        DlDialogBox,
        DlDialogBoxHeader,
        DlDialogBoxFooter,
        DlAlert,
        DlInput,
        DlTypography,
        DlIcon,
        DlTooltip
    },
    setup() {
        return { args }
    },
    data() {
        return {
            open: ref(false),
            openDialogTwo: ref(false)
        }
    },
    template: `
    <dl-dialog-box ref="modalName" v-bind="args" v-model="open">
    <template #header>
        <dl-dialog-box-header
            title="Header Title"
            @on-close="open = false"
        >
        </dl-dialog-box-header>
    </template>
    <template #body>
        <p
            style="
                margin: 0;
                color: var(--dl-color-medium);
                font-size: 10px;
            "
        >
            Updated by rotemshaham@dataloop.ai
        </p>
        <p
            style="
                margin: 0;
                color: var(--dl-color-medium);
                font-size: 10px;
                margin-bottom: 20px;
            "
        >
            Dec 1, 2020, 12:21pm
        </p>
        <p
            style="
                margin: 0;
                color: var(--dl-color-darker);
                font-size: 12px;
            "
        >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Erat ac duis sed ullamcorper sagittis, sed. Tempus ac
            pellentesque dignissim lobortis.
        </p>
          
        <dl-dialog-box ref="modalName" v-bind="args" v-model="openDialogTwo">
        <template #header>
            <dl-dialog-box-header
                hasBackButton
                title="Header Title"
                @on-close="openDialogTwo = false"
            >
            </dl-dialog-box-header>
        </template>
        <template #body>
            <p
                style="
                    margin: 0;
                    color: var(--dl-color-medium);
                    font-size: 10px;
                "
            >
                Updated by rotemshaham@dataloop.ai
            </p>
            <p
                style="
                    margin: 0;
                    color: var(--dl-color-medium);
                    font-size: 10px;
                    margin-bottom: 20px;
                "
            >
                Dec 1, 2020, 12:21pm
            </p>
            <p
                style="
                    margin: 0;
                    color: var(--dl-color-darker);
                    font-size: 12px;
                "
            >
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Erat ac duis sed ullamcorper sagittis, sed. Tempus ac
                pellentesque dignissim lobortis.
            </p>
        </template>
        <template #footer>
            <dl-dialog-box-footer>
                <dl-button @click="openDialogTwo = false">
                    Close
                </dl-button>
            </dl-dialog-box-footer>
        </template>
    </dl-dialog-box>

    </template>
    <template #footer>
        <dl-dialog-box-footer>
        <dl-button @click="openDialogTwo = true">
        Open Dialog Box Two
    </dl-button>
            <dl-button @click="open = false">
                Close
            </dl-button>
        </dl-dialog-box-footer>
    </template>
</dl-dialog-box>
<dl-button @click="open = true">
    Open Dialog Box
</dl-button>
    `
})

export const DialogBoxInsideDialogBoxPreview = DialogBoxInsideDialogBox.bind({})
DialogBoxInsideDialogBox.args = {}
