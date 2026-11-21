<script setup lang="ts">
import { computed, ref, shallowRef, watch } from "vue";
import { useData, useRouter } from "vitepress";
import searchIndexes from "@localSearchIndex";
import MiniSearch from "minisearch";
import UModal from "@nuxt/ui/components/Modal.vue";
import UCommandPalette from "@nuxt/ui/components/CommandPalette.vue";

const open = defineModel<boolean>({ default: false });
const props = defineProps<{ label: string; pages: { label: string; to: string }[] }>();
const { localeIndex } = useData();
const router = useRouter();
const input = ref("");
const index = shallowRef<MiniSearch>();
const loading = ref(false);
watch([open, localeIndex], async ([visible, locale], _, cleanup) => {
  input.value = "";
  if (!visible) return;
  let current = true;
  cleanup(() => { current = false; });
  index.value = undefined;
  loading.value = true;
  try {
    const json = (await searchIndexes[locale]?.())?.default;
    if (current && json) index.value = MiniSearch.loadJSON(json, {
      fields: ["title", "titles", "text"], storeFields: ["title", "titles"],
      searchOptions: { prefix: true, fuzzy: 0.2, boost: { title: 4, text: 2 } },
    });
  } finally {
    if (current) loading.value = false;
  }
}, { immediate: true });

const groups = computed(() => {
  const term = input.value.trim();
  const items = term && index.value
    ? index.value.search(term).slice(0, 18).map(hit => ({ label: hit.title as string, description: hit.titles?.join(" › "), to: String(hit.id) }))
    : props.pages.filter(p => !term || p.label.toLowerCase().includes(term.toLowerCase())).slice(0, 8);
  return [{ id: "docs", ignoreFilter: true, items: items.map(({ to, ...item }) => ({
    ...item, value: to, icon: "i-lucide-file-text", onSelect: () => { open.value = false; router.go(to); },
  })) }];
});
</script>

<template>
  <UModal v-model:open="open" :title="label">
    <template #content>
      <UCommandPalette v-model:search-term="input" :groups="groups" :placeholder="label"
        :loading="loading" close @update:open="open = $event" />
    </template>
  </UModal>
</template>
