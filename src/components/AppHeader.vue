<template>
  <div class="header">
    <div class="side"><div class="h-btn">数说规则</div></div>
    <div class="title">全球数字经贸规则库</div>
    <div class="side">
      <div class="h-wrap">
        <div class="h-btn">图说规则</div>
        <div class="scope-box">
          <div class="t-btn" :class="{ active: store.scope === 'global' }" @click="store.scope = 'global'">全球</div>
          <div class="t-btn" :class="{ active: store.scope === 'domestic' }" @click="store.scope = 'domestic'">国内</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { store } from '../store.js'
</script>
