<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from "vue";
import { useDocumentVisibility, useElementSize, useElementVisibility, usePreferredReducedMotion } from "@vueuse/core";
import type { Globe } from "cobe";

defineProps<{ regions: string[] }>();
const locations: [number, number][] = [[-15,-47],[9,8],[16,105],[49,68]];
const selected = ref(1);
const location = computed(() => locations[selected.value]);
const stage = ref<HTMLElement>(), canvas = ref<HTMLCanvasElement>();
const { width } = useElementSize(stage);
const visible = useElementVisibility(stage), tab = useDocumentVisibility(), preference = usePreferredReducedMotion();
const ready = ref(false);
let globe: Globe | undefined, frame=0, loading=false, unavailable=false, disposed=false;
// COBE decodes its map texture after creating the first frame.
let warmUntil = 0;
let phi = Math.PI * (1.5 - locations[1][1]/180), theta = locations[1][0]*Math.PI/180;
function draw() {
  const [lat,lon]=location.value;
  const delta=Math.PI*(1.5-lon/180)-phi;
  const turn=Math.atan2(Math.sin(delta),Math.cos(delta)), tilt=lat*Math.PI/180-theta;
  const step=preference.value==="reduce"?1:.095;
  phi+=turn*step; theta+=tilt*step;
  globe?.update({phi,theta});
  if (performance.now()<warmUntil || (step!==1 && Math.abs(turn)+Math.abs(tilt)>.003)) frame=requestAnimationFrame(draw);
}
async function sync() {
  cancelAnimationFrame(frame);
  if (!visible.value || tab.value!=="visible" || !canvas.value || !width.value || unavailable) return;
  if (!globe) {
    if (loading) return;
    loading=true;
    try {
      const {default:createGlobe}=await import("cobe");
      if(disposed || !canvas.value) return;
      const el=canvas.value;
      if (!(el.getContext("webgl2",{alpha:true}) || el.getContext("webgl",{alpha:true}))) { unavailable=true; return; }
      globe=createGlobe(el,{
        width:width.value,height:width.value,devicePixelRatio:Math.min(devicePixelRatio,2),
        phi,theta,dark:1,diffuse:1.2,mapSamples:18000,mapBrightness:8,mapBaseBrightness:.02,
        baseColor:[.18,.42,.94],glowColor:[.065,.13,.34],markerColor:[.78,.9,1],
        markers:locations.map(location=>({location,size:.055})),
        arcs:[{from:locations[0],to:locations[1]},{from:locations[1],to:locations[2]},{from:locations[2],to:locations[3]}],
        arcColor:[.35,.66,1],arcHeight:.24,arcWidth:.6,markerElevation:.025,
      });
      warmUntil=performance.now()+900;
      ready.value=true;
    } catch { unavailable=true; return; }
    finally { loading=false; }
  }
  if (!visible.value || tab.value!=="visible" || disposed) return;
  globe.update({width:width.value,height:width.value});
  draw();
}
watch([visible,tab,width,selected,preference],sync,{flush:"post"});
onUnmounted(()=>{disposed=true;cancelAnimationFrame(frame);globe?.destroy();});
</script>
<template>
  <div class="market-atlas" :class="{ 'has-globe':ready }">
    <div class="atlas-heading"><strong>{{ regions[selected] }}</strong></div>
    <div class="globe-window">
      <div class="atlas-plane" aria-hidden="true">
        <div class="atlas-land"></div>
        <i v-for="([lat,lon],i) in locations" :key="lon" :class="{selected:i===selected}" :style="{left:(lon+180)/360*100+'%', top:(80-lat)/142.5*100+'%'}"></i>
      </div>
      <div ref="stage" class="globe-stage" aria-hidden="true"><canvas ref="canvas" /></div>
    </div>
    <div class="atlas-switch">
      <button v-for="(label,index) in regions" :key="label" type="button" :aria-pressed="index===selected" @click="selected=index">{{ label }}</button>
    </div>
  </div>
</template>
<style scoped>
.market-atlas {
  position: relative;
  overflow: hidden;
  border-radius: 5px;
  background: #091426;
  color: #eef4ff;
}
.atlas-heading {
  position: absolute;
  top: 1rem;
  left: 1.25rem;
  z-index: 1;
  font: .85rem/1.5 var(--mono);
}
.globe-window { position: relative; height: clamp(205px, 21vw, 305px); overflow: hidden; }
.globe-stage {
  position: absolute;
  width: min(89%, 460px);
  aspect-ratio: 1;
  left: 50%;
  top: 4%;
  transform: translateX(-50%);
  opacity: 0;
}
.has-globe .globe-stage { opacity: 1; }
.globe-stage canvas { display: block; width: 100%; height: 100%; }
.atlas-plane { position: absolute; width: 90%; left: 5%; top: 50%; transform: translateY(-50%); aspect-ratio: 720/285; }
.has-globe .atlas-plane { opacity: 0; }
.atlas-land {
  position: absolute;
  inset: 0;
  background: radial-gradient(#6898f7 1px, transparent 1.35px) 0 0 / 4px 4px;
  mask: url(/art/land.png) center / 100% 100% no-repeat;
}
.atlas-plane i { position: absolute; width: 7px; height: 7px; border-radius: 50%; background: #7999cc; }
.atlas-plane i.selected { background: white; box-shadow: 0 0 0 5px #416fffaa; }
.atlas-switch { display: flex; flex-wrap: wrap; gap: .4rem; position: relative; padding: .75rem 1rem 1rem; }
.atlas-switch button {
  flex: 1 1 auto;
  min-height: 40px;
  padding: .4rem .65rem;
  border: 1px solid #526786;
  border-radius: 3px;
  background: #101f36;
  color: #e6eeff;
  font-weight: 500;
  line-height: 1.3;
  font-family: inherit;
  font-size: .875rem;
  cursor: pointer;
}
.atlas-switch button:hover { border-color: #aac5ff; }
.atlas-switch button[aria-pressed=true] { background: #e5edff; border-color: #e5edff; color: #0b1d3e; }
@media (max-width: 420px) {
  .atlas-switch { display: grid; grid-template-columns: 1fr 1fr; }
}
</style>
