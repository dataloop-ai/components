<template>
    <div style="width: 700px">
        <div class="dl-panel-container-demo">
            <dl-panel-container
                v-model="collapseP1"
                :direction="direction"
                :resizable="resizable"
                :collapsable="collapsable"
                width="500px"
            >
                <dl-panel
                    resizable
                    collapsable
                >
                    <div>
                        <h3>RESIZABLE & COLLAPSABLE</h3>
                        <p>
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit. Excepturi, rerum harum aut sunt recusandae
                            obcaecati necessitatibus. Alias nulla aliquid,
                            dolorem qui, nesciunt hic iste ratione voluptates
                            magni optio quae. Vero!
                        </p>
                    </div>
                </dl-panel>
                <dl-panel resizable>
                    <h3>RESIZABLE</h3>
                    <p>
                        Lorem ipsum dolor sit amet consectetur, adipisicing
                        elit. Nam ut odit quae minus in enim, recusandae
                        repellendus a. Tenetur voluptas autem nostrum ullam
                        nesciunt exercitationem perferendis quibusdam aliquam
                        expedita quos!
                    </p>
                </dl-panel>
                <dl-panel>
                    <h3>SIMPLE PANEL</h3>
                    <p>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Natus excepturi aliquam asperiores dignissimos quo
                        molestiae repellat officiis perferendis eius nihil
                        possimus cumque similique, ea tempora earum sint
                        reprehenderit in deleniti.
                    </p>
                </dl-panel>
                <dl-panel collapsable>
                    <h3>COLLAPSABLE</h3>
                    <p>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Necessitatibus veniam ex nisi, ab temporibus sint
                        provident quibusdam suscipit vitae? Eligendi recusandae
                        aperiam asperiores numquam inventore! Possimus
                        temporibus aliquid explicabo ab?
                    </p>
                </dl-panel>
                <dl-panel>
                    <h3>LAST PANEL</h3>
                    <p>
                        Lorem ipsum dolor, sit amet consectetur adipisicing
                        elit. Itaque sint commodi aut. Quam asperiores molestias
                        quas dicta suscipit fuga? Sapiente voluptates optio
                        aperiam sint quam commodi dolor deleniti ea itaque?
                    </p>
                </dl-panel>
            </dl-panel-container>
            <dl-panel-container
                v-model="collapseP2"
                :direction="direction"
                :resizable="resizable"
                :collapsable="collapsable"
                width="200px"
            >
                <template #header>
                    <h2>Header</h2>
                </template>
                <dl-panel
                    resizable
                    collapsable
                    :height="100"
                >
                    <div>
                        <h3>RESIZABLE & COLLAPSABLE</h3>
                        <p>
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit. Excepturi, rerum harum aut sunt recusandae
                            obcaecati necessitatibus. Alias nulla aliquid,
                            dolorem qui, nesciunt hic iste ratione voluptates
                            magni optio quae. Vero!
                        </p>
                    </div>
                </dl-panel>
                <dl-panel
                    resizable
                    :collapsable="true"
                    :height="200"
                >
                    <h3>SIMPLE PANEL</h3>
                    <p>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Natus excepturi aliquam asperiores dignissimos quo
                        molestiae repellat officiis perferendis eius nihil
                        possimus cumque similique, ea tempora earum sint
                        reprehenderit in deleniti.
                    </p>
                </dl-panel>
                <dl-panel
                    resizable
                    collapsable
                    :height="100"
                >
                    <h3>LAST PANEL</h3>
                    <p>
                        Lorem ipsum dolor, sit amet consectetur adipisicing
                        elit. Itaque sint commodi aut. Quam asperiores molestias
                        quas dicta suscipit fuga? Sapiente voluptates optio
                        aperiam sint quam commodi dolor deleniti ea itaque?
                    </p>
                </dl-panel>
                <dl-panel
                    resizable
                    collapsable
                    :height="100"
                >
                    <h3>LAST PANEL 2</h3>
                    <p>
                        Lorem ipsum dolor, sit amet consectetur adipisicing
                        elit. Itaque sint commodi aut. Quam asperiores molestias
                        quas dicta suscipit fuga? Sapiente voluptates optio
                        aperiam sint quam commodi dolor deleniti ea itaque?
                    </p>
                </dl-panel>
                <dl-panel
                    resizable
                    collapsable
                    :height="100"
                >
                    <h3>LAST PANEL 3</h3>
                    <p>
                        Lorem ipsum dolor, sit amet consectetur adipisicing
                        elit. Itaque sint commodi aut. Quam asperiores molestias
                        quas dicta suscipit fuga? Sapiente voluptates optio
                        aperiam sint quam commodi dolor deleniti ea itaque?
                    </p>
                </dl-panel>
                <template #footer>
                    <div>
                        <h2>Footer</h2>
                    </div>
                </template>
            </dl-panel-container>
        </div>
        <h2>Empty State</h2>
        <div
            class="dl-panel-container-demo"
            style="margin-top: 50px"
        >
            <dl-panel-container
                v-model="collapseP1"
                :direction="direction"
                :resizable="resizable"
                :collapsable="collapsable"
                width="500px"
                height="550px"
                is-empty
                :empty-state-props="{
                    responsive: true,
                    style: 'min-height: 350px;',
                    bgSize: '130px',
                    bgImage: `url(https://raw.githubusercontent.com/dataloop-ai/icons/main/assets/usage.svg)`,
                    title: 'Lorem ipsum',
                    subtitle:
                        'Lorem ipsum dolor sit amet consectetur. Senectus condimentum dolor sit',
                    info: 'To learn more about this analytics, read our documentation.'
                }"
            >
                <template #links="">
                    <div
                        style="
                            display: flex;
                            gap: 5px;
                            flex-direction: row;
                            padding: 0 20px;
                        "
                    >
                        <dl-button
                            padding="0px"
                            icon="icon-dl-sdk-documentation"
                            flat
                            uppercase
                            label="SDK"
                        />
                        <div class="break" />
                        <dl-button
                            padding="0px"
                            icon="icon-dl-file"
                            flat
                            label="Documentation"
                        />
                        <div class="break" />
                        <dl-button
                            padding="0px"
                            icon="icon-dl-youtube"
                            flat
                            label="Video"
                        />
                    </div>
                </template>
            </dl-panel-container>
            <dl-panel-container
                v-model="collapseP2"
                :direction="direction"
                :resizable="resizable"
                :collapsable="collapsable"
                width="200px"
                height="500px"
                is-empty
                :empty-state-props="{
                    responsive: true,
                    style: 'min-height: 350px;',
                    bgSize: '130px',
                    bgImage: `url(https://raw.githubusercontent.com/dataloop-ai/icons/main/assets/usage.svg)`,
                    title: 'Lorem ipsum',
                    subtitle:
                        'Lorem ipsum dolor sit amet consectetur. Senectus condimentum dolor sit',
                    info: 'To learn more about this analytics, read our documentation.'
                }"
            >
                <template #links="">
                    <div
                        style="
                            display: flex;
                            gap: 5px;
                            flex-wrap: wrap;
                            padding: 0 20px;
                        "
                    >
                        <dl-button
                            padding="0px"
                            icon="icon-dl-sdk-documentation"
                            flat
                            uppercase
                            label="SDK"
                        />
                        <div class="break" />
                        <dl-button
                            padding="0px"
                            icon="icon-dl-file"
                            flat
                            label="Documentation"
                        />
                        <div class="break" />
                        <dl-button
                            padding="0px"
                            icon="icon-dl-youtube"
                            flat
                            label="Video"
                        />
                    </div>
                </template>
            </dl-panel-container>
        </div>
        <div class="controls">
            <select v-model="direction">
                <option>left</option>
                <option>right</option>
            </select>
            <button @click="handleCollapseP1">
                Collapse Panel 1: {{ collapseP1 }}
            </button>
            <button @click="handleCollapseP2">
                Collapse Panel 2: {{ collapseP2 }}
            </button>
            <button @click="collapsable = !collapsable">
                collapsable: {{ collapsable }}
            </button>
            <button @click="resizable = !resizable">
                resizable: {{ resizable }}
            </button>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi'
import { DlPanel, DlPanelContainer, DlButton } from '../components'

export default defineComponent({
    name: 'DlPanelContainerDemo',
    components: {
        DlPanelContainer,
        DlPanel,
        DlButton
    },
    data() {
        return {
            direction: 'right',
            collapseP1: false,
            collapseP2: false,
            collapsable: true,
            resizable: true
        }
    },
    methods: {
        handleCollapseP1() {
            this.collapseP1 = !this.collapseP1
        },
        handleCollapseP2() {
            this.collapseP2 = !this.collapseP2
        }
    },
    template: 'dl-panel-container'
})
</script>

<style scoped lang="scss">
.dl-panel-container-demo {
    display: flex;
    flex-direction: row;
    justify-content: center;
}

.controls {
    display: flex;
    padding: 10px;
    justify-content: center;
    padding: 10px;

    > * {
        margin: 5px;
    }
}
</style>
