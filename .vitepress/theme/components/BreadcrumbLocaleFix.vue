<script setup>
import { onMounted, watch } from 'vue'
import { useData } from 'vitepress'

const { localeIndex } = useData()

const ZH_CN_LABEL_MAP = {
  guide: '指南',
  api: 'API 文档',
}

const ZH_TW_LABEL_MAP = {
  guide: '指南',
  api: 'API 文件',
}

function fix() {
  if (typeof document === 'undefined') return

  // Fix home link
  const prefix = localeIndex.value && localeIndex.value !== 'root'
    ? `/${localeIndex.value}/`
    : '/'
  document.querySelectorAll('.tk-article-breadcrumb a.home').forEach(el => {
    if (el.getAttribute('href') !== prefix) {
      el.setAttribute('href', prefix)
    }
  })

  // Fix directory labels for Chinese locales
  if (localeIndex.value === 'zh' || localeIndex.value === 'zh-tw') {
    const labelMap = localeIndex.value === 'zh' ? ZH_CN_LABEL_MAP : ZH_TW_LABEL_MAP
    document.querySelectorAll('.tk-article-breadcrumb .tk-breadcrumb__item').forEach(item => {
      const link = item.querySelector('a, span')
      if (!link) return
      const text = link.textContent?.trim()
      if (text && labelMap[text]) {
        link.textContent = labelMap[text]
      }
    })
  }
}

function delayedFix() {
  setTimeout(fix, 50)
}

onMounted(delayedFix)
watch(localeIndex, delayedFix)
</script>

<template></template>
