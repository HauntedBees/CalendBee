<script lang="ts">
    import BorderNoneVariant from "svelte-material-icons/BorderNoneVariant.svelte";
    import MenuDown from "svelte-material-icons/MenuDown.svelte";
    import MenuUp from "svelte-material-icons/MenuUp.svelte";
    import { icons } from "../lib/Icons";
    import { ModalType, type Tag } from "../lib/Models";
    import db, { SaveAndCloseModal } from "../lib/Data";
    import { CloseModal, OnThisModal } from "../lib/State";
    import IconPicker from "../component/IconPicker.svelte";

    let open = false;
    let invalidName = false;
    let categoryName = "";
    let tag: Tag;

    OnThisModal(
        ModalType.AddEditTag,
        async (data) => {
            let existingCategoryName = "";
            if (data && data.categoryId) {
                const existingCategory = await db.category.get(data.categoryId);
                if (existingCategory) {
                    existingCategoryName = existingCategory.name;
                }
            }
            open = true;
            categoryName = existingCategoryName;
            invalidName = false;
            tag = data || {
                name: "",
                color: "#FFFFFF",
                icon: "",
                includeTime: false,
            };
        },
        () => {
            open = false;
        },
    );

    async function saveTag() {
        invalidName = true;
        if (!tag.name) {
            return;
        }
        tag.name = tag.name.trim();
        if (!tag.name) {
            return;
        }

        invalidName = false;
        if (categoryName && categoryName.trim() !== "") {
            const existingCategory = await db.category
                .where("name")
                .equalsIgnoreCase(categoryName)
                .first();
            tag.categoryId = existingCategory
                ? existingCategory.id
                : await db.category.add({ name: categoryName });
        }
        SaveAndCloseModal(db.tag, tag);
    }
</script>

{#if open}
    <header class="modal-card-head">
        <p class="modal-card-title">Add Tag</p>
    </header>
    <section class="modal-card-body">
        <div class="field">
            <label class="label" for="tagname">Name</label>
            <div class="control">
                <input
                    name="tagname"
                    class="input {invalidName ? 'is-danger' : ''}"
                    type="text"
                    placeholder="Name"
                    on:blur={() => {
                        invalidName = !tag.name;
                    }}
                    bind:value={tag.name}
                />
            </div>
        </div>
        <div class="field">
            <label class="label" for="categoryname">Group</label>
            <div class="control">
                <input
                    name="categoryname"
                    class="input"
                    type="text"
                    placeholder="Group (Optional)"
                    bind:value={categoryName}
                />
            </div>
        </div>
        <div class="field">
            <label class="label" for="color">Color</label>
            <div class="control">
                <input
                    name="color"
                    class="input"
                    type="color"
                    bind:value={tag.color}
                />
            </div>
        </div>
        <div class="field">
            <IconPicker bind:value={tag.icon} />
        </div>
        <div class="field">
            <label class="checkbox">
                <input type="checkbox" bind:checked={tag.includeTime} />
                Include Time as well as Date
            </label>
        </div>
    </section>
    <footer class="modal-card-foot">
        <div class="buttons">
            <button class="button is-primary" on:click={saveTag}>Save</button>
            <button class="button" on:click={CloseModal}>Cancel</button>
        </div>
    </footer>
{/if}
