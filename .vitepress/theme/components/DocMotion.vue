<script setup lang="ts">
import { animate, motion, useScroll } from "motion-v";
import { nextTick, onUnmounted, watch } from "vue";
import { useRoute } from "vitepress";

const route = useRoute();
const { scrollYProgress } = useScroll();
let entry: ReturnType<typeof animate>;
watch(() => route.path, async () => {
  await nextTick();
  entry?.stop();
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const article = document.querySelector<HTMLElement>("main .vp-doc");
  if (article) entry = animate(article, { opacity: [0.84, 1], y: [4, 0] }, { duration: 0.18, ease: "easeOut" });
}, { flush: "post" });
onUnmounted(() => entry?.stop());
</script>

<template>
  <motion.div class="ep-reading-progress" aria-hidden="true" :style="{ scaleX: scrollYProgress }" />
</template>
