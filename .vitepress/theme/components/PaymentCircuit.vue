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
        <marker :id="id+'-pay'" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 8 4 0 8z" fill="#88afff"/></marker>
        <marker :id="id+'-event'" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 8 4 0 8z" fill="#c9aeff"/></marker>
      </defs>
      <AnimatedBeam path="M 146 79 H 453" :delay="-1.8" :active="active" :marker="id+'-pay'"/>
      <path d="M 300 80 V 157 Q 300 174 283 174 H 116 Q 99 174 99 191 V 230" fill="none" stroke="#aa8de0" stroke-width="1.6" stroke-dasharray="4 6" :marker-end="'url(#'+id+'-event)'"/>
      <circle cx="300" cy="79" r="4.5" fill="#d5e5ff"/>
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
.payment-circuit { aspect-ratio:5/3; position:relative; isolation:isolate; background:radial-gradient(ellipse at 29% 66%,#674ace30,transparent 47%),radial-gradient(ellipse at 81% 19%,#285ae833,transparent 46%); }
.payment-circuit::before { content:""; position:absolute; inset:0; z-index:-2; background:radial-gradient(#9fa9e34a .8px,transparent 1px) center/14px 14px; mask-image:radial-gradient(ellipse,#000,transparent 73%); }
.payment-circuit svg { position:absolute; inset:0; width:100%; height:100%; z-index:-1; }
.circuit-node { position:absolute; transform:translate(-50%,-50%); color:#f7f5ff; width:30%; height:0; display:grid; place-items:center; }
.circuit-node i { position:absolute; display:grid; place-items:center; width:clamp(37px,4.8vw,62px); aspect-ratio:1; transform:translateY(-50%); top:0; border-radius:24%; font-size:clamp(20px,2.5vw,30px); color:#c4d7ff; background:linear-gradient(145deg,#2b4073,#122240 76%); border:1px solid #637fb9; box-shadow:inset 0 1px #b5cdff36,0 8px 24px #050a1780; }
.circuit-node>span { position:absolute; top:clamp(23px,3.2vw,39px); width:110%; text-align:center; font:550 clamp(.73rem,1.1vw,1rem)/1.25 system-ui; }
.buyer-node,.hub-node { left:16.5%; } .merchant-node,.app-node { left:83.5%; }
.buyer-node,.merchant-node { top:21.95%; } .hub-node,.app-node { top:73.05%; }
.hub-node i,.app-node i { color:#e1d3ff; background:linear-gradient(145deg,#4f3d7f,#211a35 80%); border-color:#8d76b5; }
.hub-node img { width:57%; }
.circuit-observe,.circuit-notice { position:absolute; transform:translateX(-50%); color:#e4d4ff; font:500 clamp(.7rem,1vw,.88rem)/1.25 system-ui; text-align:center; }
.circuit-observe { left:36%; bottom:53.6%; }
.circuit-notice { left:50%; bottom:29.5%; }
</style>
