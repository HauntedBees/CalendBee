<script lang="ts">
    import Shape from "svelte-material-icons/Shape.svelte";
    import TagMultiple from "svelte-material-icons/TagMultiple.svelte";
    import { OpenModal } from "../lib/State";
    import { ModalType } from "../lib/Models";

    type MenuItem = {
        icon: any;
        name: string;
        onClick: () => void;
    };

    type Menu = {
        name: string;
        items: MenuItem[];
    };

    const menus: Menu[] = [
        {
            name: "Category Management",
            items: [
                {
                    name: "Manage Types",
                    icon: TagMultiple,
                    onClick: () =>
                        OpenModal(ModalType.PickTag, {
                            showNew: true,
                            callback: (tag) =>
                                OpenModal(ModalType.AddEditTag, tag),
                        }),
                },
                {
                    name: "Manage Groups",
                    icon: Shape,
                    onClick: () =>
                        OpenModal(ModalType.PickTag, {
                            pickCategory: true,
                            callback: (_) => {},
                        }),
                },
            ],
        },
    ];
</script>

<div class="menu px-3 py-4">
    {#each menus as menu}
        <p class="menu-label">{menu.name}</p>
        <ul class="menu-list">
            {#each menu.items as item}
                <li>
                    <button on:click={item.onClick}>
                        <span class="icon"
                            ><svelte:component this={item.icon} /></span
                        >
                        {item.name}
                    </button>
                </li>
            {/each}
        </ul>
    {/each}
</div>
