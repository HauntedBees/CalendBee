<script lang="ts">
    import dayjs from "dayjs";
    import CalendarPlus from "svelte-material-icons/CalendarPlus.svelte";
    import ArrowLeft from "svelte-material-icons/ArrowLeft.svelte";
    import ArrowRight from "svelte-material-icons/ArrowRight.svelte";
    import db from "../lib/Data";
    import {
        ModalType,
        type CalendarEntry,
        type TagIndex,
    } from "../lib/Models";
    import { icons } from "../lib/Icons";
    import { entryModified, OpenModal } from "../lib/State";
    import EntryDisplay from "../component/EntryDisplay.svelte";
    import { tick } from "svelte";

    let currentDay = dayjs().startOf("day");
    let currentMonth = dayjs().startOf("month");
    let previousMonth = currentMonth.subtract(1, "month");
    let nextMonth = currentMonth.add(1, "month");
    let weekStarts: dayjs.Dayjs[] = [];

    let tags: TagIndex = {};
    type TagEvents = { [tag: number]: CalendarEntry[] };
    type EntryList = { [day: string]: CalendarEntry[] };
    let thisMonthsEntries: EntryList = {};
    let todaysEntries: CalendarEntry[] = [];
    let tagsEntriesSorted: TagEvents = [];

    async function UpdateMonth(change: number) {
        currentMonth = currentMonth.add(change, "month");
        previousMonth = currentMonth.subtract(1, "month");
        nextMonth = currentMonth.add(1, "month");
        weekStarts = [currentMonth.startOf("week")];
        while (true) {
            const next = weekStarts[weekStarts.length - 1].add(1, "week");
            if (next.isSame(currentMonth, "month")) {
                weekStarts.push(next);
            } else {
                break;
            }
        }

        // TODO: this doesn't need to be done every time we update the month
        const allEntries = await db.entry.toArray();
        tagsEntriesSorted = allEntries.reduce(
            (accumulator: TagEvents, entry) => {
                if (!accumulator[entry.tagId]) {
                    accumulator[entry.tagId] = [];
                }
                accumulator[entry.tagId].push(entry);
                return accumulator;
            },
            {},
        );
        Object.values(tagsEntriesSorted).forEach((list) => {
            list.sort((a, b) => b.date.getTime() - a.date.getTime());
        });

        const currentMonthAsDate = currentMonth.toDate();
        const nextMonthAsDate = nextMonth.toDate();
        const entries = allEntries.filter(
            (d) => d.date >= currentMonthAsDate && d.date < nextMonthAsDate,
        );

        thisMonthsEntries = entries.reduce((accumulator: EntryList, entry) => {
            const key = dayjs(entry.date).startOf("day").format();
            if (!accumulator[key]) {
                accumulator[key] = [];
            }
            accumulator[key].push(entry);
            return accumulator;
        }, {});
    }
    function WeekArray(startOfWeek: dayjs.Dayjs): dayjs.Dayjs[] {
        return [
            startOfWeek,
            startOfWeek.add(1, "day"),
            startOfWeek.add(2, "day"),
            startOfWeek.add(3, "day"),
            startOfWeek.add(4, "day"),
            startOfWeek.add(5, "day"),
            startOfWeek.add(6, "day"),
        ];
    }

    async function ViewDay(day: dayjs.Dayjs) {
        currentDay = day;
        todaysEntries = [];
        await tick();
        todaysEntries = thisMonthsEntries[day.format()] || [];
    }

    async function Initialize() {
        const allTags = (await db.tag.toArray()) || [];
        allTags.reduce((_, tag) => {
            tags[tag.id || 0] = tag;
            return tag;
        }, {});
        await UpdateMonth(0);
        ViewDay(currentDay);
    }
    Initialize();

    entryModified.subscribe(async (_) => {
        await UpdateMonth(0);
        ViewDay(currentDay);
    });
</script>

<table class="table is-fullwidth is-narrow mb-3">
    <thead class="thead">
        <tr>
            <th class="has-text-centered">
                <button on:click={() => UpdateMonth(-1)}>
                    <span class="icon">
                        <ArrowLeft />
                    </span>
                </button>
            </th>
            <th class="has-text-centered" colspan="5"
                >{currentMonth.format("MMMM YYYY")}</th
            >
            <th class="has-text-centered">
                <button on:click={() => UpdateMonth(1)}>
                    <span class="icon">
                        <ArrowRight />
                    </span>
                </button>
            </th>
        </tr>
        <tr class="has-text-centered">
            <th>SUN</th>
            <th>MON</th>
            <th>TUE</th>
            <th>WED</th>
            <th>THU</th>
            <th>FRI</th>
            <th>SAT</th>
        </tr>
    </thead>
    <tbody class="tbody">
        {#each weekStarts as week}
            <tr>
                {#each WeekArray(week) as day}
                    <td class="is-clickable" on:click={() => ViewDay(day)}>
                        <div>
                            <div
                                class="has-text-right {day.isSame(
                                    currentMonth,
                                    'month',
                                )
                                    ? ''
                                    : 'has-text-grey'}"
                            >
                                {day.format("D")}
                            </div>
                            {#each thisMonthsEntries[day.format()] as e}
                                <span
                                    class="icon"
                                    style="color: {tags[e.tagId].color}"
                                >
                                    <svelte:component
                                        this={icons[tags[e.tagId].icon]}
                                    />
                                </span>
                            {/each}
                        </div>
                    </td>
                {/each}
            </tr>
        {/each}
    </tbody>
</table>
<div>
    <h4 class="is-size-5 pb-2 px-2 is-flex is-align-items-center">
        <div class="is-flex-grow-1">{currentDay.format("MMMM D, YYYY")}</div>
        <button
            class="button is-button is-small is-primary is-flex-grow-0"
            on:click={() =>
                OpenModal(ModalType.PickTag, {
                    date: currentDay,
                    callback: (tag) =>
                        OpenModal(ModalType.AddEditEntry, {
                            tag: tag,
                            date: currentDay,
                        }),
                })}
        >
            <span class="icon"><CalendarPlus /></span>
            <div>New Entry</div></button
        >
    </h4>
    {#if todaysEntries.length === 0}
        <div class="box m-2">
            No records for {currentDay.format("MMMM D, YYYY")}.
        </div>
    {:else}
        {#each todaysEntries as entry}
            <EntryDisplay {tags} {entry} showDates />
        {/each}
    {/if}
</div>

<style>
    td > div {
        min-height: 60px;
    }
</style>
