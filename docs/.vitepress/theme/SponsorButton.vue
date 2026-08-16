<script setup lang="ts">
import { Heart } from '@lucide/vue';
</script>

<template>
  <a
    href="https://github.com/sponsors/creeperkatze"
    target="_blank"
    rel="noopener noreferrer"
    class="ml-4 inline-flex! items-center gap-1.5 rounded-full bg-(--vp-c-brand-bg) text-[13px] font-medium text-white! no-underline transition-opacity duration-150"
    aria-label="Sponsor on GitHub"
  >
    <Heart class="size-4 shrink-0" :stroke-width="2.5" />
    Sponsor
  </a>
</template>

<style scoped>
a {
  padding: 4px 12px;
}

a:hover {
  opacity: 0.8;
}
</style>
