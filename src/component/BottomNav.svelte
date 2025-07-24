<script lang="ts">
    import Cog from "svelte-material-icons/Cog.svelte";
    import Calendar from "svelte-material-icons/Calendar.svelte";
    import ViewList from "svelte-material-icons/ViewList.svelte";
    import { navigate } from "svelte-mini-router";

    const items = [
        {
            icon: Calendar,
            text: "Calendar",
            path: "/",
        },
        {
            icon: ViewList,
            text: "List",
            path: "/list",
        },
        {
            icon: Cog,
            text: "Settings",
            path: "/settings",
        },
    ];
</script>

<nav class="navbar is-fixed-bottom">
    <div class="navbar-brand">
        {#each items as item}
            <button
                class="navbar-item is-flex flex-grow is-align-self-stretch is-block button has-background-info-dark"
                on:click={() => navigate(item.path)}
            >
                <div>
                    <span class="icon"
                        ><svelte:component this={item.icon} /></span
                    >
                </div>
                <div class="is-size-7">{item.text}</div>
            </button>
        {/each}
    </div>
</nav>
