<template>
    <div>
        <div class="dl-text-holder-demo">
            Label with actions
            <dl-label
                indicator-color="dl-color-secondary"
                text="dl-labelaaaaaaaaaaaaaa"
            >
                <template #actions>
                    <div
                        style="
                            display: flex;
                            gap: 5px;
                            align-items: center;
                            height: 100%;
                            margin-right: 5px;
                        "
                    >
                        <dl-icon icon="icon-dl-add" />
                        <dl-icon icon="icon-dl-delete" />
                    </div>
                </template>
            </dl-label>
        </div>
        <div class="dl-text-holder-demo">
            Label with hint
            <dl-label
                indicator-color="dl-color-secondary"
                hint="tooltip"
                text="dl-labelaaaaaaaaaaaaaa"
            />
        </div>
        <div class="dl-text-holder-demo">
            Label with and actions
            <dl-label
                indicator-color="dl-color-secondary"
                hint="tooltip"
                text="dl-labelaaaaaaaaaaaaaa"
            >
                <template #actions>
                    <div
                        style="
                            display: flex;
                            gap: 5px;
                            align-items: center;
                            height: 100%;
                            margin-right: 5px;
                        "
                    >
                        <dl-icon icon="icon-dl-add" />
                        <dl-icon icon="icon-dl-delete" />
                    </div>
                </template>
            </dl-label>
        </div>
        <div class="dl-text-holder-demo">
            Label with prefix
            <dl-label
                indicator-color="dl-color-secondary"
                hint="tooltip"
                text="dl-labelaaaaaaaaaaaaaadjsfskdlfjdslkfjskfljslkadjakldjdkljdkladjakldajdlkadsjakldaj"
                prefix="%"
            >
                <template #actions>
                    <div
                        style="
                            display: flex;
                            gap: 5px;
                            align-items: center;
                            height: 100%;
                            margin-right: 5px;
                        "
                    >
                        <dl-icon icon="icon-dl-add" />
                        <dl-icon icon="icon-dl-delete" />
                    </div>
                </template>
            </dl-label>
        </div>
        <div class="dl-text-holder-demo">
            Label with suffix
            <dl-label
                indicator-color="dl-color-secondary"
                hint="tooltip"
                text="dl-labelaaaaaaaaaaaaaa"
                suffix=".mp3"
            >
                <template #actions>
                    <div
                        style="
                            display: flex;
                            gap: 5px;
                            align-items: center;
                            height: 100%;
                            margin-right: 5px;
                        "
                    >
                        <dl-icon icon="icon-dl-add" />
                        <dl-icon icon="icon-dl-delete" />
                    </div>
                </template>
            </dl-label>
        </div>
        <div
            class="dl-text-holder-demo"
            style="width: 500px"
        >
            Label with suffix in a large container
            <dl-label
                indicator-color="dl-color-secondary"
                hint="tooltip"
                text="dl-labelaaaaaaaaaaaaaa"
                suffix=".mp3"
            >
                <template #actions>
                    <div
                        style="
                            display: flex;
                            gap: 5px;
                            align-items: center;
                            height: 100%;
                            margin-right: 5px;
                        "
                    >
                        <dl-icon icon="icon-dl-add" />
                        <dl-icon icon="icon-dl-delete" />
                    </div>
                </template>
            </dl-label>
        </div>
        <div
            class="dl-text-holder-demo"
            style="width: 500px"
        >
            Label with suffix in a large container and fluid
            <dl-label
                indicator-color="dl-color-secondary"
                hint="tooltip"
                text="dl-labelaaaaaaaaaaaaaa"
                suffix=".mp3asdasdsfjksdhfjkdsfhkajshdsakjdhasjkdhaskjdhaskjdhaskjdhaskjfhdskjahrjkasdhjksadhasjkashjfg"
                fluid
            >
                <template #actions>
                    <div
                        style="
                            display: flex;
                            gap: 5px;
                            align-items: center;
                            height: 100%;
                            margin-right: 5px;
                        "
                    >
                        <dl-icon icon="icon-dl-add" />
                        <dl-icon icon="icon-dl-delete" />
                    </div>
                </template>
            </dl-label>
        </div>
        <div class="dl-text-holder-demo">
            Label with a big suffix
            <dl-label
                indicator-color="dl-color-secondary"
                hint="tooltip"
                text="dl-labelaaaaaaaaaaaaaa"
                suffix=".askdjhask jshadk jsah dajk dhsa djksahd ksaj dhajkd ah dkajsd haskd shds asd asd sadas "
            />
        </div>
        <div class="dl-text-holder-demo">
            Label with suffix and separator
            <dl-label
                id="show-both-ends"
                text="I am a package name"
            >
                <template #suffix>
                    <span
                        style="
                            width: 100%;
                            display: inline-flex;
                            gap: 2px;
                            margin-left: 2px;
                        "
                    >
                        <span style="color: var(--dl-color-lighter)">|</span>
                        <dl-ellipsis
                            text="I am a very long model name I am a very long model name"
                        />
                    </span>
                </template>
            </dl-label>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi'
import { DlLabel, DlIcon, DlEllipsis } from '../components'

export default defineComponent({
    components: {
        DlLabel,
        DlIcon,
        DlEllipsis
    }
})
</script>

<style scoped>
.dl-text-holder-demo {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    width: 300px;
    padding: 5px;
    word-wrap: break-word;
}
</style>
<style lang="scss">
#show-both-ends {
    .dl-label__suffix-content {
        flex: 1 2 auto;
    }
}
</style>
