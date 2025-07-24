<script lang="ts">
  import { Router } from "svelte-mini-router";
  import { routerConf } from "./view/RouterConfig";
  import ModalHandler from "./modal/ModalHandler.svelte";
  import BottomNav from "./component/BottomNav.svelte";
</script>

<main>
  <Router {routerConf} />
</main>
<BottomNav />
<ModalHandler />
