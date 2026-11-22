<script setup lang="ts">
import { computed, ref, useId } from "vue";
import { useDocumentVisibility, useElementVisibility, usePreferredReducedMotion } from "@vueuse/core";
import UIcon from "@nuxt/ui/components/Icon.vue";
import AnimatedBeam from "./AnimatedBeam.vue";
defineProps<{ buyer: string; merchant: string; notice: string; observes: string; automation: string }>();
const panel = ref<HTMLElement>();
const visible = useElementVisibility(panel), preference = usePreferredReducedMotion(), tab = useDocumentVisibility();
const active = computed(()=>visible.value && tab.value==="visible" && preference.value!=="reduce");
const id = useId();
</script>
<template>
  <figure ref="panel" class="payment-circuit">
    <svg aria-hidden="true" viewBox="0 0 600 360" preserveAspectRatio="none">
      <defs>
        <marker :id="id+'-pay'" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 8 4 0 8z" fill="#214ded"/></marker>
        <marker :id="id+'-event'" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 8 4 0 8z" fill="#6685c0"/></marker>
      </defs>
      <AnimatedBeam path="M 146 79 H 453" :delay="-1.8" :active="active" :marker="id+'-pay'"/>
      <path d="M 300 80 V 157 Q 300 174 283 174 H 116 Q 99 174 99 191 V 230" fill="none" stroke="#6685c0" stroke-width="1.6" stroke-dasharray="4 6" :marker-end="'url(#'+id+'-event)'"/>
      <circle cx="300" cy="79" r="4.5" fill="#214ded"/>
      <AnimatedBeam path="M 146 263 H 453" :delay="-.4" :active="active" :marker="id+'-event'" signal/>
    </svg>
    <div class="circuit-node buyer-node"><i><UIcon name="i-lucide-wallet"/></i><span>{{ buyer }}</span></div>
    <div class="circuit-node merchant-node"><i><UIcon name="i-lucide-wallet-cards"/></i><span>{{ merchant }}</span></div>
    <span class="circuit-observe">{{ observes }}</span>
    <div class="circuit-node hub-node"><i><img src="/logo.png" width="34" height="34" alt=""/></i><span>EPUSDT</span></div>
    <span class="circuit-notice">{{ notice }}</span>
    <div class="circuit-node app-node"><i><UIcon name="i-lucide-workflow"/></i><span>{{ automation }}</span></div>
  </figure>
</template>
<style scoped>
.payment-circuit {
  position: relative;
  isolation: isolate;
  width: min(100%, 30rem);
  aspect-ratio: 2.05;
  min-height: 190px;
}
.payment-circuit > svg { position: absolute; inset: 0; width: 100%; height: 100%; z-index: -1; }
.circuit-node {
  position: absolute;
  width: 32%;
  display: grid;
  justify-items: center;
  transform: translateX(-50%);
}
.circuit-node i {
  display: grid;
  place-items: center;
  width: clamp(35px, 3.6vw, 46px);
  aspect-ratio: 1;
  position: absolute;
  transform: translateY(-50%);
  color: var(--blue);
  font-size: clamp(25px, 2.5vw, 34px);
  background: var(--paper);
}
.circuit-node > span {
  margin-top: clamp(20px, 2vw, 26px);
  font-size: .88rem;
  font-weight: 600;
  line-height: 1.25;
  text-align: center;
  text-wrap: balance;
}
.buyer-node, .hub-node { left: 16.5%; }
.merchant-node, .app-node { left: 83.5%; }
.buyer-node, .merchant-node { top: 21.95%; }
.hub-node, .app-node { top: 73.05%; }
.hub-node img { width: 72%; }
.circuit-observe, .circuit-notice {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  color: var(--muted);
  font: .78rem/1.3 var(--mono);
  max-width: 40%;
  text-align: center;
}
.circuit-observe { left: 34%; bottom: 53%; }
.circuit-notice { bottom: 30%; }
</style>
