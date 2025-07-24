<script lang="ts">
    import db, { SaveAndCloseModal } from "../lib/Data";
    import { ModalType, type CalendarEntry, type Tag } from "../lib/Models";
    import { CloseModal, entryModified, OnThisModal } from "../lib/State";
    import dayjs from "dayjs";

    let open = false;
    let tag: Tag;
    let entry: CalendarEntry;

    let displayDate: string;
    function updateDate() {
        entry.date = dayjs(displayDate).toDate();
    }

    OnThisModal(
        ModalType.AddEditEntry,
        (data) => {
            open = true;
            tag = data.tag;
            entry = data.entry || {
                tagId: tag.id || 0,
                date: (data.date || dayjs()).toDate(),
            };
            displayDate = dayjs(entry.date).format(
                tag.includeTime ? "YYYY-MM-DDTHH:mm" : "YYYY-MM-DD",
            );
        },
        () => {
            open = false;
        },
    );

    function OnSave() {
        SaveAndCloseModal(db.entry, entry);
        entryModified.set(entry);
    }
</script>

{#if open}
    <header class="modal-card-head">
        <p class="modal-card-title">{tag.name} Entry</p>
    </header>
    <section class="modal-card-body">
        <div class="field">
            {#if tag.includeTime}
                <input
                    class="input"
                    id="time"
                    bind:value={displayDate}
                    on:change={updateDate}
                    type="datetime-local"
                />
            {:else}
                <input
                    class="input"
                    id="time"
                    bind:value={displayDate}
                    on:change={updateDate}
                    type="date"
                />
            {/if}
        </div>
        <div class="field pt-3">
            <label for="notes">Notes</label>
            <textarea
                name="notes"
                class="textarea mt-2"
                bind:value={entry.notes}
                placeholder="Notes (Optional)"
            ></textarea>
        </div>
    </section>
    <footer class="modal-card-foot">
        <div class="buttons">
            <button class="button is-primary" on:click={OnSave}>Save</button>
            <button class="button" on:click={CloseModal}>Cancel</button>
        </div>
    </footer>
{/if}
