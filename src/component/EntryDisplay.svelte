<script lang="ts">
    import dayjs from "dayjs";
    import type { CalendarEntry, TagIndex } from "../lib/Models";
    import { icons } from "../lib/Icons";
    import db, { TimeDiff } from "../lib/Data";
    import CircleSmall from "svelte-material-icons/CircleSmall.svelte";
    import MenuLeft from "svelte-material-icons/MenuLeft.svelte";
    import MenuRight from "svelte-material-icons/MenuRight.svelte";
    import { onMount } from "svelte";

    export let tags: TagIndex;
    export let entry: CalendarEntry;
    export let showDates = false;
    export let padding = true;
    export let prev: CalendarEntry | undefined = undefined;
    export let next: CalendarEntry | undefined = undefined;

    let previousTime = "";
    let nextTime = "";
    let nextTimeIsProjected = false;

    async function SetDates() {
        if (!showDates) {
            return;
        }
        if (prev == undefined && next == undefined) {
            const allOfType = await db.entry
                .where("tagId")
                .equals(entry.tagId)
                .toArray();
            allOfType.sort((a, b) => b.date.getTime() - a.date.getTime());
            const myIndex = allOfType.findIndex((e) => e.id === entry.id);
            if (myIndex >= 0) {
                previousTime =
                    myIndex + 1 < allOfType.length
                        ? TimeDiff(entry.date, allOfType[myIndex + 1].date)
                        : "";
                nextTimeIsProjected = myIndex === 0;
                nextTime =
                    myIndex > 0
                        ? TimeDiff(allOfType[myIndex - 1].date, entry.date)
                        : TimeDiff(new Date(), entry.date);
            }
        } else {
            if (prev != undefined) {
                previousTime = TimeDiff(entry.date, prev.date);
            }
            if (next != undefined) {
                nextTime = TimeDiff(next.date, entry.date);
            }
        }
    }

    onMount(() => SetDates());
</script>

<div
    class="box {padding ? 'm-2' : 'mx-2 my-0'} has-text-black py-2"
    style="background-color: {tags[entry.tagId].color}"
>
    <div class="is-flex is-align-items-center">
        <div class="icon is-flex-grow-0">
            <svelte:component this={icons[tags[entry.tagId].icon]} />
        </div>
        <div class="is-flex-grow-1">
            <span>{tags[entry.tagId].name}</span>
        </div>
        {#if tags[entry.tagId].includeTime}
            <div class="is-flex-grow-0 has-text-right has-text-dark is-size-7">
                {dayjs(entry.date).format("HH:mm")}
            </div>
        {/if}
    </div>
    {#if showDates}
        <div class="has-text-dark is-size-7">
            {#if previousTime !== ""}
                <span class="icon-text">
                    <span class="icon is-narrow"><MenuLeft /></span>
                    <span>{previousTime}</span>
                </span>
            {/if}
            {#if previousTime !== "" && nextTime !== ""}
                <span class="icon is-narrow"><CircleSmall /></span>
            {/if}
            {#if nextTime !== ""}
                <span
                    class="icon-text {nextTimeIsProjected
                        ? 'is-transparent'
                        : ''}"
                >
                    <span>{nextTime}</span>
                    <span class="icon is-narrow"><MenuRight /></span>
                </span>
            {/if}
        </div>
    {/if}
    {#if entry.notes}
        <div class="is-size-7">{entry.notes}</div>
    {/if}
</div>
