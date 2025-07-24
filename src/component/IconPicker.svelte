<script lang="ts">
    import BorderNoneVariant from "svelte-material-icons/BorderNoneVariant.svelte";
    import MenuDown from "svelte-material-icons/MenuDown.svelte";
    import MenuUp from "svelte-material-icons/MenuUp.svelte";
    import { icons } from "../lib/Icons";
    let isOpen = false;
    export let value: string | undefined;
    function selectIcon(iconName: string) {
        if (value === iconName) {
            value = "";
        } else {
            value = iconName;
        }
        isOpen = false;
    }
</script>

<div class="dropdown {isOpen ? 'is-active' : ''}" style="width: 100%">
    <div class="dropdown-trigger" style="width: 100%">
        <button
            class="button is-fullwidth"
            aria-haspopup="true"
            aria-controls="icon-dropdown"
            on:click={() => (isOpen = !isOpen)}
        >
            <span class="icon is-small">
                {#if value === "" || value === undefined}
                    <BorderNoneVariant />
                {:else}
                    <svelte:component this={icons[value]} />
                {/if}
            </span>
            <span>Icon</span>
            <span class="icon is-small">
                {#if isOpen}
                    <MenuUp />
                {:else}
                    <MenuDown />
                {/if}
            </span>
        </button>
    </div>
    <div class="dropdown-menu" id="icon-dropdown" role="menu">
        <div class="dropdown-content">
            <div class="dropdown-item">
                <div class="fixed-grid has-6-cols">
                    <div class="grid">
                        {#each Object.keys(icons) as name}
                            <div class="cell">
                                <button
                                    class="button {value === name
                                        ? 'is-primary'
                                        : ''}"
                                    on:click={() => selectIcon(name)}
                                >
                                    <span class="icon">
                                        <svelte:component this={icons[name]} />
                                    </span>
                                </button>
                            </div>
                        {/each}
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
