<script setup lang="ts">
import { computed } from "vue";
import { useApiState } from "../api-context";
import ApiFields from "./ApiFields.vue";
const {responses,response,responseKind,labels} = useApiState();
const fields = computed(() => response.value.mime === "application/json" ? JSON.parse(response.value.body) : null);
</script>
<template>
  <section class="api-contract">
    <h2>{{ labels[0] }}</h2>
    <div class="api-contract-list">
      <template v-for="item in responses" :key="item.id">
        <button type="button" :aria-pressed="responseKind === item.id" @click="responseKind = item.id">
          <span class="api-dot" :class="{failure:item.status >= 400}" aria-hidden="true"></span>
          <strong>{{ item.status }}</strong>
          <code v-if="item.id !== 'success' && item.mime === 'application/json' && Number(item.id) !== item.status">{{ item.id }}</code>
          <span>{{ item.label }}</span>
        </button>
        <div v-if="responseKind === item.id" class="api-contract-detail">
          <small>{{ item.mime }}</small>
          <details v-if="fields"><summary>{{ labels[4] }}</summary><ApiFields :fields="fields" /></details>
          <code v-else>{{ item.body }}</code>
        </div>
      </template>
    </div>
    <a class="api-catalog-link" href="/agent-setup/error-codes.json" download>error-codes.json ↓</a>
  </section>
</template>
