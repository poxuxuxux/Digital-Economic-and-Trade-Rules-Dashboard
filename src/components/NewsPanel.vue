<template>
  <div class="panel" id="news">
    <div class="p-title"><span class="tag-icon"></span>最新规则动态</div>
    <div class="news-list">
      <div v-if="!NEWS.length" class="news-empty">暂无匹配的规则动态</div>
      <div v-else class="news-track">
        <div v-for="(n, i) in loop" :key="i" :class="['news-item', { 'domestic-news-item': store.scope === 'domestic' }]">
          <span class="new">NEW</span>
          <template v-if="store.scope === 'domestic'">
            <div class="t domestic-news-title" :title="n.t">{{ n.t }}</div>
            <span class="domestic-news-date">{{ n.d }}</span>
            <span class="chip domestic-news-type">{{ n.c }}</span>
            <span class="domestic-news-publisher" :title="n.r">{{ n.r }}</span>
          </template>
          <div v-else class="txt">
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
import { store } from '../store.js'
import { NEWS } from '../data/dashboard.js'
import { DOMESTIC_LATEST_RULES } from '../data/domesticDashboard.js'
const entries = computed(() => store.scope === 'domestic' ? DOMESTIC_LATEST_RULES : NEWS)
const loop = computed(() => (entries.value.length ? [...entries.value, ...entries.value] : []))
</script>

<style scoped>
.news-empty { text-align: center; color: #7fa3d0; font-size: 13.5px; padding: 20px 0; }
.domestic-news-item { gap: 10px; padding: 5px 8px; }
.domestic-news-title { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  color: #e6f2ff; font-size: 14px; }
.domestic-news-date { flex: 0 0 76px; color: #8fb8e6; font-size: 12px; }
.domestic-news-type { flex: 0 0 auto; }
.domestic-news-publisher { flex: 0 0 132px; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  color: #9fc5ed; font-size: 12px; }
</style>
