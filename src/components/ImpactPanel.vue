<template>
  <div class="panel" id="impact">
    <div class="p-title"><span class="tag-icon"></span>高影响规则</div>
    <div class="imp-list">
      <div v-if="!IMPACT.length" class="imp-empty">暂无高影响规则</div>
      <div v-else class="imp-track">
        <div v-for="(n, i) in loop" :key="i" class="imp-item">
          <span class="star">⭐</span>
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
import { IMPACT } from '../data/dashboard.js'
const loop = computed(() => (IMPACT.length ? [...IMPACT, ...IMPACT] : []))
</script>

<style scoped>
.imp-empty { text-align: center; color: #7fa3d0; font-size: 13.5px; padding: 20px 0; }
</style>
