import type { RouterConf } from "svelte-mini-router";

export const routerConf: RouterConf = {
    routes: [
        { path: "/", render: () => import("./Calendar.svelte") },
        { path: "/list", render: () => import("./List.svelte") },
        { path: "/settings", render: () => import("./Settings.svelte") },
    ],
    baseUrl: "/calendbee"
};