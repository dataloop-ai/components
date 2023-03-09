<template>
    <div>
        <button @click="openModal">
            Open modal
        </button>
        <dl-dialog-box
            ref="modalOne"
            v-model="isOpenedFirstModal"
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

                <dl-dialog-box ref="modalTwo">
                    <template #header>
                        <dl-dialog-box-header
                            has-back-button
                            title="Dialog Box Title"
                            subtitle="updated by rotemshaham@dataloop.ai"
                            @on-close="closeSecondModal"
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
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                            elit. Erat ac duis sed ullamcorper sagittis, sed.
                            Tempus ac pellentesque dignissim lobortis.
                        </p>
                    </template>
                    <template #footer>
                        <dl-dialog-box-footer>
                            <dl-button @click="closeSecondModal">
                                Close
                            </dl-button>
                        </dl-dialog-box-footer>
                    </template>
                </dl-dialog-box>
            </template>
            <template #footer>
                <dl-dialog-box-footer>
                    <dl-button @click="openSecondModal">
                        Open second modal
                    </dl-button>
                    <dl-button @click="closeModal">
                        Close
                    </dl-button>
                </dl-dialog-box-footer>
            </template>
        </dl-dialog-box>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue-demi'
import { DlDialogBox, DlButton } from '../components'
import { DlDialogBoxHeader, DlDialogBoxFooter } from '../components/DlDialogBox'

export default defineComponent({
    name: 'DlDialogBoxDemo',
    components: {
        DlButton,
        DlDialogBox,
        DlDialogBoxHeader,
        DlDialogBoxFooter
    },
    setup() {
        const modalOne = ref<any>(null)
        const modalTwo = ref<any>(null)

        const isOpenedFirstModal = ref(false)

        const openModal = () => {
            if (!modalOne.value) {
                return
            }

            modalOne.value?.openModal()
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
            isOpenedFirstModal
        }
    }
})
</script>
