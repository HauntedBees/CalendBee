<script lang="ts">
    import { CloseModal, currentModal } from "../lib/State";
    import ManageTag from "./ManageTag.svelte";
    import ManageEntry from "./ManageEntry.svelte";
    import PickTag from "./PickTag.svelte";
    import ManageGroup from "./ManageGroup.svelte";

    let open = false;
    currentModal.subscribe((modalData) => {
        open = modalData !== null;
    });
</script>

<div class="modal {open ? 'is-active' : ''}">
    <div
        class="modal-background"
        role="presentation"
        on:click={CloseModal}
    ></div>
    <div class="modal-card">
        <ManageTag />
        <ManageEntry />
        <ManageGroup />
        <PickTag />
    </div>
</div>
