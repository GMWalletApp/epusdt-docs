<script setup lang="ts">
import { defineAsyncComponent } from "vue";
import { useData } from "vitepress";
const { frontmatter } = useData();
const NuxtDocsLayout = defineAsyncComponent(() => import("./NuxtDocsLayout.vue"));
</script>

<template>
  <Content v-if="frontmatter.layout === false" />
  <NuxtDocsLayout v-else />
</template>
