<script setup lang="ts">
import { computed } from "vue";
import UIcon from "@nuxt/ui/components/Icon.vue";
import type { Language } from "../../languages";
import { merchantCopy } from "./merchantCopy";
import PaymentCircuit from "./PaymentCircuit.vue";
import MarketGlobe from "./MarketGlobe.vue";

const props = defineProps<{ language: Language; prefix: string }>();
const copy = computed(() => merchantCopy[props.language]);
const source = "https://github.com/GMWalletApp/epusdt";
const integrations = [
  { icon: "i-lucide-store", path: "guide/integration/epay" },
  { icon: "i-lucide-code-xml", path: "guide/integration/gmpay" },
  { icon: "i-lucide-layers", path: "api/payment#create" },
];
</script>

<template>
  <div class="merchant-story">
    <section id="checkout" class="merchant-shell ownership-layout" aria-labelledby="merchant-ownership-title">
      <div class="ownership-copy">
        <h2 id="merchant-ownership-title">
          <span v-for="line in copy.title.split('\n')" :key="line">{{ line }}</span>
        </h2>
        <p class="merchant-body">{{ copy.intro }}</p>
        <a class="text-link" :href="source">{{ copy.source }}</a>
        <PaymentCircuit :buyer="copy.buyer" :merchant="copy.merchant" :notice="copy.notice"
          :observes="copy.observes" :automation="copy.automation" />
      </div>

      <figure class="checkout-figure">
        <div class="checkout-stage">
          <a class="checkout-phone" href="/screenshots/pay1.jpeg">
            <img src="/screenshots/pay1.jpeg" width="1206" height="2622" loading="lazy" decoding="async" :alt="copy.checkout">
          </a>
          <div class="fee-receipt">
            <span class="receipt-brand" aria-hidden="true">EPUSDT</span>
            <span class="receipt-label">{{ copy.fee }}</span>
            <strong class="receipt-number">0<span>%</span></strong>
            <span class="receipt-barcode" aria-hidden="true"></span>
          </div>
        </div>
        <figcaption><strong id="merchant-fee-title">{{ copy.feeTitle }}</strong> {{ copy.feeText }}</figcaption>
      </figure>
    </section>

    <section class="merchant-markets" aria-labelledby="merchant-markets-title">
      <div class="merchant-shell">
        <div class="market-intro">
          <h2 id="merchant-markets-title">{{ copy.walletTitle }}</h2>
          <p class="merchant-body">{{ copy.walletText }}</p>
        </div>
        <div class="market-layout">
          <MarketGlobe :regions="copy.regions" />
          <div class="market-networks">
            <dl class="asset-ledger">
              <div><dt><span aria-hidden="true">₮</span>USDT</dt><dd>TRON · Ethereum</dd></div>
              <div><dt><span aria-hidden="true">$</span>USDC</dt><dd>Ethereum · Solana</dd></div>
              <div><dt><span aria-hidden="true">₽</span><a :href="source + '/pull/143'">A7A5</a></dt><dd>TRON · Ethereum</dd></div>
            </dl>
            <a class="text-link" :href="prefix + 'guide/intro#networks'">{{ copy.networks }}</a>
          </div>
        </div>
        <div class="system-notes">
          <article>
            <UIcon class="note-icon" name="i-lucide-check" aria-hidden="true" />
            <div><h3>{{ copy.finality }}</h3><p>{{ copy.finalityText }}</p></div>
          </article>
          <article>
            <UIcon class="note-icon" name="i-lucide-layers" aria-hidden="true" />
            <div><h3>{{ copy.engineering }}</h3><p>{{ copy.engineeringText }}</p></div>
          </article>
        </div>
      </div>
    </section>

    <section class="merchant-commerce" aria-labelledby="merchant-commerce-title">
      <div class="merchant-shell commerce-layout">
        <div>
          <h2 id="merchant-commerce-title">{{ copy.commerceTitle }}</h2>
          <p class="merchant-body">{{ copy.commerceText }}</p>
          <a class="merchant-install" :href="prefix + 'guide/installation/docker'">
            <UIcon name="i-lucide-terminal" aria-hidden="true" />{{ copy.install }}
          </a>
        </div>
        <div class="commerce-sectors">
          <details v-for="(sector, index) in copy.sectors" :key="language + index" name="merchant-sector" :open="index === 0">
            <summary>
              <UIcon class="sector-icon" :name="integrations[index].icon" aria-hidden="true" />
              {{ sector.label }}
              <UIcon class="sector-toggle" name="i-lucide-chevron-down" aria-hidden="true" />
            </summary>
            <div class="sector-detail">
              <p>{{ sector.detail }}</p>
              <a class="text-link" :href="prefix + integrations[index].path">{{ copy.integration }}</a>
            </div>
          </details>
        </div>
      </div>
    </section>
    <footer class="merchant-footer">
      <div class="merchant-shell">
        <a class="footer-brand" :href="prefix"><img src="/logo.png" width="26" height="26" alt="">EPUSDT</a>
        <a class="text-link" :href="source">GitHub</a>
      </div>
    </footer>
  </div>
</template>

<style scoped src="../styles/merchant-story.css"></style>
