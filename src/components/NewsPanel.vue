<template>
  <div class="panel" id="news">
    <div class="p-title"><span class="tag-icon"></span>最新规则动态</div>
    <div class="news-list">
      <div v-if="!NEWS.length" class="news-empty">暂无匹配的规则动态</div>
      <div v-else class="news-track">
        <div v-for="(n, i) in loop" :key="i" class="news-item">
          <span class="new">NEW</span>
          <div class="txt">
            <div class="t">{{ n.t }}</div>
            <div class="meta"><span>{{ n.d }}</span><span class="chip">{{ n.c }}</span><span class="chip">{{ n.r }}</span></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { NEWS } from '../data/dashboard.js'
const loop = computed(() => (NEWS.length ? [...NEWS, ...NEWS] : []))
</script>

<style scoped>
.news-empty { text-align: center; color: #7fa3d0; font-size: 13.5px; padding: 20px 0; }
</style>
