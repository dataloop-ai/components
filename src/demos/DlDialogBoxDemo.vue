<template>
    <div>
        <dl-switch
            v-model="draggable"
            left-label="Draggable"
        />
        <dl-switch
            v-model="fullscreen"
            left-label="Full screen"
        />
        <dl-switch
            v-model="fullHeight"
            left-label="Full height"
        />
        <dl-button @click="openModal">
            Open modal
        </dl-button>
        <dl-dialog-box
            ref="modalOne"
            v-model="isOpenedFirstModal"
            :draggable="draggable"
            :full-height="fullHeight"
            :fullscreen="fullscreen"
        >
            <template #header>
                <dl-dialog-box-header
                    title="Dialog Box Title"
                    subtitle="updated by rotemshaham@dataloop.ai"
                    @on-close="closeModal"
                />
            </template>
            <template #body>
                <div
                    style="
                        display: flex;
                        flex-direction: column;
                        align-content: center;
                        width: 100%;
                        height: 100%;
                    "
                >
                    <div style="display: flex; width: 100%">
                        <dl-input
                            title="Group Name"
                            placeholder="Enter Group Name"
                            dense
                            required
                            red-asterisk
                            :max-length="50"
                            info-message=" "
                            show-counter
                            :error="true"
                            :error-message="'This is an error message'"
                        />
                    </div>

                    <div style="display: flex; width: 100%">
                        <dl-input
                            width="100px"
                            max-width="100px"
                            placeholder="placeholder input"
                        />
                        <p
                            style="
                                margin: 5px;
                                color: var(--dl-color-medium);
                                font-size: 10px;
                            "
                        >
                            Updated by rotemshaham@dataloop.ai
                        </p>
                    </div>
                </div>
                <p
                    style="
                        margin: 5px;
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
                    <dl-button
                        outlined
                        @click="openSecondModal"
                    >
                        Open empty modal
                    </dl-button>
                    <dl-button @click="closeModal">
                        Close
                    </dl-button>
                </dl-dialog-box-footer>
            </template>
        </dl-dialog-box>

        <div>
            Styled Tooltip using a class
            <dl-button @click="openModal2">
                Open modal
            </dl-button>
            <dl-dialog-box
                ref="modalTwo"
                v-model="isOpenedSecondModal"
                class="TestID"
                :draggable="draggable"
                :full-height="fullHeight"
                :fullscreen="fullscreen"
            >
                <template #header>
                    <dl-dialog-box-header
                        title="Dialog Box Title"
                        subtitle="updated by rotemshaham@dataloop.ai"
                        @on-close="closeModal"
                    />
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
                        <dl-button
                            outlined
                            @click="openSecondModal"
                        >
                            Open empty modal
                        </dl-button>
                        <dl-button @click="isOpenedSecondModal = false">
                            Close
                        </dl-button>
                    </dl-dialog-box-footer>
                </template>
            </dl-dialog-box>
        </div>
        <div>
            Styled Tooltip using an id
            <dl-button @click="openModal3">
                Open modal
            </dl-button>
            <dl-dialog-box
                ref="modalThree"
                v-model="isOpenedThirdModal"
                :draggable="draggable"
                :full-height="fullHeight"
                :fullscreen="fullscreen"
            >
                <template #header>
                    <dl-dialog-box-header
                        title="Dialog Box Title"
                        subtitle="updated by rotemshaham@dataloop.ai"
                        @on-close="closeModal"
                    />
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
                        <dl-button
                            outlined
                            @click="openSecondModal"
                        >
                            Open empty modal
                        </dl-button>
                        <dl-button @click="isOpenedThirdModal = false">
                            Close
                        </dl-button>
                    </dl-dialog-box-footer>
                </template>
            </dl-dialog-box>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue-demi'
import { DlButton, DlDialogBox, DlSwitch, DlInput } from '../components'
import { DlDialogBoxHeader, DlDialogBoxFooter } from '../components'

export default defineComponent({
    name: 'DlDialogBoxDemo',
    components: {
        DlSwitch,
        DlButton,
        DlDialogBox,
        DlDialogBoxHeader,
        DlDialogBoxFooter,
        DlInput
    },
    setup() {
        const modalOne = ref<any>(null)
        const modalTwo = ref<any>(null)
        const modalThree = ref<any>(null)
        const draggable = ref(true)
        const fullscreen = ref(false)
        const fullHeight = ref(false)
        const isOpenedFirstModal = ref(false)
        const isOpenedSecondModal = ref(false)
        const isOpenedThirdModal = ref(false)

        const openModal = () => {
            if (!modalOne.value) {
                return
            }

            modalOne.value?.openModal()
        }
        const openModal2 = () => {
            if (!modalOne.value) {
                return
            }

            modalTwo.value?.openModal()
        }
        const openModal3 = () => {
            if (!modalOne.value) {
                return
            }

            modalThree.value?.openModal()
        }

        const closeModal = () => {
            if (!modalOne.value) {
                return
            }

            modalOne.value?.closeModal()
        }

        const openSecondModal = () => {
            if (!modalTwo.value) {
                return
            }

            modalTwo.value?.openModal()
        }

        const closeSecondModal = () => {
            if (!modalTwo.value) {
                return
            }

            modalTwo.value?.closeModal()
        }

        return {
            openModal,
            closeModal,
            openSecondModal,
            closeSecondModal,
            modalOne,
            modalTwo,
            isOpenedFirstModal,
            draggable,
            fullscreen,
            fullHeight,
            openModal2,
            openModal3,
            isOpenedSecondModal,
            isOpenedThirdModal
        }
    }
})
</script>
<style>
#TestID {
    border: 1px solid red;
    background-color: blue;
}
.TestID {
    border: 1px solid red;
    background-color: blue;
}
</style>
