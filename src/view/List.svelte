<script lang="ts">
    import { onDestroy, onMount, tick } from "svelte";
    import CalendarPlus from "svelte-material-icons/CalendarPlus.svelte";
    import EntryDisplay from "../component/EntryDisplay.svelte";
    import SearchBar from "../component/SearchBar.svelte";
    import db, { TimeDiff } from "../lib/Data";
    import {
        FilterType,
        ModalType,
        type CalendarEntry,
        type Category,
        type FilterValue,
        type Tag,
        type TagIndex,
    } from "../lib/Models";
    import { entryModified, OpenModal, searchChanged } from "../lib/State";
    import dayjs from "dayjs";

    let tags: TagIndex = {};
    let currentEntries: CalendarEntry[] = [];
    let lastSearch: [string, FilterType, FilterValue] = [
        "",
        FilterType.None,
        undefined,
    ];

    searchChanged.subscribe((search) => {
        lastSearch = search;
        DoSearch(search[0], search[1], search[2]);
    });
    entryModified.subscribe((_) => DoSearch(...lastSearch));

    async function DoSearch(
        searchQuery: string,
        filterType: FilterType,
        filter: FilterValue,
    ) {
        console.log("piss fuck");
        if (Object.keys(tags).length === 0) {
            (await db.tag.toArray()).forEach((tag) => {
                tags[tag.id || 0] = tag;
            });
        }
        let filterFunc: (e: CalendarEntry) => boolean;
        switch (filterType) {
            case FilterType.None:
                filterFunc = (_) => true;
                break;
            case FilterType.Category:
                filterFunc = (e) => tags[e.tagId].categoryId === filter?.id;
                break;
            case FilterType.Tag:
                filterFunc = (e) => e.tagId === filter?.id;
                break;
        }
        const lowercaseQuery = searchQuery.toLowerCase();
        currentEntries = await db.entry
            .filter(
                (entry) =>
                    filterFunc(entry) &&
                    (searchQuery.trim() === "" ||
                        (entry.notes || "")
                            .toLowerCase()
                            .indexOf(lowercaseQuery) >= 0),
            )
            .toArray();
        currentEntries.sort((a, b) => b.date.getTime() - a.date.getTime());
    }

    function NewEntry() {
        const currentDay = dayjs().startOf("day");
        switch (lastSearch[1]) {
            case FilterType.None:
                OpenModal(ModalType.PickTag, {
                    date: currentDay,
                    callback: (tag) =>
                        OpenModal(ModalType.AddEditEntry, {
                            tag: tag,
                            date: currentDay,
                        }),
                });
                break;
            case FilterType.Category:
                OpenModal(ModalType.PickTag, {
                    date: currentDay,
                    category: lastSearch[2] as Category,
                    callback: (tag) =>
                        OpenModal(ModalType.AddEditEntry, {
                            tag: tag,
                            date: currentDay,
                        }),
                });
                break;
            case FilterType.Tag:
                OpenModal(ModalType.AddEditEntry, {
                    tag: lastSearch[2] as Tag,
                    date: currentDay,
                });
                break;
        }
    }

    onMount(() => {
        DoSearch("", FilterType.None, undefined);
    });

    onDestroy(() => {
        searchChanged.set(["", FilterType.None, undefined]);
    });
</script>

<SearchBar />

<div>
    <button class="button is-primary mt-4 is-fullwidth" on:click={NewEntry}>
        <span class="icon"><CalendarPlus /></span>
        <div>New Entry</div>
    </button>
    {#each currentEntries as entry, idx}
        <div>
            <div class="has-text-centered">
                <div class="line"></div>
                {#if idx === 0}
                    <span class="is-size-7 is-transparent"
                        >{TimeDiff(new Date(), entry.date)}</span
                    >
                {:else}
                    <span class="is-size-7"
                        >{TimeDiff(
                            currentEntries[idx - 1].date,
                            entry.date,
                        )}</span
                    >
                {/if}
                <div class="line"></div>
            </div>
        </div>
        <EntryDisplay {tags} {entry} showDates={false} padding={false} />
    {/each}
</div>

<style>
    .line {
        border-left: 0.5px solid white;
        border-right: 0.5px solid white;
        width: 1px;
        margin: 0 auto;
        padding: 0;
        height: 8px;
        display: block;
        opacity: 0.5;
    }
</style>
