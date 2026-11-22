<script setup lang="ts">
import { provideApiState } from "../api-context";
import ApiExamples from "./ApiExamples.vue";
import ApiResponses from "./ApiResponses.vue";
provideApiState();
</script>

<template>
  <div class="vp-doc api-spread">
    <div class="api-article"><Content /><ApiResponses /></div>
    <ApiExamples />
  </div>
</template>
