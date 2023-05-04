<template>
    <div style="width: 950px; padding-top: 20px">
        <div
            v-for="buttonSize in buttons"
            :key="buttonSize"
        >
            <h3>Size {{ buttonSize }}</h3>
            <div style="display: flex; gap: 10px; justify-content: center">
                <div class="col">
                    <DlButton
                        :size="buttonSize"
                        color="dl-color-negative"
                        label="COntained text filled"
                        @click="log"
                    />
                    <DlButton
                        :size="buttonSize"
                        outlined
                        @click="log"
                    >
                        Outlined
                    </DlButton>
                    <DlButton
                        :size="buttonSize"
                        flat
                        @click="log"
                    >
                        Flat Primary
                    </DlButton>
                    <DlButton
                        color="secondary"
                        :size="buttonSize"
                        flat
                        @click="log"
                    >
                        Flat Secondary
                    </DlButton>
                    <DlButton
                        flat
                        disabled
                        :size="buttonSize"
                        @click="log"
                    >
                        Disabled Flat
                    </DlButton>
                    <DlButton
                        disabled
                        :size="buttonSize"
                        @click="log"
                    >
                        Disabled
                    </DlButton>
                </div>
            </div>
        </div>
        <div
            style="
                display: flex;
                gap: 10px;
                width: 100%;
                justify-content: center;
                margin-top: 50px;
            "
        >
            <DlButton
                :fluid="true"
                size="xl"
                @click="log"
            >
                Fluid Button
            </DlButton>
            <DlButton
                size="xl"
                outlined
                @click="log"
            >
                Outlined
            </DlButton>
            <DlButton
                size="xl"
                flat
                @click="log"
            >
                Flat
            </DlButton>
            <DlButton
                size="xl"
                disabled
                @click="log"
            >
                Disabled
            </DlButton>
        </div>
        <div
            v-for="buttonSize in buttons"
            :key="buttonSize"
        >
            <h3>Size {{ buttonSize }}</h3>
            <div style="display: flex; gap: 10px; justify-content: center">
                <DlButton
                    icon="icon-dl-add"
                    :size="buttonSize"
                    round
                    @click="log"
                />
                <DlButton
                    icon="icon-dl-add"
                    :size="buttonSize"
                    @click="log"
                />
                <DlButton
                    icon="icon-dl-add"
                    :size="buttonSize"
                    outlined
                    @click="log"
                >
                    Outlined
                </DlButton>
                <DlButton
                    icon="icon-dl-add"
                    :size="buttonSize"
                    flat
                    @click="log"
                >
                    Flat Primary
                </DlButton>
                <DlButton
                    icon="icon-dl-add"
                    color="secondary"
                    :size="buttonSize"
                    flat
                    @click="log"
                >
                    Flat Secondary
                </DlButton>
                <DlButton
                    flat
                    icon="icon-dl-add"
                    disabled
                    :size="buttonSize"
                    @click="log"
                >
                    Disabled Flat
                </DlButton>
                <DlButton
                    icon="icon-dl-add"
                    disabled
                    :size="buttonSize"
                    @click="log"
                >
                    Disabled
                </DlButton>
            </div>
        </div>
        <div
            style="
                display: flex;
                gap: 10px;
                width: 100%;
                justify-content: center;
                margin-top: 50px;
            "
        >
            <DlButton
                icon="icon-dl-add"
                :fluid="true"
                size="xl"
                @click="log"
            >
                Fluid Button
            </DlButton>
            <DlButton
                icon="icon-dl-add"
                size="xl"
                outlined
                @click="log"
            >
                Outlined
            </DlButton>
            <DlButton
                icon="icon-dl-add"
                size="xl"
                flat
                @click="log"
            >
                Flat
            </DlButton>
            <DlButton
                icon="icon-dl-add"
                size="xl"
                disabled
                @click="log"
            >
                Disabled
            </DlButton>
        </div>
        <div>
            <h3>With badge</h3>

            <dl-button>
                <dl-badge
                    with-border
                    floating
                    align="top"
                    color="red"
                />
                button with badge
            </dl-button>
        </div>
        <div>
            <h3>Button with label and slot</h3>

            <dl-button label="Hello">
                World
            </dl-button>
        </div>
        <div>
            <h3>Button with icon and slot</h3>

            <dl-button icon="icon-dl-search">
                <dl-icon
                    size="16px"
                    icon="icon-dl-cart"
                />
                <dl-badge
                    with-border
                    floating
                    align="top"
                    color="red"
                />
            </dl-button>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue-demi'
import { DlButton, DlBadge, DlIcon } from '../components'
import { ButtonSizes } from '../components/basic/DlButton/utils'
export default defineComponent({
    name: 'DlButtonDemo',
    components: {
        DlButton,
        DlBadge,
        DlIcon
    },
    setup() {
        const buttons = reactive<ButtonSizes[]>(['s', 'm', 'l', 'xl'])

        const log = (e: Event) => console.log(e)
        return { buttons, log }
    }
})
</script>

<style scoped lang="scss">
.col {
    width: auto;
    display: flex;
    flex-wrap: wrap;
    min-width: 0;
    max-width: 100%;
    & > button,
    & > div.dl-chip {
        margin: 0 0 0 8px;
    }
}
</style>
