<template>
  <div class="panel" id="network">
    <div class="p-title"><span class="tag-icon"></span>规则关联网络</div>
    <div class="chart"><EChart :option="option" /></div>
  </div>
</template>

<script setup>
import EChart from './EChart.vue'
import { NET_NODES } from '../data/dashboard.js'

const option = {
  tooltip: {},
  series: [{
    type: 'graph', layout: 'none', roam: false,
    data: NET_NODES.map(n => ({
      name: n.name, x: n.x, y: n.y, symbolSize: n.size, label: { fontSize: n.fs },
      itemStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
        colorStops: [{ offset: 0, color: n.c1 }, { offset: 1, color: n.c2 }] },
        shadowColor: n.c1, shadowBlur: 16 },
    })),
    links: NET_NODES.slice(1).map(n => ({ source: n.name, target: 'EU AI Act' })),
    lineStyle: { color: 'rgba(90,190,255,.7)', width: 1.6, type: 'dashed', curveness: 0.15, shadowColor: 'rgba(80,180,255,.6)', shadowBlur: 6 },
    label: { show: true, color: '#fff', fontWeight: 700, formatter: p => p.name.replace(' ', '\n') },
    emphasis: { scale: 1.15 },
  }],
}
</script>
