<script setup lang="ts">
import { computed, ref, useId, watch } from "vue";
import { useApiState } from "../api-context";
import ApiFields from "./ApiFields.vue";

const { responses, responseKind, labels } = useApiState();
const panelPrefix = useId();
const collapsed = ref(false);
const expandedId = computed(() => collapsed.value ? null : responseKind.value);
const rows = computed(() => responses.value.map(item => ({
  ...item,
  fields: item.mime === "application/json" ? JSON.parse(item.body) : null,
})));

watch(responseKind, () => { collapsed.value = false; });
function toggle(id: string) {
  if (id === responseKind.value) collapsed.value = !collapsed.value;
  else responseKind.value = id;
}
</script>

<template>
  <section class="api-contract">
    <h2>{{ labels[0] }}</h2>
    <div class="api-contract-list">
      <template v-for="item in rows" :key="item.id">
        <button type="button" :aria-expanded="expandedId === item.id" :aria-controls="panelPrefix + item.id" @click="toggle(item.id)">
          <span class="api-dot" :class="{failure:item.status >= 400}" aria-hidden="true"></span>
          <strong>{{ item.status }}</strong>
          <code v-if="item.id !== 'success' && item.mime === 'application/json' && Number(item.id) !== item.status">{{ item.id }}</code>
          <span>{{ item.label }}</span>
          <svg class="api-disclosure-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="m6 3 5 5-5 5" /></svg>
        </button>
        <div :id="panelPrefix + item.id" class="api-disclosure" :inert="expandedId !== item.id">
          <div class="api-disclosure-clip">
            <div class="api-contract-detail">
              <small>{{ item.mime }}</small>
              <details v-if="item.fields"><summary>{{ labels[4] }}</summary><ApiFields :fields="item.fields" /></details>
              <code v-else>{{ item.body }}</code>
            </div>
          </div>
        </div>
      </template>
    </div>
    <a class="api-catalog-link" href="/agent-setup/error-codes.json" download>error-codes.json ↓</a>
  </section>
</template>
