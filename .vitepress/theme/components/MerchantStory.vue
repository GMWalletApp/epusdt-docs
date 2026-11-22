<script setup lang="ts">
import { computed, ref } from "vue";
import { motion, useScroll, useTransform } from "motion-v";
import { merchantCopy } from "./merchantCopy";
import type { Language } from "../../languages";
import PaymentCircuit from "./PaymentCircuit.vue";
import MarketGlobe from "./MarketGlobe.vue";

const props = defineProps<{ language: Language; prefix: string }>();
const copy = computed(() => merchantCopy[props.language]);
const feeSection = ref<HTMLElement>();
const { scrollYProgress } = useScroll({ target: feeSection, offset: ["start end", "end start"] });
const checkoutY = useTransform(scrollYProgress, [0, 1], [20, -20]);
const checkoutAngle = useTransform(scrollYProgress, [0, 1], [2, -2]);
const guides = ["guide/integration/epay", "guide/integration/gmpay", "api/payment#create"];
</script>

<template>
  <div class="merchant-story">
    <section class="merchant-ownership" aria-labelledby="merchant-ownership-title">
      <div class="merchant-shell ownership-layout">
        <div class="ownership-copy">
          <h2 id="merchant-ownership-title"><span v-for="line in copy.title.split('\n')" :key="line">{{ line }}</span></h2>
          <p class="merchant-body">{{ copy.intro }}</p>
          <a class="merchant-source" href="https://github.com/GMWalletApp/epusdt">{{ copy.source }}</a>
        </div>
        <PaymentCircuit :buyer="copy.buyer" :merchant="copy.merchant" :notice="copy.notice" :observes="copy.observes" :automation="copy.automation" />
      </div>
    </section>
    <section ref="feeSection" class="merchant-fees" aria-labelledby="merchant-fee-title">
      <div class="merchant-shell fee-layout">
        <div class="fee-copy">
          <p class="merchant-caption">{{ copy.fee }}</p>
          <div class="fee-number">0<span>%</span></div>
          <h2 id="merchant-fee-title">{{ copy.feeTitle }}</h2>
          <p class="merchant-body">{{ copy.feeText }}</p>
        </div>
        <div class="checkout-stage">
          <motion.figure class="checkout-preview" :style="{ y: checkoutY, rotate: checkoutAngle }">
            <a href="/screenshots/pay1.jpeg" :aria-label="copy.checkout">
              <img src="/screenshots/pay1.jpeg" width="1206" height="2622" loading="lazy" decoding="async" :alt="copy.checkout" />
            </a>
          </motion.figure>
        </div>
      </div>
    </section>
    <section class="merchant-markets" aria-labelledby="merchant-markets-title">
      <div class="merchant-shell">
        <p class="merchant-caption">{{ copy.markets }}</p>
        <h2 id="merchant-markets-title">{{ copy.walletTitle }}</h2>
        <div class="market-layout">
          <MarketGlobe :regions="copy.regions" />
          <div class="market-copy">
            <p class="merchant-body">{{ copy.walletText }}</p>
            <dl class="asset-ledger">
              <div><dt>USDT</dt><dd>TRON · Ethereum</dd></div>
              <div><dt>USDC</dt><dd>Ethereum · Solana</dd></div>
              <div><dt><a href="https://github.com/GMWalletApp/epusdt/pull/143">A7A5</a></dt><dd>TRON · Ethereum</dd></div>
            </dl>
            <a class="market-networks" :href="prefix+'guide/intro#networks'">{{ copy.networks }}</a>
          </div>
        </div>
        <div class="system-notes">
          <article>
            <div class="system-mark finality-mark" aria-hidden="true"><i></i><i></i><i></i></div>
            <h3>{{ copy.finality }}</h3><p>{{ copy.finalityText }}</p>
          </article>
          <article>
            <div class="system-mark finality-mark" aria-hidden="true"><i></i><i></i></div>
            <h3>{{ copy.engineering }}</h3><p>{{ copy.engineeringText }}</p>
          </article>
        </div>
      </div>
    </section>
    <section class="merchant-commerce" aria-labelledby="merchant-commerce-title">
      <div class="merchant-shell commerce-layout">
        <div>
          <h2 id="merchant-commerce-title">{{ copy.commerceTitle }}</h2>
          <p class="merchant-body">{{ copy.commerceText }}</p>
          <a class="merchant-install" :href="prefix + 'guide/installation/docker'">{{ copy.install }}</a>
        </div>
        <div class="commerce-sectors">
          <details v-for="(sector, index) in copy.sectors" :key="language + index" name="merchant-sector" :open="index === 0">
            <summary>{{ sector.label }}<span class="sector-toggle" aria-hidden="true"></span></summary>
            <div class="sector-detail"><p>{{ sector.detail }}</p><a :href="prefix + guides[index]">{{ copy.integration }}</a></div>
          </details>
        </div>
      </div>
    </section>
  </div>
</template>

<style src="../styles/merchant-story.css"></style>
