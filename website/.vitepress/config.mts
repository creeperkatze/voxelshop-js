import { version } from "../../package.json";
import { defineDocsConfig } from "./shared/docs";

export default defineDocsConfig({
  name: "voxelshop-js",
  description: "A framework-agnostic fully typed JavaScript client for the voxel.shop API.",
  repo: "creeperkatze/voxelshop-js",
  version,
  guide: [
    { text: "Getting Started", link: "/guide/getting-started" },
    { text: "Error Handling", link: "/guide/error-handling" },
    { text: "Custom Fetch", link: "/guide/custom-fetch" },
    { text: "General", link: "/guide/general" },
    { text: "Plugins", link: "/guide/plugins" },
    { text: "Resources", link: "/guide/resources" },
    { text: "Managers", link: "/guide/managers" },
    { text: "Authors", link: "/guide/authors" },
    { text: "Platforms", link: "/guide/platforms" },
  ],
  api: new URL("../api", import.meta.url),
});
