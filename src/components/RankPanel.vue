<template>
  <div class="panel" id="rank">
    <div class="p-title"><span class="tag-icon"></span>国际组织规则排名 TOP5</div>
    <div class="chart"><EChart :option="option" /></div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import EChart from './EChart.vue'
import { stats } from '../store.js'

const axisStyle = {
  axisLine: { lineStyle: { color: 'rgba(80,140,220,.6)' } },
  axisTick: { show: false },
  axisLabel: { color: '#8fb8e6', fontSize: 12 },
  splitLine: { lineStyle: { color: 'rgba(60,110,190,.18)', type: 'dashed' } },
}

const option = computed(() => ({
  grid: { left: 40, right: 16, top: 32, bottom: 26 },
  tooltip: { trigger: 'axis' },
  xAxis: { type: 'category', data: stats.value.rankData.map(d => d.name), ...axisStyle, splitLine: { show: false } },
  yAxis: { type: 'value', ...axisStyle },
  series: [{
    type: 'bar', barWidth: 22, data: stats.value.rankData.map(d => d.v),
    label: { show: true, position: 'top', color: '#eaf6ff', fontSize: 13, fontWeight: 700 },
    itemStyle: {
      borderRadius: [10, 10, 2, 2],
      color: p => {
        const d = stats.value.rankData[p.dataIndex]
        return { type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [{ offset: 0, color: d.c1 }, { offset: 1, color: d.c2 }] }
      },
      shadowColor: 'rgba(60,140,255,.4)', shadowBlur: 10,
    },
  }],
}))
</script>
