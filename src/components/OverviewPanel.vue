<template>
  <div class="panel" id="overview">
    <div class="p-title">
      <svg width="22" height="22" viewBox="0 0 24 24" style="filter:drop-shadow(0 0 5px rgba(70,160,255,.9));flex:none;">
        <path d="M4 22V8h7v14M11 22V4h9v18M2 22h20" fill="none" stroke="#4db8ff" stroke-width="2.2" stroke-linejoin="round"/>
        <path d="M14.5 8h2M14.5 12h2M14.5 16h2M7 12h1.5M7 16h1.5" stroke="#7fd0ff" stroke-width="2" stroke-linecap="round"/>
      </svg>全球规则总览</div>
    <div class="ov-top">
      <div class="ov-main">
        <svg class="ov-doc" viewBox="0 0 58 62">
          <path d="M14 4h26l10 10v40H14z" fill="rgba(30,90,190,.25)" stroke="#3f9dff" stroke-width="2.5" stroke-linejoin="round"/>
          <path d="M40 4v10h10" fill="none" stroke="#3f9dff" stroke-width="2.5"/>
          <path d="M6 14h30v44H6z" fill="rgba(8,30,70,.9)" stroke="#5fc0ff" stroke-width="2.5" stroke-linejoin="round"/>
          <path d="M13 25h16M13 33h16M13 41h10" stroke="#7fd0ff" stroke-width="2.5" stroke-linecap="round"/>
          <circle cx="42" cy="52" r="7" fill="#08152e" stroke="#7fd0ff" stroke-width="2.5"/>
          <circle cx="42" cy="52" r="2.4" fill="#7fd0ff"/>
        </svg>
        <div>
          <div class="ov-num">{{ s.total.toLocaleString() }}</div>
          <div class="ov-label">全球规则总量</div>
        </div>
      </div>
      <div class="ov-minis">
        <div class="ov-mini">
          <svg viewBox="0 0 40 40">
            <circle cx="18" cy="20" r="13" fill="none" stroke="#4db8ff" stroke-width="2.5"/>
            <ellipse cx="18" cy="20" rx="6" ry="13" fill="none" stroke="#4db8ff" stroke-width="2"/>
            <path d="M5.5 15.5h25M5.5 24.5h25" stroke="#4db8ff" stroke-width="2"/>
            <path d="M31 26v9M35 22v13M39 18v17" stroke="#4db8ff" stroke-width="2.5" stroke-linecap="round"/>
          </svg>
          <span class="ml">国际组织</span><span class="mv">{{ s.org }}</span>
        </div>
        <div class="ov-mini">
          <svg viewBox="0 0 40 40">
            <path d="M9 36V4" stroke="#4db8ff" stroke-width="3" stroke-linecap="round"/>
            <path d="M9 6c5-3 9 3 14 0s8 1 12-1v14c-4 2-7 2-12 1s-9-3-14 0z" fill="rgba(40,120,230,.35)" stroke="#4db8ff" stroke-width="2.5" stroke-linejoin="round"/>
            <path d="M5 36h9" stroke="#4db8ff" stroke-width="3" stroke-linecap="round"/>
          </svg>
          <span class="ml">国家/地区</span><span class="mv">{{ s.region }}</span>
        </div>
      </div>
    </div>
    <div class="ov-subs">
      <div class="ov-sub" v-for="(sub, i) in s.subs" :key="i">
        <div class="k">{{ sub[0] }}</div>
        <div class="v">{{ sub[1] }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { stats } from '../store.js'
const s = computed(() => stats.value)
</script>
