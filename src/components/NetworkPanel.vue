<template>
  <div class="panel" id="network">
    <div class="p-title">
      <span class="tag-icon"></span>国家合作网络
      <div class="net-tabs">
        <span v-for="t in TYPES" :key="t.k" class="net-tab"
              :class="{ active: cur === t.k }" @click="cur = t.k">{{ t.label }}</span>
      </div>
    </div>
    <div class="chart net-chart"><EChart :option="option" /></div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import EChart from './EChart.vue'
import { NET_COOP } from '../data/coopNetwork.js'

const TYPES = [
  { k: 'unilateral', label: '单边' },
  { k: 'bilateral', label: '双边' },
  { k: 'multilateral', label: '多边' },
]
const cur = ref('bilateral')

const option = computed(() => {
  const d = NET_COOP[cur.value]
  return {
    tooltip: {
      confine: true,
      formatter: p => p.dataType === 'edge'
        ? `${p.data.source} — ${p.data.target}${p.data.name ? '<br/>' + p.data.name : ''}`
        : `${p.name}${p.data.desc ? '<br/>' + p.data.desc : ''}`,
    },
    series: [{
      type: 'graph',
      layout: cur.value === 'unilateral' ? 'circular' : 'force',
      top: 6, bottom: 6, left: 12, right: 12,
      roam: false,
      circular: { radius: 90 },
      force: { repulsion: 190, edgeLength: 46, gravity: 0.22 },
      data: d.nodes.map(n => ({
        name: n.name, desc: n.desc,
        symbolSize: n.size || (n.org ? 24 : 11),
        itemStyle: {
          color: n.org ? '#ffb02e' : '#3fa8ff',
          borderColor: 'rgba(10,30,70,.9)', borderWidth: 1.5,
          shadowColor: n.org ? 'rgba(255,190,60,.8)' : 'rgba(70,180,255,.8)', shadowBlur: 10,
        },
      })),
      links: d.links.map(l => ({ source: l[0], target: l[1], name: l[2] || '' })),
      lineStyle: { color: 'rgba(90,190,255,.5)', width: 1.2, curveness: 0.12, type: 'dashed' },
      label: { show: true, position: 'bottom', distance: 2, color: '#cfe6ff', fontSize: 10,
        textBorderColor: 'rgba(4,18,44,.9)', textBorderWidth: 2 },
      emphasis: { focus: 'adjacency', lineStyle: { width: 2.2, color: '#8fe8ff' } },
    }],
  }
})
</script>

<style scoped>
.net-tabs { margin-left: auto; display: flex; gap: 6px; }
.net-tab { text-align: center; height: 22px; line-height: 20px; padding: 0 12px; font-size: 12px;
  color: #9fc2ee; border: 1px solid rgba(60,130,230,.45); border-radius: 11px;
  cursor: pointer; background: rgba(8,26,60,.35); transition: all .2s; user-select: none; white-space: nowrap; }
.net-tab:hover { color: #fff; }
.net-tab.active { color: #04122c; font-weight: 700;
  background: linear-gradient(180deg, #6ec1ff, #1f7ae0); border-color: #7cc4ff;
  box-shadow: 0 0 10px rgba(80,170,255,.55); }
.net-chart { top: 44px; }
</style>
