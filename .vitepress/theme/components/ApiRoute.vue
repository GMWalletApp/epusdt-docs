<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useApiState } from "../api-context";
const { origin, route, method, labels } = useApiState();
const address = computed(() => origin.value + route.value);
const parts = computed(() => route.value.split(/(\{[^}]+\})/));
const node = ref<HTMLElement>();
const feedback = ref("");
watch(address, () => { feedback.value = ""; });
async function copyUrl() {
  try {
    await navigator.clipboard.writeText(address.value);
    feedback.value = labels.value[6];
  } catch {
    const range = document.createRange();
    range.selectNodeContents(node.value!);
    const selection = window.getSelection();
    selection?.removeAllRanges(); selection?.addRange(range);
    feedback.value = labels.value[8];
  }
}
</script>

<template>
  <div class="api-endpoint-address">
    <b class="api-verb" :data-method="method">{{ method }}</b>
    <code ref="node"><span class="api-origin">{{ origin }}</span><template v-for="(part,i) in parts" :key="i"><mark v-if="part.startsWith('{')">{{ part }}</mark><template v-else>{{ part }}</template></template></code>
    <button type="button" :disabled="!origin" :aria-label="labels[5]" :data-tip="feedback || labels[5]" @click="copyUrl">
      <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path v-if="feedback === labels[6]" d="m4 12 5 5 11-12"/><g v-else><rect x="8" y="8" width="12" height="13" rx="2"/><path d="M15 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/></g></svg>
    </button>
    <span role="status" class="sr-only">{{ feedback }}</span>
  </div>
</template>
