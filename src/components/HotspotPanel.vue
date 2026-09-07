<template>
  <div class="panel" id="hotspot">
    <div class="p-title"><span class="tag-icon"></span>热点议题分布<span class="badge">8大主题</span></div>
    <div class="hs-body">
      <div id="donut"><EChart :option="option" /></div>
      <div class="hs-legend">
        <div class="hs-item" v-for="h in stats.hotspots" :key="h.name">
          <i :style="{ background: h.color }"></i>
          <span class="n">{{ h.name }}</span><span class="v">{{ h.value }}</span><span class="p">({{ h.pct }})</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import EChart from './EChart.vue'
import { stats } from '../store.js'

const option = computed(() => ({
  tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
  series: [
    {
      type: 'pie', radius: ['52%', '74%'], center: ['50%', '50%'],
      data: stats.value.hotspots.map(h => ({ name: h.name, value: h.value,
        itemStyle: { color: h.color, borderColor: '#061530', borderWidth: 2 } })),
      label: { show: false }, emphasis: { scaleSize: 6 },
    },
    {
      type: 'pie', radius: ['80%', '82%'], center: ['50%', '50%'], silent: true,
      data: [{ value: 1, itemStyle: { color: 'rgba(80,150,255,.35)' } }],
      label: { show: false },
    },
  ],
  graphic: [
    { type: 'text', left: 'center', top: '38%', style: { text: '总计', fill: '#9fc2ee', fontSize: 15 } },
    { type: 'text', left: 'center', top: '48%', style: { text: String(stats.value.total), fill: '#eaf6ff', fontSize: 30, fontWeight: 700 } },
  ],
}))
</script>
