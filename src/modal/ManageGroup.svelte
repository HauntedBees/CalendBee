<script lang="ts">
    import { ModalType, type Category } from "../lib/Models";
    import db, { SaveAndCloseModal } from "../lib/Data";
    import { CloseModal, OnThisModal } from "../lib/State";
    import IconPicker from "../component/IconPicker.svelte";

    let open = false;
    let invalidName = false;
    let category: Category;

    OnThisModal(
        ModalType.AddEditGroup,
        async (data) => {
            open = true;
            invalidName = false;
            category = data || {
                name: "",
                color: "#FFFFFF",
                icon: "",
            };
        },
        () => {
            open = false;
        },
    );

    async function saveCategory() {
        invalidName = true;
        if (!category.name) {
            return;
        }
        category.name = category.name.trim();
        if (!category.name) {
            return;
        }

        invalidName = false;
        SaveAndCloseModal(db.category, category);
    }
</script>

{#if open}
    <header class="modal-card-head">
        <p class="modal-card-title">Edit Group</p>
    </header>
    <section class="modal-card-body">
        <div class="field">
            <label class="label" for="categoryname">Name</label>
            <div class="control">
                <input
                    name="categoryname"
                    class="input {invalidName ? 'is-danger' : ''}"
                    type="text"
                    placeholder="Name"
                    on:blur={() => {
                        invalidName = !category.name;
                    }}
                    bind:value={category.name}
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
                    bind:value={category.color}
                />
            </div>
        </div>
        <div class="field">
            <IconPicker bind:value={category.icon} />
        </div>
    </section>
    <footer class="modal-card-foot">
        <div class="buttons">
            <button class="button is-primary" on:click={saveCategory}
                >Save</button
            >
            <button class="button" on:click={CloseModal}>Cancel</button>
        </div>
    </footer>
{/if}
