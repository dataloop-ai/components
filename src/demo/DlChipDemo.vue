<template>
    <div style="width: 800px">
        <div
            class="col"
            style="margin-bottom: 30px"
        >
            <DlChip label="Lorem ipsum dolor" />
            <DlChip
                outlined
                label="Chip outlined"
            />
            <DlChip
                disabled
                label="Chip disabled"
            />
            <DlChip label="Ellipsed Chip with a multiple words" />
            <DlChip
                label="Ellipsed Chip with a multiple words"
                icon="icon-dl-search"
            />
            <DlChip
                label="custom max width (200px)"
                icon="icon-dl-search"
                max-width="200px"
            />
        </div>
        <h4>Removable Chips</h4>
        <div
            class="col"
            style="margin-bottom: 30px"
        >
            <DlChip
                removable
                label="Chip filled"
                @remove="log('removable')"
            />
            <DlChip
                removable
                outlined
                label="Chip outlined"
                @remove="log('outlined')"
            />
            <DlChip
                removable
                disabled
                label="Chip disabled"
                @remove="log('disabled')"
            />
            <DlChip
                removable
                label="Ellipsed Chip with a multiple words"
                @remove="log('ellipsed')"
            />
            <DlChip
                removable
                label="custom max width (200px)"
                max-width="200px"
                @remove="log('test')"
            />
        </div>
        <h4>Removable Chips with icon</h4>
        <div
            class="col"
            style="margin-bottom: 30px"
        >
            <DlChip
                removable
                icon="icon-dl-search"
                label="Chip filled"
                @remove="log('test')"
            />
            <DlChip
                removable
                icon="icon-dl-search"
                @remove="log('test')"
            />
            <DlChip
                removable
                icon="icon-dl-search"
                outlined
                label="Chip outlined"
                @remove="log('test')"
            />
            <DlChip
                removable
                icon="icon-dl-search"
                disabled
                label="Chip disabled"
                @remove="log('test')"
            />
            <DlChip
                removable
                label="Ellipsed Chip with a multiple words"
                icon="icon-dl-search"
                @remove="log('test')"
            />
            <DlChip
                removable
                label="custom max width (200px)"
                icon="icon-dl-search"
                max-width="200px"
                @remove="log('test')"
            />
        </div>
        <h4>Removable Chips without icon and label</h4>
        <div
            class="col"
            style="margin-bottom: 30px"
        >
            <DlChip
                removable
                @remove="log('test')"
            />
            <DlChip
                removable
                outlined
                @remove="log('test')"
            />
            <DlChip
                removable
                disabled
                @remove="log('test')"
            />
        </div>
        <h4>Chips with label slot</h4>
        <div
            class="col"
            style="margin-bottom: 30px"
        >
            <DlChip
                v-model="removableValue"
                removable
                label="Ellipsed Chip with a multiple words"
            />
        </div>
        <h4>Chips with icon and without label</h4>
        <div
            class="col"
            style="margin-bottom: 30px"
        >
            <DlChip icon="icon-dl-search" />
            <DlChip
                icon="icon-dl-search"
                outlined
            />
            <DlChip
                icon="icon-dl-search"
                disabled
            />
        </div>
        <h4>Chips with overflow</h4>
        <div
            class="col"
            style="margin-bottom: 30px"
        >
            <DlChip
                label="Long Chip Label With Alot Of Text"
                max-width="75px"
                overflow
            />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue-demi'
import { DlChip } from '../components'
export default defineComponent({
    name: 'DlChipDemo',
    components: {
        DlChip
    },
    setup() {
        const log = (e: Event) => console.log(e)

        const removableValue = ref(true)
        return { log, removableValue }
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
