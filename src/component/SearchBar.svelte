<script lang="ts">
    import Filter from "svelte-material-icons/Filter.svelte";
    import FilterOutline from "svelte-material-icons/FilterOutline.svelte";
    import Magnify from "svelte-material-icons/Magnify.svelte";
    import {
        FilterType,
        ModalType,
        type FilterValue,
        type Tag,
    } from "../lib/Models";
    import {
        CloseModal,
        filterSelect,
        OpenModal,
        searchChanged,
    } from "../lib/State";

    let searchQuery = "";
    let filterType = FilterType.None;
    let currentFilter: FilterValue = undefined;
    function OpenFilter() {
        OpenModal(ModalType.PickTag, {
            fromFilter: true,
            callback: (_tag: Tag) => {},
        });
    }

    function Search() {
        searchChanged.set([searchQuery, filterType, currentFilter]);
    }

    filterSelect.subscribe((newValue) => {
        [filterType, currentFilter] = newValue;
        Search();
        CloseModal();
    });
</script>

<div>
    <div class="field has-addons">
        <p class="control has-icons-left">
            <input
                class="input"
                type="text"
                on:blur={Search}
                bind:value={searchQuery}
                placeholder="Search"
            />
            <span class="icon is-left">
                <Magnify />
            </span>
        </p>
        <p class="control">
            <button class="button" on:click={OpenFilter}>
                <span class="icon">
                    {#if filterType == FilterType.None}
                        <FilterOutline />
                    {:else}
                        <Filter />
                    {/if}
                </span>
            </button>
        </p>
    </div>
</div>

<style>
    .control.has-icons-left {
        width: 100%;
    }
</style>
