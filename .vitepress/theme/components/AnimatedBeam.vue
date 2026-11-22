<script setup lang="ts">
// Adapted from Inspira UI Animated Beam (MIT, eec920b). See /licenses/inspira-ui.txt.
// Paths use a shared viewBox so their anchors are already aligned at first paint.
import { computed, useId } from "vue";
const props = defineProps<{ path: string; delay: number; reverse?: boolean; marker: string; signal?: boolean; active: boolean }>();
const id = useId();
const sweep = computed(() => props.reverse ? "110%;-10%" : "-10%;110%");
const tail = computed(() => props.reverse ? "85%;-35%" : "-35%;85%");
</script>
<template>
  <g fill="none" stroke-linecap="round">
    <path :d="path"  :stroke="signal ? '#ab8cde' : '#739bf1'" :stroke-dasharray="signal ? '4 6' : undefined" :marker-end="'url(#'+marker+')'" stroke-width="2" />
    <path v-if="active" :d="path" :stroke="'url(#'+id+')'" stroke-width="2.5" />
    <defs>
      <linearGradient :id="id" gradientUnits="userSpaceOnUse" x1="-10%" x2="-35%" y1="0" y2="0">
        <stop stop-color="#b5d2ff"/><stop offset=".36" stop-color="#548bff"/><stop offset="1" stop-color="#315fff" stop-opacity="0"/>
        <template v-if="active">
          <animate attributeName="x1" :values="sweep" :begin="delay+'s'" dur="3.8s" repeatCount="indefinite"/>
          <animate attributeName="x2" :values="tail" :begin="delay+'s'" dur="3.8s" repeatCount="indefinite"/>
        </template>
      </linearGradient>
    </defs>
  </g>
</template>
