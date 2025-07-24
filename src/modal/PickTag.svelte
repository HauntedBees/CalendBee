<script lang="ts">
    import Shape from "svelte-material-icons/Shape.svelte";
    import { icons } from "../lib/Icons";
    import {
        FilterType,
        ModalType,
        type Category,
        type Tag,
    } from "../lib/Models";
    import db from "../lib/Data";
    import {
        CloseModal,
        filterSelect,
        OnThisModal,
        OpenModal,
    } from "../lib/State";
    import type dayjs from "dayjs";

    let open = false;
    let modalTitle = "Pick a Group";
    let tagPickCallback: (tag: Tag) => void = (_) => {};
    let specificDate: dayjs.Dayjs | undefined;
    let showNew = false;
    let isFilter = false;
    let pickCategory = false;

    let specificCategory: Category | undefined = undefined;
    let tags: Tag[] = [];
    let categories: Category[] = [];
    let activeTags: Tag[] = [];

    OnThisModal(
        ModalType.PickTag,
        (data) => {
            open = true;
            specificDate = data.date;
            if (data.fromFilter) {
                tagPickCallback = (tag: Tag) =>
                    filterSelect.set([FilterType.Tag, tag]);
            } else {
                tagPickCallback = data.callback;
            }
            pickCategory = data.pickCategory || false;
            showNew = data.showNew || false;
            isFilter = data.fromFilter || false;
            specificCategory = data.category;
            modalTitle = "Pick a Group";
            LoadData();
        },
        () => {
            open = false;
        },
    );

    function SetCategory(category: Category | undefined) {
        if (category) {
            if (pickCategory) {
                OpenModal(ModalType.AddEditGroup, category);
            } else {
                specificCategory = category;
                modalTitle = `Pick a Type (${specificCategory.name || "Uncategorized"})`;
                activeTags = tags.filter(
                    (t) => (t.categoryId || 0) === category.id,
                );
            }
        } else {
            modalTitle = "Pick a Group";
            specificCategory = undefined;
            activeTags = [];
        }
    }

    async function LoadData() {
        tags = await db.tag.toArray();
        categories = await db.category.toArray();
        if (tags.some((t) => !t.categoryId)) {
            categories.push({
                id: 0,
                name: "Uncategorized",
            });
        }
        if (categories.length === 1) {
            SetCategory(categories[0]);
        }
    }
</script>

{#if open}
    <header class="modal-card-head">
        <p class="modal-card-title">{modalTitle}</p>
    </header>
    <section class="modal-card-body">
        {#if specificCategory === undefined}
            <div class="grid is-gap-0">
                {#each categories as category}
                    <div class="cell">
                        <button
                            class="button is-fullwidth is-block py-5"
                            style="background-color: {category.color}"
                            on:click={() => SetCategory(category)}
                        >
                            <div>
                                <span class="icon is-large">
                                    {#if category.icon}
                                        <svelte:component
                                            this={icons[category.icon]}
                                        />
                                    {:else}
                                        <Shape />
                                    {/if}
                                </span>
                            </div>
                            <div>
                                {category.name}
                            </div>
                        </button>
                    </div>
                {/each}
            </div>
        {:else}
            <div class="grid is-gap-0">
                {#each activeTags as tag}
                    <div class="cell">
                        <button
                            class="button is-fullwidth is-block py-5"
                            style="background-color: {tag.color}"
                            on:click={() => tagPickCallback(tag)}
                        >
                            <div>
                                <span class="icon is-large">
                                    {#if tag.icon}
                                        <svelte:component
                                            this={icons[tag.icon]}
                                        />
                                    {:else}
                                        <Shape />
                                    {/if}
                                </span>
                            </div>
                            <div>
                                {tag.name}
                            </div>
                        </button>
                    </div>
                {/each}
            </div>
        {/if}
    </section>
    <footer class="modal-card-foot">
        <div class="buttons">
            {#if isFilter}
                {#if specificCategory && categories.length > 1}
                    <button
                        class="button is-primary"
                        on:click={() =>
                            filterSelect.set([
                                FilterType.Category,
                                specificCategory,
                            ])}>Choose Category</button
                    >
                {:else}
                    <button
                        class="button is-primary"
                        on:click={() =>
                            filterSelect.set([FilterType.None, undefined])}
                        >Clear Filter</button
                    >
                {/if}
            {/if}
            {#if showNew}
                <button
                    class="button is-primary"
                    on:click={() => OpenModal(ModalType.AddEditTag)}>New</button
                >
            {/if}
            {#if specificCategory && categories.length > 1}
                <button
                    on:click={() => SetCategory(undefined)}
                    class="button is-info">Back</button
                >
            {/if}
            {#if !isFilter || specificCategory === undefined}
                <button class="button" on:click={CloseModal}>Cancel</button>
            {/if}
        </div>
    </footer>
{/if}
