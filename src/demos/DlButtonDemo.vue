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
                        label="Contained text filled"
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
                        flat primary
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
        <div
            style="
                display: flex;
                justify-content: center;
                flex-direction: column;
            "
        >
            <h3>Button keeping its active state with menu</h3>
            <dl-button
                :active="activeButtonState"
                @click="activeButtonState = !activeButtonState"
            >
                {{ activeButtonState ? 'Close' : 'Open' }}
                <dl-menu
                    :offset="[0, 5]"
                    anchor="bottom middle"
                    self="top middle"
                    :model-value="!activeButtonState"
                >
                    <div
                        style="width: 100px; height: 100px; text-align: center"
                    >
                        Menu
                    </div>
                </dl-menu>
            </dl-button>
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
        <div>
            <h3>Button with icon no label and menu</h3>
            <p>should not have extra margin in right</p>
            <dl-button icon="icon-dl-search">
                <dl-menu>
                    <dl-list>
                        <dl-list-item>item 1</dl-list-item>
                        <dl-list-item> item 2</dl-list-item>
                    </dl-list>
                </dl-menu>
            </dl-button>
        </div>
        <div>
            <h3>Button with icon no label and menu</h3>
            <p>should have</p>
            <dl-button icon="icon-dl-search">
                <div>
                    test
                    <dl-menu>
                        <dl-list>
                            <dl-list-item>item 1</dl-list-item>
                            <dl-list-item> item 2</dl-list-item>
                        </dl-list>
                    </dl-menu>
                </div>
            </dl-button>
        </div>
        <div>
            <h3>Shaded and outlined</h3>
            <dl-button
                icon="icon-dl-search"
                label="test me"
                shaded
                outlined
            />
        </div>
        <div style="display: flex; flex-direction: column">
            <h3>button with icon color</h3>
            <dl-button
                icon="icon-dl-search"
                :icon-color="'red'"
                :text-color="'blue'"
                color="green"
                label="test me"
                size="s"
                flat
            />
            <dl-button
                icon="icon-dl-search"
                :icon-color="'red'"
                :text-color="'blue'"
                color="green"
                label="test me"
                size="s"
                shaded
            />
            <dl-button
                icon="icon-dl-search"
                :icon-color="'red'"
                :text-color="'blue'"
                color="green"
                label="test me"
                size="s"
                outlined
            />
            <dl-button
                icon="icon-dl-search"
                :icon-color="'red'"
                :text-color="'blue'"
                color="green"
                label="test me"
                size="s"
                filled
            />
        </div>
        <div style="display: flex; flex-direction: column">
            <h3>button with tooltip</h3>
            <dl-button
                label="test me"
                tooltip="test me please"
            />
        </div>
        <div style="display: flex; justify-content: center; margin-top: 50px">
            <dl-button
                id="import-info-dl-button"
                flat
                icon="icon-dl-info"
                size="s"
            />
        </div>
        <div style="display: flex; justify-content: center; margin-top: 20px">
            <dl-button
                flat
                icon="icon-dl-info"
                size="s"
                icon-color="dell-green-200"
                text-color="dell-yellow-800"
            >
                Info Button
                <dl-menu hover-group="info-menu">
                    <div style="padding: 10px; text-align: center">
                        Hello World
                    </div>
                </dl-menu>
            </dl-button>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue-demi'
import { DlButton, DlBadge, DlIcon, DlMenu } from '../components'
import { ButtonSizes } from '../components/basic/DlButton/utils'
import DlList from '../components/essential/DlList/DlList.vue'
import DlListItem from '../components/basic/DlListItem/DlListItem.vue'

export default defineComponent({
    name: 'DlButtonDemo',
    components: {
        DlListItem,
        DlList,
        DlMenu,
        DlButton,
        DlBadge,
        DlIcon
    },
    setup() {
        const buttons = reactive<(ButtonSizes | string)[]>(
            Object.values(ButtonSizes)
        )
        const activeButtonState = ref(false)

        const log = (e: Event) => console.log(e)
        return { buttons, log, activeButtonState }
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
